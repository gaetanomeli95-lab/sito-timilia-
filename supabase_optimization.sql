-- ============================================
-- TIMILIA — DB Optimization & Security
-- Run this in Supabase SQL Editor (Dashboard > SQL)
-- ============================================

-- 1. INDICES for performance under high traffic
-- These speed up the most common queries

-- Orders: filter by customer (account page)
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- Orders: filter/sort by status (admin panel)
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Orders: sort by created_at (admin + account)
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Orders: filter by payment_status (webhook)
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Customers: lookup by auth_id (auth verification)
CREATE INDEX IF NOT EXISTS idx_customers_auth_id ON customers(auth_id);

-- Customers: lookup by email (checkout)
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Reviews: filter by customer (account page)
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);

-- Reviews: filter approved (public display)
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);

-- Reviews: sort by created_at
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Newsletter: dedup upsert
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- ============================================
-- 2. ROW LEVEL SECURITY (RLS) policies
-- Ensures users can only access their own data
-- ============================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- CUSTOMERS: users can read/update only their own profile
DROP POLICY IF EXISTS "customers_select_own" ON customers;
CREATE POLICY "customers_select_own" ON customers
  FOR SELECT USING (auth_id = auth.uid());

DROP POLICY IF EXISTS "customers_update_own" ON customers;
CREATE POLICY "customers_update_own" ON customers
  FOR UPDATE USING (auth_id = auth.uid());

-- Note: INSERT and DELETE on customers are handled via service_role (server-side only)
-- The anon key cannot insert/delete directly

-- ORDERS: users can read only their own orders
DROP POLICY IF EXISTS "orders_select_own" ON orders;
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT USING (customer_id IN (
    SELECT id FROM customers WHERE auth_id = auth.uid()
  ));

-- Note: INSERT/UPDATE on orders handled via service_role only

-- REVIEWS: anyone can read approved reviews
DROP POLICY IF EXISTS "reviews_select_approved" ON reviews;
CREATE POLICY "reviews_select_approved" ON reviews
  FOR SELECT USING (approved = true);

-- Users can read their own reviews (even unapproved)
DROP POLICY IF EXISTS "reviews_select_own" ON reviews;
CREATE POLICY "reviews_select_own" ON reviews
  FOR SELECT USING (customer_id IN (
    SELECT id FROM customers WHERE auth_id = auth.uid()
  ));

-- Note: INSERT/UPDATE/DELETE on reviews handled via service_role only

-- NEWSLETTER: no public read access (service_role only)
-- INSERT is handled via service_role API

-- SETTINGS: no public access (service_role only)

-- ============================================
-- 3. Verify policies are active
-- ============================================
SELECT tablename, policyname, cmd, roles, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
