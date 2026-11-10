'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SubjectId, TurboLessonTab } from '@/types/course';
import { ALL_SUBJECTS, SUBJECT_MAP, CHAPTER_LOOKUP } from '@/data/courseIndex';
import { StudyProgressProvider, useStudyProgress } from '@/context/StudyProgressContext';
import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { CommandPalette } from '@/components/CommandPalette';
import { SubjectDashboard } from '@/components/SubjectDashboard';
import { ChapterView } from '@/components/ChapterView';
import { ShimmerSkeleton } from '@/components/ShimmerSkeleton';

function PortalWorkspace() {
  const {
    state,
    isHydrated,
    toggleChapterCompleted,
    toggleChapterBookmark,
    markFlashcard,
    updateChapterNote,
    setRevisionQueue,
    recordQuizAttempt,
    toggleCramMode,
    toggleHighlightKeywords,
    setLastVisitedChapter,
    toggleTheme,
    exportStateJson,
    importStateJson,
  } = useStudyProgress();

  const [activeSubjectId, setActiveSubjectId] = useState<SubjectId | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [activeLessonTab, setActiveLessonTab] = useState<TurboLessonTab>('notes');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const activeSubject = activeSubjectId ? SUBJECT_MAP[activeSubjectId] : null;
  const activeChapter =
    activeSubject && activeChapterId
      ? activeSubject.chapters.find((c) => c.id === activeChapterId) ?? null
      : null;

  const handleSelectDashboard = useCallback(() => {
    setActiveSubjectId(null);
    setActiveChapterId(null);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleSelectSubject = useCallback((subjectId: SubjectId) => {
    setActiveSubjectId(subjectId);
    setActiveChapterId(null);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleSelectChapter = useCallback(
    (subjectId: SubjectId, chapterId: string, initialTab: TurboLessonTab = 'notes') => {
      setActiveSubjectId(subjectId);
      setActiveChapterId(chapterId);
      setActiveLessonTab(initialTab);
      setLastVisitedChapter(chapterId);
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    },
    [setLastVisitedChapter]
  );

  // Global keyboard shortcuts: Ctrl+K / Cmd+K for search, 'c' (outside inputs) for Cram Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        return;
      }
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (!isTyping && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        toggleCramMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, toggleCramMode]);

  return (
    <div className={`portal-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        subjects={ALL_SUBJECTS}
        activeSubjectId={activeSubjectId}
        activeChapterId={activeChapterId}
        completedChapters={state.completedChapters}
        bookmarkedChapters={state.bookmarkedChapters}
        theme={state.theme}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenSearch={() => setSearchOpen(true)}
        onToggleTheme={toggleTheme}
        onSelectDashboard={handleSelectDashboard}
        onSelectSubject={handleSelectSubject}
        onSelectChapter={handleSelectChapter}
      />

      <div className="portal-main">
        <TopHeader
          activeSubject={activeSubject}
          activeChapter={activeChapter}
          activeLessonTab={activeLessonTab}
          theme={state.theme}
          cramModeEnabled={state.cramModeEnabled}
          highlightKeywordsEnabled={state.highlightKeywordsEnabled}
          sidebarCollapsed={sidebarCollapsed}
          isChapterCompleted={
            activeChapter ? state.completedChapters.includes(activeChapter.id) : false
          }
          isChapterBookmarked={
            activeChapter ? state.bookmarkedChapters.includes(activeChapter.id) : false
          }
          onChangeLessonTab={setActiveLessonTab}
          onToggleTheme={toggleTheme}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onToggleSidebarCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onOpenSearch={() => setSearchOpen(true)}
          onToggleCramMode={toggleCramMode}
          onToggleHighlightKeywords={toggleHighlightKeywords}
          onToggleCompleted={
            activeChapter ? () => toggleChapterCompleted(activeChapter.id) : undefined
          }
          onToggleBookmark={
            activeChapter ? () => toggleChapterBookmark(activeChapter.id) : undefined
          }
          onNavigateDashboard={handleSelectDashboard}
          onNavigateSubject={
            activeSubject ? () => handleSelectSubject(activeSubject.id) : undefined
          }
        />

        <main className="portal-content">
          {!isHydrated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <ShimmerSkeleton height={160} />
              <ShimmerSkeleton height={220} />
            </div>
          ) : activeSubject && activeChapter ? (
            <ChapterView
              key={activeChapter.id}
              subject={activeSubject}
              chapter={activeChapter}
              activeTab={activeLessonTab}
              onChangeTab={setActiveLessonTab}
              highlightKeywordsEnabled={state.highlightKeywordsEnabled}
              cramModeEnabled={state.cramModeEnabled}
              isChapterCompleted={state.completedChapters.includes(activeChapter.id)}
              masteredFlashcards={state.masteredFlashcards}
              reviewAgainFlashcards={state.reviewAgainFlashcards}
              personalNote={state.chapterNotes[activeChapter.id] ?? ''}
              onMarkFlashcard={markFlashcard}
              onUpdatePersonalNote={(note) => updateChapterNote(activeChapter.id, note)}
              onCompleteQuiz={recordQuizAttempt}
              onToggleCompleted={() => toggleChapterCompleted(activeChapter.id)}
              onSelectChapter={handleSelectChapter}
            />
          ) : (
            <SubjectDashboard
              subjects={ALL_SUBJECTS}
              activeSubject={activeSubject}
              allChapters={CHAPTER_LOOKUP}
              studyState={state}
              onSelectSubject={handleSelectSubject}
              onSelectChapter={handleSelectChapter}
              onReorderQueue={setRevisionQueue}
              onRecordQuiz={recordQuizAttempt}
              onExportJson={exportStateJson}
              onImportJson={importStateJson}
            />
          )}
        </main>
      </div>

      <CommandPalette
        isOpen={searchOpen}
        subjects={ALL_SUBJECTS}
        onClose={() => setSearchOpen(false)}
        onSelectChapter={(subjId, chapId) => handleSelectChapter(subjId, chapId, 'notes')}
      />
    </div>
  );
}

export function App() {
  return (
    <StudyProgressProvider>
      <PortalWorkspace />
    </StudyProgressProvider>
  );
}
