#!/usr/bin/env python3
import os
import re
import sys
import json
import logging
from typing import List, Dict, Any, Tuple
import requests

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# Raw scraped or extracted source data for Málaga campings (MVP)
RAW_CAMPINGS_DATA = [
    {
        "name": "camping EL SUR ronda",
        "description": "Camping El Sur está situado en una de las zonas más bellas de Andalucía, a sólo 2 km de la histórica ciudad de Ronda. rodeado de olivos centenarios y robles, ofrece un entorno familiar ideal con animación infantil en verano y vistas impresionantes a la Serranía de Ronda.",
        "address": "Carretera de Algeciras Km 1.5, 29400 Ronda, Málaga",
        "lat": 36.7262,
        "lng": -5.1764,
        "municipality_slug": "andalucia/malaga/ronda",
        "image_urls": [
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80"
        ],
        "affiliate_url": "https://www.pitchup.com/es/campsites/Spain/Andalucia/Malaga/Ronda/camping_el_sur/?aff=campbase",
        "official_url": "https://www.campingelsur.mg.es",
        "price_tier": 2,
        "amenities": {
            "piscina": True,
            "mascotas": True,
            "animacion_infantil": True,
            "entorno_familiar": True,
            "glamping": False,
            "playa": False
        }
    },
    {
        "name": "camping cabopino marbella",
        "description": "Camping Cabopino es un complejo turístico situado en Marbella, a escasos metros de la playa de Cabopino y de las famosas dunas protegidas. Cuenta con instalaciones excepcionales con piscinas cubiertas y descubiertas, completo programa de animación infantil y ambiente ideal para vacaciones en familia.",
        "address": "Ctra. N-340, Km 194.7, 29604 Marbella, Málaga",
        "lat": 36.4883,
        "lng": -4.7431,
        "municipality_slug": "andalucia/malaga/marbella",
        "image_urls": [
            "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80"
        ],
        "affiliate_url": "https://www.pitchup.com/es/campsites/Spain/Andalucia/Malaga/Marbella/camping_cabopino/?aff=campbase",
        "official_url": "https://www.campingcabopino.com",
        "price_tier": 3,
        "amenities": {
            "piscina": True,
            "mascotas": False,
            "animacion_infantil": True,
            "entorno_familiar": True,
            "glamping": True,
            "playa": True
        }
    },
    {
        "name": "camping LA MARIPOSA nerja",
        "description": "Ubicado cerca de Nerja y los acantilados de Maro, Camping La Mariposa combina la tranquilidad de la naturaleza con la cercanía a las calas de agua cristalina. Perfecto para familias y viajeros que buscan confort y descanso.",
        "address": "Ctra. de Maro s/n, 29780 Nerja, Málaga",
        "lat": 36.7581,
        "lng": -3.8542,
        "municipality_slug": "andalucia/malaga/nerja",
        "image_urls": [
            "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80"
        ],
        "affiliate_url": "https://www.travelpayouts.com/campaigns/nerja-camping?aff=campbase",
        "official_url": "https://www.campinglamariposanerja.es",
        "price_tier": 2,
        "amenities": {
            "piscina": True,
            "mascotas": True,
            "animacion_infantil": False,
            "entorno_familiar": True,
            "glamping": False,
            "playa": True
        }
    },
    {
        "name": "glamping SIERRA DE LAS NIEVES",
        "description": "Experiencia de alojamiento ecológico y glamping de lujo a las puertas del Parque Nacional Sierra de las Nieves. Tiendas bell completamente equipadas con baño privado, zona chill-out y piscina sin cloro.",
        "address": "Camino de los Pinares s/n, 29100 Coín, Málaga",
        "lat": 36.6580,
        "lng": -4.7561,
        "municipality_slug": "andalucia/malaga/ronda",
        "image_urls": [
            "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1525811902-f2342640856e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?auto=format&fit=crop&w=1200&q=80"
        ],
        "affiliate_url": None, # Test monetization fallback B2B / Google AdSense
        "official_url": "https://www.glampingsierradelasnieves.com",
        "price_tier": 4,
        "amenities": {
            "piscina": True,
            "mascotas": True,
            "animacion_infantil": False,
            "entorno_familiar": True,
            "glamping": True,
            "playa": False
        }
    },
    {
        "name": "camping TORREMOLINOS COSTA",
        "description": "Camping urbano junto al paseo marítimo de Torremolinos. Gran ambiente veraniego, parque infantil, piscina olímpica y acceso directo a zonas comerciales y gastronómicas de la Costa del Sol.",
        "address": "Av. Manuel Fraga Iribarne, 29620 Torremolinos, Málaga",
        "lat": 36.6288,
        "lng": -4.4981,
        "municipality_slug": "andalucia/malaga/torremolinos",
        "image_urls": [
            "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=1200&q=80"
        ],
        "affiliate_url": "https://www.pitchup.com/es/campsites/Spain/Andalucia/Malaga/Torremolinos/torremolinos_costa/?aff=campbase",
        "official_url": "https://www.campingtorremolinoscosta.es",
        "price_tier": 2,
        "amenities": {
            "piscina": True,
            "mascotas": False,
            "animacion_infantil": True,
            "entorno_familiar": True,
            "glamping": False,
            "playa": True
        }
    }
]

def generate_slug(name: str) -> str:
    """Generate a clean URL slug from name."""
    s = name.lower()
    # Replace spanish accents / chars
    replacements = {'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u'}
    for char, repl in replacements.items():
        s = s.replace(char, repl)
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s-]+', '-', s).strip('-')
    return s

