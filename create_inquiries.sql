-- Run this in Supabase SQL Editor
-- Creates only the missing `inquiries` table

CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'collab', 'property', 'lease')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry
CREATE POLICY "public_insert_inquiries"
ON public.inquiries FOR INSERT
WITH CHECK (true);

-- Only authenticated users (admin) can read
CREATE POLICY "auth_select_inquiries"
ON public.inquiries FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users can delete
CREATE POLICY "auth_delete_inquiries"
ON public.inquiries FOR DELETE
TO authenticated
USING (true);
