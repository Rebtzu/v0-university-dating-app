-- Function to automatically create a match when two users like each other
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER AS $$
DECLARE
  existing_like UUID;
  new_match_id UUID;
  user1 UUID;
  user2 UUID;
BEGIN
  -- Only process if the action is 'like' or 'super_like'
  IF NEW.action IN ('like', 'super_like') THEN
    -- Check if the swiped user has already liked the swiper
    SELECT id INTO existing_like
    FROM public.swipes
    WHERE swiper_id = NEW.swiped_id
      AND swiped_id = NEW.swiper_id
      AND action IN ('like', 'super_like');

    -- If mutual like exists, create a match
    IF existing_like IS NOT NULL THEN
      -- Ensure consistent ordering (smaller UUID first)
      IF NEW.swiper_id < NEW.swiped_id THEN
        user1 := NEW.swiper_id;
        user2 := NEW.swiped_id;
      ELSE
        user1 := NEW.swiped_id;
        user2 := NEW.swiper_id;
      END IF;

      -- Insert the match (ignore if already exists)
      INSERT INTO public.matches (user1_id, user2_id, created_at)
      VALUES (user1, user2, NOW())
      ON CONFLICT (user1_id, user2_id) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to check for matches after each swipe
DROP TRIGGER IF EXISTS check_match_after_swipe ON public.swipes;
CREATE TRIGGER check_match_after_swipe
  AFTER INSERT ON public.swipes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_create_match();

-- Function to update last_message_at in matches table
CREATE OR REPLACE FUNCTION public.update_match_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.matches
  SET last_message_at = NEW.created_at
  WHERE id = NEW.match_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update last message timestamp
DROP TRIGGER IF EXISTS update_last_message_trigger ON public.messages;
CREATE TRIGGER update_last_message_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_match_last_message();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, date_of_birth, gender, university)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'date_of_birth')::date, CURRENT_DATE - INTERVAL '20 years'),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'other'),
    COALESCE(NEW.raw_user_meta_data->>'university', '')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger to create profile on auth user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
