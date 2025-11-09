# Story 11.10: Playwright E2E Testing with Console Error Detection

**Status:** 📋 Ready for Implementation
**Type:** Quality Assurance / Testing Infrastructure
**Priority:** P2 - Medium
**Sprint:** TBD | **Points:** 5 (Medium-Large)
**Created:** November 9, 2025

---

## 🎯 Problem Statement

**Current Situation:**

The Agenseek application currently lacks automated end-to-end (E2E) testing, which means:

1. **No systematic bug detection** - Console errors and warnings may go unnoticed
2. **Manual testing burden** - Every route/feature must be tested manually after changes
3. **No regression protection** - Fixed bugs might reappear without detection
4. **Limited console monitoring** - No centralized way to catch JavaScript errors across the app
5. **No visual regression testing** - UI changes might break layouts unintentionally

**Impact:**
- Bugs discovered by users instead of automated tests
- Time wasted on manual testing
- Risk of shipping broken features
- Console errors accumulate unnoticed
- Reduced confidence in deployments

---

## 📖 User Story

**As a developer,**
**I want automated E2E tests that detect console errors and validate critical user flows,**
**So that bugs are caught early and the app maintains high quality without manual testing overhead.**

---

## ✅ Acceptance Criteria

### 1. Playwright Installation & Setup

**Given** Agenseek needs E2E testing
**When** setting up Playwright
**Then:**

- [ ] Install Playwright with TypeScript support
- [ ] Configure Playwright for React + Vite project
- [ ] Set up test directory structure: `tests/e2e/`
- [ ] Configure base URL for local development
- [ ] Set up multiple browsers (Chromium, Firefox, WebKit)
- [ ] Configure test timeout and retry settings
- [ ] Add Playwright to `.gitignore` (test-results, playwright-report)

**Installation:**

```bash
npm install -D @playwright/test
npx playwright install
```

**Configuration File:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

### 2. Console Error Detection System

**Given** need to catch console errors
**When** running E2E tests
**Then:**

- [ ] Capture all console messages (error, warn, log)
- [ ] Filter and categorize messages
- [ ] Fail tests when critical errors detected
- [ ] Generate detailed error reports
- [ ] Track error locations (file, line, stack trace)

**Console Listener Utility:**

Create `tests/e2e/utils/console-monitor.ts`:

```typescript
import { Page, ConsoleMessage } from '@playwright/test';

export type ConsoleLog = {
  type: 'error' | 'warning' | 'log' | 'info';
  message: string;
  location?: string;
  timestamp: Date;
  url: string;
};

export class ConsoleMonitor {
  private logs: ConsoleLog[] = [];

  constructor(private page: Page) {
    this.setupListeners();
  }

  private setupListeners() {
    this.page.on('console', (msg: ConsoleMessage) => {
      const type = msg.type();

      // Only capture errors, warnings, and important logs
      if (['error', 'warning'].includes(type)) {
        this.logs.push({
          type: type as 'error' | 'warning',
          message: msg.text(),
          location: msg.location().url,
          timestamp: new Date(),
          url: this.page.url(),
        });
      }
    });

    // Catch page errors
    this.page.on('pageerror', (error) => {
      this.logs.push({
        type: 'error',
        message: error.message,
        location: error.stack,
        timestamp: new Date(),
        url: this.page.url(),
      });
    });
  }

  getLogs() {
    return this.logs;
  }

  getErrors() {
    return this.logs.filter(log => log.type === 'error');
  }

  getWarnings() {
    return this.logs.filter(log => log.type === 'warning');
  }

  hasErrors() {
    return this.getErrors().length > 0;
  }

  clear() {
    this.logs = [];
  }

  generateReport() {
    const errors = this.getErrors();
    const warnings = this.getWarnings();

    return {
      summary: {
        totalErrors: errors.length,
        totalWarnings: warnings.length,
        totalIssues: this.logs.length,
      },
      errors,
      warnings,
    };
  }
}
```

---

### 3. Core Route Testing Suite

**Given** Agenseek has multiple routes
**When** testing navigation and functionality
**Then:**

Test all major routes and detect console errors:

- [ ] Home/Landing page
- [ ] Authentication flows (login, signup, password reset)
- [ ] Dashboard
- [ ] Guides list & individual guide reader
- [ ] Tasks page
- [ ] Profile page
- [ ] Settings page
- [ ] Admin panel (if accessible)
- [ ] Search functionality
- [ ] 404 error page

