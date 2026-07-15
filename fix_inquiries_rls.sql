-- Fix RLS on inquiries table to allow anonymous inserts
-- Run this in Supabase SQL Editor

-- Drop the old policy if it exists
DROP POLICY IF EXISTS "public_insert_inquiries" ON public.inquiries;

-- Re-create with explicit TO anon
CREATE POLICY "public_insert_inquiries"
ON public.inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anon to also select their own submission (optional, not strictly needed)
-- Admins (authenticated) can read all
DROP POLICY IF EXISTS "auth_select_inquiries" ON public.inquiries;
CREATE POLICY "auth_select_inquiries"
ON public.inquiries
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "auth_delete_inquiries" ON public.inquiries;
CREATE POLICY "auth_delete_inquiries"
ON public.inquiries
FOR DELETE
TO authenticated
USING (true);
