'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { Chapter, Subject, SubjectId, TurboLessonTab } from '@/types/course';
import { useSafeMotion } from '@/hooks/use-reduced-motion';
import { springs, motionTokens } from '@/lib/motion-tokens';
import { KeywordText } from '@/components/KeywordText';
import { FormulaBlock } from '@/components/FormulaBlock';
import { DualViewAlert } from '@/components/DualViewAlert';
import { FlashcardDeck } from '@/components/FlashcardDeck';
import { QuizEngine } from '@/components/QuizEngine';
import { CsoLab } from '@/labs/CsoLab';
import { MathsLab } from '@/labs/MathsLab';
import { DatabaseLab } from '@/labs/DatabaseLab';
import { BusinessLab } from '@/labs/BusinessLab';
import { EnglishLab } from '@/labs/EnglishLab';
import {
  IconSpark,
  IconAlert,
  IconLab,
  IconArrowRight,
  IconCheck,
  IconNote,
  IconChevronDown,
  IconChevronRight,
} from '@/components/Icons';

interface ChapterViewProps {
  readonly subject: Subject;
  readonly chapter: Chapter;
  readonly activeTab: TurboLessonTab;
  readonly onChangeTab: (tab: TurboLessonTab) => void;
  readonly highlightKeywordsEnabled: boolean;
  readonly cramModeEnabled: boolean;
  readonly isChapterCompleted: boolean;
  readonly masteredFlashcards: readonly string[];
  readonly reviewAgainFlashcards: readonly string[];
  readonly personalNote: string;
  readonly onMarkFlashcard: (cardId: string, status: 'mastered' | 'review') => void;
  readonly onUpdatePersonalNote: (note: string) => void;
  readonly onCompleteQuiz: (attempt: {
    readonly scopeId: string;
    readonly scopeLabel: string;
    readonly score: number;
    readonly total: number;
  }) => void;
  readonly onToggleCompleted: () => void;
  readonly onSelectChapter: (
    subjectId: SubjectId,
    chapterId: string,
    initialTab?: TurboLessonTab
  ) => void;
}

