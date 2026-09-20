import postgres from "postgres";
import type { CarListing, ContactMessage, PricingTier, SiteSettings } from "../../shared/admin";

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? postgres(databaseUrl, { max: 5, idle_timeout: 20, connect_timeout: 10, ssl: "require" }) : null;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("Databáze není připojena. Doplňte proměnnou DATABASE_URL.");
  }
}

function database() {
  if (!sql) throw new DatabaseNotConfiguredError();
  return { query: (text: string, params: unknown[] = []) => sql.unsafe(text, params as never[]) };
}

const toIso = (value: unknown) => new Date(String(value)).toISOString();

function mapCar(row: Record<string, unknown>): CarListing {
  return {
    id: String(row.id),
    title: String(row.title),
    make: String(row.make),
    model: String(row.model),
    price: Number(row.price),
    currency: String(row.currency ?? "Kč"),
    year: Number(row.year),
    mileage: Number(row.mileage),
    fuel: String(row.fuel),
    transmission: String(row.transmission),
    power: row.power ? String(row.power) : null,
    description: row.description ? String(row.description) : null,
    photoUrl: row.photo_url ? String(row.photo_url) : null,
    status: row.status === "sold" ? "sold" : "available",
    featured: Boolean(row.featured),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function mapMessage(row: Record<string, unknown>): ContactMessage {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: row.phone ? String(row.phone) : null,
    subject: String(row.subject),
    message: String(row.message),
    source: row.source === "reservation" || row.source === "listing" ? row.source : "contact",
    status: row.status === "read" ? "read" : "unread",
    metadata: row.metadata && typeof row.metadata === "object" ? row.metadata as Record<string, unknown> : null,
    createdAt: toIso(row.created_at),
  };
}

function mapPricing(row: Record<string, unknown>): PricingTier {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    priceLabel: String(row.price_label),
    highlighted: Boolean(row.highlighted),
    sortOrder: Number(row.sort_order),
    features: Array.isArray(row.features) ? row.features.map(String) : [],
    updatedAt: toIso(row.updated_at),
  };
}

function mapSettings(row: Record<string, unknown>): SiteSettings {
  return {
    id: String(row.id),
    siteName: String(row.site_name),
    logoUrl: row.logo_url ? String(row.logo_url) : null,
    faviconUrl: row.favicon_url ? String(row.favicon_url) : null,
    email: String(row.email),
    phone: String(row.phone),
    facebookUrl: row.facebook_url ? String(row.facebook_url) : null,
    instagramUrl: row.instagram_url ? String(row.instagram_url) : null,
    youtubeUrl: row.youtube_url ? String(row.youtube_url) : null,
    updatedAt: toIso(row.updated_at),
  };
}

export function dbConfigured() {
  return Boolean(sql);
}

export async function getCars(options: { includeSold?: boolean; limit?: number } = {}) {
  const rows = await database().query("SELECT * FROM cars " + (options.includeSold ? "" : "WHERE status = 'available' ") + "ORDER BY featured DESC, updated_at DESC " + (options.limit ? "LIMIT $1" : ""), options.limit ? [options.limit] : []);
  return rows.map(mapCar);
}

export async function getCar(id: string) {
  const rows = await database().query("SELECT * FROM cars WHERE id = $1 LIMIT 1", [id]);
  return rows[0] ? mapCar(rows[0]) : null;
}

export async function saveCar(input: Omit<CarListing, "createdAt" | "updatedAt">, isNew: boolean) {
  const db = database();
  const params = [input.id, input.title, input.make, input.model, input.price, input.currency, input.year, input.mileage, input.fuel, input.transmission, input.power ?? null, input.description ?? null, input.photoUrl ?? null, input.status, input.featured];
  const query = isNew
    ? "INSERT INTO cars (id,title,make,model,price,currency,year,mileage,fuel,transmission,power,description,photo_url,status,featured) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *"
    : "UPDATE cars SET title=$2, make=$3, model=$4, price=$5, currency=$6, year=$7, mileage=$8, fuel=$9, transmission=$10, power=$11, description=$12, photo_url=$13, status=$14, featured=$15, updated_at=NOW() WHERE id=$1 RETURNING *";
  const rows = await db.query(query, params);
  return rows[0] ? mapCar(rows[0]) : null;
}

export async function deleteCar(id: string) {
  const rows = await database().query("DELETE FROM cars WHERE id = $1 RETURNING id", [id]);
  return rows.length > 0;
}

export async function getMessages() {
  const rows = await database().query("SELECT * FROM contact_messages ORDER BY CASE WHEN status = 'unread' THEN 0 ELSE 1 END, created_at DESC");
  return rows.map(mapMessage);
}

export async function getMessage(id: string) {
  const rows = await database().query("SELECT * FROM contact_messages WHERE id = $1 LIMIT 1", [id]);
  return rows[0] ? mapMessage(rows[0]) : null;
}

export async function createMessage(input: Omit<ContactMessage, "id" | "createdAt" | "status">) {
  const id = crypto.randomUUID();
  const rows = await database().query("INSERT INTO contact_messages (id,name,email,phone,subject,message,source,status,metadata) VALUES ($1,$2,$3,$4,$5,$6,$7,'unread',$8::jsonb) RETURNING *", [id, input.name, input.email, input.phone ?? null, input.subject, input.message, input.source, JSON.stringify(input.metadata ?? {})]);
  return mapMessage(rows[0]);
}

