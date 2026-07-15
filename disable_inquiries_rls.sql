-- Final fix: Disable RLS on inquiries (it is a public contact form table,
-- no user-specific row security needed. Admin reads all via Flask+JWT anyway.)
-- Run this in Supabase SQL Editor

ALTER TABLE public.inquiries DISABLE ROW LEVEL SECURITY;