**Example Test:** `tests/e2e/routes.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { ConsoleMonitor } from './utils/console-monitor';

test.describe('Route Navigation & Console Errors', () => {
  let consoleMonitor: ConsoleMonitor;

  test.beforeEach(async ({ page }) => {
    consoleMonitor = new ConsoleMonitor(page);
  });

  test.afterEach(async () => {
    const report = consoleMonitor.generateReport();

    // Fail test if critical errors found
    if (report.summary.totalErrors > 0) {
      console.error('Console Errors Detected:', report.errors);
      throw new Error(`${report.summary.totalErrors} console error(s) found`);
    }

    // Warn about warnings (don't fail, just report)
    if (report.summary.totalWarnings > 0) {
      console.warn('Console Warnings:', report.warnings);
    }
  });

  test('Homepage loads without errors', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Agenseek/);

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('Dashboard loads without errors', async ({ page }) => {
    // Login first (if auth required)
    await loginHelper(page);

    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('לוח הבקרה');
    await page.waitForLoadState('networkidle');
  });

  test('Guides page loads without errors', async ({ page }) => {
    await page.goto('/guides');

    // Wait for guides to load
    await page.waitForSelector('[data-testid="guide-card"]', { timeout: 5000 });
    await page.waitForLoadState('networkidle');
  });

  test('Individual guide loads without errors', async ({ page }) => {
    await page.goto('/guides');

    // Click first guide
    const firstGuide = page.locator('[data-testid="guide-card"]').first();
    await firstGuide.click();

    // Wait for guide content
    await page.waitForSelector('[data-testid="guide-content"]');
    await page.waitForLoadState('networkidle');
  });

  test('Tasks page loads without errors', async ({ page }) => {
    await loginHelper(page);
    await page.goto('/tasks');
    await page.waitForLoadState('networkidle');
  });

  test('Profile page loads without errors', async ({ page }) => {
    await loginHelper(page);
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
  });

  test('Settings page loads without errors', async ({ page }) => {
    await loginHelper(page);
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
  });

  test('Search functionality works without errors', async ({ page }) => {
    await page.goto('/');

    // Open search (Ctrl+K)
    await page.keyboard.press('Control+K');

    // Wait for search modal
    await page.waitForSelector('[data-testid="search-modal"]');

    // Type search query
    await page.fill('input[type="search"]', 'AI');

    // Wait for results
    await page.waitForTimeout(500);
    await page.waitForLoadState('networkidle');
  });
});

// Helper function
async function loginHelper(page) {
  // Implement login flow or use stored auth state
  await page.goto('/auth/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}
```

---

### 4. Critical User Flow Testing

**Given** key user flows exist
**When** testing end-to-end functionality
**Then:**

Test complete user journeys:

- [ ] **Onboarding Flow**: New user completes onboarding wizard
- [ ] **Guide Reading Flow**: User finds, opens, and reads a guide
- [ ] **Task Management Flow**: User creates, updates, completes task
- [ ] **Search Flow**: User searches and finds content
- [ ] **Authentication Flow**: User logs in, logs out, resets password

**Example:** `tests/e2e/flows/guide-reading.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { ConsoleMonitor } from '../utils/console-monitor';

test.describe('Guide Reading Flow', () => {
  let consoleMonitor: ConsoleMonitor;

  test.beforeEach(async ({ page }) => {
    consoleMonitor = new ConsoleMonitor(page);
  });

  test('Complete guide reading flow', async ({ page }) => {
    // 1. Navigate to guides
    await page.goto('/guides');
    await page.waitForLoadState('networkidle');

    // 2. Search for a guide
    await page.fill('input[placeholder*="חפש"]', 'AI');
    await page.waitForTimeout(500);

    // 3. Click first result
    const firstGuide = page.locator('[data-testid="guide-card"]').first();
    await firstGuide.click();

    // 4. Verify guide loaded
    await expect(page.locator('[data-testid="guide-content"]')).toBeVisible();

    // 5. Test navigation (next/previous)
    const nextButton = page.locator('button[aria-label*="הבא"]');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');
    }

    // 6. Test bookmark (if logged in)
    const bookmarkButton = page.locator('button[aria-label*="מועדפים"]');
    if (await bookmarkButton.isVisible()) {
      await bookmarkButton.click();
      await page.waitForTimeout(300);
    }

    // 7. Close guide
    await page.keyboard.press('Escape');

    // Check for errors
    const report = consoleMonitor.generateReport();
    expect(report.summary.totalErrors).toBe(0);
  });
});
```

---

### 5. Visual Regression Testing

**Given** UI changes might break layouts
**When** running tests
**Then:**

- [ ] Take screenshots of key pages
- [ ] Compare with baseline screenshots
- [ ] Detect visual differences
- [ ] Generate visual diff reports

