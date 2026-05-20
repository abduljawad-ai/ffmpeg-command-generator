import { useState, useRef, useCallback } from 'react';
import VideoDetailsInput from './components/VideoDetailsInput.jsx';
import DeletionZoneManager from './components/DeletionZoneManager.jsx';
import TimelineVisualizer from './components/TimelineVisualizer.jsx';
import CommandOutput from './components/CommandOutput.jsx';
import QualityReference from './components/QualityReference.jsx';
import { validateZones, hasErrors } from './logic/validateZones.js';
import { generateCommands } from './logic/generateCommands.js';

let _zoneIdCounter = 1;
function newZone() {
  return { id: _zoneIdCounter++, start: 0, end: 60 };
}

export default function App() {
  const [filename, setFilename] = useState('');
  const [duration, setDuration] = useState(0);
  const [zones, setZones] = useState([]);
  const [result, setResult] = useState(null);
  const outputRef = useRef(null);

  // Derived validation
  const errors = validateZones(zones, duration);
  const anyErrors = hasErrors(errors);

  const canGenerate =
    filename.trim() !== '' &&
    duration > 0 &&
    zones.length > 0 &&
    !anyErrors;

  // Zone actions
  const handleAddZone = useCallback(() => {
    setZones((prev) => [...prev, newZone()]);
    setResult(null);
  }, []);

  const handleUpdateZone = useCallback((id, patch) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, ...patch } : z)));
    setResult(null);
  }, []);

  const handleRemoveZone = useCallback((id) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
    setResult(null);
  }, []);

  // Generate
  function handleGenerate() {
    if (!canGenerate) return;
    const out = generateCommands(filename.trim(), duration, zones);
    setResult(out);
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  // Reset
  function handleReset() {
    if (!window.confirm('Clear everything and start over?')) return;
    setFilename('');
    setDuration(0);
    setZones([]);
    setResult(null);
    _zoneIdCounter = 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-brand">
          <div className="app-header-logo">✂</div>
          <div>
            <div className="app-header-title">FFmpeg Cut &amp; Merge</div>
            <div className="app-header-subtitle">Command Generator</div>
          </div>
        </div>
        <button className="header-reset-btn" onClick={handleReset}>
          ↺ Reset
        </button>
      </header>

      {/* Main */}
      <main className="app-main">
        {/* Step 1 — Video Details */}
        <VideoDetailsInput
          filename={filename}
          setFilename={(v) => { setFilename(v); setResult(null); }}
          duration={duration}
          setDuration={(v) => { setDuration(v); setResult(null); }}
        />

        {/* Step 2 — Deletion Zones */}
        <DeletionZoneManager
          zones={zones}
          errors={errors}
          onAdd={handleAddZone}
          onUpdate={handleUpdateZone}
          onRemove={handleRemoveZone}
        />

        {/* Step 3 — Timeline */}
        <TimelineVisualizer zones={zones} videoDuration={duration} />

        {/* Generate Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <button
            id="generate-btn"
            className="btn btn-primary"
            style={{ padding: '14px 48px', fontSize: '15px', fontWeight: 600 }}
            onClick={handleGenerate}
            disabled={!canGenerate}
          >
            ⚡ Generate Commands
          </button>

          {!filename.trim() && (
            <span className="text-sm text-muted">Enter a filename to continue</span>
          )}
          {filename.trim() && duration === 0 && (
            <span className="text-sm text-muted">Enter video duration to continue</span>
          )}
          {filename.trim() && duration > 0 && zones.length === 0 && (
            <span className="text-sm text-muted">Add at least one deletion zone</span>
          )}
          {anyErrors && zones.length > 0 && (
            <div className="warning-banner">
              ⚠ Fix the errors above before generating commands
            </div>
          )}
        </div>

        {/* Step 4 — Output */}
        {result && (
          <div ref={outputRef}>
            <CommandOutput
              result={result}
              videoDuration={duration}
              zones={zones}
            />
          </div>
        )}

        {/* Step 5 — Quality Reference */}
        <QualityReference defaultFilename={filename} />
      </main>
    </div>
  );
}
