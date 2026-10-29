import {test, expect} from '@playwright/test';

// Canonical source: docs/JMC_GLOBAL_WIDTH_BIBLE_V1.md.
// This test checks computed browser geometry, not just CSS declarations.
const viewports = [1920, 1440, 768, 390, 320] as const;
const paths = ['/', '/vehicles/vigus', '/vehicles/grand-avenue', '/vehicles/grand-avenue-pro'] as const;

test.describe('Global Width Bible — approved layout contracts', () => {
  for (const width of viewports) {
    test(`shared layout and hero geometry at ${width}px`, async ({page}) => {
      await page.setViewportSize({width, height:900});
      await page.goto('/', {waitUntil:'domcontentloaded'});
      const metrics = await page.evaluate(() => {
        const root = getComputedStyle(document.documentElement);
        const container = document.querySelector('.hero-content.container')!;
        const hero = document.querySelector('.hero.hero-editorial')!;
        const rect = container.getBoundingClientRect();
        return {
          max:root.getPropertyValue('--jmc-content-max').trim(),
          readable:root.getPropertyValue('--jmc-readable-max').trim(),
          gutter:root.getPropertyValue('--jmc-page-gutter').trim(),
          heroDesktop:root.getPropertyValue('--jmc-hero-height-desktop').trim(),
          heroMobile:root.getPropertyValue('--jmc-hero-height-mobile').trim(),
          contentX:rect.x, contentWidth:rect.width,
          heroHeight:hero.getBoundingClientRect().height,
          viewport:document.documentElement.clientWidth,
          scrollWidth:document.documentElement.scrollWidth
        };
      });
      const gutter = width <= 700 ? 16 : 24;
      const expectedContentWidth = Math.min(1680, width - 2 * gutter);
      expect(metrics.max).toBe('1680px');
      expect(metrics.readable).toBe('760px');
      expect(metrics.gutter).toBe(`${gutter}px`);
      expect(metrics.heroDesktop).toBe('748px');
      expect(metrics.heroMobile).toBe('650px');
      expect(metrics.contentWidth).toBeCloseTo(expectedContentWidth, 0);
      expect(metrics.contentX).toBeCloseTo((width - expectedContentWidth) / 2, 0);
      expect(metrics.heroHeight).toBe(width <= 700 ? 650 : 748);
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewport + 2);
    });
  }

  for (const path of paths) {
    test(`${path} retains functional navigation and no overflow on narrow and wide screens`, async ({page}) => {
      for (const width of [1920, 390, 320]) {
        await page.setViewportSize({width, height:850});
        const errors:string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        const response = await page.goto(path, {waitUntil:'domcontentloaded'});
        expect(response?.status()).toBe(200);
        await expect(page.locator('.jmc-header')).toBeVisible();
        await expect(page.locator('.jmc-footer')).toHaveCount(1);
        await expect(page.locator('.jmc-header-drive')).toHaveCount(0);
        const dimensions = await page.evaluate(() => ({
          viewport:document.documentElement.clientWidth,
          scroll:document.documentElement.scrollWidth
        }));
        expect(dimensions.scroll, `${path} at ${width}px overflows`).toBeLessThanOrEqual(dimensions.viewport + 2);
        expect(errors, `${path} at ${width}px browser exceptions`).toEqual([]);
        if (path !== '/') {
          const cta = page.locator('.model-local-nav a[href="/test-drive"], .pro-page-nav a[href="/test-drive"]');
          await expect(cta.first()).toBeAttached();
        }
      }
    });
  }
});
