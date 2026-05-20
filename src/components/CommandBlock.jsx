import { useState } from 'react';

export default function CommandBlock({ command, label }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = command;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="cmd-block">
      <pre className="cmd-text">{command}</pre>
      <button
        className={`cmd-copy-btn${copied ? ' copied' : ''}`}
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy command'}
        aria-label={label ? `Copy ${label}` : 'Copy command'}
      >
        {copied ? '✓ Copied' : '⎘ Copy'}
      </button>
    </div>
  );
}
