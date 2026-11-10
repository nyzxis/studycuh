import type { DualViewAlert as DualViewAlertType } from '@/types/course';
import { IconAlert, IconCheck } from '@/components/Icons';

const SEVERITY_LABELS: Readonly<Record<DualViewAlertType['severity'], { readonly label: string; readonly badgeClass: string }>> = {
  typo: { label: 'Lecturer Slide Typo Alert', badgeClass: 'pastel-amber' },
  contradiction: { label: 'Deck Contradiction / Alignment Note', badgeClass: 'pastel-red' },
  'unanswered-exercise': { label: 'Solved Unanswered Deck Exercise', badgeClass: 'pastel-blue' },
  'missing-deck': { label: 'Missing Deck Bridge Reference', badgeClass: 'pastel-green' },
};

export function DualViewAlert({ alert }: { readonly alert: DualViewAlertType }) {
  const meta = SEVERITY_LABELS[alert.severity];

  return (
    <div className="dual-view-card" data-testid="dual-view-alert">
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: 'var(--canvas-bg)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className={`pastel-badge ${meta.badgeClass}`}>
            <IconAlert size={13} />
            {meta.label}
          </span>
          <strong style={{ color: 'var(--ink-primary)', fontSize: '0.92rem' }}>{alert.title}</strong>
        </div>
        <code
          style={{
            fontSize: '0.75rem',
            color: 'var(--ink-muted)',
            backgroundColor: 'var(--surface-primary)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {alert.slideRef}
        </code>
      </div>

      <div className="dual-view-grid">
        <div className="dual-view-pane">
          <div
            style={{
              fontSize: '0.73rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--pastel-red-text)',
              marginBottom: '6px',
            }}
          >
            Original UNITAR Slide / PDF Text
          </div>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--ink-body)' }}>
            {alert.unitarOriginal}
          </p>
        </div>

        <div className="dual-view-pane">
          <div
            style={{
              fontSize: '0.73rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--pastel-green-text)',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <IconCheck size={13} />
            Verified Correction / Worked Solution
          </div>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--ink-primary)', fontWeight: 500 }}>
            {alert.verifiedCorrection}
          </p>
        </div>
      </div>

      <div
        style={{
          padding: '9px 16px',
          backgroundColor: 'var(--pastel-amber-bg)',
          color: 'var(--pastel-amber-text)',
          fontSize: '0.81rem',
          borderTop: '1px solid var(--pastel-amber-border)',
        }}
      >
        <strong>Exam Strategy: </strong>
        {alert.examTip}
      </div>
    </div>
  );
}
