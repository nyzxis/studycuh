import React, { useMemo } from 'react';
import type { PastelTheme } from '@/types/course';

interface KeywordTextProps {
  readonly text: string;
  readonly keywords: readonly string[];
  readonly pastel: PastelTheme;
  readonly enabled: boolean;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function KeywordText({ text, keywords, pastel, enabled }: KeywordTextProps) {
  const parts = useMemo(() => {
    if (!enabled || keywords.length === 0) {
      return [{ text, isMatch: false }];
    }

    const STOP_SUBTOKENS = new Set([
      'topic',
      'chapter',
      'system',
      'systems',
      'model',
      'models',
      'method',
      'methods',
      'column',
      'square',
      'general',
      'process',
    ]);
    const expandedTokens = new Set<string>();
    for (const raw of keywords) {
      const trimmed = raw.trim();
      if (trimmed.length >= 3) {
        expandedTokens.add(trimmed);
      }
      const subParts = trimmed
        .split(/[/(),]|vs\.|->/)
        .map((s) => s.trim())
        .filter(
          (s) =>
            s.length >= 5 &&
            !/^\d+$/.test(s) &&
            !STOP_SUBTOKENS.has(s.toLowerCase())
        );
      for (const sp of subParts) {
        expandedTokens.add(sp);
      }
    }

    const sortedTokens = Array.from(expandedTokens).sort((a, b) => b.length - a.length);
    if (sortedTokens.length === 0) {
      return [{ text, isMatch: false }];
    }

    const pattern = new RegExp(`(${sortedTokens.map(escapeRegExp).join('|')})`, 'gi');
    const split = text.split(pattern);
    const lowerSet = new Set(sortedTokens.map((t) => t.toLowerCase()));

    return split
      .filter((segment) => segment.length > 0)
      .map((segment) => ({
        text: segment,
        isMatch: lowerSet.has(segment.toLowerCase()),
      }));
  }, [text, keywords, enabled]);

  return (
    <>
      {parts.map((part, idx) =>
        part.isMatch ? (
          <mark key={idx} className={`kw-highlight theme-${pastel}`} data-testid="kw-highlight">
            {part.text}
          </mark>
        ) : (
          <React.Fragment key={idx}>{part.text}</React.Fragment>
        )
      )}
    </>
  );
}
