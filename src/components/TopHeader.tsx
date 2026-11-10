'use client';

import type { Chapter, Subject } from '@/types/course';
import { IconMenu, IconSearch, IconSpark, IconBookmark, IconCheck } from '@/components/Icons';

interface TopHeaderProps {
  readonly activeSubject: Subject | null;
  readonly activeChapter: Chapter | null;
  readonly cramModeEnabled: boolean;
  readonly highlightKeywordsEnabled: boolean;
  readonly isChapterCompleted: boolean;
  readonly isChapterBookmarked: boolean;
  readonly onOpenMobileMenu: () => void;
  readonly onOpenSearch: () => void;
  readonly onToggleCramMode: () => void;
  readonly onToggleHighlightKeywords: () => void;
  readonly onToggleCompleted?: () => void;
  readonly onToggleBookmark?: () => void;
  readonly onNavigateDashboard: () => void;
  readonly onNavigateSubject?: () => void;
}

export function TopHeader({
  activeSubject,
  activeChapter,
  cramModeEnabled,
  highlightKeywordsEnabled,
  isChapterCompleted,
  isChapterBookmarked,
  onOpenMobileMenu,
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
      {/* Left: Mobile Menu + Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <button
          type="button"
          className="btn-secondary mobile-menu-btn"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          data-testid="mobile-menu-btn"
        >
          <IconMenu size={17} />
        </button>

        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.84rem',
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
              fontSize: '0.84rem',
            }}
          >
            Sem 3 Workspace
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
                  fontSize: '0.84rem',
                }}
              >
                {activeSubject.code} ({activeSubject.shortName})
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
                {activeChapter.numberLabel}: {activeChapter.title}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Right: Search, Keyword Highlighter, Cram Mode, Bookmark & Complete */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={onOpenSearch}
          data-testid="open-search-btn"
        >
          <IconSearch size={14} />
          <span>Search</span>
          <kbd>Ctrl K</kbd>
        </button>

        <button
          type="button"
          className={`btn-secondary ${highlightKeywordsEnabled ? 'active' : ''}`}
          onClick={onToggleHighlightKeywords}
          data-testid="toggle-keywords-btn"
          title="Highlight subject keywords inline across notes"
        >
          <span>Highlight Keywords</span>
        </button>

        <button
          type="button"
          className={`btn-secondary ${cramModeEnabled ? 'active' : ''}`}
          onClick={onToggleCramMode}
          data-testid="toggle-cram-btn"
          title="Spotlight exam trigger phrases and keyword pattern matrices"
        >
          <IconSpark size={14} />
          <span>Cram Mode</span>
          <kbd>C</kbd>
        </button>

        {activeChapter && onToggleBookmark && (
          <button
            type="button"
            className={`btn-secondary ${isChapterBookmarked ? 'active' : ''}`}
            onClick={onToggleBookmark}
            data-testid="bookmark-chapter-btn"
            aria-label="Bookmark chapter"
          >
            <IconBookmark size={14} />
            <span>{isChapterBookmarked ? 'Saved' : 'Bookmark'}</span>
          </button>
        )}

        {activeChapter && onToggleCompleted && (
          <button
            type="button"
            className={isChapterCompleted ? 'btn-primary' : 'btn-secondary'}
            onClick={onToggleCompleted}
            data-testid="complete-chapter-btn"
          >
            <IconCheck size={14} />
            <span>{isChapterCompleted ? 'Completed' : 'Mark Done'}</span>
          </button>
        )}
      </div>
    </header>
  );
}
