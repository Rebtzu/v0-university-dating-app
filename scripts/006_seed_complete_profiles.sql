-- Script mejorado para crear perfiles de prueba con autenticación
-- Este script crea usuarios completos en auth.users y sus perfiles asociados

-- IMPORTANTE: Este script usa extensiones de Supabase que solo funcionan en el SQL Editor de Supabase
-- No funcionará en un cliente SQL estándar

-- Habilitar la extensión necesaria para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear usuarios de prueba usando la API de autenticación de Supabase
-- NOTA: Estos INSERT funcionan gracias al trigger handle_new_user que crea el perfil automáticamente

-- Primero, necesitamos insertar en auth.users (requiere permisos de service_role)
-- Esto es más seguro hacerlo desde el dashboard o API

-- En su lugar, usaremos un enfoque diferente:
-- Este script asume que ya ejecutaste los scripts anteriores y tienes las tablas creadas

-- Opción 1: Crear usuarios manualmente desde Supabase Dashboard
-- Ve a Authentication > Users > Add User
-- Usa estos datos:

/*
Usuario 1:
Email: carlos.garcia@uaeh.edu.mx
Password: TestPassword123!

Usuario 2:
Email: ana.martinez@uaeh.edu.mx
Password: TestPassword123!

Usuario 3:
Email: sofia.lopez@uaeh.edu.mx
Password: TestPassword123!

Usuario 4:
Email: miguel.ramirez@uaeh.edu.mx
Password: TestPassword123!

Usuario 5:
Email: laura.hernandez@uaeh.edu.mx
Password: TestPassword123!
*/

-- Después de crear los usuarios en el dashboard, ejecuta este script
-- que actualizará sus perfiles y agregará datos adicionales

-- Función temporal para actualizar perfiles de prueba
CREATE OR REPLACE FUNCTION seed_test_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  user3_id UUID;
  user4_id UUID;
  user5_id UUID;
