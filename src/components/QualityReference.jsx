import { useState } from 'react';
import CommandBlock from './CommandBlock.jsx';

const PRESETS = [
  {
    id: 'p720',
    title: '720p — High Quality',
    desc: 'Good balance of quality and file size. Great for YouTube/web.',
    getCmd: (f) => `ffmpeg -i "${f}" -vf scale=-2:720 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k "${f.replace(/\.[^/.]+$/, '')}_720p.mp4"`,
  },
  {
    id: 'p480',
    title: '480p — Medium Quality',
    desc: 'Smaller file size, suitable for streaming or sharing.',
    getCmd: (f) => `ffmpeg -i "${f}" -vf scale=-2:480 -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 96k "${f.replace(/\.[^/.]+$/, '')}_480p.mp4"`,
  },
  {
    id: 'p360',
    title: '360p — Small Size',
    desc: 'Minimum quality for very small file sizes.',
    getCmd: (f) => `ffmpeg -i "${f}" -vf scale=-2:360 -c:v libx264 -crf 30 -preset slow -c:a aac -b:a 64k "${f.replace(/\.[^/.]+$/, '')}_360p.mp4"`,
  },
  {
    id: 'ph265',
    title: 'H.265 Compress (same res)',
    desc: 'Keep original resolution. Use H.265/HEVC for ~50% smaller files.',
    getCmd: (f) => `ffmpeg -i "${f}" -c:v libx265 -crf 28 -preset slow -c:a aac -b:a 128k "${f.replace(/\.[^/.]+$/, '')}_h265.mp4"`,
  },
];

export default function QualityReference({ defaultFilename }) {
  const [open, setOpen] = useState(false);
  const [fileInputs, setFileInputs] = useState({});

  function getFilename(id) {
    return fileInputs[id] ?? defaultFilename ?? '';
  }

  function setFile(id, val) {
    setFileInputs((prev) => ({ ...prev, [id]: val }));
  }

  return (
    <div className="card quality-section">
      <div className="collapsible-header" onClick={() => setOpen((o) => !o)}>
        <div className="card-title" style={{ marginBottom: 0 }}>
          <span className="card-title-icon">🗜</span>
          Quality &amp; Compression Reference
          <span style={{ fontSize: '11px', color: 'var(--text-muted)',
            background: 'var(--bg-input)', padding: '2px 8px', borderRadius: '99px',
            fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
            Optional
          </span>
        </div>
        <span className={`collapsible-arrow${open ? ' open' : ''}`}>▼</span>
      </div>

      {open && (
        <div style={{ marginTop: '20px' }}>
          <p className="text-sm text-muted" style={{ marginBottom: '16px' }}>
            These commands re-encode the video to a different resolution or codec.
            They are independent of the cut workflow above.
          </p>
          <div className="quality-grid">
            {PRESETS.map((preset) => {
              const f = getFilename(preset.id);
              const cmd = f ? preset.getCmd(f) : preset.getCmd('input.mp4');
              return (
                <div key={preset.id} className="quality-card">
                  <div className="quality-card-title">{preset.title}</div>
                  <div className="quality-card-desc">{preset.desc}</div>
                  <div className="input-group" style={{ marginBottom: '10px' }}>
                    <input
                      id={`quality-file-${preset.id}`}
                      type="text"
                      className="input-field"
                      placeholder="filename.mp4"
                      value={getFilename(preset.id)}
                      onChange={(e) => setFile(preset.id, e.target.value)}
                    />
                  </div>
                  <CommandBlock command={cmd} label={preset.title} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
