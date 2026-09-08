#!/usr/bin/env python3
"""
fetch_guide_images.py - Automated image scraper & processor for Astro guide articles.

Scrapes copyright-free images from Pexels / Unsplash API (or HD fallbacks),
processes and converts them to WebP using Pillow, stores them in
public/images/guias/{slug}.webp (and optionally uploads to Supabase Storage),
and updates the Markdown frontmatter of guide articles in src/content/guias/.

Usage:
    python3 fetch_guide_images.py [--slug <slug>] [--force] [--query <custom_query>]
"""

import os
import sys
import glob
import re
import argparse
import urllib.parse
import io
import requests
from PIL import Image

GUIDES_DIR = "src/content/guias"
PUBLIC_OUTPUT_DIR = "public/images/guias"
DEFAULT_FALLBACK_URL = "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80"

# Mapping guide slugs or keywords to optimal search terms
KEYWORD_MAPPING = {
    "areas-vaciado-aguas-grises-negras-autocaravanas-andalucia": "campervan motorhome service station",
    "campings-abiertos-en-invierno-andalucia": "camping winter campervan nature",
    "campings-con-toboganes-parques-acuaticos-andalucia": "waterpark resort pool slides camping",
    "campings-que-admiten-perros-playas-caninas-andalucia": "dog beach camping nature camper",
    "diferencias-glamping-bungalow-camping-tradicional": "luxury glamping tent nature wood cabin",
    "equipamiento-imprescindible-camping-verano": "summer camping equipment gear tent",
    "glamping-caminito-del-rey-sierra-de-las-nieves": "glamping dome mountain nature Spain",
    "guia-camping-con-ninos-consejos-equipamiento": "family camping kids outdoor nature tent",
    "normativa-pernocta-autocaravanas-andalucia": "campervan sunset coastal roadtrip",
    "ruta-5-dias-camper-costa-del-sol": "campervan coastal roadtrip beach Spain"
}

def get_supabase_client():
    """Returns Supabase client if environment variables are set."""
    supabase_url = os.environ.get("SUPABASE_URL") or os.environ.get("PUBLIC_SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY") or os.environ.get("PUBLIC_SUPABASE_ANON_KEY")

    if supabase_url and supabase_key:
        try:
            from supabase import create_client
            # Sanitize URL
            clean_url = supabase_url.rstrip("/").removesuffix("/rest/v1")
            return create_client(clean_url, supabase_key)
        except Exception as e:
            print(f"[WARN] Could not initialize Supabase client: {e}")
    return None

def fetch_image_from_pexels(query):
    pexels_key = os.environ.get("PEXELS_API_KEY")
    if not pexels_key:
        return None
    try:
        url = f"https://api.pexels.com/v1/search?query={urllib.parse.quote(query)}&per_page=1&orientation=landscape"
        headers = {"Authorization": pexels_key}
        res = requests.get(url, headers=headers, timeout=10)
        if res.status_code == 200:
            data = res.json()
            if data.get("photos") and len(data["photos"]) > 0:
                img_url = data["photos"][0]["src"]["large2x"]
                print(f"[PEXELS] Found image for query '{query}': {img_url}")
                return img_url
    except Exception as e:
        print(f"[PEXELS WARN] Error searching Pexels: {e}")
    return None

def fetch_image_from_unsplash_api(query):
    unsplash_key = os.environ.get("UNSPLASH_ACCESS_KEY") or os.environ.get("UNSPLASH_API_KEY")
    if not unsplash_key:
        return None
    try:
        url = f"https://api.unsplash.com/search/photos?query={urllib.parse.quote(query)}&per_page=1&orientation=landscape"
        headers = {"Authorization": f"Client-ID {unsplash_key}"}
        res = requests.get(url, headers=headers, timeout=10)
        if res.status_code == 200:
            data = res.json()
            if data.get("results") and len(data["results"]) > 0:
                img_url = data["results"][0]["urls"]["regular"]
                print(f"[UNSPLASH API] Found image for query '{query}': {img_url}")
                return img_url
    except Exception as e:
        print(f"[UNSPLASH API WARN] Error searching Unsplash API: {e}")
    return None

def fetch_image_fallback(query):
    """Fallback stock images if no API key is available."""
    fallback_urls = [
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=1200&q=80"
    ]
    # Simple hash based on query string to pick a consistent photo
    idx = abs(hash(query)) % len(fallback_urls)
    return fallback_urls[idx]

def fetch_hero_image_url(query):
    # Try Pexels first
    img_url = fetch_image_from_pexels(query)
    if img_url:
        return img_url

    # Try Unsplash API
    img_url = fetch_image_from_unsplash_api(query)
    if img_url:
        return img_url

    # Direct search fallback
    return fetch_image_fallback(query)

