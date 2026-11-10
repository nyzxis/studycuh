'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { flushSync } from 'react-dom';
import type { QuizAttempt, ThemeMode, UserStudyState } from '@/types/course';

const STORAGE_KEY = 'unitar_sem3_study_state_v1';

const DEFAULT_REVISION_QUEUE: readonly string[] = [
  'cso-ch5',
  'math-t6',
  'db-ch7',
  'biz-ch6',
  'eng-t5',
];

const INITIAL_STATE: UserStudyState = {
  completedChapters: [],
  bookmarkedChapters: [],
  masteredFlashcards: [],
  reviewAgainFlashcards: [],
  chapterNotes: {},
  revisionQueue: DEFAULT_REVISION_QUEUE,
  quizHistory: [],
  cramModeEnabled: false,
  highlightKeywordsEnabled: true,
  lastVisitedChapterId: 'cso-ch1',
  theme: 'light',
};

interface StudyProgressContextValue {
  readonly state: UserStudyState;
  readonly isHydrated: boolean;
  readonly toggleChapterCompleted: (chapterId: string) => void;
  readonly toggleChapterBookmark: (chapterId: string) => void;
  readonly markFlashcard: (cardId: string, status: 'mastered' | 'review') => void;
  readonly updateChapterNote: (chapterId: string, note: string) => void;
  readonly setRevisionQueue: (nextQueue: readonly string[]) => void;
  readonly recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => void;
  readonly toggleCramMode: () => void;
  readonly toggleHighlightKeywords: () => void;
  readonly setLastVisitedChapter: (chapterId: string) => void;
  readonly toggleTheme: (event?: React.MouseEvent<HTMLElement>) => void;
  readonly setTheme: (theme: ThemeMode) => void;
  readonly exportStateJson: () => string;
  readonly importStateJson: (rawJson: string) => { readonly ok: boolean; readonly error?: string };
  readonly resetProgress: () => void;
}

const StudyProgressContext = createContext<StudyProgressContextValue | null>(null);

function sanitizeLoadedState(parsed: unknown): UserStudyState {
  if (typeof parsed !== 'object' || parsed === null) {
    return INITIAL_STATE;
  }
  const candidate = parsed as Record<string, unknown>;
  const sanitizedNotes: Record<string, string> = {};
  if (
    typeof candidate.chapterNotes === 'object' &&
    candidate.chapterNotes !== null &&
    !Array.isArray(candidate.chapterNotes)
  ) {
    for (const [k, v] of Object.entries(candidate.chapterNotes)) {
      if (typeof v === 'string') {
        sanitizedNotes[k] = v;
      }
    }
  }

  const sanitizedHistory: QuizAttempt[] = [];
  if (Array.isArray(candidate.quizHistory)) {
    for (const item of candidate.quizHistory) {
      if (typeof item === 'object' && item !== null) {
        const rec = item as Record<string, unknown>;
        if (
          typeof rec.id === 'string' &&
          typeof rec.scopeId === 'string' &&
          typeof rec.scopeLabel === 'string' &&
          typeof rec.score === 'number' &&
          typeof rec.total === 'number' &&
          typeof rec.completedAt === 'string'
        ) {
          sanitizedHistory.push({
            id: rec.id,
            scopeId: rec.scopeId,
            scopeLabel: rec.scopeLabel,
            score: rec.score,
            total: rec.total,
            completedAt: rec.completedAt,
          });
        }
      }
    }
  }

  return {
    completedChapters: Array.isArray(candidate.completedChapters)
      ? candidate.completedChapters.filter((x): x is string => typeof x === 'string')
      : INITIAL_STATE.completedChapters,
    bookmarkedChapters: Array.isArray(candidate.bookmarkedChapters)
      ? candidate.bookmarkedChapters.filter((x): x is string => typeof x === 'string')
      : INITIAL_STATE.bookmarkedChapters,
    masteredFlashcards: Array.isArray(candidate.masteredFlashcards)
      ? candidate.masteredFlashcards.filter((x): x is string => typeof x === 'string')
      : INITIAL_STATE.masteredFlashcards,
    reviewAgainFlashcards: Array.isArray(candidate.reviewAgainFlashcards)
      ? candidate.reviewAgainFlashcards.filter((x): x is string => typeof x === 'string')
      : INITIAL_STATE.reviewAgainFlashcards,
    chapterNotes: sanitizedNotes,
    revisionQueue:
      Array.isArray(candidate.revisionQueue) && candidate.revisionQueue.length > 0
        ? candidate.revisionQueue.filter((x): x is string => typeof x === 'string')
        : INITIAL_STATE.revisionQueue,
    quizHistory: sanitizedHistory,
    cramModeEnabled:
      typeof candidate.cramModeEnabled === 'boolean'
        ? candidate.cramModeEnabled
        : INITIAL_STATE.cramModeEnabled,
    highlightKeywordsEnabled:
      typeof candidate.highlightKeywordsEnabled === 'boolean'
        ? candidate.highlightKeywordsEnabled
        : INITIAL_STATE.highlightKeywordsEnabled,
    lastVisitedChapterId:
      typeof candidate.lastVisitedChapterId === 'string'
        ? candidate.lastVisitedChapterId
        : INITIAL_STATE.lastVisitedChapterId,
    theme:
      candidate.theme === 'dark' || candidate.theme === 'light'
        ? candidate.theme
        : INITIAL_STATE.theme,
  };
}

