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

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

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
          related_affiliates: item.related_affiliates || {}
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
          related_affiliates: item.related_affiliates || {}
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
          related_affiliates: data.related_affiliates || {}
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
