-- MejoresCampings Supabase Database Schema

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
ALTER TABLE campings
ADD COLUMN IF NOT EXISTS province_slug TEXT NOT NULL DEFAULT 'malaga',
ADD COLUMN IF NOT EXISTS comarca TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS comarca_slug TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS municipality_slug TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS quality_score INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS rta_license TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS legal_capacity INT DEFAULT NULL;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_campings_slug ON campings(slug);
CREATE INDEX IF NOT EXISTS idx_campings_municipality ON campings(municipality_slug);
CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug);
CREATE INDEX IF NOT EXISTS idx_features_slug ON features(slug);
CREATE INDEX IF NOT EXISTS idx_campings_province ON campings(province_slug);
CREATE INDEX IF NOT EXISTS idx_campings_muni ON campings(province_slug, municipality_slug);
CREATE INDEX IF NOT EXISTS idx_campings_geo ON campings USING GIST (ll_to_earth(lat, lng));

-- Seed Data for MVP (Málaga)
INSERT INTO locations (region, province, municipality, slug) VALUES
('andalucia', 'malaga', 'Ronda', 'andalucia/malaga/ronda'),
('andalucia', 'malaga', 'Marbella', 'andalucia/malaga/marbella'),
('andalucia', 'malaga', 'Nerja', 'andalucia/malaga/nerja'),
('andalucia', 'malaga', 'Cabopino', 'andalucia/malaga/cabopino'),
('andalucia', 'malaga', 'Torremolinos', 'andalucia/malaga/torremolinos')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO features (feature_name, slug, key, icon) VALUES
('Piscina', 'campings-con-piscina', 'piscina', 'swimming-pool'),
('Mascotas Permitidas', 'campings-que-admiten-perros', 'mascotas', 'dog'),
('Animación Infantil', 'campings-con-animacion-infantil', 'animacion_infantil', 'sparkles'),
('Entorno Familiar', 'campings-familiares', 'entorno_familiar', 'users'),
('Glamping', 'glamping', 'glamping', 'tent'),
('Playa', 'campings-cerca-de-la-playa', 'playa', 'sun')
ON CONFLICT (slug) DO NOTHING;
