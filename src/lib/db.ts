import { createClient } from '@supabase/supabase-js';
import localCampings from '../data/campings.json';
import localLocations from '../data/locations.json';
import localFeatures from '../data/features.json';

export interface Camping {
  id?: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  province_slug?: string;
  comarca?: string | null;
  comarca_slug?: string | null;
  municipality_slug: string;
  image_url: string;
  image_urls: string[];
  affiliate_url?: string | null;
  official_url?: string | null;
  price_tier: number;
  is_active: boolean;
  is_promoted?: boolean;
  status?: string;
  ai_description?: string | null;
  faqs_json?: Array<{ question: string; answer: string }> | null;
  meta_title?: string | null;
  meta_description?: string | null;
  amenities: Record<string, boolean>;
  related_affiliates?: Record<string, any> | null;
  rating?: number;
  review_count?: number;
  seasonality?: string;
  editorial_badges?: string[] | null;
  editorial_tags?: string[] | null;
  editorial_quote?: string | null;
  pitchup_rating?: number | null;
  photos_manifest?: Array<{ url: string; caption?: string; score?: number }> | null;
  google_place_id?: string | null;
}

export interface Location {
  region: string;
  province: string;
  municipality: string;
  slug: string;
}

export interface Feature {
  feature_name: string;
  slug: string;
  key: string;
  icon: string;
}

export interface ProvinceInfo {
  name: string;
  slug: string;
  description: string;
  highlights: string[];
}

export const PROVINCES: ProvinceInfo[] = [
  { name: 'Almería', slug: 'almeria', description: 'Campings en Cabo de Gata, las Tabernas y la costa almeriense.', highlights: ['Cabo de Gata', 'Níjar', 'Roquetas de Mar'] },
  { name: 'Cádiz', slug: 'cadiz', description: 'Campings en Tarifa, Costa de la Luz y Sierra de Grazalema.', highlights: ['Tarifa', 'Conil de la Frontera', 'Grazalema'] },
  { name: 'Córdoba', slug: 'cordoba', description: 'Campings en Sierra Morena, Valle del Guadalquivir y Subbética.', highlights: ['Sierra Morena', 'Zuheros', 'Hornachuelos'] },
  { name: 'Granada', slug: 'granada', description: 'Campings en Sierra Nevada, Alpujarra y Costa Tropical.', highlights: ['Sierra Nevada', 'Orgiva', 'Almuñécar'] },
  { name: 'Huelva', slug: 'huelva', description: 'Campings en el entorno de Doñana, Sierra de Aracena y Costa de la Luz.', highlights: ['Doñana', 'Mazagón', 'Aracena'] },
  { name: 'Jaén', slug: 'jaen', description: 'Campings en Cazorla, Segura, Las Villas y Despeñaperros.', highlights: ['Sierra de Cazorla', 'Úbeda', 'Segura de la Sierra'] },
  { name: 'Málaga', slug: 'malaga', description: 'Campings en la Costa del Sol, Serranía de Ronda y Axarquía.', highlights: ['Ronda', 'Marbella', 'Nerja'] },
  { name: 'Sevilla', slug: 'sevilla', description: 'Campings en Sierra Norte, Vega del Guadalquivir y entorno de Doñana.', highlights: ['Sierra Norte', 'Cazalla de la Sierra', 'El Pedroso'] }
];

const getEnvVar = (key: string): string | undefined => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env) {
      return import.meta.env[key];
    }
  } catch (e) {}
  try {
    if (typeof process !== 'undefined' && process?.env) {
      return process.env[key];
    }
  } catch (e) {}
  return undefined;
};

const supabaseUrl = getEnvVar('PUBLIC_SUPABASE_URL') || getEnvVar('SUPABASE_URL');
const supabaseKey = getEnvVar('PUBLIC_SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_ANON_KEY');

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function getCampings(): Promise<Camping[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('campings')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          affiliate_url: item.affiliate_url || item.aff_url || null,
          image_urls: item.image_urls || (item.image_url ? [item.image_url] : []),
          related_affiliates: item.related_affiliates || {},
          faqs_json: item.faqs_json && item.faqs_json.length > 0 ? item.faqs_json : [
            {
              question: `¿Cuál es la capacidad legal y categoría de ${item.name}?`,
              answer: `El ${item.name} cuenta con categoría de ${item.category || '2ª Categ.'} y capacidad autorizada para ${item.legal_capacity || 400} personas bajo licencia RTA ${item.rta_license || 'oficial'}.`
            },
            {
              question: `¿Admite perros y mascotas el ${item.name}?`,
              answer: item.amenities?.mascotas ? `Sí, el ${item.name} admite mascotas en sus parcelas e instalaciones.` : `El ${item.name} mantiene normativa de silencio y no admite mascotas.`
            },
            {
              question: `¿Cuenta con piscina ${item.name}?`,
              answer: item.amenities?.piscina ? `Sí, el recinto incluye piscina para sus clientes.` : `El camping no dispone de piscina, situándose cerca de zonas de baño naturales.`
            }
          ]
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch from Supabase, fallback to local data:', e);
    }
  }
  return localCampings as Camping[];
}

