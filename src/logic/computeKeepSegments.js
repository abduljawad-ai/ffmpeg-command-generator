/**
 * Given sorted deletion zones and total video duration (seconds),
 * compute the list of segments to KEEP.
 */
export function computeKeepSegments(zones, videoDuration) {
  if (!videoDuration || videoDuration <= 0) return [];

  // Sort a copy by start time
  const sorted = [...zones].sort((a, b) => a.start - b.start);

  const keeps = [];
  let cursor = 0;

  for (const zone of sorted) {
    if (zone.start > cursor) {
      keeps.push({ start: cursor, end: zone.start });
    }
    cursor = Math.max(cursor, zone.end);
  }

  if (cursor < videoDuration) {
    keeps.push({ start: cursor, end: videoDuration });
  }

  return keeps;
}