BEGIN
  -- Obtener los UUIDs de los usuarios creados
  SELECT id INTO user1_id FROM auth.users WHERE email = 'carlos.garcia@uaeh.edu.mx';
  SELECT id INTO user2_id FROM auth.users WHERE email = 'ana.martinez@uaeh.edu.mx';
  SELECT id INTO user3_id FROM auth.users WHERE email = 'sofia.lopez@uaeh.edu.mx';
  SELECT id INTO user4_id FROM auth.users WHERE email = 'miguel.ramirez@uaeh.edu.mx';
  SELECT id INTO user5_id FROM auth.users WHERE email = 'laura.hernandez@uaeh.edu.mx';

  -- Verificar que los usuarios existen
  IF user1_id IS NULL OR user2_id IS NULL OR user3_id IS NULL OR user4_id IS NULL OR user5_id IS NULL THEN
    RAISE EXCEPTION 'Debes crear los usuarios en Supabase Dashboard primero';
  END IF;

  -- Actualizar perfil 1 (Carlos)
  UPDATE public.profiles SET
    full_name = 'Carlos García',
    date_of_birth = '2002-03-15',
    gender = 'male',
    university = 'Universidad Autónoma del Estado de Hidalgo',
    major = 'Ingeniería en Computación',
    graduation_year = 2025,
    bio = 'Estudiante de ingeniería apasionado por la tecnología y el deporte. Me gusta el fútbol y la programación. Siempre buscando nuevas aventuras.',
    interests = ARRAY['Deportes', 'Tecnología', 'Videojuegos', 'Música'],
    profile_complete = true
  WHERE id = user1_id;

  INSERT INTO public.profile_photos (user_id, photo_url, photo_order)
  VALUES (user1_id, '/placeholder.svg?height=600&width=600', 0)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.preferences (user_id, show_me, min_age, max_age, same_university_only)
  VALUES (user1_id, 'female', 18, 25, true)
  ON CONFLICT (user_id) DO UPDATE SET
    show_me = EXCLUDED.show_me,
    min_age = EXCLUDED.min_age,
    max_age = EXCLUDED.max_age,
    same_university_only = EXCLUDED.same_university_only;

  -- Actualizar perfil 2 (Ana)
  UPDATE public.profiles SET
    full_name = 'Ana Martínez',
    date_of_birth = '2003-07-22',
    gender = 'female',
    university = 'Universidad Autónoma del Estado de Hidalgo',
    major = 'Medicina',
    graduation_year = 2026,
    bio = 'Futura doctora con amor por los animales y la naturaleza. Me encanta leer, viajar y conocer gente nueva.',
    interests = ARRAY['Lectura', 'Viajes', 'Animales', 'Fotografía'],
    profile_complete = true
  WHERE id = user2_id;

  INSERT INTO public.profile_photos (user_id, photo_url, photo_order)
  VALUES (user2_id, '/placeholder.svg?height=600&width=600', 0)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.preferences (user_id, show_me, min_age, max_age, same_university_only)
  VALUES (user2_id, 'male', 19, 27, true)
  ON CONFLICT (user_id) DO UPDATE SET
    show_me = EXCLUDED.show_me,
    min_age = EXCLUDED.min_age,
    max_age = EXCLUDED.max_age,
    same_university_only = EXCLUDED.same_university_only;

  -- Actualizar perfil 3 (Sofía)
  UPDATE public.profiles SET
    full_name = 'Sofía López',
    date_of_birth = '2001-11-08',
    gender = 'female',
    university = 'Universidad Autónoma del Estado de Hidalgo',
    major = 'Arquitectura',
    graduation_year = 2024,
    bio = 'Creativa y soñadora. Amo el arte, el diseño y la música indie. Buscando a alguien con quien compartir aventuras.',
    interests = ARRAY['Arte', 'Diseño', 'Música', 'Café'],
    profile_complete = true
  WHERE id = user3_id;

  INSERT INTO public.profile_photos (user_id, photo_url, photo_order)
  VALUES (user3_id, '/placeholder.svg?height=600&width=600', 0)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.preferences (user_id, show_me, min_age, max_age, same_university_only)
  VALUES (user3_id, 'everyone', 20, 28, true)
  ON CONFLICT (user_id) DO UPDATE SET
    show_me = EXCLUDED.show_me,
    min_age = EXCLUDED.min_age,
    max_age = EXCLUDED.max_age,
    same_university_only = EXCLUDED.same_university_only;

  -- Actualizar perfil 4 (Miguel)
  UPDATE public.profiles SET
    full_name = 'Miguel Ramírez',
    date_of_birth = '2002-05-30',
    gender = 'male',
    university = 'Universidad Autónoma del Estado de Hidalgo',
    major = 'Administración de Empresas',
    graduation_year = 2025,
    bio = 'Emprendedor en formación. Me gusta el gimnasio, los negocios y las películas de acción. Siempre positivo.',
    interests = ARRAY['Gimnasio', 'Negocios', 'Cine', 'Emprendimiento'],
    profile_complete = true
  WHERE id = user4_id;

  INSERT INTO public.profile_photos (user_id, photo_url, photo_order)
  VALUES (user4_id, '/placeholder.svg?height=600&width=600', 0)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.preferences (user_id, show_me, min_age, max_age, same_university_only)
  VALUES (user4_id, 'female', 18, 26, true)
  ON CONFLICT (user_id) DO UPDATE SET
    show_me = EXCLUDED.show_me,
    min_age = EXCLUDED.min_age,
    max_age = EXCLUDED.max_age,
    same_university_only = EXCLUDED.same_university_only;

  -- Actualizar perfil 5 (Laura)
  UPDATE public.profiles SET
    full_name = 'Laura Hernández',
    date_of_birth = '2003-01-17',
    gender = 'female',
    university = 'Universidad Autónoma del Estado de Hidalgo',
    major = 'Psicología',
    graduation_year = 2026,
    bio = 'Estudiante de psicología con pasión por ayudar a los demás. Me encanta bailar, cocinar y las conversaciones profundas.',
    interests = ARRAY['Baile', 'Cocina', 'Psicología', 'Yoga'],
    profile_complete = true
  WHERE id = user5_id;

  INSERT INTO public.profile_photos (user_id, photo_url, photo_order)
  VALUES (user5_id, '/placeholder.svg?height=600&width=600', 0)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.preferences (user_id, show_me, min_age, max_age, same_university_only)
  VALUES (user5_id, 'male', 20, 28, true)
  ON CONFLICT (user_id) DO UPDATE SET
    show_me = EXCLUDED.show_me,
    min_age = EXCLUDED.min_age,
    max_age = EXCLUDED.max_age,
    same_university_only = EXCLUDED.same_university_only;

  RAISE NOTICE 'Perfiles de prueba actualizados exitosamente';
END;
$$;

-- Ejecutar la función de seeding
SELECT seed_test_profiles();

-- Limpiar la función temporal
DROP FUNCTION IF EXISTS seed_test_profiles();
