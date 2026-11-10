'use client';

import { useState, useMemo } from 'react';
import type { QuizQuestion, PastelTheme } from '@/types/course';
import { Counter } from '@/components/Counter';
import { IconCheck, IconSpark } from '@/components/Icons';

interface QuizEngineProps {
  readonly scopeId: string;
  readonly scopeLabel: string;
  readonly questions: readonly QuizQuestion[];
  readonly pastel: PastelTheme;
  readonly isMockExam?: boolean;
  readonly onCompleteQuiz: (attempt: {
    readonly scopeId: string;
    readonly scopeLabel: string;
    readonly score: number;
    readonly total: number;
  }) => void;
}

export function QuizEngine({
  scopeId,
  scopeLabel,
  questions,
  pastel,
  isMockExam = false,
  onCompleteQuiz,
}: QuizEngineProps) {
  const [questionLimit, setQuestionLimit] = useState<number>(
    isMockExam ? Math.min(15, questions.length) : questions.length
  );
  const [seed, setSeed] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Readonly<Record<string, number>>>({});
  const [submitted, setSubmitted] = useState(false);

  const activeQuestions = useMemo(() => {
    if (!isMockExam) {
      return questions;
    }
    // Deterministic shuffle per seed for mock exams
    const copy = [...questions];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = (i * 17 + seed * 31) % (i + 1);
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy.slice(0, Math.min(questionLimit, copy.length));
  }, [questions, isMockExam, questionLimit, seed]);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const answeredCount = activeQuestions.filter(
    (q) => typeof selectedAnswers[q.id] === 'number'
  ).length;

  const score = activeQuestions.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    onCompleteQuiz({
      scopeId,
      scopeLabel,
      score,
      total: activeQuestions.length,
    });
  };

  const handleReset = (newShuffle = false) => {
    setSelectedAnswers({});
    setSubmitted(false);
    if (newShuffle) {
      setSeed((s) => s + 1);
    }
  };

  return (
    <div data-testid="quiz-engine">
      {/* Header Toolbar */}
      <div
        className="bento-card"
        style={{
          marginBottom: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className={`pastel-badge pastel-${pastel}`}>
              <IconSpark size={13} />
              {isMockExam ? 'Randomized Subject Mock Exam' : 'Chapter Practice Quiz'}
            </span>
            <span className="tabular-mono" style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
              {answeredCount} / {activeQuestions.length} Answered
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{scopeLabel}</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {isMockExam && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label
                htmlFor="mock-count-select"
                style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}
              >
                Questions:
              </label>
              <select
                id="mock-count-select"
                className="editorial-select"
                style={{ width: 'auto', minHeight: '34px', padding: '4px 10px' }}
                value={questionLimit}
                onChange={(e) => {
                  setQuestionLimit(Number(e.target.value));
                  handleReset(true);
                }}
              >
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
                <option value={questions.length}>All ({questions.length})</option>
              </select>
            </div>
          )}

          {isMockExam && (
            <button
              type="button"
              className="btn-secondary"
              style={{ minHeight: '34px', padding: '4px 12px', fontSize: '0.8rem' }}
              onClick={() => handleReset(true)}
            >
              New Random Set
            </button>
          )}
        </div>
      </div>

      {/* Submitted Score Banner (Success State) */}
      {submitted && (
        <div
          className="bento-card"
          style={{
            marginBottom: '16px',
            backgroundColor: 'var(--pastel-green-bg)',
            borderColor: 'var(--pastel-green-border)',
          }}
          data-testid="quiz-result-banner"
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <span className="pastel-badge pastel-green" style={{ marginBottom: '6px' }}>
                <IconCheck size={13} /> Quiz Completed
              </span>
              <h3 style={{ margin: 0, color: 'var(--ink-primary)' }}>
                Score: <Counter to={score} /> / {activeQuestions.length} (
                <Counter to={Math.round((score / Math.max(1, activeQuestions.length)) * 100)} suffix="%" />)
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--ink-body)' }}>
                Review the step-by-step UNITAR slide explanations and highlighted keywords below.
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => handleReset(isMockExam)}
              data-testid="quiz-retry-btn"
            >
              {isMockExam ? 'Start Fresh Mock Exam' : 'Retry Chapter Quiz'}
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {activeQuestions.map((q, qIdx) => {
          const picked = selectedAnswers[q.id];
          const isAnswered = typeof picked === 'number';

          return (
            <div key={q.id} className="bento-card" data-testid="quiz-question-card">
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className="tabular-mono"
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--canvas-bg)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    Q{qIdx + 1}
                  </span>
                  <span className={`pastel-badge pastel-${pastel}`}>
                    Keyword: {q.keywordTested}
                  </span>
                </div>
                <code style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
                  {q.sourceRef}
                </code>
              </div>

              <p
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  color: 'var(--ink-primary)',
                  margin: '0 0 12px',
                }}
              >
                {q.question}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((optionText, optIdx) => {
                  const isThisPicked = picked === optIdx;
                  const isCorrectOption = q.correctIndex === optIdx;

                  let bg = 'var(--surface-primary)';
                  let border = 'var(--border-subtle)';
                  let textColor = 'var(--ink-body)';

                  if (!submitted && isThisPicked) {
                    bg = 'var(--canvas-bg)';
                    border = 'var(--ink-primary)';
                    textColor = 'var(--ink-primary)';
                  } else if (submitted && isCorrectOption) {
                    bg = 'var(--pastel-green-bg)';
                    border = 'var(--pastel-green-border)';
                    textColor = 'var(--pastel-green-text)';
                  } else if (submitted && isThisPicked && !isCorrectOption) {
                    bg = 'var(--pastel-red-bg)';
                    border = 'var(--pastel-red-border)';
                    textColor = 'var(--pastel-red-text)';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        minHeight: '42px',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${border}`,
                        backgroundColor: bg,
                        color: textColor,
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.88rem',
                        fontWeight: isThisPicked || (submitted && isCorrectOption) ? 600 : 400,
                        cursor: submitted ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transitionProperty: 'background-color, border-color, color',
                        transitionDuration: '150ms',
                      }}
                      data-testid={`quiz-option-${qIdx}-${optIdx}`}
                    >
                      <span
                        className="tabular-mono"
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          width: '22px',
                          height: '22px',
                          borderRadius: '4px',
                          border: '1px solid currentColor',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{optionText}</span>
                    </button>
                  );
                })}
              </div>

              {(submitted || isAnswered) && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--canvas-bg)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.84rem',
                  }}
                >
                  <strong style={{ color: 'var(--ink-primary)' }}>
                    {picked === q.correctIndex ? 'Correct — ' : 'UNITAR Note Explanation — '}
                  </strong>
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Action Footer */}
      {!submitted && (
        <div
          style={{
            marginTop: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '0.84rem', color: 'var(--ink-muted)' }}>
            Select an option on any question for instant feedback, then click Grade Quiz to save your score.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit}
            data-testid="quiz-submit-btn"
          >
            Grade & Record Score ({answeredCount}/{activeQuestions.length})
          </button>
        </div>
      )}
    </div>
  );
}
