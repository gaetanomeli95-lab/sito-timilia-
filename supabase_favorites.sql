-- Add favorites column to customers table
-- Run this in Supabase SQL Editor

ALTER TABLE customers
ADD COLUMN IF NOT EXISTS favorites TEXT[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN customers.favorites IS 'Array of favorite menu item names, synced from client';
