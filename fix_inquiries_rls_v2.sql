-- DEFINITIVE FIX: Drop ALL policies on inquiries and start clean
-- Run this in Supabase SQL Editor

-- Step 1: Disable RLS temporarily to see current state, then re-enable
ALTER TABLE public.inquiries DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (belt and suspenders)
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname FROM pg_policies WHERE tablename = 'inquiries' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.inquiries', pol.policyname);
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Step 4: Create clean policies
-- Anyone (including anon) can insert inquiries
CREATE POLICY "anon_insert_inquiries"
ON public.inquiries
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated (admin) can read all inquiries
CREATE POLICY "auth_read_inquiries"
ON public.inquiries
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (true);

-- Only authenticated (admin) can delete inquiries
CREATE POLICY "auth_delete_inquiries"
ON public.inquiries
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (true);

-- Verify: show all policies on inquiries
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'inquiries';
