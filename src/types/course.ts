export type SubjectId = 'business' | 'cso' | 'database' | 'english' | 'maths';

export type PastelTheme = 'amber' | 'blue' | 'green' | 'red' | 'lavender';

export type TurboLessonTab = 'notes' | 'flashcards' | 'quiz' | 'toolkit';

export type ThemeMode = 'light' | 'dark';

export interface KeywordPattern {
  readonly id: string;
  readonly keyword: string;
  readonly triggerPhrase: string;
  readonly examAnswer: string;
  readonly formulaOrRule?: string;
  readonly sourceRef: string;
}

export interface StudyTable {
  readonly title: string;
  readonly headers: readonly string[];
  readonly rows: readonly (readonly string[])[];
  readonly sourceRef?: string;
}

export interface WorkedExample {
  readonly id: string;
  readonly title: string;
  readonly problem: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
  readonly latexFormula?: string;
  readonly sourceRef: string;
}

export interface DualViewAlert {
  readonly id: string;
  readonly title: string;
  readonly slideRef: string;
  readonly severity: 'typo' | 'contradiction' | 'unanswered-exercise' | 'missing-deck';
  readonly unitarOriginal: string;
  readonly verifiedCorrection: string;
  readonly examTip: string;
}

export interface StudySection {
  readonly id: string;
  readonly heading: string;
  readonly sourceRef: string;
  readonly summary: string;
  readonly bulletPoints: readonly string[];
  readonly formulas?: readonly {
    readonly label: string;
    readonly latex: string;
    readonly note?: string;
  }[];
  readonly tables?: readonly StudyTable[];
}

export interface QuizQuestion {
  readonly id: string;
  readonly question: string;
  readonly options: readonly [string, string, string, string];
  readonly correctIndex: 0 | 1 | 2 | 3;
  readonly explanation: string;
  readonly keywordTested: string;
  readonly sourceRef: string;
}

export interface Flashcard {
  readonly id: string;
  readonly frontKeyword: string;
  readonly frontPrompt: string;
  readonly backAnswer: string;
  readonly backFormula?: string;
  readonly sourceRef: string;
}

export interface Chapter {
  readonly id: string;
  readonly subjectId: SubjectId;
  readonly numberLabel: string;
  readonly title: string;
  readonly subtitle: string;
  readonly sourceFile: string;
  readonly slideOrPageCount: string;
  readonly estimatedMinutes: number;
  readonly overview: string;
  readonly masterKeywords: readonly string[];
  readonly keywordPatterns: readonly KeywordPattern[];
  readonly sections: readonly StudySection[];
  readonly workedExamples: readonly WorkedExample[];
  readonly dualViewAlerts: readonly DualViewAlert[];
  readonly quiz: readonly QuizQuestion[];
  readonly flashcards: readonly Flashcard[];
}

export interface Subject {
  readonly id: SubjectId;
  readonly code: string;
  readonly name: string;
  readonly shortName: string;
  readonly tagline: string;
  readonly pastel: PastelTheme;
  readonly totalFiles: string;
  readonly totalVolume: string;
  readonly instructorOrSource: string;
  readonly masterKeywords: readonly string[];
  readonly labTitle: string;
  readonly labDescription: string;
  readonly chapters: readonly Chapter[];
}

export interface QuizAttempt {
  readonly id: string;
  readonly scopeId: string;
  readonly scopeLabel: string;
  readonly score: number;
  readonly total: number;
  readonly completedAt: string;
}

export interface UserStudyState {
  readonly completedChapters: readonly string[];
  readonly bookmarkedChapters: readonly string[];
  readonly masteredFlashcards: readonly string[];
  readonly reviewAgainFlashcards: readonly string[];
  readonly chapterNotes: Readonly<Record<string, string>>;
  readonly revisionQueue: readonly string[];
  readonly quizHistory: readonly QuizAttempt[];
  readonly cramModeEnabled: boolean;
  readonly highlightKeywordsEnabled: boolean;
  readonly lastVisitedChapterId: string | null;
  readonly theme: ThemeMode;
}
