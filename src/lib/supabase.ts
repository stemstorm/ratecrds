import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

export interface Celebrity {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar_url: string;
  category_id: string;
  verified: boolean;
  followers: number;
  engagement_rate: number;
  trending_score: number;
  created_at: string;
  category?: Category;
}

export interface RateCard {
  id: string;
  celebrity_id: string;
  service_type: string;
  description: string;
  price: number;
  duration: string;
  active: boolean;
  created_at: string;
}

export interface Booking {
  celebrity_id: string;
  rate_card_id: string;
  client_name: string;
  client_email: string;
  client_company: string;
  booking_date: string;
  message: string;
  total_amount: number;
}
