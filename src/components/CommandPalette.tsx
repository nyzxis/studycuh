'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Subject, SubjectId } from '@/types/course';
import { GLOBAL_SEARCH_INDEX } from '@/data/courseIndex';
import { IconSearch, IconArrowRight } from '@/components/Icons';

interface CommandPaletteProps {
  readonly isOpen: boolean;
  readonly subjects: readonly Subject[];
  readonly onClose: () => void;
  readonly onSelectChapter: (subjectId: SubjectId, chapterId: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectChapter,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return GLOBAL_SEARCH_INDEX.filter((i) => i.kind === 'Chapter').slice(0, 12);
    }
    return GLOBAL_SEARCH_INDEX.filter(
      (item) =>
        item.chapterTitle.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.subjectCode.toLowerCase().includes(q)
    ).slice(0, 18);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(17, 17, 17, 0.36)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '64px 16px 24px',
      }}
      onClick={onClose}
      data-testid="command-palette-backdrop"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global coursework search"
        className="bento-card"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: 0,
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
        data-testid="command-palette-modal"
      >
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <IconSearch size={18} />
          <input
            type="text"
            autoFocus
            aria-label="Search chapters, keywords, and slide alerts"
            placeholder="Search 48 chapters, keywords (e.g. Cramer, 2's Complement, Grice, 3NF, 4Ps)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-sans)',
              backgroundColor: 'transparent',
              color: 'var(--ink-primary)',
            }}
            data-testid="command-palette-input"
          />
          <button
            type="button"
            className="btn-secondary"
            style={{ minHeight: '28px', padding: '2px 8px', fontSize: '0.74rem' }}
            onClick={onClose}
          >
            ESC
          </button>
        </div>

        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '10px' }}>
          {filtered.length === 0 ? (
            <div
              style={{ padding: '28px 16px', textAlign: 'center' }}
              data-testid="command-palette-empty"
            >
              <p style={{ margin: '0 0 10px', color: 'var(--ink-muted)' }}>
                No chapters, keywords, or slide alerts matched &ldquo;{query}&rdquo;.
              </p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setQuery('')}
                data-testid="clear-search-btn"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filtered.map((hit) => (
                <button
                  key={hit.id}
                  type="button"
                  onClick={() => {
                    onSelectChapter(hit.subjectId, hit.chapterId);
                    onClose();
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--surface-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                  data-testid="command-palette-hit"
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span className={`pastel-badge pastel-${hit.pastel}`}>
                        {hit.subjectCode}
                      </span>
                      <span
                        className="tabular-mono"
                        style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', fontWeight: 600 }}
                      >
                        {hit.kind}
                      </span>
                      <strong style={{ fontSize: '0.86rem', color: 'var(--ink-primary)' }}>
                        {hit.chapterTitle}
                      </strong>
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--ink-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {hit.snippet}
                    </div>
                  </div>
                  <IconArrowRight size={14} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
