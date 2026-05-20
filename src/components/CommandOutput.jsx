import { useState } from 'react';
import CommandBlock from './CommandBlock.jsx';
import OperationSummary from './OperationSummary.jsx';

function ScriptView({ bashScript, outputFile }) {
  const [copied, setCopied] = useState(false);

  async function handleCopyAll() {
    try { await navigator.clipboard.writeText(bashScript); } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([bashScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputFile.replace('_final.mp4', '_edit.sh');
    a.click();
    URL.revokeObjectURL(url);
  }

  // Colour script lines
  const lines = bashScript.split('\n').map((line, i) => {
    let cls = '';
    if (line.startsWith('#!')) cls = 'script-shebang';
    else if (line.startsWith('#')) cls = 'script-comment';
    return (
      <span key={i} className={cls}>
        {line}
        {'\n'}
      </span>
    );
  });

  return (
    <div>
      <pre className="script-block">{lines}</pre>
      <div className="script-actions">
        <button className="btn btn-secondary btn-sm" onClick={handleCopyAll}>
          {copied ? '✓ Copied!' : '⎘ Copy All'}
        </button>
        <button className="btn btn-primary btn-sm" onClick={handleDownload}>
          ⬇ Download .sh
        </button>
      </div>
    </div>
  );
}

function StepByStepView({ result }) {
  const { extractCmds, mergeListCmd, mergeCmd, cleanupCmd } = result;

  return (
    <div>
      <div className="step-group">
        <div className="step-group-title">
          <span className="step-number">1</span>
          Extract keep segments
        </div>
        {extractCmds.map((cmd, i) => (
          <CommandBlock key={i} command={cmd} label={`extract part ${i + 1}`} />
        ))}
      </div>

      <div className="step-group">
        <div className="step-group-title">
          <span className="step-number">2</span>
          Create merge list file
        </div>
        <CommandBlock command={mergeListCmd} label="create merge list" />
      </div>

      <div className="step-group">
        <div className="step-group-title">
          <span className="step-number">3</span>
          Merge all parts losslessly
        </div>
        <CommandBlock command={mergeCmd} label="merge" />
      </div>

      <div className="step-group">
        <div className="step-group-title">
          <span className="step-number">4</span>
          Clean up temporary files
        </div>
        <CommandBlock command={cleanupCmd} label="cleanup" />
      </div>
    </div>
  );
}

export default function CommandOutput({ result, videoDuration, zones }) {
  const [tab, setTab] = useState('steps');

  return (
    <div className="card output-section">
      <div className="card-title">
        <span className="card-title-icon">⚡</span>
        Generated Commands
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--keep)',
          background: 'var(--keep-bg)', padding: '2px 8px', borderRadius: '99px' }}>
          Ready to copy
        </span>
      </div>

      <OperationSummary result={result} videoDuration={videoDuration} zones={zones} />

      <div className="divider" />

      <div className="tab-bar">
        <button id="tab-steps" className={`tab-btn${tab === 'steps' ? ' active' : ''}`}
          onClick={() => setTab('steps')}>
          Step by Step
        </button>
        <button id="tab-script" className={`tab-btn${tab === 'script' ? ' active' : ''}`}
          onClick={() => setTab('script')}>
          Full Bash Script
        </button>
      </div>

      {tab === 'steps'
        ? <StepByStepView result={result} />
        : <ScriptView bashScript={result.bashScript} outputFile={result.outputFile} />
      }
    </div>
  );
}
