import { test, expect } from '@playwright/test';
import { PortalPage } from '../pages/PortalPage';
import fs from 'node:fs';
import path from 'node:path';

const RENDERED_DIR = path.resolve(process.cwd(), 'artifacts', 'rendered');

test.beforeAll(() => {
  fs.mkdirSync(RENDERED_DIR, { recursive: true });
});

test.describe('UNITAR Semester 3 Turbo AI Study Studio E2E Suite', () => {
  test('1. Desktop (1440x900): Guided Home, 5 Folder Cards, Night Mode, 4-Tab Turbo Workspace, Inline Alerts, Labs, Flashcards & Quiz', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize({ width: 1440, height: 900 });
    const portal = new PortalPage(page);
    await portal.gotoHome();

    // Verify Guided Home "Continue Studying" hero CTA & all 5 Course Folders
    await expect(page.getByTestId('resume-lesson-btn')).toBeVisible();
    for (const subj of ['business', 'cso', 'database', 'english', 'maths'] as const) {
      await expect(page.getByTestId(`dashboard-subject-card-${subj}`)).toBeVisible();
    }

    // Capture Desktop Guided Home screenshot
    await page.screenshot({
      path: path.join(RENDERED_DIR, 'desktop-1440x900-dashboard.png'),
      fullPage: true,
    });

    // Test 1-Click Night Mode Toggle, capture Night Mode screenshot, and return to Studio Light
    await portal.toggleThemeBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.screenshot({
      path: path.join(RENDERED_DIR, 'desktop-1440x900-night-mode.png'),
    });
    await portal.toggleThemeBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Test Subject Folder View (CSO Curriculum Lesson List)
    await portal.selectSubjectFromDashboard('cso');
    await expect(page.getByTestId('subject-chapter-card-cso-ch1')).toBeVisible();

    // Test Command Palette search (Empty state + Matching hit state)
    await portal.openSearchBtn.click();
    await expect(portal.commandPaletteModal).toBeVisible();
    await portal.commandPaletteInput.fill('xyznonexistentkeyword999');
    await expect(page.getByTestId('command-palette-empty')).toBeVisible();
    await page.getByTestId('clear-search-btn').click();
    await portal.commandPaletteInput.fill('Cramer');
    await expect(page.getByTestId('command-palette-hit').first()).toBeVisible();
    await page.getByTestId('command-palette-hit').first().click();

    // Should now be inside Mathematics Topic 6 (Matrices) Turbo Lesson Workspace
    await expect(page.getByTestId('chapter-view')).toBeVisible();
    await expect(page.getByTestId('turbo-segmented-bar')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Matrices/i);

    // Verify inline highlighted keywords & integrated Dual-View Slide Alerts in Continuous Notes
    const highlightCount = await page.getByTestId('kw-highlight').count();
    expect(highlightCount).toBeGreaterThan(0);
    await expect(page.getByTestId('dual-view-alert').first()).toBeVisible();

    // Toggle Cram Mode and verify spotlight matrix appears
    await portal.toggleCramBtn.click();
    await expect(page.getByTestId('cram-mode-spotlight')).toBeVisible();

    await page.screenshot({
      path: path.join(RENDERED_DIR, 'desktop-1440x900-chapter-cram.png'),
    });

    // Check Collapsible Personal Scratchpad Drawer (Empty state -> Starter template)
    await page.getByTestId('tab-mynotes').click();
    await expect(page.getByTestId('empty-note-state')).toBeVisible();
    await page.getByTestId('seed-note-btn').click();
    await expect(page.getByTestId('personal-note-textarea')).not.toHaveValue('');

    // Switch to Tab 2: Flashcards
    await page.getByTestId('tab-flashcards').click();
    await expect(page.getByTestId('flashcard-deck')).toBeVisible();
    await page.getByTestId('flashcard-flip-btn').click();
    await page.getByTestId('flashcard-mastered-btn').click();

    // Switch to Tab 3: Quiz
    await page.getByTestId('tab-quiz').click();
    await page.getByTestId('quiz-option-0-0').click();
    await page.getByTestId('quiz-submit-btn').click();
    await expect(page.getByTestId('quiz-result-banner')).toBeVisible();

    // Switch to Tab 4: Cheat Sheet & Lab (MathsLab singular matrix error state + recovery)
    await page.getByTestId('tab-toolkit').click();
    await expect(page.getByTestId('keyword-matrix-view')).toBeVisible();
    await expect(page.getByTestId('maths-lab')).toBeVisible();
    await page.getByTestId('maths-load-singular').click();
    await expect(page.getByTestId('maths-singular-error')).toBeVisible();
    await page.getByTestId('maths-recover-btn').click();
    await expect(page.getByTestId('maths-singular-error')).toBeHidden();

    // Navigate to CSO Topic 5 and verify CsoLab 2's Complement calculator
    await portal.selectChapterFromSidebar('cso', 'cso-ch5');
    await page.getByTestId('tab-toolkit').click();
    await expect(page.getByTestId('cso-lab')).toBeVisible();
    await expect(page.getByTestId('cso-twos-output')).toContainText('11101110');

    // Navigate to Database Topic 7 and verify DatabaseLab KenariMart query sandbox
    await portal.selectChapterFromSidebar('database', 'db-ch7');
    await page.getByTestId('tab-toolkit').click();
    await expect(page.getByTestId('database-lab')).toBeVisible();
    await page.getByTestId('db-preset-likes').click();

    expect(errors).toEqual([]);
  });

  test('2. Mobile (390x844): Responsive Turbo navigation drawer, touch layout, and Lesson Workspace', async ({
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

    // Expand English Folder and select Topic 5 (How Conversations Work)
    await page.getByTestId('nav-subject-english').click();
    await mobileMenuBtn.click();
    await page.getByTestId('nav-chapter-eng-t5').click();
    await expect(page.getByTestId('chapter-view')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Conversations Work/i);

    await page.screenshot({
      path: path.join(RENDERED_DIR, 'mobile-390x844-chapter.png'),
    });
  });
});
