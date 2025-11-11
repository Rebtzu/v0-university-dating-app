-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view any profile"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- Profile photos policies
CREATE POLICY "Users can view any profile photo"
  ON public.profile_photos FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own photos"
  ON public.profile_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos"
  ON public.profile_photos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON public.profile_photos FOR DELETE
  USING (auth.uid() = user_id);

-- Preferences policies
CREATE POLICY "Users can view their own preferences"
  ON public.preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON public.preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
  ON public.preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Swipes policies
CREATE POLICY "Users can view their own swipes"
  ON public.swipes FOR SELECT
  USING (auth.uid() = swiper_id);

CREATE POLICY "Users can insert their own swipes"
  ON public.swipes FOR INSERT
  WITH CHECK (auth.uid() = swiper_id);

-- Matches policies
CREATE POLICY "Users can view their own matches"
  ON public.matches FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "System can create matches"
  ON public.matches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete their own matches"
  ON public.matches FOR DELETE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages policies
CREATE POLICY "Users can view messages in their matches"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages in their matches"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
