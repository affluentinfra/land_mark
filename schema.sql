-- LANDMARK REALTORS - SUPABASE DATABASE SCHEMA
-- Execute this SQL script in the Supabase SQL Editor to set up your tables and security policies.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- PROPERTIES TABLE
-- Stores commercial real estate listings
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    price_display TEXT NOT NULL, -- e.g., "₹2.5 Cr" or "₹1.5 Lakh/month"
    location TEXT NOT NULL, -- e.g., "Ferozepur Road, Ludhiana"
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'lease', 'rent')),
    category TEXT NOT NULL DEFAULT 'premium' CHECK (category IN ('mid-luxury', 'premium', 'ultra-luxury')),
    images TEXT[] NOT NULL, -- Array of image URLs
    video_url TEXT, -- YouTube or raw MP4 video URL
    custom_fields JSONB DEFAULT '{}'::jsonb, -- Custom key-value pairs (e.g., Carpet Area: "2500 Sq.Ft")
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster filtering and sorting
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Policies for properties table
-- 1. Allow anyone (including anonymous public users) to select properties
CREATE POLICY "Allow public read access on properties" 
ON public.properties 
FOR SELECT 
USING (true);

-- 2. Allow authenticated admin users to insert properties
CREATE POLICY "Allow authenticated admin insert properties" 
ON public.properties 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 3. Allow authenticated admin users to update properties
CREATE POLICY "Allow authenticated admin update properties" 
ON public.properties 
FOR UPDATE 
TO authenticated 
USING (true);

-- 4. Allow authenticated admin users to delete properties
CREATE POLICY "Allow authenticated admin delete properties" 
ON public.properties 
FOR DELETE 
TO authenticated 
USING (true);


-- =========================================================================
-- INQUIRIES TABLE
-- Stores customer queries for "List With Us" / Collab / Property Inquiries
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'collab', 'property')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for inquiries sorting
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Policies for inquiries table
-- 1. Allow anyone to submit an inquiry
CREATE POLICY "Allow public insert on inquiries" 
ON public.inquiries 
FOR INSERT 
WITH CHECK (true);

-- 2. Allow only authenticated admin users to select/view inquiries
CREATE POLICY "Allow authenticated admin select inquiries" 
ON public.inquiries 
FOR SELECT 
TO authenticated 
USING (true);

-- 3. Allow authenticated admin users to delete inquiries
CREATE POLICY "Allow authenticated admin delete inquiries" 
ON public.inquiries 
FOR DELETE 
TO authenticated 
USING (true);
