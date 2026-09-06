#!/usr/bin/env python3
"""
Ingestion Script for Scrape Sources (ingest_sources.py)

Flow:
1. Reads pending sources from the Supabase table `scrape_sources` (status = 'pending').
2. Updates status to 'processing'.
3. Downloads HTML / content from the source URL and parses campsite entities using Gemini Flash (google-genai).
4. Processes images via Google Places -> Gemini Vision -> Supabase Storage.
5. Upserts campsite entities to Supabase DB, attaching `badge_label` if present.
6. Marks source status as 'completed' (or 'failed' if an exception occurs) and records `items_extracted` & `last_scraped_at`.
"""

import os
import sys
import json
import re
import datetime
import logging
import requests
from typing import List, Dict, Any, Optional

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# Import pipeline helpers from scrape_andalucia if available
try:
    from scrape_andalucia import (
        process_campsite_with_google_places,
        process_campsite_images,
        synthesize_text_with_gemini,
        calculate_data_quality_score,
        generate_slug,
        sync_to_supabase,
        sanitize_record,
        fetch_remote_table_columns,
        ALLOWED_CAMPING_KEYS
    )
except ImportError as e:
    logging.warning(f"Could not import helper functions from scrape_andalucia: {e}")

def get_supabase_client():
    url = os.environ.get("SUPABASE_URL") or os.environ.get("PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY") or os.environ.get("PUBLIC_SUPABASE_ANON_KEY")
    if not url or not key:
        raise ValueError("Supabase URL or Key environment variables are missing.")
    url = url.rstrip("/").replace("/rest/v1", "").rstrip("/")
    from supabase import create_client
    return create_client(url, key)

def parse_with_gemini(source_url: str) -> List[Dict[str, Any]]:
    """
    Downloads HTML from source_url and uses Gemini Flash to extract campsite entity structures.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    resp = requests.get(source_url, headers=headers, timeout=15)
    resp.raise_for_status()
    html_content = resp.text[:100000] # Limit content for prompt window

    gemini_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_key:
        raise ValueError("GEMINI_API_KEY is required to parse source content.")

    from google import genai
    client = genai.Client(api_key=gemini_key)

    prompt = f"""
    Extrae de forma precisa todos los campings, glampings o alojamientos de naturaleza mencionados en el siguiente texto de la URL ({source_url}).

    Devuelve un JSON estricto en forma de lista de objetos con las siguientes claves para cada camping:
    - name: Nombre del camping (ej: "Camping Cabopino")
    - province: Nombre de la provincia andaluza (ej: "malaga", "cadiz", "almeria", "huelva", "granada", "cordoba", "jaen", "sevilla")
    - municipality: Municipio o ciudad (ej: "Marbella")
    - description: Breve resumen o cita de lo que dice el artículo sobre este camping
    - address: Dirección aproximada si se menciona
    - official_url: URL web oficial o enlace directo si está en el texto
    - category: Tipo de alojamiento (ej: "Camping", "Glamping", "Bungalows")
    - editorial_quote: Frase o recomendación destacada extraída del artículo

    Responde ÚNICAMENTE con el bloque JSON `[...]`. No incluyas explicaciones extra.

    Texto:
    {html_content}
    """

    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt
    )

    if not response or not response.text:
        return []

    json_match = re.search(r'\[.*\]', response.text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(0))
        except Exception as err:
            logging.error(f"Failed to parse Gemini output JSON: {err}")
            return []
    return []

def upsert_camping_to_db(camping: Dict[str, Any], badge: Optional[str] = None):
    """
    Enriches campsite via Google Places & Gemini Vision, processes images,
    attaches badge_label to editorial_badges if present, and upserts to Supabase DB.
    """
    client = get_supabase_client()

    name = camping.get("name")
    if not name:
        return

    slug = generate_slug(name)
    camping["slug"] = slug

    # Enrich with Google Places
    camping = process_campsite_with_google_places(camping)

    # Attach badge_label if present
    if badge:
        existing_badges = camping.get("editorial_badges") or []
        if isinstance(existing_badges, list) and badge not in existing_badges:
            existing_badges.append(badge)
            camping["editorial_badges"] = existing_badges

    # Process and validate WebP images (Google Places -> Gemini Vision -> Supabase Storage)
    image_urls = process_campsite_images(camping, slug)
    if image_urls:
        camping["image_urls"] = image_urls
        camping["image_url"] = image_urls[0]

    # Calculate quality score and synthesize AI text if needed
    score, _ = calculate_data_quality_score(camping)
    camping["quality_score"] = score
    if not camping.get("ai_description"):
        camping = synthesize_text_with_gemini(camping)

    # Prepare sanitize payload
    url = os.environ.get("SUPABASE_URL") or os.environ.get("PUBLIC_SUPABASE_URL") or ""
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY") or ""
    url = url.rstrip("/").replace("/rest/v1", "").rstrip("/")

    allowed_keys = fetch_remote_table_columns(url, key, "campings") if (url and key) else ALLOWED_CAMPING_KEYS
    sanitized = sanitize_record(camping, allowed_keys)

    # Upsert to Supabase
    client.table("campings").upsert(sanitized, on_conflict="slug").execute()
    logging.info(f"Successfully upserted camping '{name}' ({slug}) with badge '{badge}'")

def process_sources():
    """
    Main loop to process pending scrape sources.
    """
    supabase = get_supabase_client()

    # 1. Fetch pending sources
    res = supabase.table('scrape_sources').select('*').eq('status', 'pending').execute()
    sources = res.data or []

    logging.info(f"Found {len(sources)} pending scrape sources.")

    for source in sources:
        source_id = source['id']
        source_url = source['url']
        badge_label = source.get('badge_label')

        logging.info(f"Processing source {source_id}: {source_url}")

        # 2. Update status to 'processing'
        supabase.table('scrape_sources').update({'status': 'processing'}).eq('id', source_id).execute()

        try:
            # 3. Parse entities using Gemini Flash
            extracted_campings = parse_with_gemini(source_url)
            logging.info(f"Extracted {len(extracted_campings)} campings from {source_url}")

            # 4. Enrich & Upsert each extracted campsite
            for camping in extracted_campings:
                upsert_camping_to_db(camping, badge=badge_label)

            # 5. Mark as completed
            supabase.table('scrape_sources').update({
                'status': 'completed',
                'items_extracted': len(extracted_campings),
                'last_scraped_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
            }).eq('id', source_id).execute()
            logging.info(f"Successfully completed source {source_id}")

        except Exception as e:
            err_msg = str(e)
            logging.error(f"Failed processing source {source_id}: {err_msg}")
            supabase.table('scrape_sources').update({
                'status': 'failed',
                'error_log': err_msg
            }).eq('id', source_id).execute()

if __name__ == "__main__":
    process_sources()
