import type { APIRoute } from 'astro';
import { getCampings } from '../../lib/db';

export const GET: APIRoute = async () => {
  const campings = await getCampings();
  const geoData = campings
    .filter((c) => c.is_active && c.lat && c.lng)
    .map((c) => {
      const muni = (c.municipality_slug || '').split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || '';
      return {
        id: c.id || c.slug,
        name: c.name,
        slug: c.slug,
        latitude: c.lat,
        longitude: c.lng,
        municipality: muni,
        main_image: c.image_url || (c.image_urls && c.image_urls[0]) || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80'
      };
    });

  return new Response(JSON.stringify(geoData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
