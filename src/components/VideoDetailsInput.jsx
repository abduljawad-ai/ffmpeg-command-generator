import { useState } from 'react';
import { hmsToSeconds, friendlyDuration } from '../logic/formatTime.js';

export default function VideoDetailsInput({ filename, setFilename, duration, setDuration }) {
  const [h, setH] = useState(String(Math.floor(duration / 3600)).padStart(2, '0'));
  const [m, setM] = useState(String(Math.floor((duration % 3600) / 60)).padStart(2, '0'));
  const [s, setS] = useState(String(duration % 60).padStart(2, '0'));

  function handleHMS(field, value) {
    const clamped = Math.max(0, Math.min(field === 'h' ? 99 : 59, Number(value) || 0));
    const str = String(clamped).padStart(2, '0');
    let nh = h, nm = m, ns = s;
    if (field === 'h') { nh = str; setH(str); }
    if (field === 'm') { nm = str; setM(str); }
    if (field === 's') { ns = str; setS(str); }
    setDuration(hmsToSeconds(nh, nm, ns));
  }

  const totalSecs = hmsToSeconds(h, m, s);

  return (
    <div className="card">
      <div className="card-title">
        <span className="card-title-icon">📁</span>
        Video Details
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Filename */}
        <div className="input-group">
          <label className="section-label">Filename (with extension)</label>
          <input
            id="video-filename"
            type="text"
            className="input-field"
            placeholder="e.g. my_lecture.mp4"
            value={filename}
            onChange={(e) => setFilename(e.target.value.trim())}
            spellCheck={false}
          />
          {filename && (
            <span className="text-sm text-muted" style={{ fontFamily: 'var(--font-mono)' }}>
              Output: <strong style={{ color: 'var(--text-secondary)' }}>
                {filename.replace(/\.[^/.]+$/, '')}_final.mp4
              </strong>
            </span>
          )}
        </div>

        {/* Duration */}
        <div className="input-group">
          <label className="section-label">Video Duration</label>
          <div className="hms-row">
            <div className="hms-field-wrap">
              <label htmlFor="dur-h">Hours</label>
              <input id="dur-h" type="number" className="input-field hms" min="0" max="99"
                value={h} onChange={(e) => handleHMS('h', e.target.value)} />
            </div>
            <span className="hms-separator">:</span>
            <div className="hms-field-wrap">
              <label htmlFor="dur-m">Min</label>
              <input id="dur-m" type="number" className="input-field hms" min="0" max="59"
                value={m} onChange={(e) => handleHMS('m', e.target.value)} />
            </div>
            <span className="hms-separator">:</span>
            <div className="hms-field-wrap">
              <label htmlFor="dur-s">Sec</label>
              <input id="dur-s" type="number" className="input-field hms" min="0" max="59"
                value={s} onChange={(e) => handleHMS('s', e.target.value)} />
            </div>
          </div>
          {totalSecs > 0 && (
            <span className="text-sm text-muted mt-8">
              ≈ <strong style={{ color: 'var(--text-secondary)' }}>{friendlyDuration(totalSecs)}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
