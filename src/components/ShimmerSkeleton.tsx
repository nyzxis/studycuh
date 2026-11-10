'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { motionTokens } from '@/lib/motion-tokens';
import { motionConfig } from '@/lib/motion-config';

export function ShimmerSkeleton({
  height = 20,
  width = '100%',
}: {
  readonly height?: number;
  readonly width?: string | number;
}) {
  const controls = useAnimation();

  useEffect(() => {
    if (!motionConfig.shouldAnimate()) return;

    const play = () =>
      controls.start({
        x: ['-100%', '100%'],
        transition: {
          repeat: Infinity,
          duration: motionTokens.duration.crawl,
          ease: motionTokens.easing.linear,
        },
      });

    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        controls.stop();
      } else {
        void play();
      }
    };

    void play();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      controls.stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [controls]);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        height,
        width,
        backgroundColor: 'var(--surface-secondary)',
        borderRadius: 'var(--radius-sm)',
      }}
      data-testid="shimmer-skeleton"
    >
      <motion.div
        initial={{ x: '-100%' }}
        animate={controls}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--border-subtle)',
          opacity: 0.45,
        }}
      />
    </div>
  );
}
