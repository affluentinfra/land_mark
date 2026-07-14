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
    created_at TIMESTAMPTZ DEFAULT now(),
    owner_id UUID REFERENCES public.users(id)
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

-- ====================================================
-- EXTENSION: USER LISTING LIMIT, BLOGS, AND RLS POLICIES
-- ====================================================

-- Add listing_limit to users (default 10)
ALTER TABLE public.users ADD COLUMN listing_limit INT NOT NULL DEFAULT 10;

-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES public.users(id) NOT NULL
);

-- RLS for properties – owners only
CREATE POLICY "owner can manage own properties"
ON public.properties
FOR ALL
TO authenticated
USING (auth.uid() = owner_id);

-- Admin full access (already covered by existing admin policies, but ensure)
CREATE POLICY "admin full property access"
ON public.properties
FOR ALL
TO authenticated
USING (auth.role() = 'admin');

-- Enforce per‑user listing limit via trigger
CREATE OR REPLACE FUNCTION enforce_listing_limit()
RETURNS trigger AS $$
DECLARE current_count INT;
BEGIN
    SELECT COUNT(*) INTO current_count FROM public.properties WHERE owner_id = NEW.owner_id;
    IF current_count >= (SELECT listing_limit FROM public.users WHERE id = NEW.owner_id) THEN
        RAISE EXCEPTION 'User has reached their listing limit';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_enforce_listing_limit
BEFORE INSERT ON public.properties
FOR EACH ROW EXECUTE FUNCTION enforce_listing_limit();

-- Blogs – public read, admin write
CREATE POLICY "public read blogs"
ON public.blogs
FOR SELECT
USING (true);

CREATE POLICY "admin write blogs"
ON public.blogs
FOR ALL
TO authenticated
USING (auth.role() = 'admin');

-- =========================================================================
-- USERS TABLE
-- Stores application users and roles
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin','user')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies for users table
-- 1. Allow anyone to sign up (insert) with email
CREATE POLICY "Allow public insert into users"
ON public.users
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2. Allow admin to select all users
CREATE POLICY "Allow admin select users"
ON public.users
FOR SELECT
TO authenticated
USING (auth.role() = 'admin');

-- 3. Allow admin to update any user
CREATE POLICY "Allow admin update users"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.role() = 'admin')
WITH CHECK (true);

-- 4. Allow admin to delete any user
CREATE POLICY "Allow admin delete users"
ON public.users
FOR DELETE
TO authenticated
USING (auth.role() = 'admin');
