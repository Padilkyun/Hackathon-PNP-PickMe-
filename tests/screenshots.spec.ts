import { test, expect, devices } from '@playwright/test';

const routes = [
  { path: '/', name: 'web-01-landing' },
  { path: '/lapor', name: 'web-02-submit' },
  { path: '/admin', name: 'web-03-dashboard' },
  { path: '/admin/reports/rpt-001', name: 'web-04-detail' },
  { path: '/admin/integrity', name: 'web-05-integrity' },
  { path: '/admin/chatbot', name: 'web-06-chatbot' },
  { path: '/about', name: 'web-07-about' },
  { path: '/solution', name: 'web-08-solution' },
  { path: '/flow', name: 'web-09-flow' },
  { path: '/tech', name: 'web-10-tech' },
  { path: '/impact', name: 'web-11-impact' },
  { path: '/contact', name: 'web-12-contact' },
];

test.describe('Web Screenshots', () => {
  for (const route of routes) {
    test(`Screenshot: ${route.name}`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `docs/screenshots/${route.name}.png`,
        fullPage: true,
      });
    });
  }
});

const mobileRoutes = [
  { path: '/', name: 'mob-01-home' },
  { path: '/lapor', name: 'mob-02-submit' },
  { path: '/admin', name: 'mob-03-dashboard' },
];

test.describe.configure({ retries: 0 });
test.use({ ...devices['Pixel 5'] });

test.describe('Mobile Screenshots', () => {
  for (const route of mobileRoutes) {
    test(`Mobile screenshot: ${route.name}`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `docs/screenshots/${route.name}.png`,
        fullPage: true,
      });
    });
  }
});

const viewports = [
  { width: 1920, height: 1080, suffix: 'desktop-hd' },
  { width: 1366, height: 768, suffix: 'desktop-hd-ready' },
  { width: 768, height: 1024, suffix: 'tablet-portrait' },
  { width: 1024, height: 768, suffix: 'tablet-landscape' },
  { width: 375, height: 667, suffix: 'mobile-se' },
  { width: 414, height: 896, suffix: 'mobile-plus' },
];

test.describe('Viewport Variations', () => {
  for (const vp of viewports) {
    test(`Landing page @ ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
      await page.screenshot({
        path: `docs/screenshots/web-01-landing-${vp.suffix}.png`,
        fullPage: true,
      });
    });
  }
});