def download_and_process_image(source_url, output_path, max_width=1200, quality=80):
    """Downloads image, resizes if needed, and saves as WebP."""
    print(f"Downloading image from {source_url}...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    resp = requests.get(source_url, headers=headers, timeout=15)
    resp.raise_for_status()

    image = Image.open(io.BytesIO(resp.content))

    # Convert RGBA / Palette mode to RGB
    if image.mode in ("RGBA", "P"):
        image = image.convert("RGB")

    # Resize if image width exceeds max_width
    w, h = image.size
    if w > max_width:
        new_h = int(h * (max_width / float(w)))
        image = image.resize((max_width, new_h), Image.Resampling.LANCZOS)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    image.save(output_path, "WEBP", quality=quality, optimize=True)
    print(f"Saved processed WebP image to: {output_path}")
    return True

def upload_to_supabase_storage(local_path, destination_path):
    """Uploads WebP image to Supabase Storage campsite-images bucket if available."""
    supabase = get_supabase_client()
    if not supabase:
        return None
    try:
        with open(local_path, "rb") as f:
            file_data = f.read()

        # Storage bucket: campsite-images
        bucket = "campsite-images"
        res = supabase.storage.from_(bucket).upload(
            path=destination_path,
            file=file_data,
            file_options={"content-type": "image/webp", "upsert": "true"}
        )
        public_url = supabase.storage.from_(bucket).get_public_url(destination_path)
        print(f"[SUPABASE STORAGE] Uploaded to Supabase bucket '{bucket}': {public_url}")
        return public_url
    except Exception as e:
        print(f"[SUPABASE STORAGE WARN] Could not upload to Supabase storage: {e}")
    return None

def update_markdown_frontmatter(md_path, hero_image_val, hero_alt_val):
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    fm_match = re.search(r'^(---\s*\n)(.*?)(\n---)', content, re.DOTALL)
    if not fm_match:
        print(f"[ERROR] Invalid Markdown frontmatter in {md_path}")
        return False

    start_delim = fm_match.group(1)
    fm_body = fm_match.group(2)
    end_delim = fm_match.group(3)
    rest_content = content[fm_match.end():]

    lines = fm_body.split('\n')
    new_lines = []
    has_hero_image = False
    has_hero_alt = False

    for line in lines:
        if line.startswith("heroImage:"):
            new_lines.append(f'heroImage: "{hero_image_val}"')
            has_hero_image = True
        elif line.startswith("heroImageAlt:"):
            new_lines.append(f'heroImageAlt: "{hero_alt_val}"')
            has_hero_alt = True
        else:
            new_lines.append(line)

    if not has_hero_image:
        new_lines.append(f'heroImage: "{hero_image_val}"')
    if not has_hero_alt:
        new_lines.append(f'heroImageAlt: "{hero_alt_val}"')

    new_fm = start_delim + '\n'.join(new_lines) + end_delim
    new_content = new_fm + rest_content

    with open(md_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Updated frontmatter in {md_path}: heroImage='{hero_image_val}', heroImageAlt='{hero_alt_val}'")
    return True

def process_guide_file(md_path, force=False, custom_query=None):
    filename = os.path.basename(md_path)
    slug = filename.removesuffix(".md")

    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract title from frontmatter
    title_match = re.search(r'^title:\s*["\']?(.*?)["\']?$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else slug.replace("-", " ").title()

    hero_alt = f"Imagen ilustrativa: {title}"

    # Local WebP file output path
    local_webp_filename = f"{slug}.webp"
    local_webp_path = os.path.join(PUBLIC_OUTPUT_DIR, local_webp_filename)
    public_url_path = f"{import_meta_env_base() if False else ''}/images/guias/{local_webp_filename}"

    # Search query
    query = custom_query or KEYWORD_MAPPING.get(slug) or title

    # Check if already processed and not forced
    if os.path.exists(local_webp_path) and not force and 'heroImageAlt:' in content:
        print(f"[SKIP] Guide '{slug}' already has WebP image at {local_webp_path}")
        return True

    print(f"\nProcessing guide: {slug}")
    print(f"Keyword search: '{query}'")

    # Fetch source image URL
    source_url = fetch_hero_image_url(query)

    # Download and process to local WebP
    download_and_process_image(source_url, local_webp_path)

    # Try uploading to Supabase Storage if configured
    supabase_storage_url = upload_to_supabase_storage(local_webp_path, f"guias/{local_webp_filename}")

    final_hero_image = supabase_storage_url if supabase_storage_url else f"/images/guias/{local_webp_filename}"

    # Update frontmatter
    update_markdown_frontmatter(md_path, final_hero_image, hero_alt)
    return True

def main():
    parser = argparse.ArgumentParser(description="Scrape and process hero images for Astro guides.")
    parser.add_argument("--slug", type=str, help="Target a specific guide slug")
    parser.add_argument("--force", action="store_true", help="Force re-downloading and updating existing images")
    parser.add_argument("--query", type=str, help="Custom query string for image search")
    args = parser.parse_args()

    os.makedirs(PUBLIC_OUTPUT_DIR, exist_ok=True)

    if args.slug:
        target_file = os.path.join(GUIDES_DIR, f"{args.slug}.md")
        if not os.path.exists(target_file):
            print(f"[ERROR] Guide file not found: {target_file}")
            sys.exit(1)
        process_guide_file(target_file, force=args.force, custom_query=args.query)
    else:
        guide_files = sorted(glob.glob(f"{GUIDES_DIR}/*.md"))
        print(f"Found {len(guide_files)} guide files in {GUIDES_DIR}:")
        for file in guide_files:
            process_guide_file(file, force=args.force, custom_query=args.query)

if __name__ == "__main__":
    main()
