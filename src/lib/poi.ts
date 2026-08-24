export interface PoiDistance {
  name: string;
  icon: string;
  distanceKm: number;
  timeMin: number;
}

const MALAGA_POIS = [
  { name: "Playa / Costa del Sol", icon: "🏖️", lat: 36.540, lng: -4.620 },
  { name: "Caminito del Rey", icon: "🧗", lat: 36.915, lng: -4.772 },
  { name: "Sierra de las Nieves", icon: "⛰️", lat: 36.689, lng: -4.981 },
  { name: "Tajo de Ronda", icon: "🏛️", lat: 36.742, lng: -5.166 },
  { name: "Málaga Centro", icon: "🌆", lat: 36.721, lng: -4.421 }
];

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getNearestPois(lat: number, lng: number, limit = 3): PoiDistance[] {
  if (!lat || !lng) return [];

  const calculated = MALAGA_POIS.map((poi) => {
    const dist = haversineDistance(lat, lng, poi.lat, poi.lng);
    // Estimated driving time: ~50km/h average inland/coastal roads
    const timeMin = Math.max(5, Math.round((dist / 50) * 60));
    return {
      name: poi.name,
      icon: poi.icon,
      distanceKm: Math.round(dist * 10) / 10,
      timeMin
    };
  });

  // Sort by distance and take closest POIs
  calculated.sort((a, b) => a.distanceKm - b.distanceKm);
  return calculated.slice(0, limit);
}
