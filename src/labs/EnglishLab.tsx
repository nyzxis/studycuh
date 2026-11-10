'use client';

import { useState } from 'react';
import { IconLab, IconCheck } from '@/components/Icons';

interface CommScenario {
  readonly id: string;
  readonly title: string;
  readonly context: string;
  readonly commType: string;
  readonly maximOrRule: string;
  readonly tracBreakdown: string;
}

const SCENARIOS: readonly CommScenario[] = [
  {
    id: 'career-sara',
    title: 'Scenario 1: Sara Rehearsing & Presenting on Career Day',
    context:
      'Sara silently practices her opening lines backstage to calm her nerves, then delivers a structured 10-minute keynote with keyword slides to 150 students.',
    commType: 'Intrapersonal (Self-regulation backstage) -> Public Communication (150-student keynote)',
    maximOrRule: 'Lucas (2020) Delivery Elements: Preparation & Practice, Voice Control, and Keyword-Only Visual Aids.',
    tracBreakdown: 'Topic: Career Readiness | Relevance: Graduate employability | Accountability: Official stats | Clarity: Concise slides.',
  },
  {
    id: 'committee-minutes',
    title: 'Scenario 2: 6-Member Organizing Committee Meeting',
    context:
      'Amir chairs a 6-person committee meeting using a pre-circulated Agenda while the Secretary records decisions, PICs, and deadlines in the Minutes of Meeting.',
    commType: 'Small Group Communication (3 to 15 participants with shared purpose & interdependence)',
    maximOrRule: 'Topic 5 Turn-Taking (One speaker at a time) + Topic 9 Agenda (Before) & Minutes (During/After).',
    tracBreakdown: 'Topic: Booth Logistics | Relevance: Action items | Accountability: Assigned PIC + Deadline | Clarity: Factual minutes.',
  },
  {
    id: 'audit-report',
    title: 'Scenario 3: Post-Event Analytical Report Submission',
    context:
      'Following Career Day, the team compiles survey findings, conclusions, and actionable recommendations into a formal report.',
    commType: 'Written Organizational Report (Bhatia, 2013 & Bovee and Thill, 2018 Analytical/Persuasive Report)',
    maximOrRule: '5 Steps of Report Writing: 1. Purpose/Audience -> 2. Gather/Organise -> 3. Plan Structure -> 4. Write Draft -> 5. Review/Edit.',
    tracBreakdown: 'Objective tone, structured headings (Intro, Methodology, Findings, Conclusion, Recommendations), zero slang.',
  },
];

export function EnglishLab() {
  const [selectedId, setSelectedId] = useState<string>(SCENARIOS[0].id);
  const activeScenario = SCENARIOS.find((s) => s.id === selectedId) ?? SCENARIOS[0];

  return (
    <div className="bento-card" data-testid="english-lab">
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
          <span className="pastel-badge pastel-red" style={{ marginBottom: '6px' }}>
            <IconLab size={13} /> SFQF0233 Interactive Lab
          </span>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
            Communication Types, Grice Maxims / T.R.A.C. &amp; Report Writing Case Analyzer
          </h3>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            type="button"
            className={`btn-secondary ${selectedId === sc.id ? 'active' : ''}`}
            onClick={() => setSelectedId(sc.id)}
          >
            {sc.title}
          </button>
        ))}
      </div>

      <div
        style={{
          padding: '16px',
          backgroundColor: 'var(--canvas-bg)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <p style={{ marginTop: 0, fontWeight: 600, color: 'var(--ink-primary)' }}>
          {activeScenario.context}
        </p>

        <div className="bento-grid">
          <div className="bento-span-4" style={{ padding: '12px', backgroundColor: 'var(--surface-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--pastel-red-text)', marginBottom: '4px' }}>
              Communication Classification
            </div>
            <div style={{ fontSize: '0.85rem' }}>{activeScenario.commType}</div>
          </div>

          <div className="bento-span-4" style={{ padding: '12px', backgroundColor: 'var(--surface-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--pastel-blue-text)', marginBottom: '4px' }}>
              Scholarly Framework / Rule
            </div>
            <div style={{ fontSize: '0.85rem' }}>{activeScenario.maximOrRule}</div>
          </div>

          <div className="bento-span-4" style={{ padding: '12px', backgroundColor: 'var(--surface-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--pastel-green-text)', marginBottom: '4px' }}>
              <IconCheck size={12} /> T.R.A.C. &amp; Structure Check
            </div>
            <div style={{ fontSize: '0.85rem' }}>{activeScenario.tracBreakdown}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
