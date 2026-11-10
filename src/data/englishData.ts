import type { Subject } from '@/types/course';
import { englishT1to5 } from '@/data/englishT1to5';
import { englishT6to10 } from '@/data/englishT6to10';

export const englishSubject: Subject = {
  id: 'english',
  code: 'SFQF0233',
  name: 'English for Communication',
  shortName: 'English Comm',
  tagline:
    'Communication models (Transactional vs. Linear), 4 communication types, language power, Grice maxims, T.R.A.C., speech delivery (Lucas 2020), meetings, and report writing (Bhatia 2013).',
  pastel: 'red',
  totalFiles: '10 PDFs',
  totalVolume: '40 Pages',
  instructorOrSource: 'UNITAR International University (SFQF0233)',
  masterKeywords: [
    'Adler and Rodman (2018)',
    'Intrapersonal / Interpersonal / Small Group / Public',
    'Joseph A. DeVito',
    'Transactional Model vs. Shannon & Weaver',
    '8 Elements (Encoding & Decoding)',
    'Code-Switching',
    'Grice 4 Maxims (Quantity, Quality, Relation, Manner)',
    'T.R.A.C. (Topic, Relevance, Accountability, Clarity)',
    'Demographic / Psychographic / Situational Analysis',
    'Lucas (2020) 6 Delivery Elements',
    'Meeting Agenda vs. Minutes of Meeting',
    'Bhatia (2013) & Bovee and Thill (2018) Reports',
  ],
  labTitle: 'Communication Classifier, Grice Maxims & Report Builder Lab',
  labDescription:
    'Interactive scenario analyzer for the 4 Communication Types, Transactional 8 Elements, Grice Conversational Maxims / T.R.A.C., and a Meeting Minutes & 5-Step Report generator.',
  chapters: [...englishT1to5, ...englishT6to10],
};
