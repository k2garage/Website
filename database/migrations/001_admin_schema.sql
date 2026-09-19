CREATE TABLE IF NOT EXISTS cars (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  currency TEXT NOT NULL DEFAULT 'Kč',
  year INTEGER NOT NULL CHECK (year BETWEEN 1900 AND 2100),
  mileage INTEGER NOT NULL DEFAULT 0 CHECK (mileage >= 0),
  fuel TEXT NOT NULL DEFAULT '',
  transmission TEXT NOT NULL DEFAULT '',
  power TEXT,
  description TEXT,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'contact' CHECK (source IN ('contact', 'reservation', 'listing')),
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS pricing_tiers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_label TEXT NOT NULL,
  highlighted BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'site' CHECK (id = 'site'),
  site_name TEXT NOT NULL,
  logo_url TEXT,
  favicon_url TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_traffic (
  day DATE NOT NULL,
  pathname TEXT NOT NULL,
  visits INTEGER NOT NULL DEFAULT 0 CHECK (visits >= 0),
  PRIMARY KEY (day, pathname)
);

CREATE INDEX IF NOT EXISTS cars_status_updated_idx ON cars (status, updated_at DESC);
CREATE INDEX IF NOT EXISTS messages_status_created_idx ON contact_messages (status, created_at DESC);
CREATE INDEX IF NOT EXISTS traffic_day_idx ON page_traffic (day DESC);

INSERT INTO site_settings (id, site_name, logo_url, favicon_url, email, phone, facebook_url, instagram_url, youtube_url)
VALUES ('site', 'K2 garage', '/assets/K2-GARAGE-mlecna.webp', '/assets/favicon.ico', 'k2garage@seznam.cz', '+420 725 480 018', '', '', '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO pricing_tiers (id, title, description, price_label, highlighted, sort_order, features)
VALUES
  ('pricing-inspection', 'Kontrola vozu před koupí', 'Technik přijede k vybranému vozu a srozumitelně vysvětlí, co našel.', 'od 3 490 Kč', TRUE, 1, '["Kontrola konkrétního vozu", "Závady a riziková místa", "Jasné doporučení před koupí"]'::jsonb),
  ('pricing-import', 'Prověření a dovoz vozu', 'Pomoc s výběrem, prověřením nabídky a dalším postupem při dovozu.', 'od 2 490 Kč', FALSE, 2, '["Prověření vybrané nabídky", "Doporučení dalšího postupu", "Individuální rozsah"]'::jsonb),
  ('pricing-detailing', 'Detailing interiéru', 'Důkladná péče o čistší interiér a lepší pocit z každé jízdy.', 'od 2 490 Kč', FALSE, 3, '["Hloubkové čištění", "Péče podle stavu", "Individuální rozsah"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
