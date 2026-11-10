'use client';

import { useState, useEffect } from 'react';
import type { Subject, SubjectId, ThemeMode } from '@/types/course';
import { ProgressRing } from '@/components/ProgressRing';
import {
  IconCheck,
  IconGrid,
  IconBookmark,
  IconFolder,
  IconSearch,
  IconSun,
  IconMoon,
  IconChevronRight,
  IconChevronDown,
} from '@/components/Icons';

interface SidebarProps {
  readonly subjects: readonly Subject[];
  readonly activeSubjectId: SubjectId | null;
  readonly activeChapterId: string | null;
  readonly completedChapters: readonly string[];
  readonly bookmarkedChapters: readonly string[];
  readonly theme: ThemeMode;
  readonly mobileOpen: boolean;
  readonly onCloseMobile: () => void;
  readonly onOpenSearch: () => void;
  readonly onToggleTheme: () => void;
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
  theme,
  mobileOpen,
  onCloseMobile,
  onOpenSearch,
  onToggleTheme,
  onSelectDashboard,
  onSelectSubject,
  onSelectChapter,
}: SidebarProps) {
  // Only expand the currently active subject folder by default so we never dump 48 chapters at once
  const [openFolderId, setOpenFolderId] = useState<SubjectId | null>(activeSubjectId);

  useEffect(() => {
    if (activeSubjectId) {
      setOpenFolderId(activeSubjectId);
    }
  }, [activeSubjectId]);

  const totalChapters = subjects.reduce((sum, s) => sum + s.chapters.length, 0);
  const completedCount = completedChapters.length;
  const overallPct = totalChapters > 0 ? (completedCount / totalChapters) * 100 : 0;

  const handleFolderClick = (subjectId: SubjectId) => {
    setOpenFolderId((prev) => (prev === subjectId && activeSubjectId === subjectId ? null : subjectId));
    onSelectSubject(subjectId);
    onCloseMobile();
  };

  const handleToggleChevron = (e: React.MouseEvent, subjectId: SubjectId) => {
    e.stopPropagation();
    setOpenFolderId((prev) => (prev === subjectId ? null : subjectId));
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
        {/* Top Studio Brand & Quick Search */}
        <div
          style={{
            padding: '18px 16px 14px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            <div>
              <div
                className="tabular-mono"
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--ink-muted)',
                }}
              >
                UNITAR • Sem 3
              </div>
              <h2 style={{ fontSize: '1.15rem', margin: '2px 0 0' }}>
                Study Studio
              </h2>
            </div>
            <ProgressRing progress={overallPct} size={42} strokeWidth={4.5} />
          </div>

          {/* Quick Search Trigger in Sidebar */}
          <button
            type="button"
            onClick={() => {
              onCloseMobile();
              onOpenSearch();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 11px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--surface-primary)',
              color: 'var(--ink-muted)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <IconSearch size={14} />
              <span>Quick search...</span>
            </span>
            <kbd>Ctrl K</kbd>
          </button>

          {/* Home Launcher */}
          <button
            type="button"
            onClick={() => {
              onSelectDashboard();
              onCloseMobile();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '8px 11px',
              borderRadius: 'var(--radius-sm)',
              border:
                activeSubjectId === null
                  ? '1px solid var(--border-strong)'
                  : '1px solid transparent',
              backgroundColor:
                activeSubjectId === null ? 'var(--surface-primary)' : 'transparent',
              color: activeSubjectId === null ? 'var(--ink-primary)' : 'var(--ink-body)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.83rem',
              fontWeight: activeSubjectId === null ? 600 : 500,
              cursor: 'pointer',
            }}
            data-testid="nav-dashboard-btn"
          >
            <IconGrid size={15} />
            <span>Home Workspace</span>
          </button>
        </div>

        {/* 5 Course Folders (Single-Accordion so it stays clean like Turbo AI) */}
        <div
          style={{
            padding: '14px 12px 6px',
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--ink-muted)',
          }}
        >
          Course Folders ({subjects.length})
        </div>

        <nav style={{ padding: '0 10px 20px', flex: 1, overflowY: 'auto' }}>
          {subjects.map((subj) => {
            const isExpanded = openFolderId === subj.id;
            const isSubjectSelected = activeSubjectId === subj.id;
            const subjCompleted = subj.chapters.filter((c) =>
              completedChapters.includes(c.id)
            ).length;

            return (
              <div key={subj.id} style={{ marginBottom: '4px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSubjectSelected
                      ? 'var(--surface-primary)'
                      : 'transparent',
                    border: isSubjectSelected
                      ? '1px solid var(--border-subtle)'
                      : '1px solid transparent',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleFolderClick(subj.id)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                    data-testid={`nav-subject-${subj.id}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <span
                        className={`pastel-badge pastel-${subj.pastel}`}
                        style={{ padding: '2px 7px', fontSize: '0.66rem' }}
                      >
                        <IconFolder size={11} />
                        {subj.code}
                      </span>
                      <span
                        style={{
                          fontSize: '0.83rem',
                          fontWeight: isSubjectSelected ? 600 : 500,
                          color: 'var(--ink-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {subj.shortName}
                      </span>
                    </div>

                    <span
                      className="tabular-mono"
                      style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', flexShrink: 0 }}
                    >
                      {subjCompleted}/{subj.chapters.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-label={`Toggle ${subj.shortName} lessons`}
                    onClick={(e) => handleToggleChevron(e, subj.id)}
                    style={{
                      width: '28px',
                      height: '28px',
                      marginRight: '4px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--ink-muted)',
                      flexShrink: 0,
                    }}
                  >
                    {isExpanded ? <IconChevronDown size={13} /> : <IconChevronRight size={13} />}
                  </button>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      marginTop: '4px',
                      marginBottom: '8px',
                      paddingLeft: '12px',
                      borderLeft: '1px solid var(--border-subtle)',
                      marginLeft: '14px',
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
                            padding: '6px 9px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: isCurrent
                              ? 'var(--surface-primary)'
                              : 'transparent',
                            color: isCurrent ? 'var(--ink-primary)' : 'var(--ink-muted)',
                            fontWeight: isCurrent ? 600 : 400,
                            fontSize: '0.78rem',
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
                            <strong className="tabular-mono" style={{ fontSize: '0.72rem' }}>
                              {ch.numberLabel}:
                            </strong>{' '}
                            {ch.title}
                          </span>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              flexShrink: 0,
                            }}
                          >
                            {isBookmarked && (
                              <span style={{ color: 'var(--pastel-amber-text)' }}>
                                <IconBookmark size={11} />
                              </span>
                            )}
                            {isDone && (
                              <span style={{ color: 'var(--pastel-green-text)' }}>
                                <IconCheck size={12} />
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

        {/* Bottom Footer: Night Mode Toggle & Mastery Summary */}
        <div
          style={{
            padding: '12px 14px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <span className="tabular-mono" style={{ fontSize: '0.74rem', color: 'var(--ink-muted)' }}>
            {completedCount}/{totalChapters} Lessons Done
          </span>

          <button
            type="button"
            className="btn-icon-pill"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Studio Light mode' : 'Switch to Night mode'}
            data-testid="toggle-theme-btn"
          >
            {theme === 'dark' ? (
              <>
                <IconSun size={13} />
                <span>Light</span>
              </>
            ) : (
              <>
                <IconMoon size={13} />
                <span>Night</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
