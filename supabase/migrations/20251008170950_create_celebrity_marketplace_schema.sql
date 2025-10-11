/*
  # Celebrity Rate Card Marketplace Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name (e.g., "Music", "Sports", "Acting")
      - `icon` (text) - Icon name for UI
      - `created_at` (timestamptz)
    
    - `celebrities`
      - `id` (uuid, primary key)
      - `name` (text) - Celebrity full name
      - `slug` (text, unique) - URL-friendly identifier
      - `bio` (text) - Short biography
      - `avatar_url` (text) - Profile image URL
      - `category_id` (uuid, foreign key) - Links to categories
      - `verified` (boolean) - Verification status
      - `followers` (integer) - Social media follower count
      - `engagement_rate` (decimal) - Average engagement percentage
      - `trending_score` (integer) - Algorithm score for trending board
      - `created_at` (timestamptz)
    
    - `rate_cards`
      - `id` (uuid, primary key)
      - `celebrity_id` (uuid, foreign key) - Links to celebrities
      - `service_type` (text) - Type of service (e.g., "Brand Post", "Event Appearance")
      - `description` (text) - Service details
      - `price` (integer) - Price in USD
      - `duration` (text) - Duration or deliverable details
      - `active` (boolean) - Whether rate is currently available
      - `created_at` (timestamptz)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `celebrity_id` (uuid, foreign key)
      - `rate_card_id` (uuid, foreign key)
      - `client_name` (text) - Client/brand name
      - `client_email` (text) - Contact email
      - `client_company` (text) - Company name
      - `booking_date` (date) - Requested date for service
      - `message` (text) - Additional details from client
      - `status` (text) - Booking status (pending, confirmed, declined, completed)
      - `total_amount` (integer) - Total booking amount
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for celebrities, rate_cards, and categories
    - Public insert for bookings to allow instant booking
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS celebrities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  bio text NOT NULL,
  avatar_url text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  verified boolean DEFAULT true,
  followers integer DEFAULT 0,
  engagement_rate decimal(5,2) DEFAULT 0,
  trending_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rate_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  celebrity_id uuid REFERENCES celebrities(id) ON DELETE CASCADE NOT NULL,
  service_type text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  duration text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  celebrity_id uuid REFERENCES celebrities(id) ON DELETE CASCADE NOT NULL,
  rate_card_id uuid REFERENCES rate_cards(id) ON DELETE CASCADE NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_company text NOT NULL,
  booking_date date NOT NULL,
  message text DEFAULT '',
  status text DEFAULT 'pending',
  total_amount integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_celebrities_slug ON celebrities(slug);
CREATE INDEX IF NOT EXISTS idx_celebrities_trending ON celebrities(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_celebrities_category ON celebrities(category_id);
CREATE INDEX IF NOT EXISTS idx_rate_cards_celebrity ON rate_cards(celebrity_id);
CREATE INDEX IF NOT EXISTS idx_bookings_celebrity ON bookings(celebrity_id);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE celebrities ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Celebrities are viewable by everyone"
  ON celebrities FOR SELECT
  USING (true);

CREATE POLICY "Active rate cards are viewable by everyone"
  ON rate_cards FOR SELECT
  USING (active = true);

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'email' = client_email);

INSERT INTO categories (name, icon) VALUES
  ('Music', 'Music'),
  ('Sports', 'Trophy'),
  ('Acting', 'Film'),
  ('Fashion', 'Sparkles'),
  ('Gaming', 'Gamepad2'),
  ('Business', 'Briefcase')
ON CONFLICT DO NOTHING;