-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  university TEXT NOT NULL,
  major TEXT,
  graduation_year INTEGER,
  bio TEXT,
  interests TEXT[], -- Array of interests
  profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profile_photos table for multiple photos per user
CREATE TABLE IF NOT EXISTS public.profile_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create preferences table for user dating preferences
CREATE TABLE IF NOT EXISTS public.preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  show_me TEXT NOT NULL CHECK (show_me IN ('male', 'female', 'everyone')),
  min_age INTEGER NOT NULL DEFAULT 18,
  max_age INTEGER NOT NULL DEFAULT 30,
  max_distance INTEGER DEFAULT 50, -- in kilometers
  same_university_only BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create swipes table to track likes and passes
CREATE TABLE IF NOT EXISTS public.swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  swiped_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'pass', 'super_like')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swiper_id, swiped_id)
);

-- Create matches table for mutual likes
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id) -- Ensure consistent ordering
);

-- Create messages table for chat
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_university ON public.profiles(university);
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON public.profiles(gender);
CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON public.swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped ON public.swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON public.matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON public.matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_match ON public.messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);
