import { test, expect } from '@playwright/test';

test.describe('CampBase - Site QA Suite', () => {

  test('Homepage loads correctly with new H1 and category grid', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toContainText('Encuentra tu camping ideal en Andalucía');
    await expect(page.getByRole('heading', { name: 'Glamping de Lujo' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Camping El Sur Ronda/i })).toBeVisible();
  });

  test('pSEO Province Route (/andalucia/malaga) returns HTTP 200', async ({ page }) => {
    const response = await page.goto('/andalucia/malaga');
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toContainText('Campings y Glampings en Malaga');
    await expect(page.getByRole('link', { name: /Camping Cabopino Marbella/i })).toBeVisible();
  });

  test('pSEO Feature Route (/andalucia/malaga/campings-con-piscina) filters correctly', async ({ page }) => {
    const response = await page.goto('/andalucia/malaga/campings-con-piscina');
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toContainText('Piscina');
  });

  test('Camping Product detail page renders CTA, ad slots, and contextual links', async ({ page, isMobile }) => {
    // 1. Check camping with affiliate link
    const resp1 = await page.goto('/camping/camping-el-sur-ronda');
    expect(resp1?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Camping El Sur Ronda');

    // Check primary high-contrast CTA
    await expect(page.getByRole('link', { name: /Ver Disponibilidad y Precios/i }).first()).toBeVisible();

    // Check contextual inline affiliate link in text
    await expect(page.locator('p a[href*="pitchup.com"]')).toBeVisible();

    // Check in-content ad block
    await expect(page.locator('[data-testid="ad-block-incontent"]')).toBeVisible();

    if (isMobile) {
      await expect(page.locator('[data-testid="ad-block-mobile"]')).toBeVisible();
    } else {
      await expect(page.locator('[data-testid="ad-block-sidebar"]')).toBeVisible();
    }

    // 2. Check camping with missing affiliate link (Glamping Sierra de las Nieves) - Google AdSense fallback
    const resp2 = await page.goto('/camping/glamping-sierra-de-las-nieves');
    expect(resp2?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Glamping Sierra de las Nieves');

    if (!isMobile) {
      await expect(page.locator('[data-testid="adsense-fallback"]')).toBeVisible();
    }
  });

});
