export type ListingStatus = "available" | "sold";
export type MessageStatus = "unread" | "read";

export type CarListing = {
  id: string;
  title: string;
  make: string;
  model: string;
  price: number;
  currency: string;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  power?: string | null;
  description?: string | null;
  photoUrl?: string | null;
  status: ListingStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  source: "contact" | "reservation" | "listing";
  status: MessageStatus;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
};

export type PricingTier = {
  id: string;
  title: string;
  description: string;
  priceLabel: string;
  highlighted: boolean;
  sortOrder: number;
  features: string[];
  updatedAt: string;
};

export type SiteSettings = {
  id: string;
  siteName: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  email: string;
  phone: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  updatedAt: string;
};

export type TrafficPoint = {
  day: string;
  visits: number;
};

export type DashboardData = {
  stats: {
    totalListings: number;
    activeListings: number;
    unreadMessages: number;
    trafficToday: number;
    trafficChange: number;
  };
  traffic: TrafficPoint[];
  recentListings: CarListing[];
};

export type AdminBootstrap = {
  dashboard: DashboardData;
  messages: ContactMessage[];
  cars: CarListing[];
  pricing: PricingTier[];
  settings: SiteSettings;
};

export type ApiResponse<T> = {
  data: T;
  meta?: Record<string, unknown>;
};
