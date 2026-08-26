import { test, expect } from '@playwright/test';

test.describe('MejoresCampings - Site QA Suite', () => {

  test('Homepage loads correctly with new H1 and category grid', async ({ page }) => {
    const response = await page.goto('./');
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toContainText('Encuentra tu camping ideal en Andalucía');
    await expect(page.getByRole('heading', { name: 'Glamping de Lujo' })).toBeVisible();
    await expect(page.getByRole('link', { name: /El Sur/i })).toBeVisible();
  });

  test('Camping cards are fully clickable and navigate to detail page', async ({ page }) => {
    await page.goto('./');

    // Find first camping card stretched link
    const cardLink = page.locator('a[aria-label*="Ver detalles de"]').first();
    await expect(cardLink).toBeVisible();

    // Click on the card container/stretched link
    await cardLink.click();

    // Assert navigation to camping detail page
    await expect(page).toHaveURL(/\/camping\//);
    await expect(page.locator('h1')).toBeVisible();
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

  test('Camping Product detail page renders atomic components, CTA, weather, OG tags, FAQs and Environment Block', async ({ page, isMobile }) => {
    const resp1 = await page.goto('camping/el-sur/');
    expect(resp1?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('El Sur');

    // Check primary CTA or web official link / Reservar button
    await expect(page.locator('a, button').filter({ hasText: /Reservar/i }).first()).toBeVisible();

    // Check OpenGraph image meta tag
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();

    // Check Open-Meteo weather widget
    await expect(page.locator('[data-testid="weather-widget"]')).toBeVisible();

    // Check Environment Block
    await expect(page.locator('[data-testid="environment-block"]')).toBeVisible();

    // Check Travelpayouts Affiliate elements (Rentacar, Klook cards, Radical Storage)
    await expect(page.locator('a[href*="getrentacar.tpx.lv"]').first()).toBeVisible();
    await expect(page.locator('a[href*="klook.tpx.lv"]').first()).toBeVisible();
    await expect(page.locator('a[href*="radicalstorage.tpx.lv"]').first()).toBeVisible();

    // Check JSON-LD structured data in head
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allInnerTexts();
    expect(jsonLdScripts.some(s => s.includes('"@type":"Campground"'))).toBe(true);

    // Check FAQ section rendered
    await expect(page.getByRole('heading', { name: /Preguntas Frecuentes sobre El Sur/i })).toBeVisible();

    // Check in-content ad block
    await expect(page.locator('[data-testid="ad-block-incontent"]')).toBeVisible();

    if (isMobile) {
      await expect(page.locator('[data-testid="ad-block-mobile"]')).toBeHidden(); // Sticky bottom bar takes over
    } else {
      await expect(page.locator('[data-testid="ad-block-sidebar"]')).toBeVisible();
    }
  });

  test('Province page renders BikesBooking and Klook affiliate sections', async ({ page }) => {
    await page.goto('andalucia/malaga/');
    await expect(page.locator('a[href*="bikesbooking.tpx.lv"]').first()).toBeVisible();
    await expect(page.locator('a[href*="klook.tpx.lv"]').first()).toBeVisible();
  });

  test('404 page loads correctly for non-existent route', async ({ page }) => {
    const response = await page.goto('404.html');
    expect([200, 404]).toContain(response?.status());

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

  test('Dynamic XML Sitemaps are generated, valid, and contain expected URLs', async ({ page }) => {
    const respIndex = await page.goto('sitemap.xml');
    expect(respIndex?.status()).toBe(200);
    const contentIndex = await respIndex?.text();
    expect(contentIndex).toContain('<urlset');
    expect(contentIndex).toContain('https://mejorescampings.es');
    expect(contentIndex).toContain('https://mejorescampings.es/andalucia/malaga/ronda/');

    const respMalaga = await page.goto('sitemap-malaga.xml');
    expect(respMalaga?.status()).toBe(200);
    const contentMalaga = await respMalaga?.text();
    expect(contentMalaga).toContain('<urlset');
    expect(contentMalaga).toContain('https://mejorescampings.es/andalucia/malaga/');
    expect(contentMalaga).toContain('https://mejorescampings.es/camping/');
  });

});
