'use client';

import { useState } from 'react';
import type { Subject, SubjectId } from '@/types/course';
import { ProgressRing } from '@/components/ProgressRing';
import { StudyPulse } from '@/components/StudyPulse';
import { IconCheck, IconGrid, IconPlus, IconMinus, IconBookmark } from '@/components/Icons';

interface SidebarProps {
  readonly subjects: readonly Subject[];
  readonly activeSubjectId: SubjectId | null;
  readonly activeChapterId: string | null;
  readonly completedChapters: readonly string[];
  readonly bookmarkedChapters: readonly string[];
  readonly mobileOpen: boolean;
  readonly onCloseMobile: () => void;
  readonly onSelectDashboard: () => void;
  readonly onSelectSubject: (subjectId: SubjectId) => void;
  readonly onSelectChapter: (subjectId: SubjectId, chapterId: string) => void;
}

export function Sidebar({
  subjects,
  activeSubjectId,
  activeChapterId,
  completedChapters,
  bookmarkedChapters,
  mobileOpen,
  onCloseMobile,
  onSelectDashboard,
  onSelectSubject,
  onSelectChapter,
}: SidebarProps) {
  const [expandedSubjects, setExpandedSubjects] = useState<Readonly<Record<SubjectId, boolean>>>({
    business: true,
    cso: true,
    database: true,
    english: true,
    maths: true,
  });

  const totalChapters = subjects.reduce((sum, s) => sum + s.chapters.length, 0);
  const completedCount = completedChapters.length;
  const overallPct = totalChapters > 0 ? (completedCount / totalChapters) * 100 : 0;

  const toggleExpand = (subjectId: SubjectId) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  return (
    <>
      <div
        aria-hidden="true"
        className={`sidebar-backdrop ${mobileOpen ? 'mobile-open' : ''}`}
        onClick={onCloseMobile}
      />
      <aside
        className={`portal-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
        aria-label="Coursework Navigation"
        data-testid="portal-sidebar"
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '20px 18px 16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <div>
              <div
                className="tabular-mono"
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--ink-muted)',
                }}
              >
                UNITAR Foundation in IT
              </div>
              <h2 style={{ fontSize: '1.2rem', margin: '2px 0 4px' }}>
                Semester 3 Portal
              </h2>
              <StudyPulse label="5 Subjects • 48 Chapters" />
            </div>
            <ProgressRing progress={overallPct} size={50} strokeWidth={5} />
          </div>

          <button
            type="button"
            className={`btn-secondary ${activeSubjectId === null ? 'active' : ''}`}
            style={{ width: '100%', marginTop: '14px', justifyContent: 'flex-start' }}
            onClick={() => {
              onSelectDashboard();
              onCloseMobile();
            }}
            data-testid="nav-dashboard-btn"
          >
            <IconGrid size={15} />
            <span>All Subjects Overview</span>
          </button>
        </div>

        {/* Subject & Chapter Tree */}
        <nav style={{ padding: '12px 10px 28px', flex: 1 }}>
          {subjects.map((subj) => {
            const isExpanded = expandedSubjects[subj.id];
            const subjCompleted = subj.chapters.filter((c) =>
              completedChapters.includes(c.id)
            ).length;

            return (
              <div
                key={subj.id}
                style={{
                  marginBottom: '10px',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSubject(subj.id);
                      onCloseMobile();
                    }}
                    style={{
                      flex: 1,
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor:
                        activeSubjectId === subj.id && activeChapterId === null
                          ? 'var(--surface-primary)'
                          : 'transparent',
                    }}
                    data-testid={`nav-subject-${subj.id}`}
                  >
                    <div>
                      <span className={`pastel-badge pastel-${subj.pastel}`}>
                        {subj.code}
                      </span>
                      <div
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          color: 'var(--ink-primary)',
                          marginTop: '4px',
                        }}
                      >
                        {subj.shortName}
                      </div>
                    </div>
                    <span
                      className="tabular-mono"
                      style={{ fontSize: '0.73rem', color: 'var(--ink-muted)' }}
                    >
                      {subjCompleted}/{subj.chapters.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-label={`Toggle ${subj.shortName} chapters`}
                    onClick={() => toggleExpand(subj.id)}
                    style={{
                      width: '32px',
                      height: '32px',
                      background: 'none',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--ink-muted)',
                    }}
                  >
                    {isExpanded ? <IconMinus size={13} /> : <IconPlus size={13} />}
                  </button>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      marginTop: '4px',
                      paddingLeft: '6px',
                    }}
                  >
                    {subj.chapters.map((ch) => {
                      const isCurrent = activeChapterId === ch.id;
                      const isDone = completedChapters.includes(ch.id);
                      const isBookmarked = bookmarkedChapters.includes(ch.id);

                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => {
                            onSelectChapter(subj.id, ch.id);
                            onCloseMobile();
                          }}
                          style={{
                            textAlign: 'left',
                            padding: '7px 10px',
                            borderRadius: 'var(--radius-sm)',
                            border: isCurrent
                              ? '1px solid var(--border-strong)'
                              : '1px solid transparent',
                            backgroundColor: isCurrent
                              ? 'var(--surface-primary)'
                              : 'transparent',
                            color: isCurrent ? 'var(--ink-primary)' : 'var(--ink-body)',
                            fontWeight: isCurrent ? 600 : 400,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '6px',
                          }}
                          data-testid={`nav-chapter-${ch.id}`}
                        >
                          <span
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <strong className="tabular-mono" style={{ fontSize: '0.74rem' }}>
                              {ch.numberLabel}:
                            </strong>{' '}
                            {ch.title}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                            {isBookmarked && (
                              <span style={{ color: 'var(--pastel-amber-text)' }}>
                                <IconBookmark size={12} />
                              </span>
                            )}
                            {isDone && (
                              <span style={{ color: 'var(--pastel-green-text)' }}>
                                <IconCheck size={13} />
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
