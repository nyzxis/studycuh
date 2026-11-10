import type { Subject } from '../types/course';
import { mathsT1to5 } from './mathsT1to5';
import { mathsT6to10 } from './mathsT6to10';

export const mathsSubject: Subject = {
  id: 'maths',
  code: 'ITNF0024E',
  name: 'Fundamentals of Mathematics',
  shortName: 'Mathematics',
  tagline: 'Real numbers, exponents, logs, polynomials, sets, functions, AP/GP series, matrices & Cramers Rule, linear programming, CPM networks, and calculus.',
  pastel: 'lavender',
  totalFiles: '1 PPT + 7 PPTXs + 9 PDFs',
  totalVolume: '146 Pages / Slides',
  instructorOrSource: 'UNITAR International University (ITNF0024E)',
  masterKeywords: [
    'Real Numbers (R, Q, J, W, N, I)',
    'Trichotomy & Absolute Value',
    'Exponent Laws & Radicals',
    'Logarithm Rules & Change of Base',
    'Division Algorithm & Zero Remainder',
    'Factoring (GCF, AC, Cubes, Substitution)',
    'Quadratic Formula & Completing Square',
    'Inequalities & Interval Notation',
    'Sets, Subsets & Venn Diagrams',
    'One-to-One Functions & Distance Formula',
    'Piecewise Functions, Reflections & Shifts',
    'Arithmetic Progression (AP) & Geometric Progression (GP)',
    'Determinants, 2x2 Inverse & Cramer\'s Rule',
    'Graphical LP & Simplex Tableau',
    'CPM Forward/Backward Pass & Float (TF, FF, IF)',
    'First Principle, Product, Quotient & Chain Rules',
    'Indefinite & Definite Integrals (Area Under/Between/y-Axis)',
  ],
  labTitle: 'Matrix/Cramers Rule, AP/GP, CPM Network & Calculus Lab',
  labDescription: 'Interactive 2x2 & 3x3 determinant/inverse/Cramers Rule solver, AP/GP progression calculator, CPM forward/backward pass visualizer, and calculus trainer.',
  chapters: [...mathsT1to5, ...mathsT6to10],
};
