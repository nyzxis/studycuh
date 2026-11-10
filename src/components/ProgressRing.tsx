'use client';

import { motion } from 'motion/react';
import { motionTokens } from '@/lib/motion-tokens';

interface ProgressRingProps {
  readonly progress: number;
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly strokeColor?: string;
}

export function ProgressRing({
  progress,
  size = 64,
  strokeWidth = 6,
  strokeColor = 'var(--ink-primary)',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, progress));
  const dashOffset = circumference - (clamped / 100) * circumference;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: dashOffset }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{
            duration: motionTokens.duration.normal,
            ease: motionTokens.easing.smooth,
          }}
          style={{ rotate: -90, transformOrigin: 'center' }}
        />
      </svg>
      <span
        className="tabular-mono"
        style={{
          position: 'absolute',
          fontSize: size >= 60 ? '0.78rem' : '0.68rem',
          fontWeight: 600,
          color: 'var(--ink-primary)',
        }}
      >
        {Math.round(clamped)}%
      </span>
    </div>
  );
}
