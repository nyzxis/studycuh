'use client';

import { useState } from 'react';
import type { Chapter, Subject, SubjectId, UserStudyState } from '@/types/course';
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
} from '@/components/Icons';

interface SubjectDashboardProps {
  readonly subjects: readonly Subject[];
  readonly activeSubject: Subject | null;
  readonly allChapters: ReadonlyMap<string, { readonly chapter: Chapter; readonly subject: Subject }>;
  readonly studyState: UserStudyState;
  readonly onSelectSubject: (subjectId: SubjectId) => void;
  readonly onSelectChapter: (subjectId: SubjectId, chapterId: string) => void;
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
  const [subjectTab, setSubjectTab] = useState<'chapters' | 'keywords' | 'lab' | 'mock'>('chapters');
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [backupText, setBackupText] = useState('');
  const [backupFeedback, setBackupFeedback] = useState<{
    readonly type: 'success' | 'error';
    readonly message: string;
  } | null>(null);

  const totalChapters = subjects.reduce((acc, s) => acc + s.chapters.length, 0);
  const totalKeywords = subjects.reduce(
    (acc, s) =>
      acc + s.chapters.reduce((cAcc, ch) => cAcc + ch.masterKeywords.length, 0),
    0
  );
  const totalAlerts = subjects.reduce(
    (acc, s) =>
      acc + s.chapters.reduce((cAcc, ch) => cAcc + ch.dualViewAlerts.length, 0),
    0
  );

