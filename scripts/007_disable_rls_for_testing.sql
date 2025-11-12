-- DISABLE ALL RLS POLICIES FOR TESTING
-- This makes all tables fully accessible for demonstration purposes
-- WARNING: Do not use in production!

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view any profile photo" ON public.profile_photos;
DROP POLICY IF EXISTS "Users can insert their own photos" ON public.profile_photos;
DROP POLICY IF EXISTS "Users can update their own photos" ON public.profile_photos;
DROP POLICY IF EXISTS "Users can delete their own photos" ON public.profile_photos;

DROP POLICY IF EXISTS "Users can view their own preferences" ON public.preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.preferences;
DROP POLICY IF EXISTS "Users can delete their own preferences" ON public.preferences;

DROP POLICY IF EXISTS "Users can view their own swipes" ON public.swipes;
DROP POLICY IF EXISTS "Users can insert their own swipes" ON public.swipes;

DROP POLICY IF EXISTS "Users can view their own matches" ON public.matches;
DROP POLICY IF EXISTS "System can create matches" ON public.matches;
DROP POLICY IF EXISTS "Users can delete their own matches" ON public.matches;

DROP POLICY IF EXISTS "Users can view messages in their matches" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their matches" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

-- Drop storage policies
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Photos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can update photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete photos" ON storage.objects;

-- Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- Create permissive policies for storage
CREATE POLICY "Public access to photos" ON storage.objects
FOR ALL
USING (bucket_id = 'photos');

-- Grant full access to authenticated users
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profile_photos TO authenticated;
GRANT ALL ON public.preferences TO authenticated;
GRANT ALL ON public.swipes TO authenticated;
GRANT ALL ON public.matches TO authenticated;
GRANT ALL ON public.messages TO authenticated;

-- Grant access to anon users as well for testing
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.profile_photos TO anon;
GRANT ALL ON public.preferences TO anon;
GRANT ALL ON public.swipes TO anon;
GRANT ALL ON public.matches TO anon;
GRANT ALL ON public.messages TO anon;