**Example:** `tests/e2e/visual.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('Dashboard visual snapshot', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Take screenshot and compare
    await expect(page).toHaveScreenshot('dashboard.png', {
      fullPage: true,
      maxDiffPixels: 100, // Allow small differences
    });
  });

  test('Guide reader visual snapshot', async ({ page }) => {
    await page.goto('/guides/test-guide');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('guide-reader.png', {
      fullPage: true,
    });
  });
});
```

---

### 6. Error Report Generation

**Given** tests complete
**When** console errors detected
**Then:**

- [ ] Generate detailed HTML report
- [ ] Categorize errors by page/route
- [ ] Include screenshots of error states
- [ ] Export to JSON for CI/CD integration
- [ ] Send notifications (optional)

**Report Generator:** `tests/e2e/utils/report-generator.ts`

```typescript
import fs from 'fs';
import path from 'path';

export class ReportGenerator {
  static generateHTML(allReports: any[]) {
    const totalErrors = allReports.reduce((sum, r) => sum + r.summary.totalErrors, 0);
    const totalWarnings = allReports.reduce((sum, r) => sum + r.summary.totalWarnings, 0);

    const html = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Agenseek E2E Test Report</title>
  <style>
    body { font-family: 'Varela Round', Arial, sans-serif; padding: 20px; background: #f5f5f5; }
    .summary { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .error { background: #fee; border-right: 4px solid #c00; padding: 10px; margin: 10px 0; }
    .warning { background: #ffc; border-right: 4px solid #fa0; padding: 10px; margin: 10px 0; }
    .success { color: #0a0; font-weight: bold; }
    .fail { color: #c00; font-weight: bold; }
  </style>
</head>
<body>
  <h1>דוח בדיקות E2E - Agenseek</h1>
  <div class="summary">
    <h2>סיכום</h2>
    <p>סה"כ שגיאות: <span class="${totalErrors > 0 ? 'fail' : 'success'}">${totalErrors}</span></p>
    <p>סה"כ אזהרות: <span class="${totalWarnings > 0 ? 'fail' : 'success'}">${totalWarnings}</span></p>
    <p>תאריך: ${new Date().toLocaleString('he-IL')}</p>
  </div>

  ${allReports.map(report => `
    <div class="report-section">
      <h3>${report.page}</h3>
      ${report.errors.map(err => `
        <div class="error">
          <strong>שגיאה:</strong> ${err.message}<br>
          <small>URL: ${err.url}</small><br>
          <small>זמן: ${new Date(err.timestamp).toLocaleTimeString('he-IL')}</small>
        </div>
      `).join('')}
      ${report.warnings.map(warn => `
        <div class="warning">
          <strong>אזהרה:</strong> ${warn.message}<br>
          <small>URL: ${warn.url}</small>
        </div>
      `).join('')}
    </div>
  `).join('')}
</body>
</html>
    `;

    const reportPath = path.join(process.cwd(), 'test-results', 'console-report.html');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, html, 'utf-8');

    console.log(`Report generated: ${reportPath}`);
  }

  static generateJSON(allReports: any[]) {
    const jsonPath = path.join(process.cwd(), 'test-results', 'console-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(allReports, null, 2), 'utf-8');
    console.log(`JSON report: ${jsonPath}`);
  }
}
```

---

### 7. NPM Scripts & CI Integration

**Given** tests need to be runnable easily
**When** setting up automation
**Then:**

- [ ] Add test scripts to `package.json`
- [ ] Set up pre-commit hooks (optional)
- [ ] Configure CI/CD pipeline (GitHub Actions)
- [ ] Run tests on pull requests
- [ ] Fail builds on critical errors

**package.json scripts:**

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:report": "playwright show-report"
  }
}
```

**GitHub Actions:** `.github/workflows/e2e-tests.yml`

```yaml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

      - name: Upload console error report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: console-report
          path: test-results/console-report.html
```

---

### 8. Documentation

**Given** team needs to use Playwright
**When** documenting testing approach
**Then:**

- [ ] Create `docs/testing-guide.md`
- [ ] Document how to run tests
- [ ] Explain console monitoring
- [ ] Add troubleshooting section
- [ ] Include CI/CD setup instructions

---

## 🔧 Technical Implementation

### Directory Structure

```
tests/
└── e2e/
    ├── utils/
    │   ├── console-monitor.ts
    │   ├── report-generator.ts
    │   └── auth-helpers.ts
    ├── flows/
    │   ├── onboarding.spec.ts
    │   ├── guide-reading.spec.ts
    │   └── task-management.spec.ts
    ├── routes.spec.ts
    ├── visual.spec.ts
    └── console-errors.spec.ts
```

### Files to Create

