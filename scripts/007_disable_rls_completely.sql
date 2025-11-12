-- DISABLE ALL ROW LEVEL SECURITY FOR TESTING
-- This allows all operations without authentication checks

-- Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to ensure clean state
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
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;

-- Create permissive storage policies for testing
CREATE POLICY "Allow all operations on photos bucket"
ON storage.objects FOR ALL
USING (bucket_id = 'photos')
WITH CHECK (bucket_id = 'photos');
