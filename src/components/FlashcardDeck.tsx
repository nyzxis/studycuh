'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import type { Flashcard, PastelTheme } from '@/types/course';
import { springs, motionTokens } from '@/lib/motion-tokens';
import { FormulaBlock } from '@/components/FormulaBlock';
import { IconCheck, IconCards } from '@/components/Icons';

interface FlashcardDeckProps {
  readonly cards: readonly Flashcard[];
  readonly pastel: PastelTheme;
  readonly masteredIds: readonly string[];
  readonly reviewAgainIds: readonly string[];
  readonly onMarkCard: (cardId: string, status: 'mastered' | 'review') => void;
}

const SWIPE_OFFSET_THRESHOLD = 75;
const SWIPE_VELOCITY_THRESHOLD = 320;

export function FlashcardDeck({
  cards,
  pastel,
  masteredIds,
  reviewAgainIds,
  onMarkCard,
}: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'review'>('all');

  const filteredCards =
    filterMode === 'review'
      ? cards.filter((c) => !masteredIds.includes(c.id))
      : cards;

  const safeIndex =
    filteredCards.length > 0 ? currentIndex % filteredCards.length : 0;
  const activeCard = filteredCards[safeIndex];

  // Motion values for physics-based swipe without triggering React re-renders
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-7, 0, 7]);
  const rightBadgeOpacity = useTransform(x, [20, 110], [0, 1]);
  const leftBadgeOpacity = useTransform(x, [-110, -20], [1, 0]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filterMode, cards]);

  const advanceCard = useCallback(
    (cardId: string, status: 'mastered' | 'review') => {
      onMarkCard(cardId, status);
      setIsFlipped(false);
      x.set(0);
      setCurrentIndex((prev) =>
        filteredCards.length > 0 ? (prev + 1) % filteredCards.length : 0
      );
    },
    [onMarkCard, filteredCards.length, x]
  );

  if (cards.length === 0) {
    return (
      <div className="bento-card" data-testid="flashcards-empty">
        <p style={{ margin: 0, color: 'var(--ink-muted)' }}>
          No flashcards available for this selection.
        </p>
      </div>
    );
  }

  return (
    <div data-testid="flashcard-deck">
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className={`pastel-badge pastel-${pastel}`}>
            <IconCards size={13} /> Active Recall Deck
          </span>
          <span className="tabular-mono" style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
            Mastered: {cards.filter((c) => masteredIds.includes(c.id)).length} / {cards.length}
          </span>
          {reviewAgainIds.length > 0 && (
            <span className="pastel-badge pastel-amber">
              Needs Review: {cards.filter((c) => reviewAgainIds.includes(c.id)).length}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`btn-secondary ${filterMode === 'all' ? 'active' : ''}`}
            style={{ minHeight: '34px', padding: '4px 12px', fontSize: '0.78rem' }}
            onClick={() => setFilterMode('all')}
          >
            All Cards ({cards.length})
          </button>
          <button
            type="button"
            className={`btn-secondary ${filterMode === 'review' ? 'active' : ''}`}
            style={{ minHeight: '34px', padding: '4px 12px', fontSize: '0.78rem' }}
            onClick={() => setFilterMode('review')}
          >
            Unmastered ({cards.filter((c) => !masteredIds.includes(c.id)).length})
          </button>
        </div>
      </div>

      {!activeCard ? (
        <div className="bento-card" style={{ textAlign: 'center', padding: '36px 24px' }}>
          <span className="pastel-badge pastel-green" style={{ marginBottom: '10px' }}>
            <IconCheck size={13} /> All Cards Mastered
          </span>
          <h3 style={{ marginBottom: '8px' }}>You have mastered every flashcard in this chapter!</h3>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
            Switch back to All Cards to review the full deck again.
          </p>
          <button type="button" className="btn-primary" onClick={() => setFilterMode('all')}>
            Reset Deck Filter
          </button>
        </div>
      ) : (
        <div>
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <motion.div
              key={activeCard.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.22}
              dragTransition={springs.release}
              style={{
                x,
                rotate,
                cursor: 'grab',
                position: 'relative',
                minHeight: '240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              whileTap={{ scale: motionTokens.scale.subtle }}
              onDragEnd={(_, info) => {
                // Rule 3: Combine offset + velocity checks
                const swipedRight =
                  info.offset.x > SWIPE_OFFSET_THRESHOLD ||
                  info.velocity.x > SWIPE_VELOCITY_THRESHOLD;
                const swipedLeft =
                  info.offset.x < -SWIPE_OFFSET_THRESHOLD ||
                  info.velocity.x < -SWIPE_VELOCITY_THRESHOLD;

                if (swipedRight) {
                  advanceCard(activeCard.id, 'mastered');
                } else if (swipedLeft) {
                  advanceCard(activeCard.id, 'review');
                }
              }}
              className="bento-card"
              data-testid="flashcard-card"
            >
              {/* Swipe status overlays */}
              <motion.div
                style={{
                  opacity: rightBadgeOpacity,
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  pointerEvents: 'none',
                }}
              >
                <span className="pastel-badge pastel-green">Got It (Mastered)</span>
              </motion.div>
              <motion.div
                style={{
                  opacity: leftBadgeOpacity,
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  pointerEvents: 'none',
                }}
              >
                <span className="pastel-badge pastel-amber">Review Again</span>
              </motion.div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginBottom: '14px',
                }}
              >
                <span className={`pastel-badge pastel-${pastel}`}>
                  Keyword Trigger: {activeCard.frontKeyword}
                </span>
                <span className="tabular-mono" style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
                  Card {safeIndex + 1} of {filteredCards.length} • {activeCard.sourceRef}
                </span>
              </div>

              <div
                role="button"
                tabIndex={0}
                aria-label="Flip flashcard"
                onClick={() => setIsFlipped((f) => !f)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsFlipped((f) => !f);
                  }
                }}
                style={{ padding: '12px 0', cursor: 'pointer' }}
                data-testid="flashcard-body"
              >
                {!isFlipped ? (
                  <div>
                    <div
                      style={{
                        fontSize: '0.73rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--ink-muted)',
                        marginBottom: '6px',
                      }}
                    >
                      Question / Exam Prompt (Click to Reveal Answer)
                    </div>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{activeCard.frontPrompt}</h3>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        fontSize: '0.73rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--pastel-green-text)',
                        fontWeight: 700,
                        marginBottom: '6px',
                      }}
                    >
                      Verified UNITAR Answer
                    </div>
                    <p
                      style={{
                        fontSize: '0.98rem',
                        color: 'var(--ink-primary)',
                        fontWeight: 500,
                        margin: '0 0 10px',
                      }}
                    >
                      {activeCard.backAnswer}
                    </p>
                    {activeCard.backFormula && (
                      <FormulaBlock latex={activeCard.backFormula} label="Formula" />
                    )}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '12px',
                  fontSize: '0.76rem',
                  color: 'var(--ink-muted)',
                }}
              >
                <span>Click card to flip • Drag left/right to grade</span>
                {masteredIds.includes(activeCard.id) && (
                  <span className="pastel-badge pastel-green">Mastered</span>
                )}
              </div>
            </motion.div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsFlipped((f) => !f)}
              data-testid="flashcard-flip-btn"
            >
              {isFlipped ? 'Show Question Side' : 'Reveal Answer Side'}
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => advanceCard(activeCard.id, 'review')}
                data-testid="flashcard-review-btn"
              >
                Review Again
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => advanceCard(activeCard.id, 'mastered')}
                data-testid="flashcard-mastered-btn"
              >
                <IconCheck size={14} /> Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
