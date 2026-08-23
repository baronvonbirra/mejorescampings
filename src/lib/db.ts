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
  municipality_slug: string;
  image_url: string;
  image_urls: string[];
  affiliate_url?: string | null;
  official_url?: string | null;
  price_tier: number;
  is_active: boolean;
  amenities: Record<string, boolean>;
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

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function getCampings(): Promise<Camping[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('campings').select('*').eq('is_active', true);
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          affiliate_url: item.affiliate_url || item.aff_url || null,
          image_urls: item.image_urls || (item.image_url ? [item.image_url] : [])
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch from Supabase, fallback to local data:', e);
    }
  }
  return localCampings as Camping[];
}

export async function getCampingBySlug(slug: string): Promise<Camping | undefined> {
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
