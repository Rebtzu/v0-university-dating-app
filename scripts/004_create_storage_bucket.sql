-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for profile photos
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos' AND
  (storage.foldername(name))[1] = 'profile-photos' AND
  auth.uid()::text = (regexp_match(name, '^profile-photos/([^-]+)-'))[1]
);

CREATE POLICY "Photos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'photos');

CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'photos' AND
  (storage.foldername(name))[1] = 'profile-photos' AND
  auth.uid()::text = (regexp_match(name, '^profile-photos/([^-]+)-'))[1]
);

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'photos' AND
  (storage.foldername(name))[1] = 'profile-photos' AND
  auth.uid()::text = (regexp_match(name, '^profile-photos/([^-]+)-'))[1]
);
