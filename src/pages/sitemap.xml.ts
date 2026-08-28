import type { APIRoute } from 'astro';
import { getCampings, getLocations, PROVINCES } from '../lib/db';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ? site.href.replace(/\/$/, '') : 'https://mejorescampings.es';
  const today = new Date().toISOString().split('T')[0];

  const campings = await getCampings();
  const locations = await getLocations();

  const urls: string[] = [];

  // 1. Root Home & Guides Hub
  urls.push(`${baseUrl}/`);
  urls.push(`${baseUrl}/guias/`);

  // 2. 8 Provincial Guides & Hubs
  for (const prov of PROVINCES) {
    urls.push(`${baseUrl}/${prov.slug}/`);
    urls.push(`${baseUrl}/andalucia/${prov.slug}/`);
    urls.push(`${baseUrl}/guias/normativa-pernocta-${prov.slug}/`);
  }
  urls.push(`${baseUrl}/normativa-pernocta-malaga/`);

  // 3. Category pages per province
  const categorySlugs = [
    'campings-playa',
    'campings-montana',
    'campings-con-mascotas',
    'campings-bungalows',
    'campings-con-piscina'
  ];
  for (const prov of PROVINCES) {
    for (const cat of categorySlugs) {
      urls.push(`${baseUrl}/${prov.slug}/${cat}/`);
      urls.push(`${baseUrl}/andalucia/${prov.slug}/${cat}/`);
    }
  }

  // 4. Municipality pages
  for (const loc of locations) {
    const muniSlug = loc.slug.split('/').pop() || loc.slug;
    urls.push(`${baseUrl}/${loc.province}/${muniSlug}/`);
    urls.push(`${baseUrl}/andalucia/${loc.province}/${muniSlug}/`);
  }

  // 5. Campsite detail pages
  for (const camp of campings) {
    if (camp.is_active && camp.status !== 'closed_temp') {
      urls.push(`${baseUrl}/camping/${camp.slug}/`);
    }
  }

  const xmlEntries = urls.map(
    (u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