def title_case(text: str) -> str:
    """Standardize name to Title Case."""
    words = text.split()
    minor_words = {'de', 'del', 'la', 'los', 'las', 'en', 'y', 'e', 'a', 'por', 'con'}
    result = []
    for i, w in enumerate(words):
        w_lower = w.lower()
        if i > 0 and w_lower in minor_words:
            result.append(w_lower)
        else:
            result.append(w_lower.capitalize())
    return ' '.join(result)

def validate_camping(camping: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Validate data quality requirements for a camping entry."""
    errors = []

    # Lat/Lng numerical validation
    lat = camping.get("lat")
    lng = camping.get("lng")
    if not isinstance(lat, (int, float)) or not isinstance(lng, (int, float)):
        errors.append("Coordinates lat/lng must be numeric")
    elif lat == 0 and lng == 0:
        errors.append("Invalid (0, 0) coordinates")
    elif not (-90 <= lat <= 90 and -180 <= lng <= 180):
        errors.append(f"Coordinates out of range: lat={lat}, lng={lng}")

    # Media requirement (minimum 3 image URLs)
    images = camping.get("image_urls", [])
    if not isinstance(images, list) or len(images) < 3:
        errors.append(f"Minimum 3 image URLs required, found {len(images) if isinstance(images, list) else 0}")
    else:
        for url in images:
            if not isinstance(url, str) or not url.startswith("http"):
                errors.append(f"Invalid image URL format: {url}")

    # Name validation
    if not camping.get("name"):
        errors.append("Name is required")

    return len(errors) == 0, errors

def process_and_clean_data(raw_list: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], int, int]:
    cleaned = []
    total = len(raw_list)
    error_count = 0

    for idx, item in enumerate(raw_list):
        valid, errors = validate_camping(item)
        if not valid:
            error_count += 1
            logging.error(f"Validation failed for record #{idx} '{item.get('name')}': {errors}")
            continue

        # Standardize fields
        clean_item = dict(item)
        clean_item["name"] = title_case(item["name"])
        clean_item["slug"] = generate_slug(clean_item["name"])
        clean_item["image_url"] = clean_item["image_urls"][0]
        clean_item["is_active"] = True

        cleaned.append(clean_item)

    return cleaned, total, error_count

def sync_to_supabase(campings: List[Dict[str, Any]]):
    """Upsert cleaned records to Supabase if configured."""
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key:
        logging.info("Supabase environment variables not set. Skipping remote database sync.")
        return

    endpoint = f"{supabase_url.rstrip('/')}/rest/v1/campings"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    logging.info(f"Syncing {len(campings)} campings to Supabase at {endpoint}...")
    try:
        res = requests.post(endpoint, headers=headers, json=campings, timeout=10)
        if res.status_code in [200, 201]:
            logging.info("Successfully upserted data to Supabase.")
        else:
            logging.warning(f"Supabase sync returned status {res.status_code}: {res.text}")
    except Exception as e:
        logging.error(f"Failed to communicate with Supabase: {e}")

def main():
    logging.info("Starting CampBase Data Extraction & Pipeline...")

    cleaned_data, total_records, error_records = process_and_clean_data(RAW_CAMPINGS_DATA)

    error_rate = (error_records / total_records) if total_records > 0 else 0
    logging.info(f"Processed {total_records} records. Valid: {len(cleaned_data)}, Errors: {error_records} ({error_rate:.1%})")

    # Quality Gate Check (Requirement: fail if > 10% errors)
    MAX_ALLOWED_ERROR_RATE = 0.10
    if error_rate > MAX_ALLOWED_ERROR_RATE:
        msg = f"Data Quality Gate Failed! Error rate {error_rate:.1%} exceeds maximum threshold ({MAX_ALLOWED_ERROR_RATE:.0%}). Aborting build."
        logging.critical(msg)
        sys.exit(1)

    # Save to local JSON files for SSG Astro build fallback
    os.makedirs("src/data", exist_ok=True)

    with open("src/data/campings.json", "w", encoding="utf-8") as f:
        json.dump(cleaned_data, f, ensure_ascii=False, indent=2)

    locations_data = [
        {"region": "andalucia", "province": "malaga", "municipality": "Ronda", "slug": "andalucia/malaga/ronda"},
        {"region": "andalucia", "province": "malaga", "municipality": "Marbella", "slug": "andalucia/malaga/marbella"},
        {"region": "andalucia", "province": "malaga", "municipality": "Nerja", "slug": "andalucia/malaga/nerja"},
        {"region": "andalucia", "province": "malaga", "municipality": "Torremolinos", "slug": "andalucia/malaga/torremolinos"}
    ]
    with open("src/data/locations.json", "w", encoding="utf-8") as f:
        json.dump(locations_data, f, ensure_ascii=False, indent=2)

    features_data = [
        {"feature_name": "Piscina", "slug": "campings-con-piscina", "key": "piscina", "icon": "swimming-pool"},
        {"feature_name": "Mascotas Permitidas", "slug": "campings-que-admiten-perros", "key": "mascotas", "icon": "dog"},
        {"feature_name": "Animación Infantil", "slug": "campings-con-animacion-infantil", "key": "animacion_infantil", "icon": "sparkles"},
        {"feature_name": "Entorno Familiar", "slug": "campings-familiares", "key": "entorno_familiar", "icon": "users"},
        {"feature_name": "Glamping", "slug": "glamping", "key": "glamping", "icon": "tent"},
        {"feature_name": "Playa", "slug": "campings-cerca-de-la-playa", "key": "playa", "icon": "sun"}
    ]
    with open("src/data/features.json", "w", encoding="utf-8") as f:
        json.dump(features_data, f, ensure_ascii=False, indent=2)

    logging.info("Saved clean local datasets to src/data/")

    # Sync to Supabase if config exists
    sync_to_supabase(cleaned_data)
    logging.info("Pipeline completed successfully.")

if __name__ == "__main__":
    main()
