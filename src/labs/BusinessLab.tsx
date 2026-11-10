'use client';

import { useState } from 'react';
import { FormulaBlock } from '@/components/FormulaBlock';
import { IconLab, IconCheck } from '@/components/Icons';

export function BusinessLab() {
  const [sales, setSales] = useState<number>(120000);
  const [cogs, setCogs] = useState<number>(48000);
  const [expenses, setExpenses] = useState<number>(32000);
  const [liabilities, setLiabilities] = useState<number>(45000);
  const [equity, setEquity] = useState<number>(95000);

  // Inventory Ch. 7 state
  const [dailyUsage, setDailyUsage] = useState<number>(25);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(6);
  const [bufferStock, setBufferStock] = useState<number>(50);

  const grossProfit = sales - cogs;
  const netProfit = grossProfit - expenses;
  const grossMargin = sales > 0 ? (grossProfit / sales) * 100 : 0;
  const netMargin = sales > 0 ? (netProfit / sales) * 100 : 0;
  const totalAssets = liabilities + equity;
  const reorderLevel = dailyUsage * leadTimeDays + bufferStock;

  return (
    <div className="bento-card" data-testid="business-lab">
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '14px',
        }}
      >
        <div>
          <span className="pastel-badge pastel-amber" style={{ marginBottom: '6px' }}>
            <IconLab size={13} /> BUSINESS Interactive Lab
          </span>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
            Accounting Equation, Income Statement &amp; Inventory Control Analyzer (Ch. 6 &amp; Ch. 7)
          </h3>
        </div>
      </div>

      <div className="bento-grid">
        <div className="bento-span-6">
          <h4 style={{ margin: '0 0 10px', fontSize: '0.96rem' }}>
            1. Income Statement &amp; Balance Sheet (Ch. 6)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Sales Revenue (RM):</label>
              <input
                type="number"
                aria-label="Sales Revenue in RM"
                className="editorial-input tabular-mono"
                value={sales}
                onChange={(e) => setSales(Number(e.target.value) || 0)}
                data-testid="biz-sales-input"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Cost of Goods Sold (RM):</label>
              <input
                type="number"
                aria-label="Cost of Goods Sold in RM"
                className="editorial-input tabular-mono"
                value={cogs}
                onChange={(e) => setCogs(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Operating Expenses (RM):</label>
              <input
                type="number"
                aria-label="Operating Expenses in RM"
                className="editorial-input tabular-mono"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Liabilities + Equity (RM):</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input
                  type="number"
                  className="editorial-input tabular-mono"
                  value={liabilities}
                  onChange={(e) => setLiabilities(Number(e.target.value) || 0)}
                  aria-label="Liabilities"
                />
                <input
                  type="number"
                  className="editorial-input tabular-mono"
                  value={equity}
                  onChange={(e) => setEquity(Number(e.target.value) || 0)}
                  aria-label="Owners Equity"
                />
              </div>
            </div>
          </div>

          <FormulaBlock
            label="Accounting Equation & Profitability (Ch. 6)"
            latex={`\\text{Assets} = ${liabilities} + ${equity} = \\text{RM } ${totalAssets.toLocaleString()}`}
            note={`Gross Profit = RM ${grossProfit.toLocaleString()} (${grossMargin.toFixed(1)}%) | Net Profit = RM ${netProfit.toLocaleString()} (${netMargin.toFixed(1)}%)`}
          />
        </div>

        <div className="bento-span-6">
          <h4 style={{ margin: '0 0 10px', fontSize: '0.96rem' }}>
            2. Inventory Reorder Level &amp; Buffer Stock (Ch. 7)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Daily Usage (units):</label>
              <input
                type="number"
                aria-label="Daily Usage in units"
                className="editorial-input tabular-mono"
                value={dailyUsage}
                onChange={(e) => setDailyUsage(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Lead Time (days):</label>
              <input
                type="number"
                aria-label="Lead Time in days"
                className="editorial-input tabular-mono"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Buffer Stock (units):</label>
              <input
                type="number"
                aria-label="Buffer Stock in units"
                className="editorial-input tabular-mono"
                value={bufferStock}
                onChange={(e) => setBufferStock(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--pastel-amber-bg)',
              border: '1px solid var(--pastel-amber-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.86rem',
            }}
          >
            <div className="tabular-mono" style={{ fontWeight: 700, fontSize: '1.02rem', color: 'var(--ink-primary)' }}>
              <IconCheck size={14} /> Reorder Trigger Level: {reorderLevel} units
            </div>
            <p style={{ margin: '6px 0 0', color: 'var(--pastel-amber-text)' }}>
              When inventory drops to <strong>{reorderLevel} units</strong>, place a new replenishment
              order so stock never falls below the <strong>{bufferStock}-unit buffer stock</strong>{' '}
              during the {leadTimeDays}-day supplier lead time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
