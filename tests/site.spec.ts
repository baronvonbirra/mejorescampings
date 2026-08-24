import { test, expect } from '@playwright/test';

test.describe('CampBase - Site QA Suite', () => {

  test('Homepage loads correctly with new H1 and category grid', async ({ page }) => {
    const response = await page.goto('./');
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toContainText('Encuentra tu camping ideal en Andalucía');
    await expect(page.getByRole('heading', { name: 'Glamping de Lujo' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Camping el Sur/i })).toBeVisible();
  });

  test('pSEO Province Route (/andalucia/malaga/) returns HTTP 200', async ({ page }) => {
    const response = await page.goto('andalucia/malaga/');
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toContainText('Campings y Glampings en Malaga');
    await expect(page.getByRole('link', { name: /Camping Cabopino/i })).toBeVisible();
  });

  test('pSEO Feature Route (/andalucia/malaga/campings-con-piscina/) filters correctly', async ({ page }) => {
    const response = await page.goto('andalucia/malaga/campings-con-piscina/');
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toContainText('Piscina');
  });

  test('Camping Product detail page renders CTA, ad slots, contextual links, JSON-LD, FAQs and Internal Links', async ({ page, isMobile }) => {
    // 1. Check camping with affiliate link
    const resp1 = await page.goto('camping/camping-el-sur/');
    expect(resp1?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Camping el Sur');

    // Check primary high-contrast CTA
    await expect(page.getByRole('link', { name: /Ver Disponibilidad y Precios/i }).first()).toBeVisible();

    // Check contextual inline affiliate link in text
    await expect(page.locator('p a[href*="pitchup.com"]')).toBeVisible();

    // Check JSON-LD structured data in head
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allInnerTexts();
    expect(jsonLdScripts.some(s => s.includes('"@type":"Campground"'))).toBe(true);
    expect(jsonLdScripts.some(s => s.includes('"@type":"BreadcrumbList"'))).toBe(true);
    expect(jsonLdScripts.some(s => s.includes('"@type":"FAQPage"'))).toBe(true);

    // Check FAQ section rendered
    await expect(page.getByRole('heading', { name: /Preguntas Frecuentes sobre Camping el Sur/i })).toBeVisible();

    // Check internal linking blocks
    await expect(page.getByRole('link', { name: /Todos los campings en Provincia de Málaga/i })).toBeVisible();

    // Check in-content ad block
    await expect(page.locator('[data-testid="ad-block-incontent"]')).toBeVisible();

    if (isMobile) {
      await expect(page.locator('[data-testid="ad-block-mobile"]')).toBeVisible();
    } else {
      await expect(page.locator('[data-testid="ad-block-sidebar"]')).toBeVisible();
    }

    // 2. Check camping with missing affiliate link (Glamping Sierra de las Nieves) - Google AdSense fallback
    const resp2 = await page.goto('camping/glamping-sierra-de-las-nieves/');
    expect(resp2?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Glamping Sierra de las Nieves');

    if (!isMobile) {
      await expect(page.locator('[data-testid="adsense-fallback"]')).toBeVisible();
    }
  });

  test('404 page loads correctly for non-existent route', async ({ page }) => {
    const response = await page.goto('404.html');
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toContainText('404 - Página no encontrada');
  });

  test('Robots.txt is served and contains AI crawler permissions', async ({ page }) => {
    const response = await page.goto('robots.txt');
    expect(response?.status()).toBe(200);
    const content = await response?.text();
    expect(content).toContain('GPTBot');
    expect(content).toContain('PerplexityBot');
    expect(content).toContain('ClaudeBot');
  });

});
