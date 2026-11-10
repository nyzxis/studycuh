'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { motionTokens } from '@/lib/motion-tokens';
import { FormulaBlock } from '@/components/FormulaBlock';
import { IconLab, IconAlert, IconCheck } from '@/components/Icons';

type MathsTab = 'matrix' | 'apgp' | 'cpm';

export function MathsLab() {
  const [activeTab, setActiveTab] = useState<MathsTab>('matrix');

  // Tab 1: 2x2 Matrix & Cramer's Rule
  const [a11, setA11] = useState<string>('2');
  const [a12, setA12] = useState<string>('5');
  const [a21, setA21] = useState<string>('1');
  const [a22, setA22] = useState<string>('3');
  const [b1, setB1] = useState<string>('9');
  const [b2, setB2] = useState<string>('5');

  // Tab 2: AP / GP state
  const [firstTerm, setFirstTerm] = useState<number>(3);
  const [diffOrRatio, setDiffOrRatio] = useState<number>(4);
  const [termN, setTermN] = useState<number>(8);

  const mA = Number(a11);
  const mB = Number(a12);
  const mC = Number(a21);
  const mD = Number(a22);
  const r1 = Number(b1);
  const r2 = Number(b2);

  const detA = mA * mD - mB * mC;
  const detAx = r1 * mD - mB * r2;
  const detAy = mA * r2 - r1 * mC;
  const isSingular = Number.isNaN(detA) || detA === 0;

  // AP & GP formulas
  const apTn = firstTerm + (termN - 1) * diffOrRatio;
  const apSn = (termN / 2) * (2 * firstTerm + (termN - 1) * diffOrRatio);
  const rawGpTn = firstTerm * Math.pow(diffOrRatio, termN - 1);
  const gpTn = Number.isFinite(rawGpTn) ? rawGpTn : 0;
  const rawGpSn =
    diffOrRatio === 1
      ? firstTerm * termN
      : (firstTerm * (Math.pow(diffOrRatio, termN) - 1)) / (diffOrRatio - 1);
  const gpSn = Number.isFinite(rawGpSn) ? rawGpSn : 0;

  return (
    <div className="bento-card" data-testid="maths-lab">
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
          <span className="pastel-badge pastel-lavender" style={{ marginBottom: '6px' }}>
            <IconLab size={13} /> ITNF0024E Interactive Lab
          </span>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
            Mathematics Workbench: Matrix &amp; Cramer&apos;s Rule, AP/GP Series &amp; CPM Network Float
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn-secondary ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
            data-testid="maths-tab-matrix"
          >
            1. 2×2 Inverse &amp; Cramer&apos;s Rule
          </button>
          <button
            type="button"
            className={`btn-secondary ${activeTab === 'apgp' ? 'active' : ''}`}
            onClick={() => setActiveTab('apgp')}
            data-testid="maths-tab-apgp"
          >
            2. AP &amp; GP Progression
          </button>
          <button
            type="button"
            className={`btn-secondary ${activeTab === 'cpm' ? 'active' : ''}`}
            onClick={() => setActiveTab('cpm')}
            data-testid="maths-tab-cpm"
          >
            3. CPM Network &amp; Dual Critical Path
          </button>
        </div>
      </div>

      {activeTab === 'matrix' && (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '14px', alignItems: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 86px)', gap: '8px' }}>
              <input aria-label="a11" className="editorial-input tabular-mono" value={a11} onChange={(e) => setA11(e.target.value)} data-testid="matrix-a11" />
              <input aria-label="a12" className="editorial-input tabular-mono" value={a12} onChange={(e) => setA12(e.target.value)} data-testid="matrix-a12" />
              <input aria-label="b1" className="editorial-input tabular-mono" value={b1} onChange={(e) => setB1(e.target.value)} style={{ backgroundColor: 'var(--canvas-bg)' }} />
              <input aria-label="a21" className="editorial-input tabular-mono" value={a21} onChange={(e) => setA21(e.target.value)} data-testid="matrix-a21" />
              <input aria-label="a22" className="editorial-input tabular-mono" value={a22} onChange={(e) => setA22(e.target.value)} data-testid="matrix-a22" />
              <input aria-label="b2" className="editorial-input tabular-mono" value={b2} onChange={(e) => setB2(e.target.value)} style={{ backgroundColor: 'var(--canvas-bg)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setA11('2'); setA12('5'); setA21('1'); setA22('3'); setB1('9'); setB2('5');
                }}
                data-testid="maths-load-valid"
              >
                Load Topic 6 Worked Example (|A| = 1)
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setA11('2'); setA12('4'); setA21('1'); setA22('2');
                }}
                data-testid="maths-load-singular"
              >
                Test Singular Matrix Error (|A| = 0)
              </button>
            </div>
          </div>

          {isSingular ? (
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
              data-testid="maths-singular-error"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconAlert size={16} />
                <span>
                  <strong>Singular Matrix Detected (|A| = ad - bc = 0):</strong> A matrix with zero
                  determinant has no inverse ($A^{-1}$ does not exist) and cannot be solved uniquely via
                  Cramer&apos;s Rule.
                </span>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setA11('2'); setA12('5'); setA21('1'); setA22('3'); setB1('9'); setB2('5');
                }}
                data-testid="maths-recover-btn"
              >
                Load Worked Slide Example
              </button>
            </div>
          ) : (
            <div className="bento-grid">
              <div className="bento-span-6">
                <FormulaBlock
                  label="Determinant & Verified 2×2 Inverse (Fixing Topic 6 Page 5 -c Typo)"
                  latex={`|A| = (${mA})(${mD}) - (${mB})(${mC}) = ${detA}, \\quad A^{-1} = \\frac{1}{${detA}}\\begin{pmatrix} ${mD} & ${-mB} \\\\ ${-mC} & ${mA} \\end{pmatrix}`}
                  note="Exam Alert: Topic 6 Page 5 omitted the minus sign on c in the general formula, but your exam requires -c in row 2 column 1."
                />
              </div>
              <div className="bento-span-6">
                <FormulaBlock
                  label="Cramer's Rule Solution (x = |Ax|/|A|, y = |Ay|/|A|)"
                  latex={`x = \\frac{${detAx}}{${detA}} = ${(detAx / detA).toFixed(2)}, \\quad y = \\frac{${detAy}}{${detA}} = ${(detAy / detA).toFixed(2)}`}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'apgp' && (
        <div>
          <div className="bento-grid" style={{ marginBottom: '14px' }}>
            <div className="bento-span-4">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                First Term (a):
              </label>
              <input
                type="number"
                className="editorial-input tabular-mono"
                value={firstTerm}
                onChange={(e) => setFirstTerm(Number(e.target.value) || 0)}
              />
            </div>
            <div className="bento-span-4">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                Common Difference (d) / Ratio (r):
              </label>
              <input
                type="number"
                className="editorial-input tabular-mono"
                value={diffOrRatio}
                onChange={(e) => setDiffOrRatio(Number(e.target.value) || 0)}
              />
            </div>
            <div className="bento-span-4">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                Term Index (n):
              </label>
              <input
                type="number"
                min="1"
                max="20"
                className="editorial-input tabular-mono"
                value={termN}
                onChange={(e) => setTermN(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
              />
            </div>
          </div>

          <div className="bento-grid">
            <div className="bento-span-6">
              <FormulaBlock
                label={`Arithmetic Progression (d = ${diffOrRatio})`}
                latex={`T_{${termN}} = ${firstTerm} + (${termN}-1)(${diffOrRatio}) = ${apTn}, \\quad S_{${termN}} = ${apSn}`}
              />
            </div>
            <div className="bento-span-6">
              <FormulaBlock
                label={`Geometric Progression (r = ${diffOrRatio})`}
                latex={`T_{${termN}} = ${firstTerm}(${diffOrRatio})^{${termN - 1}} = ${gpTn}, \\quad S_{${termN}} = ${gpSn.toFixed(2)}`}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cpm' && (
        <div>
          <p style={{ marginTop: 0, fontSize: '0.88rem', color: 'var(--ink-body)' }}>
            <strong>Topic 8 Example 3 Dual Critical Path Inspector:</strong> Forward Pass takes{' '}
            <code>MAX(ES + Duration)</code>; Backward Pass takes <code>MIN(LF - Duration)</code>. Both{' '}
            <code>A -&gt; B -&gt; D -&gt; F</code> and <code>A -&gt; C -&gt; E -&gt; F</code> have Total
            Float = 0 and duration = 12 weeks.
          </p>

          <div
            style={{
              backgroundColor: 'var(--canvas-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              marginBottom: '12px',
            }}
          >
            <svg width="100%" height="110" viewBox="0 0 540 110" aria-label="CPM Network Diagram">
              <motion.path
                d="M 40 55 L 150 25 L 310 25 L 430 55 L 510 55 M 40 55 L 150 85 L 310 85 L 430 55"
                stroke="#5B3E96"
                strokeWidth="2.5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth }}
              />
              <circle cx="40" cy="55" r="14" fill="#F3EFFE" stroke="#5B3E96" strokeWidth="1.8" />
              <text x="40" y="59" textAnchor="middle" fontSize="11" fontWeight="bold">A(3)</text>
              <circle cx="150" cy="25" r="14" fill="#F3EFFE" stroke="#5B3E96" strokeWidth="1.8" />
              <text x="150" y="29" textAnchor="middle" fontSize="11" fontWeight="bold">B(2)</text>
              <circle cx="310" cy="25" r="14" fill="#F3EFFE" stroke="#5B3E96" strokeWidth="1.8" />
              <text x="310" y="29" textAnchor="middle" fontSize="11" fontWeight="bold">D(5)</text>
              <circle cx="150" cy="85" r="14" fill="#F3EFFE" stroke="#5B3E96" strokeWidth="1.8" />
              <text x="150" y="89" textAnchor="middle" fontSize="11" fontWeight="bold">C(4)</text>
              <circle cx="310" cy="85" r="14" fill="#F3EFFE" stroke="#5B3E96" strokeWidth="1.8" />
              <text x="310" y="89" textAnchor="middle" fontSize="11" fontWeight="bold">E(3)</text>
              <circle cx="430" cy="55" r="14" fill="#EDF3EC" stroke="#346538" strokeWidth="1.8" />
              <text x="430" y="59" textAnchor="middle" fontSize="11" fontWeight="bold">F(2)</text>
            </svg>
          </div>

          <div className="editorial-table-wrap">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Predecessor</th>
                  <th>Duration</th>
                  <th>ES</th>
                  <th>EF</th>
                  <th>LS</th>
                  <th>LF</th>
                  <th>Total Float (TF)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['A', '-', 3, 0, 3, 0, 3, 0],
                  ['B', 'A', 2, 3, 5, 3, 5, 0],
                  ['C', 'A', 4, 3, 7, 3, 7, 0],
                  ['D', 'B', 5, 5, 10, 5, 10, 0],
                  ['E', 'C', 3, 7, 10, 7, 10, 0],
                  ['F', 'D, E', 2, 10, 12, 10, 12, 0],
                ].map(([act, pred, dur, es, ef, ls, lf, tf]) => (
                  <tr key={String(act)}>
                    <td><strong>{act}</strong></td>
                    <td>{pred}</td>
                    <td>{dur} wks</td>
                    <td>{es}</td>
                    <td>{ef}</td>
                    <td>{ls}</td>
                    <td>{lf}</td>
                    <td>{tf}</td>
                    <td>
                      <span className="pastel-badge pastel-green">
                        <IconCheck size={12} /> Critical (TF=0)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
