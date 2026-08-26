-- ==========================================================
-- SOHAN TECH — Full Database Schema for Supabase (PostgreSQL)
-- Converted from MySQL schema for Supabase deployment
-- ==========================================================

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(191)  NOT NULL UNIQUE,
  phone      VARCHAR(30)   NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  role       VARCHAR(10)   NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar     VARCHAR(255)  DEFAULT NULL,
  address    TEXT          DEFAULT NULL,
  city       VARCHAR(100)  DEFAULT 'Dhaka',
  created_at TIMESTAMPTZ   DEFAULT NOW(),
  updated_at TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- 2. AUTH TOKENS
CREATE TABLE IF NOT EXISTS user_sessions (
  id         SERIAL PRIMARY KEY,
  user_id    INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(255) NOT NULL UNIQUE,
  user_agent VARCHAR(500) NULL,
  ip_address VARCHAR(50)  NULL,
  expires_at TIMESTAMPTZ  NOT NULL,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);

-- 3. CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
  id         SERIAL PRIMARY KEY,
  user_id    INT          NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(100) NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  name       VARCHAR(255) NOT NULL,
  brand      VARCHAR(100) DEFAULT '',
  price      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  old_price  DECIMAL(12,2) NULL,
  qty        INT          NOT NULL DEFAULT 1,
  emoji      VARCHAR(20)  DEFAULT '🛍️',
  image_url  VARCHAR(500) NULL,
  category   VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMPTZ  DEFAULT NOW(),
  updated_at TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE(session_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);

-- 4. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id               SERIAL PRIMARY KEY,
  order_id         VARCHAR(50)   NOT NULL UNIQUE,
  user_id          INT           NULL REFERENCES users(id) ON DELETE SET NULL,
  customer_name    VARCHAR(150)  NOT NULL,
  customer_phone   VARCHAR(30)   NOT NULL,
  customer_email   VARCHAR(191)  NULL,
  customer_address TEXT          NOT NULL,
  customer_city    VARCHAR(100)  DEFAULT 'Dhaka',
  customer_note    TEXT          NULL,
  subtotal         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  shipping         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  savings          DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total            DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  payment_method   VARCHAR(50)   NOT NULL DEFAULT 'cod',
  created_at       TIMESTAMPTZ   DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- 5. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   VARCHAR(50)   NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id VARCHAR(100)  NOT NULL,
  name       VARCHAR(255)  NOT NULL,
  brand      VARCHAR(100)  DEFAULT '',
  price      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  old_price  DECIMAL(12,2) NULL,
  qty        INT           NOT NULL DEFAULT 1,
  emoji      VARCHAR(20)   DEFAULT '🛍️',
  image_url  VARCHAR(500)  NULL,
  category   VARCHAR(100)  DEFAULT 'general',
  created_at TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_oi_order ON order_items(order_id);

-- 6. NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(191) NOT NULL UNIQUE,
  ip_address VARCHAR(50)  NULL,
  source     VARCHAR(100) DEFAULT 'homepage_stay_in_the_loop',
  status     VARCHAR(20)  NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  created_at TIMESTAMPTZ  DEFAULT NOW(),
  updated_at TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);