export function ChapterView({
  subject,
  chapter,
  activeTab,
  onChangeTab,
  highlightKeywordsEnabled,
  cramModeEnabled,
  isChapterCompleted,
  masteredFlashcards,
  reviewAgainFlashcards,
  personalNote,
  onMarkFlashcard,
  onUpdatePersonalNote,
  onCompleteQuiz,
  onToggleCompleted,
  onSelectChapter,
}: ChapterViewProps) {
  const [scratchpadOpen, setScratchpadOpen] = useState(false);
  const [keywordsExpanded, setKeywordsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const safeMotion = useSafeMotion(motionTokens.distance.sm);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentIdx = subject.chapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIdx > 0 ? subject.chapters[currentIdx - 1] : null;
  const nextChapter =
    currentIdx >= 0 && currentIdx < subject.chapters.length - 1
      ? subject.chapters[currentIdx + 1]
      : null;

  const combinedKeywords = [
    ...chapter.masterKeywords,
    ...chapter.keywordPatterns.map((kp) => kp.keyword),
  ];

  const scrollToAnchor = (elementId: string) => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderSubjectLab = () => {
    switch (subject.id) {
      case 'cso':
        return <CsoLab />;
      case 'maths':
        return <MathsLab />;
      case 'database':
        return <DatabaseLab />;
      case 'business':
        return <BusinessLab />;
      case 'english':
        return <EnglishLab />;
    }
  };

  return (
    <motion.div
      key={chapter.id}
      initial={mounted ? safeMotion.initial : { opacity: 1, y: 0 }}
      animate={safeMotion.animate}
      transition={springs.gentle}
      className={`reader-container ${cramModeEnabled ? 'cram-mode-active' : ''}`}
      data-testid="chapter-view"
    >
      {/* Clean Turbo Lesson Header */}
      <div style={{ marginBottom: '22px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className={`pastel-badge pastel-${subject.pastel}`}>
              {subject.code} • {chapter.numberLabel}
            </span>
            <span className="tabular-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
              {chapter.slideOrPageCount} • {chapter.estimatedMinutes} min read
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {chapter.dualViewAlerts.length > 0 && (
              <button
                type="button"
                className="pastel-badge pastel-amber"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  onChangeTab('notes');
                  setTimeout(() => scrollToAnchor('lesson-slide-alerts'), 50);
                }}
                data-testid="chapter-alert-pill"
              >
                <IconAlert size={12} /> {chapter.dualViewAlerts.length} Slide Alert
                {chapter.dualViewAlerts.length > 1 ? 's' : ''}
              </button>
            )}

            <button
              type="button"
              className={`btn-icon-pill ${scratchpadOpen ? 'active' : ''}`}
              onClick={() => setScratchpadOpen((prev) => !prev)}
              data-testid="tab-mynotes"
            >
              <IconNote size={13} />
              <span>My Notes {personalNote.trim() ? '• Saved' : ''}</span>
            </button>
          </div>
        </div>

        <h1 style={{ fontSize: '2.15rem', margin: '0 0 6px' }}>{chapter.title}</h1>
        <p style={{ margin: '0 0 14px', fontSize: '0.96rem', color: 'var(--ink-muted)' }}>
          {chapter.subtitle}
        </p>

        {/* Compact Collapsible Key Terms Strip (Never clutters the top of the lesson) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '6px',
          }}
          data-testid="chapter-keywords-strip"
        >
          <span
            className="tabular-mono"
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--ink-muted)',
              marginRight: '4px',
            }}
          >
            Key Terms:
          </span>
          {(keywordsExpanded
            ? chapter.masterKeywords
            : chapter.masterKeywords.slice(0, 6)
          ).map((kw) => (
            <span key={kw} className={`pastel-badge pastel-${subject.pastel}`}>
              {kw}
            </span>
          ))}
          {chapter.masterKeywords.length > 6 && (
            <button
              type="button"
              className="btn-icon-pill"
              style={{ height: '24px', padding: '0 9px', fontSize: '0.7rem' }}
              onClick={() => setKeywordsExpanded((prev) => !prev)}
            >
              {keywordsExpanded ? (
                <>
                  <span>Show less</span>
                  <IconChevronDown size={11} />
                </>
              ) : (
                <>
                  <span>+{chapter.masterKeywords.length - 6} more</span>
                  <IconChevronRight size={11} />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Personal Scratchpad Drawer */}
      {scratchpadOpen && (
        <div
          className="bento-card"
          style={{ marginBottom: '22px' }}
          data-testid="personal-notes-card"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                Personal Study Scratchpad — {chapter.numberLabel}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                Auto-saved in browser storage for {subject.code}.
              </p>
            </div>
            <span className="pastel-badge pastel-green">Auto-Saved</span>
          </div>

          {!personalNote.trim() && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--surface-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '10px',
                fontSize: '0.82rem',
                color: 'var(--ink-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                flexWrap: 'wrap',
              }}
              data-testid="empty-note-state"
            >
              <span>No personal notes recorded for this lesson yet.</span>
              <button
                type="button"
                className="btn-secondary"
                style={{ minHeight: '28px', padding: '2px 10px', fontSize: '0.75rem' }}
                onClick={() =>
                  onUpdatePersonalNote(
                    `Key Exam Focus for ${chapter.numberLabel} (${chapter.title}):\n- Review keywords: ${chapter.masterKeywords.slice(0, 4).join(', ')}\n`
                  )
                }
                data-testid="seed-note-btn"
              >
                Insert Starter Template
              </button>
            </div>
          )}

          <textarea
            rows={5}
            aria-label="Personal chapter study notes"
            className="editorial-textarea"
            placeholder="Write your own summary, tutorial tips, Bahasa Malaysia/English memory hooks, or questions to ask lecturer..."
            value={personalNote}
            onChange={(e) => onUpdatePersonalNote(e.target.value)}
            data-testid="personal-note-textarea"
          />
        </div>
      )}

      {/* Cram Mode Banner when active */}
      {cramModeEnabled && (
        <div
          className="bento-card"
          style={{
            marginBottom: '22px',
            backgroundColor: 'var(--pastel-amber-bg)',
            borderColor: 'var(--pastel-amber-border)',
          }}
          data-testid="cram-mode-spotlight"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span className="pastel-badge pastel-amber">
              <IconSpark size={13} /> Keyword Pattern / Cram Mode Active
            </span>
            <span className="tabular-mono" style={{ fontSize: '0.75rem', color: 'var(--pastel-amber-text)' }}>
              Rapid Trigger -&gt; Exam Answer Matrix
            </span>
          </div>
          <div className="editorial-table-wrap" style={{ margin: 0 }}>
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Exam Keyword</th>
                  <th>When You See This Trigger Phrase...</th>
                  <th>Immediate Exam Answer / Rule</th>
                  <th>Slide Ref</th>
                </tr>
              </thead>
              <tbody>
                {chapter.keywordPatterns.map((kp) => (
                  <tr key={kp.id}>
                    <td>
                      <span className={`pastel-badge pastel-${subject.pastel}`}>
                        {kp.keyword}
                      </span>
                    </td>
                    <td>
                      <strong>{kp.triggerPhrase}</strong>
                    </td>
                    <td>{kp.examAnswer}</td>
                    <td>
                      <code style={{ fontSize: '0.74rem' }}>{kp.sourceRef}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 1: NOTES (Continuous Turbo Document Sheet + Sticky Right TOC)
         ===================================================================== */}
      {activeTab === 'notes' && (
        <div className="notes-workspace-grid">
          {/* Left: Continuous Document Sheet */}
          <article className="notes-document-sheet">
            {/* Executive Overview Lead Box */}
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: 'var(--surface-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '30px',
                fontSize: '0.93rem',
              }}
            >
              <div
                className="tabular-mono"
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--ink-muted)',
                  marginBottom: '6px',
                }}
              >
                Lesson Summary • Source: {chapter.sourceFile}
              </div>
              <KeywordText
                text={chapter.overview}
                keywords={combinedKeywords}
                pastel={subject.pastel}
                enabled={highlightKeywordsEnabled}
              />
            </div>

            {/* Continuous Study Sections */}
            {chapter.sections.map((sec, idx) => (
              <section
                key={sec.id}
                id={`section-${sec.id}`}
                className="notes-section-block"
                data-testid="study-section"
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    marginBottom: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      className="tabular-mono"
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--surface-secondary)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--ink-muted)',
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h2 style={{ fontSize: '1.35rem', margin: 0 }}>{sec.heading}</h2>
                  </div>

                  <code
                    style={{
                      fontSize: '0.73rem',
                      color: 'var(--ink-muted)',
                      backgroundColor: 'var(--surface-secondary)',
                      padding: '2px 8px',
                      borderRadius: '5px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {sec.sourceRef}
                  </code>
                </div>

                <p style={{ margin: '0 0 12px', fontWeight: 500, color: 'var(--ink-primary)' }}>
                  <KeywordText
                    text={sec.summary}
                    keywords={combinedKeywords}
                    pastel={subject.pastel}
                    enabled={highlightKeywordsEnabled}
                  />
                </p>

                <ul
                  style={{
                    margin: '0 0 12px',
                    paddingLeft: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {sec.bulletPoints.map((bp, i) => (
                    <li key={i} style={{ fontSize: '0.92rem' }}>
                      <KeywordText
                        text={bp}
                        keywords={combinedKeywords}
                        pastel={subject.pastel}
                        enabled={highlightKeywordsEnabled}
                      />
                    </li>
                  ))}
                </ul>

                {sec.formulas && sec.formulas.length > 0 && (
                  <div style={{ marginTop: '14px' }}>
                    {sec.formulas.map((f, fIdx) => (
                      <FormulaBlock key={fIdx} label={f.label} latex={f.latex} note={f.note} />
                    ))}
                  </div>
                )}

                {sec.tables &&
                  sec.tables.map((tbl, tIdx) => (
                    <div key={tIdx} style={{ marginTop: '16px' }}>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--ink-primary)',
                          marginBottom: '6px',
                        }}
                      >
                        {tbl.title} {tbl.sourceRef ? `(${tbl.sourceRef})` : ''}
                      </div>
                      <div className="editorial-table-wrap">
                        <table className="editorial-table">
                          <thead>
                            <tr>
                              {tbl.headers.map((h, hIdx) => (
                                <th key={hIdx}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tbl.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx}>
                                    <KeywordText
                                      text={cell}
                                      keywords={combinedKeywords}
                                      pastel={subject.pastel}
                                      enabled={highlightKeywordsEnabled}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
              </section>
            ))}

            {/* Integrated Worked Examples inside the continuous document */}
            {chapter.workedExamples.length > 0 && (
              <section
                id="lesson-worked-examples"
                className="notes-section-block"
                data-testid="examples-alerts-view"
              >
                <div style={{ marginBottom: '14px' }}>
                  <span className={`pastel-badge pastel-${subject.pastel}`} style={{ marginBottom: '6px' }}>
                    Step-by-Step Solutions
                  </span>
                  <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
                    Worked Examples ({chapter.workedExamples.length})
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {chapter.workedExamples.map((ex) => (
                    <div
                      key={ex.id}
                      style={{
                        padding: '18px 20px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--surface-secondary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                      data-testid="worked-example-card"
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          marginBottom: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <strong style={{ fontSize: '1rem', color: 'var(--ink-primary)' }}>
                          {ex.title}
                        </strong>
                        <code style={{ fontSize: '0.74rem', color: 'var(--ink-muted)' }}>
                          {ex.sourceRef}
                        </code>
                      </div>

                      <div
                        style={{
                          padding: '10px 14px',
                          backgroundColor: 'var(--surface-primary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.88rem',
                          marginBottom: '12px',
                        }}
                      >
                        <strong>Problem: </strong>
                        {ex.problem}
                      </div>

                      {ex.latexFormula && (
                        <FormulaBlock label="Core Formula" latex={ex.latexFormula} />
                      )}

                      <ol
                        style={{
                          margin: '10px 0',
                          paddingLeft: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        {ex.steps.map((step, sIdx) => (
                          <li key={sIdx} style={{ fontSize: '0.88rem' }}>
                            {step}
                          </li>
                        ))}
                      </ol>

                      <div
                        style={{
                          padding: '10px 14px',
                          backgroundColor: 'var(--pastel-green-bg)',
                          border: '1px solid var(--pastel-green-border)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--pastel-green-text)',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                        }}
                      >
                        <IconCheck size={14} /> Final Answer: {ex.finalAnswer}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Integrated Dual-View Lecturer Slide Alerts */}
            {chapter.dualViewAlerts.length > 0 && (
              <section id="lesson-slide-alerts" className="notes-section-block">
                <div style={{ marginBottom: '12px' }}>
                  <span className="pastel-badge pastel-amber" style={{ marginBottom: '6px' }}>
                    <IconAlert size={12} /> Dual-View Fidelity
                  </span>
                  <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
                    Lecturer Slide Alerts &amp; Solved Deck Exercises
                  </h2>
                </div>
                {chapter.dualViewAlerts.map((alert) => (
                  <DualViewAlert key={alert.id} alert={alert} />
                ))}
              </section>
            )}
          </article>

          {/* Right: Sticky Mini Table of Contents ("On this page") */}
          <aside className="notes-toc-sticky" aria-label="On this page">
            <div
              className="tabular-mono"
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--ink-muted)',
                marginBottom: '10px',
                paddingLeft: '8px',
              }}
            >
              On This Page
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' }}>
              {chapter.sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  className="toc-link-btn"
                  onClick={() => scrollToAnchor(`section-${sec.id}`)}
                >
                  <strong className="tabular-mono" style={{ fontSize: '0.7rem', marginRight: '5px' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </strong>
                  {sec.heading}
                </button>
              ))}

              {chapter.workedExamples.length > 0 && (
                <button
                  type="button"
                  className="toc-link-btn"
                  onClick={() => scrollToAnchor('lesson-worked-examples')}
                >
                  <strong>Worked Examples ({chapter.workedExamples.length})</strong>
                </button>
              )}

              {chapter.dualViewAlerts.length > 0 && (
                <button
                  type="button"
                  className="toc-link-btn"
                  style={{ color: 'var(--pastel-amber-text)' }}
                  onClick={() => scrollToAnchor('lesson-slide-alerts')}
                >
                  <strong>Slide Alerts ({chapter.dualViewAlerts.length})</strong>
                </button>
              )}
            </div>

            {/* Guided Next-Step Action inside Sticky Rail */}
            <div
              style={{
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.76rem' }}
                onClick={() => onChangeTab('flashcards')}
              >
                <span>Practice Flashcards ({chapter.flashcards.length})</span>
                <IconArrowRight size={12} />
              </button>

              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.76rem' }}
                onClick={() => onChangeTab('quiz')}
              >
                <span>Take Lesson Quiz ({chapter.quiz.length})</span>
                <IconArrowRight size={12} />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* =====================================================================
          TAB 2: FLASHCARDS (Centered Turbo 3D Active-Recall Deck)
         ===================================================================== */}
      {activeTab === 'flashcards' && (
        <div style={{ maxWidth: '780px', margin: '0 auto' }} data-testid="lesson-flashcards-view">
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px' }}>
                Active-Recall Flashcards
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
                Click any card or press Spacebar to flip. Mark cards as Mastered or Review Again.
              </p>
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => onChangeTab('quiz')}
            >
              <span>Ready? Take Quiz ({chapter.quiz.length})</span>
              <IconArrowRight size={13} />
            </button>
          </div>

          <FlashcardDeck
            cards={chapter.flashcards}
            pastel={subject.pastel}
            masteredIds={masteredFlashcards}
            reviewAgainIds={reviewAgainFlashcards}
            onMarkCard={onMarkFlashcard}
          />
        </div>
      )}

      {/* =====================================================================
          TAB 3: QUIZ (Dedicated Chapter Verification Quiz)
         ===================================================================== */}
      {activeTab === 'quiz' && (
        <div style={{ maxWidth: '820px', margin: '0 auto' }} data-testid="lesson-quiz-view">
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px' }}>
                Lesson Verification Quiz
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
                Test your exam readiness on {chapter.numberLabel}: {chapter.title}.
              </p>
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => onChangeTab('toolkit')}
            >
              <IconLab size={14} />
              <span>Open Cheat Sheet &amp; Lab</span>
            </button>
          </div>

          <QuizEngine
            scopeId={chapter.id}
            scopeLabel={`${subject.code} — ${chapter.numberLabel}: ${chapter.title}`}
            questions={chapter.quiz}
            pastel={subject.pastel}
            onCompleteQuiz={onCompleteQuiz}
          />
        </div>
      )}

      {/* =====================================================================
          TAB 4: CHEAT SHEET & LAB (Keyword Pattern Matrix + Subject Simulator)
         ===================================================================== */}
      {activeTab === 'toolkit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 1. Keyword Trigger Pattern Matrix */}
          <div className="bento-card" data-testid="keyword-matrix-view">
            <h2 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>
              Keyword Pattern-Recognition Cheat Sheet
            </h2>
            <p style={{ color: 'var(--ink-muted)', fontSize: '0.86rem', marginTop: 0 }}>
              Memorize the left trigger keyword and middle exam clue to immediately identify the right UNITAR answer.
            </p>

            <div className="editorial-table-wrap">
              <table className="editorial-table">
                <thead>
                  <tr>
                    <th>Keyword / Concept</th>
                    <th>Pattern Trigger in Question</th>
                    <th>Direct Exam Answer / Rule</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {chapter.keywordPatterns.map((kp) => (
                    <tr key={kp.id}>
                      <td>
                        <span className={`pastel-badge pastel-${subject.pastel}`}>
                          {kp.keyword}
                        </span>
                      </td>
                      <td>
                        <strong>{kp.triggerPhrase}</strong>
                      </td>
                      <td>
                        <div>{kp.examAnswer}</div>
                        {kp.formulaOrRule && (
                          <div style={{ marginTop: '4px' }}>
                            <FormulaBlock latex={kp.formulaOrRule} inline />
                          </div>
                        )}
                      </td>
                      <td>
                        <code style={{ fontSize: '0.75rem' }}>{kp.sourceRef}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Interactive Subject Lab */}
          <div data-testid="chapter-lab-container">
            <div style={{ marginBottom: '10px' }}>
              <span className={`pastel-badge pastel-${subject.pastel}`} style={{ marginBottom: '6px' }}>
                <IconLab size={12} /> Interactive Simulator
              </span>
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>{subject.labTitle}</h2>
            </div>
            {renderSubjectLab()}
          </div>
        </div>
      )}

      {/* Guided Bottom Momentum Bar ("Gets the user somewhere") */}
      <div
        style={{
          marginTop: '36px',
          padding: '20px 24px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        {prevChapter ? (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onSelectChapter(subject.id, prevChapter.id, 'notes')}
          >
            ← {prevChapter.numberLabel}: {prevChapter.title}
          </button>
        ) : (
          <div style={{ fontSize: '0.84rem', color: 'var(--ink-muted)' }}>
            First lesson in <strong>{subject.shortName}</strong>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {!isChapterCompleted && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onToggleCompleted}
            >
              <IconCheck size={14} />
              <span>Mark Lesson Completed</span>
            </button>
          )}

          {nextChapter && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if (!isChapterCompleted) {
                  onToggleCompleted();
                }
                onSelectChapter(subject.id, nextChapter.id, 'notes');
              }}
              data-testid="next-chapter-btn"
            >
              <span>
                {isChapterCompleted ? 'Next' : 'Complete & Continue'}: {nextChapter.numberLabel}
              </span>
              <IconArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