1. **Playwright Config**: `playwright.config.ts`
2. **Console Monitor**: `tests/e2e/utils/console-monitor.ts`
3. **Report Generator**: `tests/e2e/utils/report-generator.ts`
4. **Route Tests**: `tests/e2e/routes.spec.ts`
5. **Flow Tests**: `tests/e2e/flows/*.spec.ts`
6. **Visual Tests**: `tests/e2e/visual.spec.ts`
7. **CI Config**: `.github/workflows/e2e-tests.yml`
8. **Documentation**: `docs/testing-guide.md`

### Dependencies

```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

---

## 🧪 Testing Checklist

### Playwright Setup
- [ ] Playwright installed successfully
- [ ] Config file created and working
- [ ] Test directory structure set up
- [ ] Browsers installed (Chromium, Firefox, WebKit)
- [ ] Base URL configured correctly
- [ ] Dev server starts automatically

### Console Monitoring
- [ ] Console errors captured
- [ ] Console warnings captured
- [ ] Page errors caught
- [ ] Reports generated correctly
- [ ] Tests fail on critical errors
- [ ] Warnings logged but don't fail tests

### Route Testing
- [ ] All major routes tested
- [ ] Authentication flows work
- [ ] No console errors on any route
- [ ] Loading states handled
- [ ] Error pages tested

### User Flows
- [ ] Onboarding flow tested
- [ ] Guide reading flow tested
- [ ] Task management tested
- [ ] Search flow tested
- [ ] All flows complete without errors

### Visual Regression
- [ ] Baseline screenshots captured
- [ ] Visual diffs detected correctly
- [ ] Reports generated

### CI/CD Integration
- [ ] GitHub Actions workflow created
- [ ] Tests run on push/PR
- [ ] Reports uploaded as artifacts
- [ ] Build fails on errors

### Documentation
- [ ] Testing guide created
- [ ] How-to instructions clear
- [ ] Troubleshooting documented
- [ ] Examples provided

---

## ✅ Definition of Done

### Implementation Complete
- [ ] Playwright installed and configured
- [ ] Console monitoring system working
- [ ] All routes tested
- [ ] Key user flows tested
- [ ] Visual regression tests set up
- [ ] Reports generated (HTML + JSON)

### CI/CD Integration
- [ ] GitHub Actions workflow active
- [ ] Tests run automatically on PR
- [ ] Reports accessible in CI
- [ ] Build protection enabled

### Documentation
- [ ] Testing guide written
- [ ] Team trained on running tests
- [ ] README updated with test commands

### Quality Gates
- [ ] Zero console errors on critical routes
- [ ] All tests passing
- [ ] Reports reviewed and clean

---

## 📊 Success Metrics

**Test Coverage:**
- All major routes covered (10+ routes)
- Key user flows tested (5+ flows)
- Console errors monitored on every test

**Error Detection:**
- Console errors caught before deployment
- Regression bugs prevented
- Visual regressions detected

**Developer Experience:**
- Tests run in < 5 minutes
- Clear error reports
- Easy to debug failures
- CI/CD integrated smoothly

---

## 🚀 Implementation Plan

### Phase 1: Setup & Basic Tests (2 hours)
1. Install Playwright and dependencies
2. Create config file
3. Set up console monitor utility
4. Write basic route tests (5 routes)

### Phase 2: Advanced Testing (2 hours)
1. Create user flow tests
2. Add visual regression tests
3. Build report generator
4. Test all major routes

### Phase 3: CI/CD & Documentation (1 hour)
1. Set up GitHub Actions
2. Write testing guide
3. Test CI pipeline
4. Final polish and documentation

**Total Estimated Time:** 5 hours (5 points)

---

## 🔗 Related Stories & Dependencies

### Depends On:
- None (standalone infrastructure)

### Enables:
- Future automated testing stories
- Regression testing for all Epic 11 fixes
- Continuous quality monitoring

### Related:
- Story 11.1-11.9 - Can test fixes made in those stories
- Any future bug fix stories can include E2E tests

---

## 📝 Notes

- **Supabase Auth**: May need to handle authentication state for protected routes
- **Test Data**: Consider creating test users/content in test environment
- **Performance**: Tests should run fast enough for CI (target < 5 min total)
- **Maintenance**: Screenshots/baselines need occasional updates
- **Cross-browser**: Focus on Chromium first, then expand to Firefox/WebKit

---

**Created by:** Ben Akiva
**Date:** November 9, 2025
**Story Type:** Quality Assurance / Testing Infrastructure (Epic 11)
**Estimated Effort:** 5 story points (~5 hours)

---

*Ensuring Agenseek quality through automated E2E testing and console error detection!*

