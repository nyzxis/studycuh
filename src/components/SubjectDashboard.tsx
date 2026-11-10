'use client';

import { useState } from 'react';
import type { Chapter, Subject, SubjectId, TurboLessonTab, UserStudyState } from '@/types/course';
import { Counter } from '@/components/Counter';
import { ProgressRing } from '@/components/ProgressRing';
import { RevisionQueue } from '@/components/RevisionQueue';
import { QuizEngine } from '@/components/QuizEngine';
import { CsoLab } from '@/labs/CsoLab';
import { MathsLab } from '@/labs/MathsLab';
import { DatabaseLab } from '@/labs/DatabaseLab';
import { BusinessLab } from '@/labs/BusinessLab';
import { EnglishLab } from '@/labs/EnglishLab';
import {
  IconArrowRight,
  IconCheck,
  IconSpark,
  IconLab,
  IconAlert,
  IconBookmark,
  IconFolder,
  IconCards,
  IconBook,
} from '@/components/Icons';

interface SubjectDashboardProps {
  readonly subjects: readonly Subject[];
  readonly activeSubject: Subject | null;
  readonly allChapters: ReadonlyMap<string, { readonly chapter: Chapter; readonly subject: Subject }>;
  readonly studyState: UserStudyState;
  readonly onSelectSubject: (subjectId: SubjectId) => void;
  readonly onSelectChapter: (
    subjectId: SubjectId,
    chapterId: string,
    initialTab?: TurboLessonTab
  ) => void;
  readonly onReorderQueue: (nextQueue: readonly string[]) => void;
  readonly onRecordQuiz: (attempt: {
    readonly scopeId: string;
    readonly scopeLabel: string;
    readonly score: number;
    readonly total: number;
  }) => void;
  readonly onExportJson: () => string;
  readonly onImportJson: (raw: string) => { readonly ok: boolean; readonly error?: string };
}

const PASTEL_FILL_COLOR: Readonly<Record<Subject['pastel'], string>> = {
  amber: 'var(--pastel-amber-text)',
  blue: 'var(--pastel-blue-text)',
  green: 'var(--pastel-green-text)',
  red: 'var(--pastel-red-text)',
  lavender: 'var(--pastel-lavender-text)',
};

