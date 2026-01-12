/*
  # LunchQuest Database Schema

  ## Overview
  Creates the core tables for the LunchQuest restaurant recommendation system.
  This migration sets up restaurants, votes, and their relationships with proper
  security policies.

  ## New Tables
  
  ### `restaurants`
  Stores restaurant information including location, pricing, and metadata.
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Restaurant name
  - `address` (text) - Physical address
  - `price_level` (text) - Price indicator: €, €€, or €€€
  - `distance_minutes` (integer) - Walking time in minutes
  - `cuisine_type` (text) - Type of cuisine (Italian, Chinese, etc.)
  - `speed` (text) - Service speed: rapido, normal, or lento
  - `maps_url` (text, optional) - Google Maps link
  - `internal_notes` (text, optional) - Team notes about the restaurant
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `votes`
  Stores individual restaurant ratings from team members.
  - `id` (uuid, primary key) - Unique identifier
  - `restaurant_id` (uuid, foreign key) - Links to restaurants table
  - `user_name` (text) - Name of the person voting
  - `score_overall` (integer) - Overall rating 1-5
  - `score_food` (integer) - Food quality rating 1-5
  - `score_quantity` (integer) - Portion size rating 1-5
  - `score_price` (integer) - Value for money rating 1-5
  - `score_ambience` (integer) - Atmosphere rating 1-5
  - `comment` (text, optional) - Additional comments
  - `created_at` (timestamptz) - Voting timestamp

  ## Security
  - Enable Row Level Security (RLS) on both tables
  - Public read access for all users (no auth required for MVP)
  - Public write access for votes (team collaboration)
  - Public write access for restaurants (admin features handled in app layer)

  ## Important Notes
  1. All score fields are constrained to values between 1 and 5
  2. Price level is constrained to €, €€, or €€€
  3. Speed is constrained to rapido, normal, or lento
  4. Cascading deletes ensure vote cleanup when restaurants are removed
  5. Indexes added for common query patterns (restaurant lookups, date ranges)
*/

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  price_level text NOT NULL CHECK (price_level IN ('€', '€€', '€€€')),
  distance_minutes integer NOT NULL CHECK (distance_minutes > 0),
  cuisine_type text NOT NULL,
  speed text NOT NULL CHECK (speed IN ('rapido', 'normal', 'lento')),
  maps_url text,
  internal_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  score_overall integer NOT NULL CHECK (score_overall >= 1 AND score_overall <= 5),
  score_food integer NOT NULL CHECK (score_food >= 1 AND score_food <= 5),
  score_quantity integer NOT NULL CHECK (score_quantity >= 1 AND score_quantity <= 5),
  score_price integer NOT NULL CHECK (score_price >= 1 AND score_price <= 5),
  score_ambience integer NOT NULL CHECK (score_ambience >= 1 AND score_ambience <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_votes_restaurant_id ON votes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);

-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies for restaurants (public access for MVP)
CREATE POLICY "Allow public read access to restaurants"
  ON restaurants
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to restaurants"
  ON restaurants
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to restaurants"
  ON restaurants
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to restaurants"
  ON restaurants
  FOR DELETE
  TO public
  USING (true);

-- Create policies for votes (public access for team collaboration)
CREATE POLICY "Allow public read access to votes"
  ON votes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to votes"
  ON votes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to votes"
  ON votes
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to votes"
  ON votes
  FOR DELETE
  TO public
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for restaurants table
DROP TRIGGER IF EXISTS update_restaurants_updated_at ON restaurants;
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();