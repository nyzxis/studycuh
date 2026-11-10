'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { motionTokens } from '@/lib/motion-tokens';
import { motionConfig } from '@/lib/motion-config';

export function StudyPulse({ label = 'Active Study Session' }: { readonly label?: string }) {
  const controls = useAnimation();

  useEffect(() => {
    if (!motionConfig.shouldAnimate()) return;

    const pulse = () =>
      controls.start({
        scale: [1, 1.32, 1],
        opacity: [1, 0.55, 1],
        transition: {
          repeat: Infinity,
          duration: motionTokens.duration.crawl,
          ease: motionTokens.easing.smooth,
        },
      });

    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        controls.stop();
      } else {
        void pulse();
      }
    };

    void pulse();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      controls.stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [controls]);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        fontSize: '0.76rem',
        color: 'var(--ink-muted)',
        fontWeight: 500,
      }}
    >
      <motion.span
        animate={controls}
        style={{
          width: 8,
          height: 8,
          borderRadius: '9999px',
          backgroundColor: 'var(--pastel-green-text)',
          display: 'inline-block',
        }}
      />
      <span>{label}</span>
    </span>
  );
}
