-- Complete storage setup with no security restrictions for testing
-- This ensures photo uploads work without authentication issues

-- Recreate the photos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remove ALL existing storage policies for clean state
DROP POLICY IF EXISTS "Allow all operations on photos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload photos" ON storage.objects;

-- Create completely open storage policies for testing
CREATE POLICY "Allow anyone to select photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

CREATE POLICY "Allow anyone to insert photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Allow anyone to update photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'photos')
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Allow anyone to delete photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'photos');

-- Ensure matches table has no restrictions
GRANT ALL ON public.matches TO anon, authenticated;
GRANT ALL ON public.swipes TO anon, authenticated;
GRANT ALL ON public.profile_photos TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