export function SubjectDashboard({
  subjects,
  activeSubject,
  allChapters,
  studyState,
  onSelectSubject,
  onSelectChapter,
  onReorderQueue,
  onRecordQuiz,
  onExportJson,
  onImportJson,
}: SubjectDashboardProps) {
  const [subjectTab, setSubjectTab] = useState<'chapters' | 'lab' | 'mock' | 'keywords'>('chapters');
  const [homeUtilityTab, setHomeUtilityTab] = useState<'bookmarks' | 'queue' | 'history'>('bookmarks');
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [backupText, setBackupText] = useState('');
  const [backupFeedback, setBackupFeedback] = useState<{
    readonly type: 'success' | 'error';
    readonly message: string;
  } | null>(null);

  const totalChapters = subjects.reduce((acc, s) => acc + s.chapters.length, 0);

  // Determine the "Continue Where You Left Off" target lesson
  const resolveResumeEntry = () => {
    if (studyState.lastVisitedChapterId) {
      const found = allChapters.get(studyState.lastVisitedChapterId);
      if (found) return found;
    }
    for (const s of subjects) {
      for (const c of s.chapters) {
        if (!studyState.completedChapters.includes(c.id)) {
          return { subject: s, chapter: c };
        }
      }
    }
    const fallbackSubject = subjects[0];
    return { subject: fallbackSubject, chapter: fallbackSubject.chapters[0] };
  };

  const resumeEntry = resolveResumeEntry();

  // ============================================================================
  // VIEW 1: SUBJECT FOLDER WORKSPACE (When a course folder is clicked)
  // ============================================================================
  if (activeSubject) {
    const subjCompleted = activeSubject.chapters.filter((c) =>
      studyState.completedChapters.includes(c.id)
    ).length;
    const subjPct =
      activeSubject.chapters.length > 0
        ? (subjCompleted / activeSubject.chapters.length) * 100
        : 0;
    const allSubjectQuestions = activeSubject.chapters.flatMap((c) => c.quiz);
    const totalKeywordPatterns = activeSubject.chapters.reduce(
      (sum, c) => sum + c.keywordPatterns.length,
      0
    );

    const nextUncompletedChapter =
      activeSubject.chapters.find((c) => !studyState.completedChapters.includes(c.id)) ??
      activeSubject.chapters[0];

    return (
      <div data-testid={`subject-hub-${activeSubject.id}`}>
        {/* Subject Folder Double-Bezel Hero */}
        <div className="double-bezel" style={{ marginBottom: '22px' }}>
          <div className="double-bezel-inner">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '18px',
              }}
            >
              <div style={{ maxWidth: '680px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span className={`pastel-badge pastel-${activeSubject.pastel}`}>
                    <IconFolder size={12} /> {activeSubject.code}
                  </span>
                  <span className="tabular-mono" style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
                    {activeSubject.chapters.length} Lessons • {activeSubject.totalVolume}
                  </span>
                </div>
                <h1 style={{ fontSize: '2rem', margin: '0 0 6px' }}>{activeSubject.name}</h1>
                <p style={{ margin: 0, color: 'var(--ink-muted)', fontSize: '0.92rem' }}>
                  {activeSubject.tagline}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ProgressRing progress={subjPct} size={56} strokeWidth={5} />
                  <div>
                    <div
                      className="tabular-mono"
                      style={{ fontSize: '0.7rem', color: 'var(--ink-muted)', textTransform: 'uppercase' }}
                    >
                      Course Progress
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink-primary)' }}>
                      {subjCompleted} / {activeSubject.chapters.length} Done
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => onSelectChapter(activeSubject.id, nextUncompletedChapter.id, 'notes')}
                >
                  <span>Start {nextUncompletedChapter.numberLabel}</span>
                  <IconArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Clean Folder Sub-Navigation */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <button
                type="button"
                className={`btn-secondary ${subjectTab === 'chapters' ? 'active' : ''}`}
                onClick={() => setSubjectTab('chapters')}
              >
                <IconBook size={14} /> Curriculum Lessons ({activeSubject.chapters.length})
              </button>
              <button
                type="button"
                className={`btn-secondary ${subjectTab === 'lab' ? 'active' : ''}`}
                onClick={() => setSubjectTab('lab')}
                data-testid="subject-tab-lab"
              >
                <IconLab size={14} /> {activeSubject.labTitle}
              </button>
              <button
                type="button"
                className={`btn-secondary ${subjectTab === 'mock' ? 'active' : ''}`}
                onClick={() => setSubjectTab('mock')}
                data-testid="subject-tab-mock"
              >
                <IconCards size={14} /> Full Mock Exam ({allSubjectQuestions.length} Qs)
              </button>
              <button
                type="button"
                className={`btn-secondary ${subjectTab === 'keywords' ? 'active' : ''}`}
                onClick={() => setSubjectTab('keywords')}
                data-testid="subject-tab-keywords"
              >
                <IconSpark size={14} /> Keyword Bank ({totalKeywordPatterns})
              </button>
            </div>
          </div>
        </div>

        {/* Sub-View 1: Turbo AI Numbered Lesson List */}
        {subjectTab === 'chapters' && (
          <div className="lesson-list-container">
            {activeSubject.chapters.map((ch, idx) => {
              const isDone = studyState.completedChapters.includes(ch.id);
              const isSaved = studyState.bookmarkedChapters.includes(ch.id);
              const indexLabel = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={ch.id}
                  role="button"
                  tabIndex={0}
                  className="lesson-row"
                  onClick={() => onSelectChapter(activeSubject.id, ch.id, 'notes')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectChapter(activeSubject.id, ch.id, 'notes');
                    }
                  }}
                  data-testid={`subject-chapter-card-${ch.id}`}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', minWidth: 0, flex: 1 }}>
                    <div
                      className="tabular-mono"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        backgroundColor: isDone
                          ? 'var(--pastel-green-bg)'
                          : 'var(--surface-secondary)',
                        color: isDone ? 'var(--pastel-green-text)' : 'var(--ink-muted)',
                        border: `1px solid ${
                          isDone ? 'var(--pastel-green-border)' : 'var(--border-subtle)'
                        }`,
                      }}
                    >
                      {isDone ? <IconCheck size={15} /> : indexLabel}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                          marginBottom: '3px',
                        }}
                      >
                        <span
                          className="tabular-mono"
                          style={{
                            fontSize: '0.73rem',
                            fontWeight: 700,
                            color: 'var(--ink-muted)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {ch.numberLabel}
                        </span>
                        <h3 style={{ fontSize: '1.05rem', margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                          {ch.title}
                        </h3>
                        {isSaved && (
                          <span className="pastel-badge pastel-amber" style={{ padding: '1px 7px' }}>
                            Saved
                          </span>
                        )}
                        {ch.dualViewAlerts.length > 0 && (
                          <span className="pastel-badge pastel-amber" style={{ padding: '1px 7px' }}>
                            {ch.dualViewAlerts.length} Slide Alert{ch.dualViewAlerts.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.83rem',
                          color: 'var(--ink-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {ch.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right Side Quick Mode Launchers */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexShrink: 0,
                      flexWrap: 'wrap',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      className="tabular-mono"
                      style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginRight: '4px' }}
                    >
                      {ch.estimatedMinutes}m • {ch.flashcards.length} cards
                    </span>

                    <button
                      type="button"
                      className="btn-icon-pill"
                      onClick={() => onSelectChapter(activeSubject.id, ch.id, 'flashcards')}
                      title="Jump straight to Flashcards"
                    >
                      <IconCards size={12} />
                      <span>Cards</span>
                    </button>

                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ minHeight: '34px', padding: '4px 12px' }}
                      onClick={() => onSelectChapter(activeSubject.id, ch.id, 'notes')}
                    >
                      <span>Open Lesson</span>
                      <IconArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {subjectTab === 'lab' && (
          <div>
            {activeSubject.id === 'cso' && <CsoLab />}
            {activeSubject.id === 'maths' && <MathsLab />}
            {activeSubject.id === 'database' && <DatabaseLab />}
            {activeSubject.id === 'business' && <BusinessLab />}
            {activeSubject.id === 'english' && <EnglishLab />}
          </div>
        )}

        {subjectTab === 'mock' && (
          <QuizEngine
            scopeId={`mock-${activeSubject.id}`}
            scopeLabel={`${activeSubject.code} — ${activeSubject.name} Full Mock Exam`}
            questions={allSubjectQuestions}
            pastel={activeSubject.pastel}
            isMockExam
            onCompleteQuiz={onRecordQuiz}
          />
        )}

        {subjectTab === 'keywords' && (
          <div className="bento-card" data-testid="subject-keyword-bank">
            <h2 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>
              {activeSubject.code} Complete Keyword Trigger Dictionary
            </h2>
            <p style={{ marginTop: 0, fontSize: '0.86rem', color: 'var(--ink-muted)' }}>
              All high-yield pattern triggers across {activeSubject.chapters.length} chapters of{' '}
              {activeSubject.name}.
            </p>
            <div className="editorial-table-wrap">
              <table className="editorial-table">
                <thead>
                  <tr>
                    <th>Lesson</th>
                    <th>Highlighted Keyword</th>
                    <th>Trigger Phrase</th>
                    <th>Exam Answer / Formula</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSubject.chapters.flatMap((ch) =>
                    ch.keywordPatterns.map((kp) => (
                      <tr key={kp.id}>
                        <td className="tabular-mono" style={{ whiteSpace: 'nowrap' }}>
                          <strong>{ch.numberLabel}</strong>
                        </td>
                        <td>
                          <span className={`pastel-badge pastel-${activeSubject.pastel}`}>
                            {kp.keyword}
                          </span>
                        </td>
                        <td>
                          <strong>{kp.triggerPhrase}</strong>
                        </td>
                        <td>{kp.examAnswer}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: GUIDED TURBO HOME SCREEN ("Gets the user somewhere" immediately)
  // ============================================================================
  return (
    <div data-testid="main-dashboard">
      {/* 1. "Continue Where You Left Off" Double-Bezel Hero Card */}
      <div className="double-bezel" style={{ marginBottom: '28px' }}>
        <div className="double-bezel-inner">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <div style={{ maxWidth: '660px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  className="tabular-mono"
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-muted)',
                  }}
                >
                  CONTINUE STUDYING
                </span>
                <span className={`pastel-badge pastel-${resumeEntry.subject.pastel}`}>
                  {resumeEntry.subject.code} • {resumeEntry.chapter.numberLabel}
                </span>
                <span className="tabular-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
                  Est. {resumeEntry.chapter.estimatedMinutes} min
                </span>
              </div>

              <h1 style={{ fontSize: '1.95rem', margin: '0 0 8px' }}>
                {resumeEntry.chapter.title}
              </h1>
              <p style={{ margin: '0 0 18px', color: 'var(--ink-muted)', fontSize: '0.92rem' }}>
                {resumeEntry.chapter.subtitle}
              </p>

              {/* Guided Action Bar: Notes, Flashcards, or Quiz in 1 Click */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() =>
                    onSelectChapter(resumeEntry.subject.id, resumeEntry.chapter.id, 'notes')
                  }
                  data-testid="resume-lesson-btn"
                >
                  <span>Continue Lesson</span>
                  <IconArrowRight size={14} />
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    onSelectChapter(resumeEntry.subject.id, resumeEntry.chapter.id, 'flashcards')
                  }
                >
                  <IconCards size={14} />
                  <span>Flashcards ({resumeEntry.chapter.flashcards.length})</span>
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    onSelectChapter(resumeEntry.subject.id, resumeEntry.chapter.id, 'quiz')
                  }
                >
                  <IconCheck size={14} />
                  <span>Practice Quiz ({resumeEntry.chapter.quiz.length})</span>
                </button>
              </div>
            </div>

            {/* Right: Compact Overall Progress & Backup Trigger */}
            <div
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-secondary)',
                border: '1px solid var(--border-subtle)',
                minWidth: '240px',
              }}
            >
              <div
                className="tabular-mono"
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--ink-muted)',
                  marginBottom: '4px',
                }}
              >
                Semester Mastery
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--ink-primary)', marginBottom: '10px' }}>
                <Counter to={studyState.completedChapters.length} /> / {totalChapters}{' '}
                <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--ink-muted)' }}>
                  lessons
                </span>
              </div>

              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%', minHeight: '32px', fontSize: '0.76rem' }}
                onClick={() => {
                  setBackupText(onExportJson());
                  setBackupFeedback(null);
                  setBackupModalOpen(true);
                }}
                data-testid="open-backup-btn"
              >
                Backup / Restore Progress
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Clean 5-Subject Course Folders Grid */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '14px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Your Course Folders</h2>
          <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: 'var(--ink-muted)' }}>
            Select a subject folder to browse lessons, launch its interactive lab, or take a full mock exam.
          </p>
        </div>
      </div>

      <div className="bento-grid" style={{ marginBottom: '32px' }}>
        {subjects.map((subj, idx) => {
          const doneCount = subj.chapters.filter((c) =>
            studyState.completedChapters.includes(c.id)
          ).length;
          const pct = subj.chapters.length > 0 ? (doneCount / subj.chapters.length) * 100 : 0;
          const nextChapter =
            subj.chapters.find((c) => !studyState.completedChapters.includes(c.id)) ??
            subj.chapters[0];
          const spanClass = idx < 2 ? 'bento-span-6' : 'bento-span-4';

          return (
            <div
              key={subj.id}
              role="button"
              tabIndex={0}
              className={`folder-card ${spanClass}`}
              onClick={() => onSelectSubject(subj.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectSubject(subj.id);
                }
              }}
              data-testid={`dashboard-subject-card-${subj.id}`}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <span className={`pastel-badge pastel-${subj.pastel}`}>
                    <IconFolder size={12} /> {subj.code}
                  </span>
                  <span className="tabular-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
                    {doneCount}/{subj.chapters.length} done
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', margin: '0 0 6px' }}>{subj.name}</h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--ink-muted)', margin: '0 0 16px' }}>
                  {subj.tagline}
                </p>
              </div>

              <div>
                {/* Clean Progress Bar */}
                <div className="progress-bar-track" style={{ marginBottom: '14px' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: PASTEL_FILL_COLOR[subj.pastel],
                    }}
                  />
                </div>

                {/* Next Lesson Direct Shortcut + Open Folder Link */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChapter(subj.id, nextChapter.id, 'notes');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--ink-muted)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={`Jump straight to ${nextChapter.numberLabel}: ${nextChapter.title}`}
                  >
                    Next: <strong style={{ color: 'var(--ink-primary)' }}>{nextChapter.numberLabel}</strong>
                  </button>

                  <span
                    style={{
                      fontWeight: 600,
                      color: 'var(--ink-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                    }}
                  >
                    Open Folder <IconArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Compact Secondary Study Tools Drawer (Bookmarks | Priority Queue | Quiz History) */}
      <div className="bento-card">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn-secondary ${homeUtilityTab === 'bookmarks' ? 'active' : ''}`}
              onClick={() => setHomeUtilityTab('bookmarks')}
              data-testid="home-tab-bookmarks"
            >
              <IconBookmark size={13} />
              <span>Saved Lessons ({studyState.bookmarkedChapters.length})</span>
            </button>
            <button
              type="button"
              className={`btn-secondary ${homeUtilityTab === 'queue' ? 'active' : ''}`}
              onClick={() => setHomeUtilityTab('queue')}
              data-testid="home-tab-queue"
            >
              <IconSpark size={13} />
              <span>Revision Queue ({studyState.revisionQueue.length})</span>
            </button>
            <button
              type="button"
              className={`btn-secondary ${homeUtilityTab === 'history' ? 'active' : ''}`}
              onClick={() => setHomeUtilityTab('history')}
              data-testid="home-tab-history"
            >
              <IconCheck size={13} />
              <span>Quiz Scores ({studyState.quizHistory.length})</span>
            </button>
          </div>
        </div>

        {homeUtilityTab === 'bookmarks' && (
          <div>
            {studyState.bookmarkedChapters.length === 0 ? (
              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--surface-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.84rem',
                  color: 'var(--ink-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
                data-testid="bookmarks-empty-state"
              >
                <span>
                  No lessons saved yet. Click &ldquo;Save&rdquo; in the top bar of any lesson to pin it here for exam week.
                </span>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ minHeight: '32px', padding: '4px 12px', fontSize: '0.78rem' }}
                  onClick={() => onSelectChapter('maths', 'math-t6', 'notes')}
                >
                  Open Topic 6: Matrices
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {studyState.bookmarkedChapters.map((chId) => {
                  const entry = allChapters.get(chId);
                  if (!entry) return null;
                  return (
                    <button
                      key={chId}
                      type="button"
                      className="btn-secondary"
                      style={{ justifyContent: 'space-between', width: '100%' }}
                      onClick={() => onSelectChapter(entry.subject.id, entry.chapter.id, 'notes')}
                    >
                      <span>
                        {entry.subject.code} — {entry.chapter.numberLabel}: {entry.chapter.title}
                      </span>
                      <IconArrowRight size={13} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {homeUtilityTab === 'queue' && (
          <RevisionQueue
            queueIds={studyState.revisionQueue}
            allChapters={allChapters}
            onReorder={onReorderQueue}
            onSelectChapter={(sId, cId) => onSelectChapter(sId, cId, 'notes')}
          />
        )}

        {homeUtilityTab === 'history' && (
          <div>
            {studyState.quizHistory.length === 0 ? (
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--ink-muted)' }}>
                Complete any chapter quiz or subject mock exam to track your score history here.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {studyState.quizHistory.slice(0, 6).map((att) => (
                  <div
                    key={att.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: 'var(--surface-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {att.scopeLabel}
                    </span>
                    <strong className="tabular-mono">
                      {att.score}/{att.total}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* JSON Backup Export / Import Modal */}
      {backupModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 10, 15, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setBackupModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Export or Import Study Progress JSON"
            className="bento-card"
            style={{ width: '100%', maxWidth: '580px' }}
            onClick={(e) => e.stopPropagation()}
            data-testid="backup-modal"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ margin: 0 }}>Export / Import Study Progress JSON</h3>
              <button
                type="button"
                className="btn-secondary"
                style={{ minHeight: '30px', padding: '2px 10px' }}
                onClick={() => setBackupModalOpen(false)}
              >
                Close
              </button>
            </div>

            <p style={{ margin: '0 0 10px', fontSize: '0.84rem', color: 'var(--ink-muted)' }}>
              Copy this JSON to back up your completed lessons, flashcard mastery, and personal
              notes, or paste a backup below to restore.
            </p>

            <textarea
              rows={8}
              aria-label="Study progress backup JSON"
              className="editorial-textarea tabular-mono"
              value={backupText}
              onChange={(e) => setBackupText(e.target.value)}
              data-testid="backup-json-textarea"
            />

            {backupFeedback && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor:
                    backupFeedback.type === 'success'
                      ? 'var(--pastel-green-bg)'
                      : 'var(--pastel-red-bg)',
                  border: `1px solid ${
                    backupFeedback.type === 'success'
                      ? 'var(--pastel-green-border)'
                      : 'var(--pastel-red-border)'
                  }`,
                  color:
                    backupFeedback.type === 'success'
                      ? 'var(--pastel-green-text)'
                      : 'var(--pastel-red-text)',
                  fontSize: '0.83rem',
                }}
                data-testid="backup-feedback"
              >
                {backupFeedback.type === 'error' ? <IconAlert size={14} /> : <IconCheck size={14} />}{' '}
                {backupFeedback.message}
              </div>
            )}

            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setBackupText(onExportJson());
                  setBackupFeedback({
                    type: 'success',
                    message: 'Reset textarea to current live study state.',
                  });
                }}
              >
                Reset to Current State
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  const res = onImportJson(backupText);
                  if (res.ok) {
                    setBackupFeedback({
                      type: 'success',
                      message: 'Study progress imported and restored successfully.',
                    });
                  } else {
                    setBackupFeedback({
                      type: 'error',
                      message: res.error ?? 'Failed to import JSON.',
                    });
                  }
                }}
                data-testid="backup-import-btn"
              >
                Import &amp; Restore JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
