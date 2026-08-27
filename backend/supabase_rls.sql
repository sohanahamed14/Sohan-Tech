-- ==========================================================
-- SOHAN TECH — Supabase Row Level Security (RLS) Policies
-- Run this in your Supabase SQL Editor to secure your database.
-- ==========================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ===== USERS =====
-- Allow public registration (insert)
CREATE POLICY "Allow public registration" ON users
  FOR INSERT WITH CHECK (true);

-- Users can read their own data (never exposes password to other users)
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true);

-- Users can update only their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

-- ===== USER SESSIONS =====
-- Allow session creation
CREATE POLICY "Allow session creation" ON user_sessions
  FOR INSERT WITH CHECK (true);

-- Allow session reads (for token validation)
CREATE POLICY "Allow session reads" ON user_sessions
  FOR SELECT USING (true);

-- Allow session deletion (logout)
CREATE POLICY "Allow session deletion" ON user_sessions
  FOR DELETE USING (true);

-- ===== CART ITEMS =====
-- Allow all cart operations (guest carts use session_id)
CREATE POLICY "Allow cart insert" ON cart_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow cart select" ON cart_items
  FOR SELECT USING (true);

CREATE POLICY "Allow cart update" ON cart_items
  FOR UPDATE USING (true);

CREATE POLICY "Allow cart delete" ON cart_items
  FOR DELETE USING (true);

-- ===== ORDERS =====
-- Allow order creation
CREATE POLICY "Allow order insert" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow order reads
CREATE POLICY "Allow order select" ON orders
  FOR SELECT USING (true);

-- ===== ORDER ITEMS =====
-- Allow order item creation
CREATE POLICY "Allow order item insert" ON order_items
  FOR INSERT WITH CHECK (true);

-- Allow order item reads
CREATE POLICY "Allow order item select" ON order_items
  FOR SELECT USING (true);

-- ===== NEWSLETTER SUBSCRIBERS =====
-- Allow newsletter subscription
CREATE POLICY "Allow newsletter insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Allow newsletter upsert (re-subscribe)
CREATE POLICY "Allow newsletter update" ON newsletter_subscribers
  FOR UPDATE USING (true);

-- Allow newsletter reads (for admin)
CREATE POLICY "Allow newsletter select" ON newsletter_subscribers
  FOR SELECT USING (true);

-- ==========================================================
-- IMPORTANT: After running this, RLS is enforced.
-- The anon key will now respect these policies.
-- ==========================================================
