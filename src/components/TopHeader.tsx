'use client';

import { motion } from 'motion/react';
import type { Chapter, Subject, TurboLessonTab } from '@/types/course';
import { springs } from '@/lib/motion-tokens';
import {
  IconMenu,
  IconSearch,
  IconSpark,
  IconBookmark,
  IconCheck,
  IconSidebarToggle,
  IconBook,
  IconCards,
  IconLab,
} from '@/components/Icons';

interface TopHeaderProps {
  readonly activeSubject: Subject | null;
  readonly activeChapter: Chapter | null;
  readonly activeLessonTab: TurboLessonTab;
  readonly cramModeEnabled: boolean;
  readonly highlightKeywordsEnabled: boolean;
  readonly sidebarCollapsed: boolean;
  readonly isChapterCompleted: boolean;
  readonly isChapterBookmarked: boolean;
  readonly onChangeLessonTab: (tab: TurboLessonTab) => void;
  readonly onOpenMobileMenu: () => void;
  readonly onToggleSidebarCollapse: () => void;
  readonly onOpenSearch: () => void;
  readonly onToggleCramMode: () => void;
  readonly onToggleHighlightKeywords: () => void;
  readonly onToggleCompleted?: () => void;
  readonly onToggleBookmark?: () => void;
  readonly onNavigateDashboard: () => void;
  readonly onNavigateSubject?: () => void;
}

const LESSON_TABS: readonly {
  readonly id: TurboLessonTab;
  readonly label: string;
  readonly testId: string;
}[] = [
  { id: 'notes', label: 'Notes', testId: 'tab-notes' },
  { id: 'flashcards', label: 'Flashcards', testId: 'tab-flashcards' },
  { id: 'quiz', label: 'Quiz', testId: 'tab-quiz' },
  { id: 'toolkit', label: 'Lab & Sheet', testId: 'tab-toolkit' },
];

export function TopHeader({
  activeSubject,
  activeChapter,
  activeLessonTab,
  cramModeEnabled,
  highlightKeywordsEnabled,
  sidebarCollapsed,
  isChapterCompleted,
  isChapterBookmarked,
  onChangeLessonTab,
  onOpenMobileMenu,
  onToggleSidebarCollapse,
  onOpenSearch,
  onToggleCramMode,
  onToggleHighlightKeywords,
  onToggleCompleted,
  onToggleBookmark,
  onNavigateDashboard,
  onNavigateSubject,
}: TopHeaderProps) {
  return (
    <header className="portal-topbar" data-testid="portal-topbar">
      {/* Left: Sidebar Toggle + Clean Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <button
          type="button"
          className="btn-icon-pill mobile-menu-btn"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          data-testid="mobile-menu-btn"
        >
          <IconMenu size={16} />
        </button>

        <button
          type="button"
          className="btn-icon-pill desktop-sidebar-toggle"
          onClick={onToggleSidebarCollapse}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Focus mode (hide sidebar)'}
          data-testid="desktop-sidebar-toggle"
        >
          <IconSidebarToggle size={15} />
        </button>

        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '0.82rem',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <button
            type="button"
            onClick={onNavigateDashboard}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: activeSubject ? 'var(--ink-muted)' : 'var(--ink-primary)',
              fontWeight: activeSubject ? 500 : 700,
              fontFamily: 'var(--font-sans)',
              fontSize: '0.82rem',
            }}
          >
            Home
          </button>

          {activeSubject && (
            <>
              <span style={{ color: 'var(--ink-faint)' }}>/</span>
              <button
                type="button"
                onClick={onNavigateSubject}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: activeChapter ? 'var(--ink-muted)' : 'var(--ink-primary)',
                  fontWeight: activeChapter ? 500 : 700,
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                }}
              >
                {activeSubject.shortName}
              </button>
            </>
          )}

          {activeChapter && (
            <>
              <span style={{ color: 'var(--ink-faint)' }}>/</span>
              <span
                style={{
                  color: 'var(--ink-primary)',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {activeChapter.numberLabel}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Center: Turbo AI 4-Tab Segmented Pill Switcher (Only when inside a Chapter) */}
      {activeChapter && (
        <div
          className="turbo-segmented-bar"
          role="tablist"
          aria-label="Lesson Study Mode"
          data-testid="turbo-segmented-bar"
        >
          {LESSON_TABS.map((t) => {
            const isActive = activeLessonTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`turbo-segmented-btn ${isActive ? 'active' : ''}`}
                onClick={() => onChangeLessonTab(t.id)}
                data-testid={t.testId}
              >
                {isActive && (
                  <motion.span
                    layoutId="turbo-lesson-tab-pill"
                    className="turbo-segmented-pill"
                    transition={springs.snappy}
                  />
                )}
                {t.id === 'notes' && <IconBook size={13} />}
                {t.id === 'flashcards' && <IconCards size={13} />}
                {t.id === 'quiz' && <IconCheck size={13} />}
                {t.id === 'toolkit' && <IconLab size={13} />}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Right: Compact Studio Action Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <button
          type="button"
          className="btn-icon-pill"
          onClick={onOpenSearch}
          data-testid="open-search-btn"
          aria-label="Search coursework"
          title="Search all subjects, chapters, and keywords (Ctrl+K)"
        >
          <IconSearch size={13} />
          <span className="hide-on-mobile">Search</span>
        </button>

        <button
          type="button"
          className={`btn-icon-pill ${highlightKeywordsEnabled ? 'active' : ''}`}
          onClick={onToggleHighlightKeywords}
          data-testid="toggle-keywords-btn"
          title="Highlight subject keywords inline across notes"
        >
          <span>Keywords</span>
        </button>

        <button
          type="button"
          className={`btn-icon-pill ${cramModeEnabled ? 'active' : ''}`}
          onClick={onToggleCramMode}
          data-testid="toggle-cram-btn"
          title="Spotlight exam trigger phrases and keyword pattern matrices (Shortcut: C)"
        >
          <IconSpark size={13} />
          <span>Cram</span>
        </button>

        {activeChapter && onToggleBookmark && (
          <button
            type="button"
            className={`btn-icon-pill ${isChapterBookmarked ? 'active' : ''}`}
            onClick={onToggleBookmark}
            data-testid="bookmark-chapter-btn"
            aria-label="Bookmark chapter"
            title={isChapterBookmarked ? 'Bookmarked' : 'Bookmark lesson'}
          >
            <IconBookmark size={13} />
            <span className="hide-on-mobile">{isChapterBookmarked ? 'Saved' : 'Save'}</span>
          </button>
        )}

        {activeChapter && onToggleCompleted && (
          <button
            type="button"
            className={isChapterCompleted ? 'btn-primary' : 'btn-icon-pill'}
            style={{ minHeight: '34px', padding: '0 12px' }}
            onClick={onToggleCompleted}
            data-testid="complete-chapter-btn"
          >
            <IconCheck size={13} />
            <span>{isChapterCompleted ? 'Done' : 'Mark Done'}</span>
          </button>
        )}
      </div>
    </header>
  );
}
