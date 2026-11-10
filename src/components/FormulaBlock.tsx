import { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface FormulaBlockProps {
  readonly label?: string;
  readonly latex: string;
  readonly note?: string;
  readonly inline?: boolean;
}

export function FormulaBlock({ label, latex, note, inline = false }: FormulaBlockProps) {
  const [copied, setCopied] = useState(false);

  const renderedHtml = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: !inline,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return latex.replace(
        /[&<>"']/g,
        (ch) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          })[ch] ?? ch
      );
    }
  }, [latex, inline]);

  if (inline) {
    return (
      <span
        className="tabular-mono"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(latex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--canvas-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        margin: '10px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: label ? '6px' : '0',
        }}
      >
        {label && (
          <span
            style={{
              fontSize: '0.76rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--ink-muted)',
            }}
          >
            {label}
          </span>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="btn-secondary"
          style={{ minHeight: '28px', padding: '2px 8px', fontSize: '0.72rem' }}
          title="Copy LaTeX formula"
        >
          {copied ? 'Copied' : 'Copy LaTeX'}
        </button>
      </div>
      <div
        style={{ overflowX: 'auto', padding: '4px 0' }}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
      {note && (
        <div
          style={{
            marginTop: '6px',
            fontSize: '0.8rem',
            color: 'var(--ink-muted)',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '6px',
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
}
