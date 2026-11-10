import { test, expect } from '@playwright/test';
import { PortalPage } from '../pages/PortalPage';
import fs from 'node:fs';
import path from 'node:path';

const RENDERED_DIR = path.resolve(process.cwd(), 'artifacts', 'rendered');

test.beforeAll(() => {
  fs.mkdirSync(RENDERED_DIR, { recursive: true });
});

test.describe('UNITAR Semester 3 Study & Exam Portal E2E Suite', () => {
  test('1. Desktop (1440x900): Renders all 5 subjects, highlighted keywords, Cram Mode, Dual-View alerts, Labs, Quiz & Flashcards', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize({ width: 1440, height: 900 });
    const portal = new PortalPage(page);
    await portal.gotoHome();

    // Verify all 5 subject cards are visible on the dashboard
    for (const subj of ['business', 'cso', 'database', 'english', 'maths'] as const) {
      await expect(page.getByTestId(`dashboard-subject-card-${subj}`)).toBeVisible();
    }

    // Capture Desktop Dashboard screenshot for rendered finish gate
    await page.screenshot({
      path: path.join(RENDERED_DIR, 'desktop-1440x900-dashboard.png'),
      fullPage: true,
    });

    // Test Command Palette search (Empty state + Matching hit state)
    await portal.openSearchBtn.click();
    await expect(portal.commandPaletteModal).toBeVisible();
    await portal.commandPaletteInput.fill('xyznonexistentkeyword999');
    await expect(page.getByTestId('command-palette-empty')).toBeVisible();
    await page.getByTestId('clear-search-btn').click();
    await portal.commandPaletteInput.fill('Cramer');
    await expect(page.getByTestId('command-palette-hit').first()).toBeVisible();
    await page.getByTestId('command-palette-hit').first().click();

    // Should now be inside Mathematics Topic 6 (Matrices)
    await expect(page.getByTestId('chapter-view')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Matrices/i);

    // Verify inline highlighted keywords are rendered
    const highlightCount = await page.getByTestId('kw-highlight').count();
    expect(highlightCount).toBeGreaterThan(0);

    // Toggle Cram Mode and verify spotlight matrix appears
    await portal.toggleCramBtn.click();
    await expect(page.getByTestId('cram-mode-spotlight')).toBeVisible();

    await page.screenshot({
      path: path.join(RENDERED_DIR, 'desktop-1440x900-chapter-cram.png'),
    });

    // Check Examples & Dual-View Slide Alerts tab (Topic 6 Page 5 -c inverse typo alert)
    await page.getByTestId('tab-examples').click();
    await expect(page.getByTestId('dual-view-alert').first()).toBeVisible();

    // Check Interactive Subject Lab (MathsLab singular matrix error state + recovery)
    await page.getByTestId('tab-lab').click();
    await expect(page.getByTestId('maths-lab')).toBeVisible();
    await page.getByTestId('maths-load-singular').click();
    await expect(page.getByTestId('maths-singular-error')).toBeVisible();
    await page.getByTestId('maths-recover-btn').click();
    await expect(page.getByTestId('maths-singular-error')).toBeHidden();

    // Check Flashcards & Chapter Quiz tab
    await page.getByTestId('tab-practice').click();
    await expect(page.getByTestId('flashcard-deck')).toBeVisible();
    await page.getByTestId('flashcard-flip-btn').click();
    await page.getByTestId('flashcard-mastered-btn').click();

    // Answer Q1 and submit Chapter Quiz
    await page.getByTestId('quiz-option-0-0').click();
    await page.getByTestId('quiz-submit-btn').click();
    await expect(page.getByTestId('quiz-result-banner')).toBeVisible();

    // Check Personal Notes (Empty state -> Starter template)
    await page.getByTestId('tab-mynotes').click();
    await expect(page.getByTestId('empty-note-state')).toBeVisible();
    await page.getByTestId('seed-note-btn').click();
    await expect(page.getByTestId('personal-note-textarea')).not.toHaveValue('');

    // Navigate to CSO Topic 5 and verify CsoLab 2's Complement calculator
    await portal.selectChapterFromSidebar('cso-ch5');
    await page.getByTestId('tab-lab').click();
    await expect(page.getByTestId('cso-lab')).toBeVisible();
    await expect(page.getByTestId('cso-twos-output')).toContainText('11101110');

    // Navigate to Database Topic 7 and verify DatabaseLab KenariMart query sandbox
    await portal.selectChapterFromSidebar('db-ch7');
    await page.getByTestId('tab-lab').click();
    await expect(page.getByTestId('database-lab')).toBeVisible();
    await page.getByTestId('db-preset-likes').click();

    expect(errors).toEqual([]);
  });

  test('2. Mobile (390x844): Responsive navigation drawer, touch layout, and all 5 subject hubs', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const portal = new PortalPage(page);
    await portal.gotoHome();

    await page.screenshot({
      path: path.join(RENDERED_DIR, 'mobile-390x844-dashboard.png'),
    });

    // Open mobile navigation drawer
    const mobileMenuBtn = page.getByTestId('mobile-menu-btn');
    await expect(mobileMenuBtn).toBeVisible();
    await mobileMenuBtn.click();

    // Select English Topic 5 (How Conversations Work)
    await page.getByTestId('nav-chapter-eng-t5').click();
    await expect(page.getByTestId('chapter-view')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Conversations Work/i);

    await page.screenshot({
      path: path.join(RENDERED_DIR, 'mobile-390x844-chapter.png'),
    });
  });
});
