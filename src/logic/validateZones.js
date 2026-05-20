/**
 * Validate all deletion zones against each other and the video duration.
 * Returns a map of { [zoneId]: errorString | null }
 */
export function validateZones(zones, videoDuration) {
  const errors = {};

  for (const zone of zones) {
    const { id, start, end } = zone;

    if (end <= start) {
      errors[id] = 'End time must be after start time.';
      continue;
    }

    if (videoDuration > 0 && end > videoDuration) {
      errors[id] = 'End time exceeds video duration.';
      continue;
    }

    if (start < 0) {
      errors[id] = 'Start time cannot be negative.';
      continue;
    }

    errors[id] = null;
  }

  // Check for overlaps (among zones that individually passed)
  const sorted = [...zones]
    .filter((z) => !errors[z.id])
    .sort((a, b) => a.start - b.start);

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (b.start < a.end) {
      if (!errors[a.id]) errors[a.id] = 'This zone overlaps with another zone.';
      if (!errors[b.id]) errors[b.id] = 'This zone overlaps with another zone.';
    }
  }

  return errors;
}

/** Returns true if any zone has an error */
export function hasErrors(errors) {
  return Object.values(errors).some((e) => e !== null);
}
