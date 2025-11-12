-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Completely open storage policies for testing - no authentication required
DROP POLICY IF EXISTS "Allow all operations on photos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;

-- Allow anyone to do anything with photos (for testing only)
CREATE POLICY "Allow all for photos bucket"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'photos')
WITH CHECK (bucket_id = 'photos');
