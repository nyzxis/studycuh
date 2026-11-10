import type { Page, Locator } from '@playwright/test';

export class PortalPage {
  readonly page: Page;
  readonly mainDashboard: Locator;
  readonly sidebar: Locator;
  readonly openSearchBtn: Locator;
  readonly toggleKeywordsBtn: Locator;
  readonly toggleCramBtn: Locator;
  readonly toggleThemeBtn: Locator;
  readonly commandPaletteModal: Locator;
  readonly commandPaletteInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainDashboard = page.getByTestId('main-dashboard');
    this.sidebar = page.getByTestId('portal-sidebar');
    this.openSearchBtn = page.getByTestId('open-search-btn');
    this.toggleKeywordsBtn = page.getByTestId('toggle-keywords-btn');
    this.toggleCramBtn = page.getByTestId('toggle-cram-btn');
    this.toggleThemeBtn = page.getByTestId('toggle-theme-btn');
    this.commandPaletteModal = page.getByTestId('command-palette-modal');
    this.commandPaletteInput = page.getByTestId('command-palette-input');
  }

  async gotoHome() {
    await this.page.goto('/');
    await this.mainDashboard.waitFor({ state: 'visible' });
  }

  async selectSubjectFromDashboard(subjectId: 'business' | 'cso' | 'database' | 'english' | 'maths') {
    await this.page.getByTestId(`dashboard-subject-card-${subjectId}`).click();
    await this.page.getByTestId(`subject-hub-${subjectId}`).waitFor({ state: 'visible' });
  }

  async selectChapterFromSidebar(
    subjectId: 'business' | 'cso' | 'database' | 'english' | 'maths',
    chapterId: string
  ) {
    const chapterBtn = this.page.getByTestId(`nav-chapter-${chapterId}`);
    if (!(await chapterBtn.isVisible())) {
      await this.page.getByTestId(`nav-subject-${subjectId}`).click();
    }
    await chapterBtn.click();
    await this.page.getByTestId('chapter-view').waitFor({ state: 'visible' });
  }
}
