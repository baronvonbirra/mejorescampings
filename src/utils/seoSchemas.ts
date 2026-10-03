/**
 * Schema.org Structured Data Generator Utilities
 */

export function generateCampsiteSchema(camping: any) {
  const slug = camping.slug || '';
  const name = camping.name || '';
  const description = camping.ai_description || camping.description || '';

  const photos = camping.photos || camping.image_urls || (camping.image_url ? [camping.image_url] : []);
  const lat = camping.latitude ?? camping.lat;
  const lng = camping.longitude ?? camping.lng;

  const municipality = camping.municipality || camping.municipality_slug || '';
  const province = camping.province || camping.province_slug || 'Málaga';

  const rawFeatures = camping.features || (camping.amenities ? Object.keys(camping.amenities).filter(k => camping.amenities[k]) : []);

  return {
    "@context": "https://schema.org",
    "@type": "Campsite",
    "@id": `https://mejorescampings.es/camping/${slug}/#campsite`,
    "name": name,
    "description": description,
    "url": `https://mejorescampings.es/camping/${slug}/`,
    "image": photos,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": municipality,
      "addressRegion": province,
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": lat,
      "longitude": lng
    },
    "amenityFeature": (rawFeatures || []).map((f: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": f,
      "value": true
    }))
  };
}