  // If a specific subject is selected (without a specific chapter), show the Subject Detail Hub
  if (activeSubject) {
    const subjCompleted = activeSubject.chapters.filter((c) =>
      studyState.completedChapters.includes(c.id)
    ).length;
    const subjPct =
      activeSubject.chapters.length > 0
        ? (subjCompleted / activeSubject.chapters.length) * 100
        : 0;
    const allSubjectQuestions = activeSubject.chapters.flatMap((c) => c.quiz);

    return (
      <div data-testid={`subject-hub-${activeSubject.id}`}>
        <div className="bento-card" style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div style={{ maxWidth: '720px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className={`pastel-badge pastel-${activeSubject.pastel}`}>
                  {activeSubject.code}
                </span>
                <span className="tabular-mono" style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
                  {activeSubject.totalFiles} • {activeSubject.totalVolume}
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', margin: '0 0 6px' }}>{activeSubject.name}</h1>
              <p style={{ margin: 0, color: 'var(--ink-muted)', fontSize: '0.94rem' }}>
                {activeSubject.tagline}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ProgressRing progress={subjPct} size={68} strokeWidth={6} />
              <div>
                <div className="tabular-mono" style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
                  CHAPTER MASTERY
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink-primary)' }}>
                  {subjCompleted} / {activeSubject.chapters.length} Done
                </div>
              </div>
            </div>
          </div>

          {/* Master Subject Keywords */}
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <div
              style={{
                fontSize: '0.73rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--ink-muted)',
                marginBottom: '8px',
              }}
            >
              Highlighted Subject Master Keywords ({activeSubject.masterKeywords.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {activeSubject.masterKeywords.map((kw) => (
                <span key={kw} className={`pastel-badge pastel-${activeSubject.pastel}`}>
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Hub Sub-Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
          <button
            type="button"
            className={`btn-secondary ${subjectTab === 'chapters' ? 'active' : ''}`}
            onClick={() => setSubjectTab('chapters')}
          >
            All Chapters ({activeSubject.chapters.length})
          </button>
          <button
            type="button"
            className={`btn-secondary ${subjectTab === 'keywords' ? 'active' : ''}`}
            onClick={() => setSubjectTab('keywords')}
            data-testid="subject-tab-keywords"
          >
            <IconSpark size={14} /> Full Subject Keyword Bank
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
            Subject Mock Exam ({allSubjectQuestions.length} Qs)
          </button>
        </div>

        {subjectTab === 'chapters' && (
          <div className="bento-grid">
            {activeSubject.chapters.map((ch) => {
              const isDone = studyState.completedChapters.includes(ch.id);
              return (
                <div
                  key={ch.id}
                  role="button"
                  tabIndex={0}
                  className="bento-card bento-card-interactive bento-span-6"
                  onClick={() => onSelectChapter(activeSubject.id, ch.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectChapter(activeSubject.id, ch.id);
                    }
                  }}
                  data-testid={`subject-chapter-card-${ch.id}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className={`pastel-badge pastel-${activeSubject.pastel}`}>
                      {ch.numberLabel}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {ch.dualViewAlerts.length > 0 && (
                        <span className="pastel-badge pastel-amber">
                          {ch.dualViewAlerts.length} Alert{ch.dualViewAlerts.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {isDone && (
                        <span className="pastel-badge pastel-green">
                          <IconCheck size={12} /> Done
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', margin: '0 0 6px' }}>{ch.title}</h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--ink-muted)', margin: '0 0 12px' }}>
                    {ch.subtitle}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                    {ch.masterKeywords.slice(0, 4).map((kw) => (
                      <span
                        key={kw}
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--canvas-bg)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      color: 'var(--ink-muted)',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '10px',
                    }}
                  >
                    <span className="tabular-mono">
                      {ch.slideOrPageCount} • {ch.quiz.length} Quiz Qs • {ch.flashcards.length} Cards
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--ink-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Study <IconArrowRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
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
                    <th>Chapter</th>
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
                        <td><strong>{kp.triggerPhrase}</strong></td>
                        <td>{kp.examAnswer}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
      </div>
    );
  }

  // Main Semester 3 Overview Dashboard
  return (
    <div data-testid="main-dashboard">
      {/* Top Hero Editorial Banner */}
      <div className="bento-card" style={{ marginBottom: '20px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="pastel-badge pastel-amber">UNITAR Semester 3</span>
              <span className="pastel-badge pastel-blue">100% Source-Mapped</span>
              <span className="pastel-badge pastel-green">Dual-View Verified</span>
            </div>
            <h1 style={{ fontSize: '2.15rem', margin: '0 0 8px' }}>
              Foundation in IT — Coursework &amp; Exam Portal
            </h1>
            <p style={{ margin: 0, color: 'var(--ink-body)', fontSize: '0.95rem' }}>
              Complete chapter notes, highlighted subject keyword triggers, interactive calculators,
              Dual-View slide typo alerts, flashcards, and mock exams across all 48 chapters (1,346
              slides and pages).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setBackupText(onExportJson());
                setBackupFeedback(null);
                setBackupModalOpen(true);
              }}
              data-testid="open-backup-btn"
            >
              Export / Import Progress
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onSelectChapter('cso', 'cso-ch5')}
            >
              Resume Study <IconArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* 4 Key Metric Counters */}
        <div
          className="bento-grid"
          style={{
            marginTop: '18px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div className="bento-span-4" style={{ padding: '10px 14px', backgroundColor: 'var(--canvas-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.73rem', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
              Completed Chapters (Partial / Full State)
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink-primary)' }}>
              <Counter to={studyState.completedChapters.length} /> / {totalChapters}
            </div>
          </div>

          <div className="bento-span-4" style={{ padding: '10px 14px', backgroundColor: 'var(--canvas-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.73rem', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
              Highlighted Exam Keywords Indexed
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink-primary)' }}>
              <Counter to={totalKeywords} suffix="+" />
            </div>
          </div>

          <div className="bento-span-4" style={{ padding: '10px 14px', backgroundColor: 'var(--canvas-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.73rem', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
              Dual-View Slide Typo &amp; Exercise Alerts
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink-primary)' }}>
              <Counter to={totalAlerts} /> Verified
            </div>
          </div>
        </div>
      </div>

      {/* 5 Subject Bento Cards */}
      <h2 style={{ fontSize: '1.45rem', marginBottom: '12px' }}>
        Semester 3 Subjects (Click Any Subject or Keyword to Dive In)
      </h2>
      <div className="bento-grid" style={{ marginBottom: '24px' }}>
        {subjects.map((subj, idx) => {
          const doneCount = subj.chapters.filter((c) =>
            studyState.completedChapters.includes(c.id)
          ).length;
          const spanClass = idx < 2 ? 'bento-span-6' : 'bento-span-4';

          return (
            <div
              key={subj.id}
              role="button"
              tabIndex={0}
              className={`bento-card bento-card-interactive ${spanClass}`}
              onClick={() => onSelectSubject(subj.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectSubject(subj.id);
                }
              }}
              data-testid={`dashboard-subject-card-${subj.id}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className={`pastel-badge pastel-${subj.pastel}`}>
                  {subj.code}
                </span>
                <span className="tabular-mono" style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
                  {doneCount}/{subj.chapters.length} Chapters • {subj.totalVolume}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', margin: '0 0 6px' }}>{subj.name}</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--ink-muted)', margin: '0 0 12px' }}>
                {subj.tagline}
              </p>

              {/* Subject Highlighted Keywords Preview */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                  Top Highlighted Keywords:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {subj.masterKeywords.slice(0, 6).map((kw) => (
                    <span
                      key={kw}
                      className={`kw-highlight theme-${subj.pastel}`}
                      style={{ fontSize: '0.74rem' }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '10px',
                  fontSize: '0.8rem',
                }}
              >
                <span style={{ color: 'var(--ink-muted)' }}>
                  <IconLab size={13} /> {subj.labTitle}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--ink-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Open Hub <IconArrowRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lower Split Bento: Priority Revision Queue (Reorder.Group) + Bookmarks & Recent Quizzes */}
      <div className="bento-grid">
        <div className="bento-card bento-span-7">
          <RevisionQueue
            queueIds={studyState.revisionQueue}
            allChapters={allChapters}
            onReorder={onReorderQueue}
            onSelectChapter={onSelectChapter}
          />
        </div>

        <div className="bento-card bento-span-5">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
              Bookmarked Chapters &amp; Recent Quiz Scores
            </h3>
            <IconBookmark size={15} />
          </div>

          {studyState.bookmarkedChapters.length === 0 ? (
            <div
              style={{
                padding: '14px',
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.83rem',
                color: 'var(--ink-muted)',
                marginBottom: '14px',
              }}
              data-testid="bookmarks-empty-state"
            >
              <p style={{ margin: '0 0 8px' }}>
                No chapters bookmarked yet. Bookmark any tricky topic to pin it here for exam week.
              </p>
              <button
                type="button"
                className="btn-secondary"
                style={{ minHeight: '32px', padding: '4px 10px', fontSize: '0.78rem' }}
                onClick={() => onSelectChapter('maths', 'math-t6')}
              >
                Explore Topic 6: Matrices
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              {studyState.bookmarkedChapters.map((chId) => {
                const entry = allChapters.get(chId);
                if (!entry) return null;
                return (
                  <button
                    key={chId}
                    type="button"
                    className="btn-secondary"
                    style={{ justifyContent: 'space-between', width: '100%' }}
                    onClick={() => onSelectChapter(entry.subject.id, entry.chapter.id)}
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

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
              Recent Quiz &amp; Mock Exam Attempts ({studyState.quizHistory.length})
            </div>
            {studyState.quizHistory.length === 0 ? (
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
                Complete any chapter quiz or subject mock exam to track your score history here.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {studyState.quizHistory.slice(0, 4).map((att) => (
                  <div
                    key={att.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      backgroundColor: 'var(--canvas-bg)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
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
        </div>
      </div>

      {/* JSON Backup Export / Import Modal (Demonstrates Error & Success States) */}
      {backupModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(17, 17, 17, 0.36)',
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
              Copy this JSON to back up your completed chapters, flashcard mastery, and personal
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
