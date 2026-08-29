-- MejoresCampings Supabase Database Schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

-- 1. Locations Table
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region TEXT NOT NULL,
    province TEXT NOT NULL,
    municipality TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Campings Table
CREATE TABLE IF NOT EXISTS campings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    address TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    province_slug TEXT NOT NULL DEFAULT 'malaga',
    comarca TEXT DEFAULT NULL,
    comarca_slug TEXT DEFAULT NULL,
    municipality_slug TEXT DEFAULT NULL,
    image_url TEXT,
    image_urls TEXT[] DEFAULT '{}',
    affiliate_url TEXT,
    official_url TEXT,
    price_tier INT DEFAULT 2 CHECK (price_tier BETWEEN 1 AND 4),
    is_active BOOLEAN DEFAULT TRUE,
    is_promoted BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',
    ai_description TEXT,
    faqs_json JSONB DEFAULT '[]'::jsonb,
    meta_title TEXT,
    meta_description TEXT,
    amenities JSONB DEFAULT '{}'::jsonb,
    related_affiliates JSONB DEFAULT '{}'::jsonb,
    rating DOUBLE PRECISION DEFAULT 4.3,
    review_count INT DEFAULT 120,
    seasonality TEXT DEFAULT 'Abierto todo el año',
    quality_score INT DEFAULT 0 CHECK (quality_score BETWEEN 0 AND 100),
    rta_license TEXT DEFAULT NULL,
    category TEXT DEFAULT NULL,
    legal_capacity INT DEFAULT NULL,
    editorial_badges TEXT[] DEFAULT '{}',
    editorial_tags TEXT[] DEFAULT '{}',
    editorial_quote TEXT DEFAULT NULL,
    pitchup_rating NUMERIC DEFAULT NULL,
    photos_manifest JSONB DEFAULT '[]'::jsonb,
    google_place_id TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Features Table (Amenities catalog)
CREATE TABLE IF NOT EXISTS features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    key TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Camping Features Pivot Table (N:M)
CREATE TABLE IF NOT EXISTS camping_features (
    camping_id UUID REFERENCES campings(id) ON DELETE CASCADE,
    feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
    PRIMARY KEY (camping_id, feature_id)
);

-- Normalización de Provincias, Comarcas y Calidad de Datos
-- Normalización y Migraciones
ALTER TABLE features
ADD COLUMN IF NOT EXISTS icon TEXT;

ALTER TABLE campings
ADD COLUMN IF NOT EXISTS is_promoted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS province_slug TEXT NOT NULL DEFAULT 'malaga',
ADD COLUMN IF NOT EXISTS comarca TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS comarca_slug TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS municipality_slug TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS quality_score INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS rta_license TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS legal_capacity INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS editorial_badges TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS editorial_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS editorial_quote TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS pitchup_rating NUMERIC DEFAULT NULL,
ADD COLUMN IF NOT EXISTS photos_manifest JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS google_place_id TEXT DEFAULT NULL;

-- Enable Row Level Security (RLS) & Define Public Access Policies
ALTER TABLE campings ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on campings" ON campings;
CREATE POLICY "Allow public read access on campings" ON campings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on locations" ON locations;
CREATE POLICY "Allow public read access on locations" ON locations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on features" ON features;
CREATE POLICY "Allow public read access on features" ON features FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_campings_slug ON campings(slug);
CREATE INDEX IF NOT EXISTS idx_campings_municipality ON campings(municipality_slug);
CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug);
CREATE INDEX IF NOT EXISTS idx_features_slug ON features(slug);
CREATE INDEX IF NOT EXISTS idx_campings_province ON campings(province_slug);
CREATE INDEX IF NOT EXISTS idx_campings_muni ON campings(province_slug, municipality_slug);
CREATE INDEX IF NOT EXISTS idx_campings_geo ON campings USING GIST (ll_to_earth(lat, lng));

-- Seed Data for Locations
INSERT INTO locations (region, province, municipality, slug) VALUES
('andalucia', 'almeria', 'Níjar', 'almeria/nijar'),
('andalucia', 'almeria', 'Almería', 'almeria/almeria'),
('andalucia', 'cadiz', 'Tarifa', 'cadiz/tarifa'),
('andalucia', 'cadiz', 'Barbate', 'cadiz/barbate'),
('andalucia', 'cordoba', 'Villafranca de Córdoba', 'cordoba/villafranca-de-cordoba'),
('andalucia', 'granada', 'Granada', 'granada/granada'),
('andalucia', 'granada', 'Motril', 'granada/motril'),
('andalucia', 'huelva', 'Mazagón', 'huelva/mazagon'),
('andalucia', 'jaen', 'Cazorla', 'jaen/cazorla'),
('andalucia', 'malaga', 'Ronda', 'malaga/ronda'),
('andalucia', 'malaga', 'Marbella', 'malaga/marbella'),
('andalucia', 'malaga', 'Nerja', 'malaga/nerja'),
('andalucia', 'malaga', 'Torremolinos', 'malaga/torremolinos'),
('andalucia', 'malaga', 'Almayate', 'malaga/almayate'),
('andalucia', 'malaga', 'Antequera', 'malaga/antequera'),
('andalucia', 'malaga', 'Málaga', 'malaga/malaga'),
('andalucia', 'sevilla', 'Aznalcázar', 'sevilla/aznalcazar')
ON CONFLICT (slug) DO NOTHING;

-- Seed Data for Features
INSERT INTO features (feature_name, slug, key, icon) VALUES
('Cerca de la Playa', 'campings-playa', 'playa', 'sun'),
('En la Montaña', 'campings-montana', 'montana', 'mountain'),
('Mascotas Permitidas', 'campings-con-mascotas', 'mascotas', 'dog'),
('Bungalows y Cabañas', 'campings-bungalows', 'glamping', 'tent'),
('Con Piscina', 'campings-con-piscina', 'piscina', 'swimming-pool'),
('Animación Infantil', 'campings-con-animacion-infantil', 'animacion_infantil', 'sparkles'),
('Entorno Familiar', 'campings-familiares', 'entorno_familiar', 'users'),
('Glamping de Lujo', 'glamping', 'glamping', 'tent'),
('Cerca de la Playa (Alt)', 'campings-cerca-de-la-playa', 'playa', 'sun'),
('Mascotas Permitidas (Alt)', 'campings-que-admiten-perros', 'mascotas', 'dog')
ON CONFLICT (slug) DO NOTHING;
