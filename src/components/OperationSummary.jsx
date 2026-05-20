import { secondsToHMS, friendlyDuration } from '../logic/formatTime.js';

export default function OperationSummary({ result, videoDuration, zones }) {
  const sorted = [...zones].sort((a, b) => a.start - b.start);
  const { keepSegments } = result;

  const totalKept = keepSegments.reduce((acc, s) => acc + (s.end - s.start), 0);
  const totalDeleted = videoDuration - totalKept;

  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '14px' }}>
        Operation Summary
      </h2>

      <div className="summary-grid">
        <div className="summary-stat">
          <div className="summary-stat-label">Total kept</div>
          <div className="summary-stat-value keep">{friendlyDuration(totalKept)}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {keepSegments.length} segment{keepSegments.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="summary-stat">
          <div className="summary-stat-label">Total deleted</div>
          <div className="summary-stat-value delete">{friendlyDuration(totalDeleted)}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {sorted.length} zone{sorted.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--delete-color)',
            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Zones to Delete
          </div>
          <ul className="summary-list">
            {sorted.map((z, i) => {
              const dur = z.end - z.start;
              return (
                <li key={z.id}>
                  <span className="tag delete">Z{i + 1}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                    {secondsToHMS(z.start)} → {secondsToHMS(z.end)}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: 'auto' }}>
                    {friendlyDuration(dur)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--keep)',
            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Segments to Keep
          </div>
          <ul className="summary-list">
            {keepSegments.map((seg, i) => {
              const dur = seg.end - seg.start;
              return (
                <li key={i}>
                  <span className="tag keep">P{i + 1}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                    {secondsToHMS(seg.start)} → {secondsToHMS(seg.end)}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: 'auto' }}>
                    {friendlyDuration(dur)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
