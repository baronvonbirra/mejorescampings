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

  test('Editorial badges and quote render correctly on campsite detail page', async ({ page }) => {
    await page.goto('camping/camping-el-sur/');
    await expect(page.locator('span').filter({ hasText: /Selección ABC/i }).first()).toBeVisible();
    await expect(page.locator('blockquote').first()).toContainText('Recomendado por su entorno');
  });

  test('Feature badge links on campsite detail page navigate to category filter routes', async ({ page }) => {
    await page.goto('camping/camping-cabopino/');
    const petsBadge = page.locator('a[href*="/campings-con-mascotas/"]').first();
    if (await petsBadge.isVisible()) {
      await petsBadge.click();
      await expect(page).toHaveURL(/\/campings-con-mascotas\//);
      await expect(page.locator('h1')).toContainText('Mascotas');
    }
  });

  test('New Provincial Hub (/cadiz/) and Category (/cadiz/campings-playa/) load with ItemList Schema', async ({ page }) => {
    const respCadiz = await page.goto('cadiz/');
    expect(respCadiz?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Cádiz');

    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allInnerTexts();
    expect(jsonLdScripts.some(s => s.includes('"@type":"ItemList"'))).toBe(true);

    const respPlaya = await page.goto('cadiz/campings-playa/');
    expect(respPlaya?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Playa');
  });

  test('llms.txt endpoint is served correctly for AI crawlers', async ({ page }) => {
    const response = await page.goto('llms.txt');
    expect(response?.status()).toBe(200);
    const content = await response?.text();
    expect(content).toContain('MejoresCampings.es');
    expect(content).toContain('/cadiz/');
    expect(content).toContain('/malaga/');
  });

  test('Camping Product detail page renders atomic components, CTA, weather, OG tags, FAQs and Environment Block', async ({ page, isMobile }) => {
    const resp1 = await page.goto('camping/camping-el-sur/');
    expect(resp1?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Camping el Sur');

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
    await expect(page.getByRole('heading', { name: /Preguntas Frecuentes sobre Camping El Sur/i })).toBeVisible();

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
