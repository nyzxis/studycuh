'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'motion/react';
import { motionTokens } from '@/lib/motion-tokens';
import { motionConfig } from '@/lib/motion-config';

interface CounterProps {
  readonly to: number;
  readonly suffix?: string;
  readonly className?: string;
}

export function Counter({ to, suffix = '', className = '' }: CounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!nodeRef.current) return;
    if (!motionConfig.shouldAnimate()) {
      nodeRef.current.textContent = `${Math.round(to)}${suffix}`;
      return;
    }

    const controls = animate(0, to, {
      duration: motionTokens.duration.slow,
      ease: motionTokens.easing.smooth,
      onUpdate: (value) => {
        if (nodeRef.current) {
          nodeRef.current.textContent = `${Math.round(value)}${suffix}`;
        }
      },
    });

    return () => {
      controls.stop();
    };
  }, [to, suffix]);

  return (
    <span ref={nodeRef} className={`tabular-nums ${className}`}>
      {Math.round(to)}
      {suffix}
    </span>
  );
}
