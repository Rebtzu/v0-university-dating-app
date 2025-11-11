-- Simplified storage bucket creation without complex folder policies

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for profile photos
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Photos are publicly accessible" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'photos');

CREATE POLICY "Users can update photos" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'photos');

CREATE POLICY "Users can delete photos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'photos');
