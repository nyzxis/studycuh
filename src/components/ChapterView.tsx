'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { Chapter, Subject, SubjectId } from '@/types/course';
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
  IconBook,
  IconSpark,
  IconAlert,
  IconLab,
  IconCards,
  IconArrowRight,
  IconCheck,
} from '@/components/Icons';

type ChapterSubTab = 'notes' | 'keywords' | 'examples' | 'lab' | 'practice' | 'mynotes';

interface ChapterViewProps {
  readonly subject: Subject;
  readonly chapter: Chapter;
  readonly highlightKeywordsEnabled: boolean;
  readonly cramModeEnabled: boolean;
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
  readonly onSelectChapter: (subjectId: SubjectId, chapterId: string) => void;
}

export function ChapterView({
  subject,
  chapter,
  highlightKeywordsEnabled,
  cramModeEnabled,
  masteredFlashcards,
  reviewAgainFlashcards,
  personalNote,
  onMarkFlashcard,
  onUpdatePersonalNote,
  onCompleteQuiz,
  onSelectChapter,
}: ChapterViewProps) {
  const [subTab, setSubTab] = useState<ChapterSubTab>('notes');
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
      {/* Editorial Chapter Header Card */}
      <div className="bento-card" style={{ marginBottom: '20px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className={`pastel-badge pastel-${subject.pastel}`}>
              {subject.code} • {chapter.numberLabel}
            </span>
            <span className="tabular-mono" style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
              Source: {chapter.sourceFile} ({chapter.slideOrPageCount})
            </span>
            <span className="tabular-mono" style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
              • Est. {chapter.estimatedMinutes} min
            </span>
          </div>

          {chapter.dualViewAlerts.length > 0 && (
            <button
              type="button"
              className="pastel-badge pastel-amber"
              style={{ cursor: 'pointer' }}
              onClick={() => setSubTab('examples')}
              data-testid="chapter-alert-pill"
            >
              <IconAlert size={12} /> {chapter.dualViewAlerts.length} Slide Alert
              {chapter.dualViewAlerts.length > 1 ? 's' : ''}
            </button>
          )}
        </div>

        <h1 style={{ fontSize: '2rem', margin: '0 0 8px' }}>{chapter.title}</h1>
        <p style={{ margin: '0 0 14px', fontSize: '1rem', color: 'var(--ink-muted)' }}>
          {chapter.subtitle}
        </p>

        <p
          style={{
            margin: '0 0 16px',
            padding: '12px 16px',
            backgroundColor: 'var(--canvas-bg)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.9rem',
          }}
        >
          <KeywordText
            text={chapter.overview}
            keywords={combinedKeywords}
            pastel={subject.pastel}
            enabled={highlightKeywordsEnabled}
          />
        </p>

        {/* Highlighted Master Keywords Strip */}
        <div>
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
            Highlighted Chapter Keywords ({chapter.masterKeywords.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }} data-testid="chapter-keywords-strip">
            {chapter.masterKeywords.map((kw) => (
              <span key={kw} className={`pastel-badge pastel-${subject.pastel}`}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cram Mode Banner when active */}
      {cramModeEnabled && (
        <div
          className="bento-card"
          style={{
            marginBottom: '20px',
            backgroundColor: 'var(--pastel-amber-bg)',
            borderColor: 'var(--pastel-amber-border)',
          }}
          data-testid="cram-mode-spotlight"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="pastel-badge pastel-amber">
              <IconSpark size={13} /> Keyword Pattern / Cram Mode Active
            </span>
            <span className="tabular-mono" style={{ fontSize: '0.76rem', color: 'var(--pastel-amber-text)' }}>
              Rapid Trigger -&gt; Answer Matrix
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
                    <td><strong>{kp.triggerPhrase}</strong></td>
                    <td>{kp.examAnswer}</td>
                    <td><code style={{ fontSize: '0.74rem' }}>{kp.sourceRef}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
        }}
        role="tablist"
        aria-label="Chapter Study Modes"
      >
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'notes'}
          className={`btn-secondary ${subTab === 'notes' ? 'active' : ''}`}
          onClick={() => setSubTab('notes')}
          data-testid="tab-notes"
        >
          <IconBook size={14} /> Study Notes ({chapter.sections.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'keywords'}
          className={`btn-secondary ${subTab === 'keywords' ? 'active' : ''}`}
          onClick={() => setSubTab('keywords')}
          data-testid="tab-keywords"
        >
          <IconSpark size={14} /> Keyword Cheat Sheet ({chapter.keywordPatterns.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'examples'}
          className={`btn-secondary ${subTab === 'examples' ? 'active' : ''}`}
          onClick={() => setSubTab('examples')}
          data-testid="tab-examples"
        >
          <IconAlert size={14} /> Examples &amp; Slide Alerts (
          {chapter.workedExamples.length + chapter.dualViewAlerts.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'lab'}
          className={`btn-secondary ${subTab === 'lab' ? 'active' : ''}`}
          onClick={() => setSubTab('lab')}
          data-testid="tab-lab"
        >
          <IconLab size={14} /> Interactive Subject Lab
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'practice'}
          className={`btn-secondary ${subTab === 'practice' ? 'active' : ''}`}
          onClick={() => setSubTab('practice')}
          data-testid="tab-practice"
        >
          <IconCards size={14} /> Quiz ({chapter.quiz.length}) &amp; Flashcards ({chapter.flashcards.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'mynotes'}
          className={`btn-secondary ${subTab === 'mynotes' ? 'active' : ''}`}
          onClick={() => setSubTab('mynotes')}
          data-testid="tab-mynotes"
        >
          My Notes {personalNote.trim() ? '• Saved' : ''}
        </button>
      </div>

      {/* Tab 1: Exhaustive Study Notes */}
      {subTab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {chapter.sections.map((sec) => (
            <section key={sec.id} className="bento-card" data-testid="study-section">
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
                <h2 style={{ fontSize: '1.3rem', margin: 0 }}>{sec.heading}</h2>
                <code
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--ink-muted)',
                    backgroundColor: 'var(--canvas-bg)',
                    padding: '2px 8px',
                    borderRadius: '4px',
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

              <ul style={{ margin: '0 0 12px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {sec.bulletPoints.map((bp, i) => (
                  <li key={i} style={{ fontSize: '0.91rem' }}>
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
                <div style={{ marginTop: '12px' }}>
                  {sec.formulas.map((f, idx) => (
                    <FormulaBlock
                      key={idx}
                      label={f.label}
                      latex={f.latex}
                      note={f.note}
                    />
                  ))}
                </div>
              )}

              {sec.tables &&
                sec.tables.map((tbl, tIdx) => (
                  <div key={tIdx} style={{ marginTop: '14px' }}>
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

          {chapter.dualViewAlerts.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
                Dual-View Lecturer Slide Alerts &amp; Unanswered Deck Solutions
              </h3>
              {chapter.dualViewAlerts.map((alert) => (
                <DualViewAlert key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Keyword Pattern Matrix */}
      {subTab === 'keywords' && (
        <div className="bento-card" data-testid="keyword-matrix-view">
          <h2 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>
            Keyword Pattern-Recognition Cheat Sheet
          </h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.88rem', marginTop: 0 }}>
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
                    <td><strong>{kp.triggerPhrase}</strong></td>
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
      )}

      {/* Tab 3: Worked Examples & Dual-View Alerts */}
      {subTab === 'examples' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} data-testid="examples-alerts-view">
          {chapter.dualViewAlerts.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                Dual-View Fidelity: Official Slide Text vs. Verified Corrections
              </h3>
              {chapter.dualViewAlerts.map((alert) => (
                <DualViewAlert key={alert.id} alert={alert} />
              ))}
            </div>
          )}

          <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
            Step-by-Step Worked Examples ({chapter.workedExamples.length})
          </h3>
          {chapter.workedExamples.map((ex) => (
            <div key={ex.id} className="bento-card" data-testid="worked-example-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                <strong style={{ fontSize: '1.02rem', color: 'var(--ink-primary)' }}>
                  {ex.title}
                </strong>
                <code style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
                  {ex.sourceRef}
                </code>
              </div>

              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--canvas-bg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  marginBottom: '12px',
                }}
              >
                <strong>Problem: </strong>
                {ex.problem}
              </div>

              {ex.latexFormula && <FormulaBlock label="Core Formula" latex={ex.latexFormula} />}

              <ol style={{ margin: '10px 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
      )}

      {/* Tab 4: Interactive Subject Lab */}
      {subTab === 'lab' && <div data-testid="chapter-lab-container">{renderSubjectLab()}</div>}

      {/* Tab 5: Practice Quiz & Flashcards */}
      {subTab === 'practice' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
              1. Keyword-Trigger Active Recall Flashcards
            </h3>
            <FlashcardDeck
              cards={chapter.flashcards}
              pastel={subject.pastel}
              masteredIds={masteredFlashcards}
              reviewAgainIds={reviewAgainFlashcards}
              onMarkCard={onMarkFlashcard}
            />
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>
              2. Chapter Verification Quiz
            </h3>
            <QuizEngine
              scopeId={chapter.id}
              scopeLabel={`${subject.code} — ${chapter.numberLabel}: ${chapter.title}`}
              questions={chapter.quiz}
              pastel={subject.pastel}
              onCompleteQuiz={onCompleteQuiz}
            />
          </div>
        </div>
      )}

      {/* Tab 6: Personal Chapter Scratchpad (Empty + Saved Content States) */}
      {subTab === 'mynotes' && (
        <div className="bento-card" data-testid="personal-notes-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                Personal Study Scratchpad — {chapter.numberLabel}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
                Automatically saved in your browser storage for {subject.code}.
              </p>
            </div>
            <span className="pastel-badge pastel-green">Auto-Saved</span>
          </div>

          {!personalNote.trim() && (
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: 'var(--canvas-bg)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '12px',
                fontSize: '0.84rem',
                color: 'var(--ink-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
              }}
              data-testid="empty-note-state"
            >
              <span>No personal notes recorded for this chapter yet.</span>
              <button
                type="button"
                className="btn-secondary"
                style={{ minHeight: '30px', padding: '2px 10px', fontSize: '0.76rem' }}
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
            rows={7}
            aria-label="Personal chapter study notes"
            className="editorial-textarea"
            placeholder="Write your own summary, tutorial tips, Bahasa Malaysia/English memory hooks, or questions to ask lecturer..."
            value={personalNote}
            onChange={(e) => onUpdatePersonalNote(e.target.value)}
            data-testid="personal-note-textarea"
          />
        </div>
      )}

      {/* Footer Prev / Next Chapter Pagination */}
      <div
        style={{
          marginTop: '32px',
          paddingTop: '18px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {prevChapter ? (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onSelectChapter(subject.id, prevChapter.id)}
          >
            ← {prevChapter.numberLabel}: {prevChapter.title}
          </button>
        ) : (
          <div />
        )}

        {nextChapter && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => onSelectChapter(subject.id, nextChapter.id)}
            data-testid="next-chapter-btn"
          >
            <span>
              Next: {nextChapter.numberLabel}: {nextChapter.title}
            </span>
            <IconArrowRight size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