export async function getAllCampingsForAdmin(): Promise<Camping[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('campings')
        .select('*')
        .order('name', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          affiliate_url: item.affiliate_url || item.aff_url || null,
          image_urls: item.image_urls || (item.image_url ? [item.image_url] : []),
          related_affiliates: item.related_affiliates || {},
          faqs_json: item.faqs_json && item.faqs_json.length > 0 ? item.faqs_json : [
            {
              question: `¿Cuál es la capacidad legal y categoría de ${item.name}?`,
              answer: `El ${item.name} cuenta con categoría de ${item.category || '2ª Categ.'} y capacidad autorizada para ${item.legal_capacity || 400} personas bajo licencia RTA ${item.rta_license || 'oficial'}.`
            },
            {
              question: `¿Admite perros y mascotas el ${item.name}?`,
              answer: item.amenities?.mascotas ? `Sí, el ${item.name} admite mascotas en sus parcelas e instalaciones.` : `El ${item.name} mantiene normativa de silencio y no admite mascotas.`
            },
            {
              question: `¿Cuenta con piscina ${item.name}?`,
              answer: item.amenities?.piscina ? `Sí, el recinto incluye piscina para sus clientes.` : `El camping no dispone de piscina, situándose cerca de zonas de baño naturales.`
            }
          ]
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch all campings for admin from Supabase, fallback to local data:', e);
    }
  }
  return localCampings as Camping[];
}

export async function getCampingBySlug(slug: string): Promise<Camping | undefined> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('campings')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      if (!error && data) {
        return {
          ...data,
          affiliate_url: data.affiliate_url || data.aff_url || null,
          image_urls: data.image_urls || (data.image_url ? [data.image_url] : []),
          related_affiliates: data.related_affiliates || {},
          faqs_json: data.faqs_json && data.faqs_json.length > 0 ? data.faqs_json : [
            {
              question: `¿Cuál es la capacidad legal y categoría de ${data.name}?`,
              answer: `El ${data.name} cuenta con categoría de ${data.category || '2ª Categ.'} y capacidad autorizada para ${data.legal_capacity || 400} personas bajo licencia RTA ${data.rta_license || 'oficial'}.`
            },
            {
              question: `¿Admite perros y mascotas el ${data.name}?`,
              answer: data.amenities?.mascotas ? `Sí, el ${data.name} admite mascotas en sus parcelas e instalaciones.` : `El ${data.name} mantiene normativa de silencio y no admite mascotas.`
            },
            {
              question: `¿Cuenta con piscina ${data.name}?`,
              answer: data.amenities?.piscina ? `Sí, el recinto incluye piscina para sus clientes.` : `El camping no dispone de piscina, situándose cerca de zonas de baño naturales.`
            }
          ]
        };
      }
    } catch (e) {
      console.warn(`Failed to fetch campsite ${slug} from Supabase, falling back:`, e);
    }
  }
  const campings = await getCampings();
  return campings.find((c) => c.slug === slug);
}

export async function getLocations(): Promise<Location[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('locations').select('*');
      if (!error && data && data.length > 0) {
        return data as Location[];
      }
    } catch (e) {
      console.warn('Failed to fetch locations from Supabase:', e);
    }
  }
  return localLocations as Location[];
}

export async function getFeatures(): Promise<Feature[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('features').select('*');
      if (!error && data && data.length > 0) {
        return data.map((f: any) => ({
          feature_name: f.feature_name,
          slug: f.slug,
          key: f.key || f.slug.replace('campings-con-', '').replace('campings-que-admiten-', '').replace('campings-', ''),
          icon: f.icon || 'sparkles'
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch features from Supabase:', e);
    }
  }
  return localFeatures as Feature[];
}
