# MejoresCampings (Mejorescampings.es) ⛺🌲

**MejoresCampings** is a high-performance, low-maintenance static site (SSG) designed for programmatic SEO (pSEO) to capture long-tail organic search traffic for camping and glamping accommodations across Spain.

The initial MVP focuses on **Andalucía (Málaga province)** to validate data extraction, coordinate geocoding, amenity tagging, and automated SSG static site builds.

---

## 🛠 Tech Stack & Architecture

- **Frontend / SSG:** [Astro v5](https://astro.build/) + [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend / Database:** [Supabase](https://supabase.com/) (PostgreSQL + REST API) with offline local JSON fallback (`src/data/`)
- **Data Pipeline:** Python 3 (`scraper.py`) utilizing `requests`, `beautifulsoup4`, and `supabase-py`
- **Automation & Hosting:** GitHub Actions (`.github/workflows/deploy.yml`) + GitHub Pages
- **Testing & QA:** [Playwright](https://playwright.dev/) E2E test suite running across desktop & mobile viewports

---

## 🚀 Key Features & pSEO Dynamic Routing

### 🗺 Programmatic SEO Routes
Astro statically generates dynamic routes querying Supabase or local JSON data:
- **Homepage:** `/` (Hero search, category grid, top features)
- **Province Overview:** `/andalucia/malaga`
- **Feature Filter Matrix:** `/andalucia/malaga/campings-con-piscina`, `/andalucia/malaga/animacion-infantil`, etc.
- **Accommodation Listing:** `/camping/[slug]` (e.g., `/camping/camping-el-sur-ronda`)

### 💰 Monetization Strategy & Layout Rules
- **Hybrid Strategy:** CPA affiliate links (Travelpayouts / Pitchup) + CPM Google AdSense blocks.
- **CLS Prevention:** Fixed aspect ratios for photo galleries (`aspect-[16/9]`) and fixed-dimension containers (`300x250`, `728x90`) for ad blocks.
- **Ad Block Limits:** Capped at $\le 3$ ad blocks per detail page. Zero above-the-fold ads on the homepage.
- **Fallback Rule:** If `affiliate_url` is null, an AdSense fallback block is automatically rendered in place of the primary reservation button.
- **Mobile UX:** Sticky bottom CTA bar on mobile screens for seamless user conversion.

---

## 🐍 Data Pipeline & Quality Gate

The Python script (`scraper.py`) runs automatically via GitHub Actions on the **1st day of every month** (`0 0 1 * *`).

### Extraction Pipeline Workflow:
1. **Extraction:** Scrapes public directories and open APIs for camping attributes (name, coordinates, amenities, image URLs, affiliate URLs).
2. **Transformation:** Normalizes names (Title Case), generates unique slugs, validates lat/lng numeric bounds, and ensures a minimum of 3 media image URLs.
3. **Quality Gate Assertion:** Calculates the error rate across raw records. **The build process fails immediately if > 10% of records fail validation checks**, preventing corrupted data from deploying.
4. **Upsert:** Connects to Supabase to perform an `UPSERT` on `campings`, `locations`, `features`, and `camping_features` tables, while simultaneously updating local static JSON files in `src/data/`.

---

## 🗄 Database Schema (`supabase/schema.sql`)

```sql
-- Core tables
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL,
  province TEXT NOT NULL,
  municipality TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE campings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  affiliate_url TEXT,
  official_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  price_tier INT DEFAULT 2,
  municipality_slug TEXT NOT NULL,
  amenities JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  key TEXT UNIQUE NOT NULL
);

CREATE TABLE camping_features (
  camping_id UUID REFERENCES campings(id) ON DELETE CASCADE,
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  PRIMARY KEY (camping_id, feature_id)
);
```

---

## 💻 Local Development & Testing

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/baronvonbirra/mejorescampings.git
cd mejorescampings

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Run Data Pipeline (Scraper)
```bash
python3 scraper.py
```

### 3. Local Development Server
```bash
npm run dev
# Open http://localhost:4321
```

### 4. Build & Run E2E QA Tests
```bash
# Build static site output
npm run build

# Run Playwright tests
npx playwright test
```

---

## ⚙️ CI/CD Deployment (`.github/workflows/deploy.yml`)

The GitHub Actions workflow automates the full lifecycle:
1. Triggered on push to `main` branch or monthly cron (`0 0 1 * *`).
2. Installs Python dependencies and runs `scraper.py` with the 10% quality gate assertion.
3. Executes `npm run build` to compile the Astro static site.
4. Runs Playwright E2E tests against the built site.
5. Deploys the static assets in `dist/` directly to **GitHub Pages**.

> **Important Configuration Note:**
> To ensure GitHub Pages serves the compiled Astro SSG output instead of raw repository root files (such as `README.md`), you must configure the GitHub repository settings:
> Go to **Settings** $\rightarrow$ **Pages** $\rightarrow$ **Build and deployment** $\rightarrow$ **Source**, and select **GitHub Actions**.