export async function updateMessageStatus(id: string, status: "read" | "unread") {
  const rows = await database().query("UPDATE contact_messages SET status = $2, read_at = CASE WHEN $2 = 'read' THEN NOW() ELSE NULL END WHERE id = $1 RETURNING *", [id, status]);
  return rows[0] ? mapMessage(rows[0]) : null;
}

export async function deleteMessage(id: string) {
  const rows = await database().query("DELETE FROM contact_messages WHERE id = $1 RETURNING id", [id]);
  return rows.length > 0;
}

export async function getPricing() {
  const rows = await database().query("SELECT * FROM pricing_tiers ORDER BY sort_order ASC, updated_at DESC");
  return rows.map(mapPricing);
}

export async function savePricing(tiers: PricingTier[]) {
  const db = database();
  const saved: PricingTier[] = [];
  for (const tier of tiers) {
    const rows = await db.query("INSERT INTO pricing_tiers (id,title,description,price_label,highlighted,sort_order,features) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb) ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, price_label=EXCLUDED.price_label, highlighted=EXCLUDED.highlighted, sort_order=EXCLUDED.sort_order, features=EXCLUDED.features, updated_at=NOW() RETURNING *", [tier.id, tier.title, tier.description, tier.priceLabel, tier.highlighted, tier.sortOrder, JSON.stringify(tier.features)]);
    saved.push(mapPricing(rows[0]));
  }
  return saved;
}

export async function getSettings() {
  const rows = await database().query("SELECT * FROM site_settings WHERE id = 'site' LIMIT 1");
  return rows[0] ? mapSettings(rows[0]) : null;
}

export async function saveSettings(input: SiteSettings) {
  const rows = await database().query("INSERT INTO site_settings (id,site_name,logo_url,favicon_url,email,phone,facebook_url,instagram_url,youtube_url) VALUES ('site',$1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO UPDATE SET site_name=EXCLUDED.site_name, logo_url=EXCLUDED.logo_url, favicon_url=EXCLUDED.favicon_url, email=EXCLUDED.email, phone=EXCLUDED.phone, facebook_url=EXCLUDED.facebook_url, instagram_url=EXCLUDED.instagram_url, youtube_url=EXCLUDED.youtube_url, updated_at=NOW() RETURNING *", [input.siteName, input.logoUrl ?? null, input.faviconUrl ?? null, input.email, input.phone, input.facebookUrl ?? null, input.instagramUrl ?? null, input.youtubeUrl ?? null]);
  return mapSettings(rows[0]);
}

export async function recordTraffic(pathname: string) {
  await database().query("INSERT INTO page_traffic (day, pathname, visits) VALUES (CURRENT_DATE, $1, 1) ON CONFLICT (day, pathname) DO UPDATE SET visits = page_traffic.visits + 1", [pathname]);
}

export async function getDashboard() {
  const db = database();
  const [listingRows, activeRows, unreadRows, trafficRows, recentRows, trendRows] = await Promise.all([
    db.query("SELECT COUNT(*)::int AS count FROM cars"),
    db.query("SELECT COUNT(*)::int AS count FROM cars WHERE status = 'available'"),
    db.query("SELECT COUNT(*)::int AS count FROM contact_messages WHERE status = 'unread'"),
    db.query("SELECT COALESCE(SUM(visits), 0)::int AS count FROM page_traffic WHERE day = CURRENT_DATE"),
    db.query("SELECT * FROM cars ORDER BY updated_at DESC LIMIT 5"),
    db.query("SELECT day::text AS day, COALESCE(SUM(visits), 0)::int AS visits FROM page_traffic WHERE day >= CURRENT_DATE - INTERVAL '6 days' GROUP BY day ORDER BY day"),
  ]);
  const today = Number(trafficRows[0]?.count ?? 0);
  const yesterdayRows = await db.query("SELECT COALESCE(SUM(visits), 0)::int AS count FROM page_traffic WHERE day = CURRENT_DATE - INTERVAL '1 day'");
  const yesterday = Number(yesterdayRows[0]?.count ?? 0);
  const trafficMap = new Map(trendRows.map((row) => [new Date(String(row.day)).toISOString().slice(0, 10), Number(row.visits)]));
  const traffic = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const iso = date.toISOString().slice(0, 10);
    return { day: new Intl.DateTimeFormat("cs-CZ", { weekday: "short" }).format(date).replace(".", ""), visits: trafficMap.get(iso) ?? 0 };
  });
  return {
    stats: {
      totalListings: Number(listingRows[0]?.count ?? 0),
      activeListings: Number(activeRows[0]?.count ?? 0),
      unreadMessages: Number(unreadRows[0]?.count ?? 0),
      trafficToday: today,
      trafficChange: yesterday > 0 ? Math.round(((today - yesterday) / yesterday) * 1000) / 10 : 0,
    },
    traffic,
    recentListings: recentRows.map(mapCar),
  };
}

export async function contentSnapshot() {
  const [cars, pricing, settings] = await Promise.all([getCars({ includeSold: true }), getPricing(), getSettings()]);
  return { generatedAt: new Date().toISOString(), cars, pricing, settings };
}
