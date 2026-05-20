import { useState } from 'react';
import { secondsToHMS, friendlyDuration } from '../logic/formatTime.js';
import { computeKeepSegments } from '../logic/computeKeepSegments.js';

function TimelineSegment({ seg, type, videoDuration }) {
  const [hovered, setHovered] = useState(false);
  const pct = ((seg.end - seg.start) / videoDuration) * 100;
  const durationSecs = seg.end - seg.start;
  const showLabel = pct > 8;

  return (
    <div
      className={`timeline-segment ${type}`}
      style={{ width: `${pct}%` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {showLabel && (
        <span className="timeline-segment-label">
          {friendlyDuration(durationSecs)}
        </span>
      )}
      {hovered && (
        <div className="timeline-tooltip">
          {type === 'keep' ? '✅ Keep' : '✂ Delete'}&nbsp;&nbsp;
          {secondsToHMS(seg.start)} → {secondsToHMS(seg.end)}
          &nbsp;&nbsp;({friendlyDuration(durationSecs)})
        </div>
      )}
    </div>
  );
}

export default function TimelineVisualizer({ zones, videoDuration }) {
  if (!videoDuration || videoDuration <= 0) {
    return (
      <div className="card">
        <div className="card-title"><span className="card-title-icon">📊</span>Timeline</div>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>Enter a video duration to see the timeline.</p>
        </div>
      </div>
    );
  }

  const sorted = [...zones].sort((a, b) => a.start - b.start);
  const keeps = computeKeepSegments(sorted, videoDuration);

  // Build interleaved segments for display
  const allSegments = [];
  let cursor = 0;

  for (const zone of sorted) {
    if (zone.start > cursor) {
      allSegments.push({ start: cursor, end: zone.start, type: 'keep' });
    }
    allSegments.push({ start: zone.start, end: zone.end, type: 'delete' });
    cursor = Math.max(cursor, zone.end);
  }
  if (cursor < videoDuration) {
    allSegments.push({ start: cursor, end: videoDuration, type: 'keep' });
  }

  const totalKept = keeps.reduce((acc, s) => acc + (s.end - s.start), 0);
  const totalDeleted = videoDuration - totalKept;

  return (
    <div className="card">
      <div className="row-between" style={{ marginBottom: '16px' }}>
        <div className="card-title" style={{ marginBottom: 0 }}>
          <span className="card-title-icon">📊</span>Timeline
        </div>
        <div className="row" style={{ gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--keep)' }}>
            ● Keeping {friendlyDuration(totalKept)}
          </span>
          <span style={{ color: 'var(--delete-color)' }}>
            ● Deleting {friendlyDuration(totalDeleted)}
          </span>
        </div>
      </div>

      <div className="timeline-bar">
        {allSegments.length === 0 ? (
          <div className="timeline-segment keep" style={{ width: '100%' }}>
            <span className="timeline-segment-label">{friendlyDuration(videoDuration)} — Full video</span>
          </div>
        ) : (
          allSegments.map((seg, i) => (
            <TimelineSegment
              key={i}
              seg={seg}
              type={seg.type}
              videoDuration={videoDuration}
            />
          ))
        )}
      </div>

      <div className="timeline-legend">
        <div className="legend-item">
          <div className="legend-dot keep" />
          <span>Keeping ({keeps.length} segment{keeps.length !== 1 ? 's' : ''})</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot delete" />
          <span>Deleting ({zones.length} zone{zones.length !== 1 ? 's' : ''})</span>
        </div>
      </div>
    </div>
  );
}
