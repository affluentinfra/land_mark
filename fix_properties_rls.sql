-- Fix RLS on properties table for authenticated admin CRUD
-- Run this in Supabase SQL Editor

-- Drop any conflicting old policies first
DROP POLICY IF EXISTS "Allow public read access on properties" ON public.properties;
DROP POLICY IF EXISTS "Allow authenticated admin insert properties" ON public.properties;
DROP POLICY IF EXISTS "Allow authenticated admin update properties" ON public.properties;
DROP POLICY IF EXISTS "Allow authenticated admin delete properties" ON public.properties;
DROP POLICY IF EXISTS "owner can manage own properties" ON public.properties;
DROP POLICY IF EXISTS "admin full property access" ON public.properties;

-- Anyone can read properties (needed for public site)
CREATE POLICY "public_read_properties"
ON public.properties
FOR SELECT
USING (true);

-- Any authenticated user can insert (admin is authenticated)
CREATE POLICY "auth_insert_properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Any authenticated user can update
CREATE POLICY "auth_update_properties"
ON public.properties
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Any authenticated user can delete
CREATE POLICY "auth_delete_properties"
ON public.properties
FOR DELETE
TO authenticated
USING (true);
