# UNITAR Semester 3 — Coursework & Exam Portal (`studycuh`)

An interactive **Warm Minimalist Editorial** study, problem-solving, and exam-simulation web application built for **UNITAR International University — Foundation in Information Technology (Semester 3)**.

Every chapter, table, formula, worked example, keyword trigger, and quiz question is mapped strictly to the official Semester 3 lecture slides and notes across **5 subjects (48 chapters/topics, 1,346 pages and slides)**.

---

## 1. Syllabus Coverage (5 Subjects • 48 Chapters)

| Subject Code | Subject Title | Scope | Volume | Interactive Workbench Lab |
| :--- | :--- | :--- | :--- | :--- |
| **`BUSINESS`** | Fundamentals of Business & Management | Chapters 1 – 10 | 10 PDFs (369 pages) | Accounting Equation, Income Statement & Inventory Reorder Lab |
| **`ITCF0013`** | Computer System Organization (CSO) | Chapters / Topics 1 – 9 | 9 PDFs + 2 PPTXs (435 slides) | Base 2/8/10/16 & 2's Complement, Boolean Truth Table & 6-Stage Pipeline Lab |
| **`ITIF0023`** | Fundamental of Database & Information Systems | Chapters 1 – 5, Topics 6 – 9 (+ Topic 10 SQL bridge) | 9 PPTXs (356 slides) | MS Access Query Criteria Sandbox (`KenariMart.accdb`) & 1NF–3NF Inspector |
| **`SFQF0233`** | English for Communication | Topics 1 – 10 | 10 PDFs (40 pages) | Communication Types, Grice's Maxims / T.R.A.C. & 5-Step Report Analyzer |
| **`ITNF0024E`** | Fundamentals of Mathematics | Topics 1 – 10 | 1 PPT + 7 PPTXs + 9 PDFs (146 pages/slides) | $2\times 2$ Matrix Inverse & Cramer's Rule, AP/GP Series & CPM Network Float Lab |

---

## 2. Core Study & Exam Features

### Highlighted Subject Keywords & Cram Mode (`648+` Indexed Keywords)
- **Inline Keyword Highlighting**: Automatically highlights exam-critical keywords inside chapter notes, bullet lists, and comparison tables using each subject's semantic muted pastel badge.
- **One-Click Cram Mode (`C` key)**: Spotlights a rapid `Exam Keyword -> Trigger Phrase -> Immediate Exam Answer / Rule` matrix at the top of any chapter.
- **Full Subject Keyword Bank**: Dedicated subject-wide keyword dictionary tab inside every subject hub.

### Dual-View Source Fidelity (`74` Verified Slide Alerts & Worked Solutions)
- Displays the **Original UNITAR Slide / PDF Text** side-by-side with the **Verified Correction / Worked Solution** and an **Exam Strategy** note:
  - **Mathematics (`ITNF0024E`)**: Covers all lecturer slide/PDF typos (including Topic 1 Slide 8 absolute value & Slide 14 slope denominator, Topic 2 Page 2 $x^3$ vs $x^2$ long division & Page 14 over-cancelled $(x+3)$, Topic 4 Page 10 $-x^{1/2}$, Topic 6 Page 5 missing minus sign on $c$ in the $2\times 2$ inverse formula, Topic 7 Page 5 Simplex slack/surplus, and Topic 8 Page 7 $\min(3,3)=0$ & dual critical paths $A\to B\to D\to F$ and $A\to C\to E\to F$).
  - **CSO (`ITCF0013`)**: Covers Chapter 3 Slide 27 truncated DRAM refresh note, Slide 29 SRAM volatility note contradiction, and step-by-step worked answers for all unanswered deck exercises (Ch. 2 Ex. 4, Ch. 3 Slides 19/32/42/45, and Ch. 6 Slide 38 truth table & logic circuit).
  - **Database (`ITIF0023`)**: Covers Chapter 2 `MIS` vs. Chapter 3 `IRS` naming alignment, Chapter 5 `"Supper key"` typo, MS Access version differences, and the missing Topic 10 SQL bridge reference across Topics 6–9.
  - **Business (`BUSINESS`)**: Covers Chapter 5 Page 43 Sales Promotion/Personal Selling duplication, Chapter 9 Page 18 External Recruitment header typo, and Chapter 9 Page 38 Grievance Procedure/Industrial Court duplication.

### Active Recall & Exam Simulation
- **Physics-Driven Swipeable Flashcards**: Built with `motion/react` (`useMotionValue`, `useTransform`, and combined offset/velocity swipe grading) with `All Cards` and `Unmastered` filters.
- **Chapter Practice Quizzes & Randomized Subject Mock Exams**: Instant step-by-step UNITAR slide explanations, source citations, configurable question counts (`10`, `15`, `20`, or `All`), and score history tracking.
- **Personal Study Persistence**: `localStorage` persistence for completed chapters, bookmarked chapters, drag-to-reorder **Priority Revision Queue**, per-chapter scratchpad notes, and JSON backup export/import.

---

## 3. Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Open Global Command Palette Search across all 48 chapters, keywords, and slide alerts |
| `C` | Toggle **Keyword Pattern / Cram Mode** spotlight |
| `Esc` | Close active modal / Command Palette |
| `Enter` / `Space` | Flip active flashcard or activate focused card |

---

## 4. Tech Stack & Project Structure

- **Framework**: React 18 + TypeScript 5 + Vite 6
- **Animation System**: `motion/react` (`motion-foundations` & `motion-advanced` tokens, springs, `Reorder.Group`, `useAnimate`, SVG `pathLength` & `strokeDashoffset`, `prefers-reduced-motion` safety)
- **Math Rendering**: `KaTeX`
- **E2E Verification**: `@playwright/test` Page Object Model suite (`1440x900` Desktop & `390x844` Mobile)

```text
├── src/
│   ├── components/       # Editorial UI shell, ChapterView, SubjectDashboard, QuizEngine, FlashcardDeck
│   ├── context/          # Immutable StudyProgressContext with localStorage & JSON export/import
│   ├── data/             # Exhaustive syllabus modules for Business, CSO, Database, English & Maths
│   ├── hooks/            # Accessibility & reduced-motion hooks
│   ├── labs/             # 5 interactive subject calculators & simulators
│   ├── lib/              # Motion tokens, spring presets & runtime hardware/reduced-motion config
│   ├── styles/           # Warm Minimalist Editorial design system (editorial.css)
│   └── types/            # Strict readonly TypeScript domain models
├── tests/
│   ├── e2e/              # Playwright E2E test suite (portal.spec.ts)
│   └── pages/            # Playwright Page Object Model (PortalPage.ts)
├── index.html
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 5. Getting Started

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
Opens at `http://localhost:4173`.

### Typecheck & Build for Production
```bash
npm run typecheck
npm run build
```

### Run Playwright E2E Tests
```bash
npm run test:e2e
```