export function StudyProgressProvider({ children }: { readonly children: React.ReactNode }) {
  const [state, setState] = useState<UserStudyState>(INITIAL_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(sanitizeLoadedState(JSON.parse(saved)));
      }
    } catch {
      // Fallback to default state if localStorage is unavailable or corrupted
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', state.theme);
    }
  }, [state.theme]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state, isHydrated]);

  const toggleChapterCompleted = useCallback((chapterId: string) => {
    setState((prev) => {
      const exists = prev.completedChapters.includes(chapterId);
      const nextCompleted = exists
        ? prev.completedChapters.filter((id) => id !== chapterId)
        : [...prev.completedChapters, chapterId];
      return { ...prev, completedChapters: nextCompleted };
    });
  }, []);

  const toggleChapterBookmark = useCallback((chapterId: string) => {
    setState((prev) => {
      const exists = prev.bookmarkedChapters.includes(chapterId);
      const nextBookmarks = exists
        ? prev.bookmarkedChapters.filter((id) => id !== chapterId)
        : [...prev.bookmarkedChapters, chapterId];
      return { ...prev, bookmarkedChapters: nextBookmarks };
    });
  }, []);

  const markFlashcard = useCallback((cardId: string, status: 'mastered' | 'review') => {
    setState((prev) => {
      if (status === 'mastered') {
        const nextMastered = prev.masteredFlashcards.includes(cardId)
          ? prev.masteredFlashcards
          : [...prev.masteredFlashcards, cardId];
        const nextReview = prev.reviewAgainFlashcards.filter((id) => id !== cardId);
        return {
          ...prev,
          masteredFlashcards: nextMastered,
          reviewAgainFlashcards: nextReview,
        };
      }
      const nextReview = prev.reviewAgainFlashcards.includes(cardId)
        ? prev.reviewAgainFlashcards
        : [...prev.reviewAgainFlashcards, cardId];
      const nextMastered = prev.masteredFlashcards.filter((id) => id !== cardId);
      return {
        ...prev,
        masteredFlashcards: nextMastered,
        reviewAgainFlashcards: nextReview,
      };
    });
  }, []);

  const updateChapterNote = useCallback((chapterId: string, note: string) => {
    setState((prev) => ({
      ...prev,
      chapterNotes: {
        ...prev.chapterNotes,
        [chapterId]: note,
      },
    }));
  }, []);

  const setRevisionQueue = useCallback((nextQueue: readonly string[]) => {
    setState((prev) => ({
      ...prev,
      revisionQueue: [...nextQueue],
    }));
  }, []);

  const recordQuizAttempt = useCallback(
    (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => {
      const newAttempt: QuizAttempt = {
        ...attempt,
        id: `qa-${Date.now()}`,
        completedAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        quizHistory: [newAttempt, ...prev.quizHistory.slice(0, 29)],
      }));
    },
    []
  );

  const toggleCramMode = useCallback(() => {
    setState((prev) => ({ ...prev, cramModeEnabled: !prev.cramModeEnabled }));
  }, []);

  const toggleHighlightKeywords = useCallback(() => {
    setState((prev) => ({
      ...prev,
      highlightKeywordsEnabled: !prev.highlightKeywordsEnabled,
    }));
  }, []);

  const setLastVisitedChapter = useCallback((chapterId: string) => {
    setState((prev) => {
      if (prev.lastVisitedChapterId === chapterId) return prev;
      return { ...prev, lastVisitedChapterId: chapterId };
    });
  }, []);

  const toggleTheme = useCallback((event?: React.MouseEvent<HTMLElement>) => {
    const nextTheme: ThemeMode = state.theme === 'light' ? 'dark' : 'light';

    const applyThemeChange = () => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', nextTheme);
      }
      flushSync(() => {
        setState((prev) => ({
          ...prev,
          theme: nextTheme,
        }));
      });
    };

    if (typeof document === 'undefined' || typeof window === 'undefined') {
      setState((prev) => ({ ...prev, theme: nextTheme }));
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const docWithTransition = document as Document & {
      startViewTransition?: (callback: () => void) => {
        readonly ready: Promise<void>;
      };
    };

    if (!docWithTransition.startViewTransition || prefersReducedMotion) {
      applyThemeChange();
      return;
    }

    // Compute origin coordinates of the expanding circle from the clicked button
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (event) {
      if (event.clientX > 0 || event.clientY > 0) {
        x = event.clientX;
        y = event.clientY;
      } else if (event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = docWithTransition.startViewTransition(() => {
      applyThemeChange();
    });

    void transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 520,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      })
      .catch(() => {
        // Ignore if transition was interrupted
      });
  }, [state.theme]);

  const setTheme = useCallback((theme: ThemeMode) => {
    setState((prev) => ({ ...prev, theme }));
  }, []);

  const exportStateJson = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importStateJson = useCallback((rawJson: string) => {
    try {
      const parsed: unknown = JSON.parse(rawJson);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return { ok: false, error: 'Backup JSON must be a valid study state object.' };
      }
      const record = parsed as Record<string, unknown>;
      if (!('completedChapters' in record) && !('chapterNotes' in record)) {
        return {
          ok: false,
          error: 'Missing expected fields (completedChapters or chapterNotes) in JSON backup.',
        };
      }
      setState(sanitizeLoadedState(parsed));
      return { ok: true };
    } catch {
      return { ok: false, error: 'Invalid JSON syntax. Please check your pasted backup.' };
    }
  }, []);

  const resetProgress = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const contextValue = useMemo<StudyProgressContextValue>(
    () => ({
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
      setTheme,
      exportStateJson,
      importStateJson,
      resetProgress,
    }),
    [
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
      setTheme,
      exportStateJson,
      importStateJson,
      resetProgress,
    ]
  );

  return (
    <StudyProgressContext.Provider value={contextValue}>
      {children}
    </StudyProgressContext.Provider>
  );
}

export function useStudyProgress(): StudyProgressContextValue {
  const ctx = useContext(StudyProgressContext);
  if (!ctx) {
    throw new Error('useStudyProgress must be used inside a StudyProgressProvider');
  }
  return ctx;
}
