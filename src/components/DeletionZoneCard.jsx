import { hmsToSeconds } from '../logic/formatTime.js';

function HMSInput({ prefix, seconds, onChange, hasError }) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  function update(field, val) {
    const v = Math.max(0, Number(val) || 0);
    let nh = h, nm = m, ns = s;
    if (field === 'h') nh = v;
    if (field === 'm') nm = Math.min(59, v);
    if (field === 's') ns = Math.min(59, v);
    onChange(hmsToSeconds(nh, nm, ns));
  }

  return (
    <div className="hms-row">
      <div className="hms-field-wrap">
        <label htmlFor={`${prefix}-h`}>Hours</label>
        <input id={`${prefix}-h`} type="number" className={`input-field hms${hasError ? ' error' : ''}`}
          min="0" max="99" value={String(h).padStart(2,'0')}
          onChange={(e) => update('h', e.target.value)} />
      </div>
      <span className="hms-separator">:</span>
      <div className="hms-field-wrap">
        <label htmlFor={`${prefix}-m`}>Min</label>
        <input id={`${prefix}-m`} type="number" className={`input-field hms${hasError ? ' error' : ''}`}
          min="0" max="59" value={String(m).padStart(2,'0')}
          onChange={(e) => update('m', e.target.value)} />
      </div>
      <span className="hms-separator">:</span>
      <div className="hms-field-wrap">
        <label htmlFor={`${prefix}-s`}>Sec</label>
        <input id={`${prefix}-s`} type="number" className={`input-field hms${hasError ? ' error' : ''}`}
          min="0" max="59" value={String(s).padStart(2,'0')}
          onChange={(e) => update('s', e.target.value)} />
      </div>
    </div>
  );
}

export default function DeletionZoneCard({ zone, index, error, onUpdate, onRemove }) {
  const hasError = !!error;

  return (
    <div className={`zone-card${hasError ? ' has-error' : ''}`}>
      <div className="zone-card-header">
        <span className="zone-label">✂ Zone {index + 1}</span>
        <button className="btn btn-danger btn-sm btn-icon" onClick={() => onRemove(zone.id)}
          title="Remove zone" aria-label={`Remove zone ${index + 1}`}>
          ✕
        </button>
      </div>

      <div className="zone-times">
        <div>
          <div className="zone-time-label">Start time</div>
          <HMSInput prefix={`zone-${zone.id}-start`} seconds={zone.start}
            onChange={(val) => onUpdate(zone.id, { start: val })} hasError={hasError} />
        </div>
        <div className="zone-arrow">→</div>
        <div>
          <div className="zone-time-label">End time</div>
          <HMSInput prefix={`zone-${zone.id}-end`} seconds={zone.end}
            onChange={(val) => onUpdate(zone.id, { end: val })} hasError={hasError} />
        </div>
      </div>

      {error && (
        <div className="error-msg mt-12">
          <span>⚠</span> {error}
        </div>
      )}
    </div>
  );
}
