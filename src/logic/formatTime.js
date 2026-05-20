/** Convert total seconds → "HH:MM:SS" string */
export function secondsToHMS(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, '0')).join(':');
}

/** Convert h, m, s integers → total seconds */
export function hmsToSeconds(h, m, s) {
  return Number(h || 0) * 3600 + Number(m || 0) * 60 + Number(s || 0);
}

/** Format a duration in seconds as a friendly string e.g. "2h 5m 30s" */
export function friendlyDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (sec || parts.length === 0) parts.push(`${sec}s`);
  return parts.join(' ');
}
