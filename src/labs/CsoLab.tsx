'use client';

import { useState } from 'react';
import { motion, useAnimate } from 'motion/react';
import { motionTokens } from '@/lib/motion-tokens';
import { FormulaBlock } from '@/components/FormulaBlock';
import { IconLab, IconCheck, IconAlert } from '@/components/Icons';

type CsoTab = 'radix' | 'boolean' | 'pipeline';

function to8BitBinary(n: number): string {
  const clamped = Math.max(0, Math.min(255, Math.abs(Math.trunc(n))));
  return clamped.toString(2).padStart(8, '0');
}

function invertBits(bits: string): string {
  return bits
    .split('')
    .map((b) => (b === '1' ? '0' : '1'))
    .join('');
}

function addOneToBinary(bits: string): string {
  const val = (parseInt(bits, 2) + 1) & 0xff;
  return val.toString(2).padStart(8, '0');
}

export function CsoLab() {
  const [activeTab, setActiveTab] = useState<CsoTab>('radix');

  // Tab 1: Base & 2's Complement state
  const [decimalInput, setDecimalInput] = useState<string>('-18');
  const [scope, animate] = useAnimate();

  // Tab 2: Boolean Preset state
  const [booleanPreset, setBooleanPreset] = useState<'slide38' | 'demorgan' | 'xor'>('slide38');

  // Tab 3: Amdahl & Pipeline state
  const [parallelFraction, setParallelFraction] = useState<number>(0.8);
  const [processors, setProcessors] = useState<number>(4);
  const [pipelineStages, setPipelineStages] = useState<number>(6);
  const [instructionCount, setInstructionCount] = useState<number>(10);

  const parsedInt = Number(decimalInput);
  const isInvalidInt =
    decimalInput.trim() === '' ||
    Number.isNaN(parsedInt) ||
    !Number.isInteger(parsedInt) ||
    parsedInt < -128 ||
    parsedInt > 127;

  const absVal = isInvalidInt ? 18 : Math.abs(parsedInt);
  const isNegative = !isInvalidInt && parsedInt < 0;
  const magnitudeBits = to8BitBinary(absVal);
  const signMagBits = isNegative ? `1${magnitudeBits.slice(1)}` : magnitudeBits;
  const onesCompBits = isNegative ? invertBits(magnitudeBits) : magnitudeBits;
  const twosCompBits = isNegative ? addOneToBinary(onesCompBits) : magnitudeBits;

  const triggerStepAnimation = async () => {
    if (!scope.current) return;
    await animate('.step-box-1', { scale: [1, 1.03, 1] }, { duration: motionTokens.duration.fast });
    await animate('.step-box-2', { scale: [1, 1.03, 1] }, { duration: motionTokens.duration.fast });
    await animate('.step-box-3', { scale: [1, 1.03, 1] }, { duration: motionTokens.duration.fast });
  };

  // Amdahl & Pipeline calculations
  const amdahlSpeedup = 1 / ((1 - parallelFraction) + parallelFraction / Math.max(1, processors));
  const nonPipelinedCycles = instructionCount * pipelineStages;
  const pipelinedCycles = pipelineStages + (instructionCount - 1);
  const pipelineSpeedup = nonPipelinedCycles / Math.max(1, pipelinedCycles);

  return (
    <div className="bento-card" data-testid="cso-lab">
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '18px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '14px',
        }}
      >
        <div>
          <span className="pastel-badge pastel-blue" style={{ marginBottom: '6px' }}>
            <IconLab size={13} /> ITCF0013 Interactive Lab
          </span>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
            CSO Workbench: Base/2&apos;s Complement, Boolean Truth Tables &amp; Pipeline Simulator
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn-secondary ${activeTab === 'radix' ? 'active' : ''}`}
            onClick={() => setActiveTab('radix')}
            data-testid="cso-tab-radix"
          >
            1. Base &amp; 2&apos;s Complement
          </button>
          <button
            type="button"
            className={`btn-secondary ${activeTab === 'boolean' ? 'active' : ''}`}
            onClick={() => setActiveTab('boolean')}
            data-testid="cso-tab-boolean"
          >
            2. Boolean &amp; Logic Gates
          </button>
          <button
            type="button"
            className={`btn-secondary ${activeTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('pipeline')}
            data-testid="cso-tab-pipeline"
          >
            3. Amdahl &amp; 6-Stage Pipeline
          </button>
        </div>
      </div>

      {activeTab === 'radix' && (
        <div ref={scope}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ flex: '1 1 220px' }}>
              <label
                htmlFor="cso-dec-input"
                style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}
              >
                Signed 8-Bit Decimal Input (-128 to +127):
              </label>
              <input
                id="cso-dec-input"
                type="text"
                className="editorial-input tabular-mono"
                value={decimalInput}
                onChange={(e) => setDecimalInput(e.target.value)}
                data-testid="cso-dec-input"
              />
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setDecimalInput('-18');
                void triggerStepAnimation();
              }}
              data-testid="cso-load-slide-example"
            >
              Load Topic 5 Slide Example (-18)
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={() => void triggerStepAnimation()}
            >
              Animate Conversion Steps
            </button>
          </div>

          {isInvalidInt ? (
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--pastel-red-bg)',
                border: '1px solid var(--pastel-red-border)',
                color: 'var(--pastel-red-text)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
              data-testid="cso-lab-error"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconAlert size={16} />
                <span>
                  <strong>8-Bit Overflow / Invalid Input:</strong> Signed 8-bit 2&apos;s complement
                  requires an integer between <code>-128</code> and <code>+127</code>.
                </span>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setDecimalInput('-18')}
              >
                Reset to -18
              </button>
            </div>
          ) : (
            <>
              <div className="bento-grid" style={{ marginBottom: '16px' }}>
                <div className="bento-span-4 step-box-1" style={{ padding: '14px', backgroundColor: 'var(--canvas-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
                    Step 1: Unsigned Magnitude |{absVal}|
                  </div>
                  <div className="tabular-mono" style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '4px' }}>
                    {magnitudeBits}₂
                  </div>
                  <div className="tabular-mono" style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginTop: '4px' }}>
                    Octal: {absVal.toString(8)}₈ • Hex: 0x{absVal.toString(16).toUpperCase()}₁₆
                  </div>
                </div>

                <div className="bento-span-4 step-box-2" style={{ padding: '14px', backgroundColor: 'var(--canvas-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
                    Step 2: 1&apos;s Complement (Invert Bits)
                  </div>
                  <div className="tabular-mono" style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '4px' }}>
                    {onesCompBits}₂
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginTop: '4px' }}>
                    Sign-Magnitude: <code className="tabular-mono">{signMagBits}₂</code>
                  </div>
                </div>

                <div className="bento-span-4 step-box-3" style={{ padding: '14px', backgroundColor: 'var(--pastel-blue-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--pastel-blue-border)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--pastel-blue-text)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Step 3: 2&apos;s Complement (1&apos;s Comp + 1)
                  </div>
                  <div className="tabular-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink-primary)', marginTop: '4px' }} data-testid="cso-twos-output">
                    {twosCompBits}₂
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--pastel-blue-text)', marginTop: '4px' }}>
                    MSB = {twosCompBits[0]} ({isNegative ? 'Negative' : 'Non-Negative'})
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'boolean' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <button
              type="button"
              className={`btn-secondary ${booleanPreset === 'slide38' ? 'active' : ''}`}
              onClick={() => setBooleanPreset('slide38')}
            >
              Ch. 6 Slide 38 Exercise: F = A&apos;B + C
            </button>
            <button
              type="button"
              className={`btn-secondary ${booleanPreset === 'demorgan' ? 'active' : ''}`}
              onClick={() => setBooleanPreset('demorgan')}
            >
              De Morgan&apos;s Theorem: (A · B)&apos; = A&apos; + B&apos;
            </button>
            <button
              type="button"
              className={`btn-secondary ${booleanPreset === 'xor' ? 'active' : ''}`}
              onClick={() => setBooleanPreset('xor')}
            >
              Half-Adder Sum &amp; Carry (XOR + AND)
            </button>
          </div>

          {/* Animated SVG Logic Circuit Schematic (motion-advanced pathLength draw-on) */}
          <div
            style={{
              backgroundColor: 'var(--canvas-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              marginBottom: '14px',
            }}
          >
            <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Verified Logic Gate Schematic (SVG Path Draw-On)
            </div>
            <svg width="100%" height="96" viewBox="0 0 520 96" aria-label="Boolean Logic Gate Diagram">
              <motion.path
                key={booleanPreset}
                d="M 20 24 L 110 24 M 20 52 L 180 52 M 20 80 L 290 80 M 140 24 L 180 24 M 230 38 L 290 38 M 340 58 L 430 58"
                stroke="#1F6C9F"
                strokeWidth="2.2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth }}
              />
              <rect x="110" y="12" width="30" height="24" rx="4" fill="var(--surface-primary)" stroke="var(--ink-primary)" strokeWidth="1.5" />
              <text x="125" y="28" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--ink-primary)">NOT</text>
              <rect x="180" y="18" width="50" height="40" rx="6" fill="var(--pastel-blue-bg)" stroke="var(--pastel-blue-text)" strokeWidth="1.5" />
              <text x="205" y="42" textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="var(--pastel-blue-text)">AND</text>
              <rect x="290" y="34" width="50" height="48" rx="6" fill="var(--pastel-green-bg)" stroke="var(--pastel-green-text)" strokeWidth="1.5" />
              <text x="315" y="62" textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="var(--pastel-green-text)">OR</text>
              <text x="440" y="62" fontSize="12" fontWeight="bold" fontFamily="monospace" fill="var(--ink-primary)">
                {booleanPreset === 'slide38' ? "F = A'B + C" : booleanPreset === 'demorgan' ? "F = (AB)'" : 'S = A ⊕ B'}
              </text>
            </svg>
          </div>

          <div className="editorial-table-wrap">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>A</th>
                  <th>B</th>
                  <th>C</th>
                  <th>A&apos;</th>
                  <th>A&apos;B</th>
                  <th>Output F = A&apos;B + C</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1].flatMap((a) =>
                  [0, 1].flatMap((b) =>
                    [0, 1].map((c) => {
                      const notA = a === 0 ? 1 : 0;
                      const notAB = notA & b;
                      const outF = notAB | c;
                      return (
                        <tr key={`${a}-${b}-${c}`}>
                          <td>{a}</td>
                          <td>{b}</td>
                          <td>{c}</td>
                          <td>{notA}</td>
                          <td>{notAB}</td>
                          <td>
                            <strong style={{ color: outF === 1 ? 'var(--pastel-green-text)' : 'var(--ink-muted)' }}>
                              {outF}
                            </strong>
                          </td>
                        </tr>
                      );
                    })
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div>
          <div className="bento-grid" style={{ marginBottom: '16px' }}>
            <div className="bento-span-6">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                Parallelizable Fraction (f): {Math.round(parallelFraction * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="0.99"
                step="0.05"
                value={parallelFraction}
                onChange={(e) => setParallelFraction(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, margin: '10px 0 4px' }}>
                Number of Processors (N): {processors}
              </label>
              <input
                type="range"
                min="1"
                max="16"
                step="1"
                value={processors}
                onChange={(e) => setProcessors(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <FormulaBlock
                label="Amdahl's Law (Topic 9 Slide 27)"
                latex={`S = \\frac{1}{(1 - ${parallelFraction.toFixed(2)}) + \\frac{${parallelFraction.toFixed(2)}}{${processors}}} = ${amdahlSpeedup.toFixed(2)}\\times`}
              />
            </div>

            <div className="bento-span-6">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                Pipeline Stages (k): {pipelineStages} (Default 6: FI, DI, CO, FO, EI, WO)
              </label>
              <input
                type="range"
                min="3"
                max="10"
                step="1"
                value={pipelineStages}
                onChange={(e) => setPipelineStages(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, margin: '10px 0 4px' }}>
                Instructions (n): {instructionCount}
              </label>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={instructionCount}
                onChange={(e) => setInstructionCount(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  backgroundColor: 'var(--pastel-green-bg)',
                  border: '1px solid var(--pastel-green-border)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div className="tabular-mono" style={{ fontSize: '0.85rem', color: 'var(--ink-primary)' }}>
                  <div>Sequential Cycles (n × k): <strong>{nonPipelinedCycles} cycles</strong></div>
                  <div>Pipelined Cycles (k + n - 1): <strong>{pipelinedCycles} cycles</strong></div>
                  <div style={{ color: 'var(--pastel-green-text)', marginTop: '4px' }}>
                    <IconCheck size={13} /> Pipeline Speedup: <strong>{pipelineSpeedup.toFixed(2)}× faster</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
