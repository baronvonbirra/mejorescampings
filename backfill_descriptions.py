#!/usr/bin/env python3
"""
MejoresCampings - Gemini AI Description Backfill Script
Cron & Backfill processor for campsites missing `ai_description`.
"""

import os
import time
import json
import logging
from typing import List, Dict, Any, Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

def get_supabase_client():
    """Instantiate Supabase client if credentials exist."""
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")
    if url and key:
        try:
            from supabase import create_client
            return create_client(url, key)
        except Exception as e:
            logging.warning(f"Could not initialize Supabase client: {e}")
    return None

def get_gemini_client():
    """Instantiate Google GenAI client if GEMINI_API_KEY exists."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        try:
            from google import genai
            return genai.Client(api_key=api_key)
        except Exception as e:
            logging.warning(f"Could not initialize Gemini Client: {e}")
    return None

def generate_gemini_description(camping: Dict[str, Any], gemini_client: Any) -> str:
    """Generate concise AI description using Gemini 2.0 Flash or clean local fallback."""
    parts = camping.get("municipality_slug", "andalucia/malaga/malaga").split("/")
    municipality = parts[-1].capitalize() if parts else "Málaga"
    province = parts[1].capitalize() if len(parts) > 1 else "Málaga"

    amenities = camping.get("amenities", {})
    if isinstance(amenities, dict):
        amenities_active = [k.replace("_", " ") for k, v in amenities.items() if v]
        amenities_str = ", ".join(amenities_active) if amenities_active else "servicios generales de camping"
    elif isinstance(amenities, list):
        amenities_str = ", ".join(amenities)
    else:
        amenities_str = "servicios generales de camping"

    environment_type = "costero" if (isinstance(amenities, dict) and amenities.get("playa")) else "sierra y naturaleza mediterránea"

    if gemini_client:
        prompt = f"""
Escribe una reseña concisa, directa y natural (máximo 70 palabras, 2 párrafos cortos) para {camping['name']}, situado en {municipality} ({province}).
Servicios: {amenities_str}.
Entorno: {environment_type}.

Reglas estrictas de estilo:
- Tono informativo y útil enfocado a viajeros.
- Sin clichés ni frases hechas como "amantes del camping", "amantes de la naturaleza", "entorno natural", "instalaciones de ensueño", "localización estratégica" o "propuesta única".
- Párrafos cortos con información práctica de las instalaciones y el entorno.
        """
        try:
            response = gemini_client.models.generate_content(
                model='gemini-2.0-flash',
                contents=prompt
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            logging.error(f"Gemini API request failed for {camping.get('name')}: {e}")

    # Direct fallback without clichés (under 70 words, 2 short paragraphs)
    p1 = f"{camping['name']} ofrece parcelas y estancias equipadas en {municipality} ({province}). Dispone de {amenities_str}."
    p2 = f"Su ubicación facilita el acceso a los puntos de interés y rutas de la zona de {municipality}."
    return f"{p1}\n\n{p2}"

def main():
    logging.info("Starting Gemini AI Description Backfill task...")

    gemini_client = get_gemini_client()
    supabase_client = get_supabase_client()

    if gemini_client:
        logging.info("Gemini API key detected. Using Gemini 2.0 Flash model.")
    else:
        logging.info("GEMINI_API_KEY not set. Using local direct description generator fallback.")

    target_campings = []
    is_supabase_source = False

    # 1. Fetch target records (limit 50)
    if supabase_client:
        try:
            logging.info("Querying Supabase: SELECT * FROM campings WHERE ai_description IS NULL AND is_active = TRUE LIMIT 50")
            res = supabase_client.table("campings").select("*").filter("ai_description", "is", "null").eq("is_active", True).limit(50).execute()
            if res.data:
                target_campings = res.data
                is_supabase_source = True
                logging.info(f"Found {len(target_campings)} records requiring AI description in Supabase.")
        except Exception as e:
            logging.warning(f"Failed querying Supabase: {e}")

    if not target_campings:
        logging.info("Checking local src/data/campings.json fallback dataset...")
        data_path = "src/data/campings.json"
        if os.path.exists(data_path):
            with open(data_path, "r", encoding="utf-8") as f:
                all_campings = json.load(f)
            target_campings = [c for c in all_campings if not c.get("ai_description") and c.get("is_active", True)][:50]
            logging.info(f"Found {len(target_campings)} records requiring AI description in local dataset.")

    if not target_campings:
        logging.info("No active campsites with missing ai_description found. All records up to date.")
        return

    # 2. Process records with rate limit delay (4.5s)
    updated_records = []
    for idx, camping in enumerate(target_campings):
        name = camping.get("name")
        logging.info(f"[{idx+1}/{len(target_campings)}] Generating AI description for: {name}")

        new_desc = generate_gemini_description(camping, gemini_client)
        camping["ai_description"] = new_desc
        updated_records.append(camping)

        # Update Supabase if connected
        if is_supabase_source and supabase_client:
            try:
                supabase_client.table("campings").update({"ai_description": new_desc}).eq("slug", camping["slug"]).execute()
            except Exception as e:
                logging.error(f"Failed updating Supabase record {name}: {e}")

        # Rate Limit Management (Gemini Free Tier: 15 req/min -> 4.5s pause)
        if gemini_client and idx < len(target_campings) - 1:
            logging.info("Waiting 4.5 seconds to adhere to Gemini Free Tier rate limits...")
            time.sleep(4.5)

    # 3. Update local src/data/campings.json dataset
    data_path = "src/data/campings.json"
    if os.path.exists(data_path):
        with open(data_path, "r", encoding="utf-8") as f:
            all_campings = json.load(f)

        updated_dict = {c["slug"]: c.get("ai_description") for c in updated_records}
        for c in all_campings:
            if c["slug"] in updated_dict and updated_dict[c["slug"]]:
                c["ai_description"] = updated_dict[c["slug"]]

        with open(data_path, "w", encoding="utf-8") as f:
            json.dump(all_campings, f, ensure_ascii=False, indent=2)
        logging.info("Updated local dataset src/data/campings.json successfully.")

    logging.info(f"Backfill complete! Processed {len(updated_records)} campsite descriptions.")

if __name__ == "__main__":
    main()
