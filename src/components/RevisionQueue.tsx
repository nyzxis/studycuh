'use client';

import { Reorder } from 'motion/react';
import type { Chapter, Subject } from '@/types/course';
import { IconArrowRight, IconGrip } from '@/components/Icons';

interface RevisionQueueProps {
  readonly queueIds: readonly string[];
  readonly allChapters: ReadonlyMap<string, { readonly chapter: Chapter; readonly subject: Subject }>;
  readonly onReorder: (nextIds: readonly string[]) => void;
  readonly onSelectChapter: (subjectId: Subject['id'], chapterId: string) => void;
}

export function RevisionQueue({
  queueIds,
  allChapters,
  onReorder,
  onSelectChapter,
}: RevisionQueueProps) {
  const validIds = queueIds.filter((id) => allChapters.has(id));

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Priority Revision Queue</h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
            Drag items vertically to reorder your next exam revision targets.
          </p>
        </div>
        <span className="pastel-badge pastel-amber">Drag to Reorder</span>
      </div>

      <Reorder.Group
        axis="y"
        values={[...validIds]}
        onReorder={(nextOrder) => onReorder(nextOrder)}
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {validIds.map((chapterId, index) => {
          const entry = allChapters.get(chapterId);
          if (!entry) return null;
          const { chapter, subject } = entry;
          return (
            <Reorder.Item
              key={chapterId}
              value={chapterId}
              style={{
                backgroundColor: 'var(--canvas-bg)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                cursor: 'grab',
              }}
              data-testid="revision-queue-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <span style={{ color: 'var(--ink-muted)', display: 'inline-flex' }}>
                  <IconGrip size={15} />
                </span>
                <span
                  className="tabular-mono"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--ink-muted)',
                    fontWeight: 600,
                  }}
                >
                  0{index + 1}
                </span>
                <span className={`pastel-badge pastel-${subject.pastel}`}>
                  {subject.shortName}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: 'var(--ink-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {chapter.numberLabel}: {chapter.title}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ minHeight: '32px', padding: '4px 10px', fontSize: '0.78rem' }}
                onClick={() => onSelectChapter(subject.id, chapter.id)}
              >
                Open <IconArrowRight size={13} />
              </button>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
}
