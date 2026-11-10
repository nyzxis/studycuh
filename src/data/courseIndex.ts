import type { Chapter, Subject, SubjectId } from '@/types/course';
import { businessSubject } from '@/data/businessData';
import { csoSubject } from '@/data/csoData';
import { databaseSubject } from '@/data/databaseData';
import { englishSubject } from '@/data/englishData';
import { mathsSubject } from '@/data/mathsData';

export const ALL_SUBJECTS: readonly Subject[] = [
  businessSubject,
  csoSubject,
  databaseSubject,
  englishSubject,
  mathsSubject,
];

export const SUBJECT_MAP: Readonly<Record<SubjectId, Subject>> = {
  business: businessSubject,
  cso: csoSubject,
  database: databaseSubject,
  english: englishSubject,
  maths: mathsSubject,
};

export const CHAPTER_LOOKUP: ReadonlyMap<
  string,
  { readonly chapter: Chapter; readonly subject: Subject }
> = new Map(
  ALL_SUBJECTS.flatMap((subject) =>
    subject.chapters.map((chapter) => [chapter.id, { chapter, subject }] as const)
  )
);

export interface SearchIndexHit {
  readonly id: string;
  readonly subjectId: SubjectId;
  readonly subjectCode: string;
  readonly pastel: Subject['pastel'];
  readonly chapterId: string;
  readonly chapterTitle: string;
  readonly kind: 'Chapter' | 'Keyword Trigger' | 'Slide Alert';
  readonly snippet: string;
}

export const GLOBAL_SEARCH_INDEX: readonly SearchIndexHit[] = ALL_SUBJECTS.flatMap((subj) =>
  subj.chapters.flatMap((ch): readonly SearchIndexHit[] => [
    {
      id: `ch-${ch.id}`,
      subjectId: subj.id,
      subjectCode: subj.code,
      pastel: subj.pastel,
      chapterId: ch.id,
      chapterTitle: `${ch.numberLabel}: ${ch.title}`,
      kind: 'Chapter',
      snippet: `${ch.subtitle} — Keywords: ${ch.masterKeywords.slice(0, 5).join(', ')}`,
    },
    ...ch.keywordPatterns.map(
      (kp): SearchIndexHit => ({
        id: `kp-${kp.id}`,
        subjectId: subj.id,
        subjectCode: subj.code,
        pastel: subj.pastel,
        chapterId: ch.id,
        chapterTitle: `${ch.numberLabel}: ${ch.title}`,
        kind: 'Keyword Trigger',
        snippet: `${kp.keyword} -> ${kp.triggerPhrase} (${kp.examAnswer})`,
      })
    ),
    ...ch.dualViewAlerts.map(
      (dv): SearchIndexHit => ({
        id: `dv-${dv.id}`,
        subjectId: subj.id,
        subjectCode: subj.code,
        pastel: subj.pastel,
        chapterId: ch.id,
        chapterTitle: `${ch.numberLabel}: ${ch.title}`,
        kind: 'Slide Alert',
        snippet: `${dv.title} (${dv.slideRef}): ${dv.verifiedCorrection}`,
      })
    ),
  ])
);

