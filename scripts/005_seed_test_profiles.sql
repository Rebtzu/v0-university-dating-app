-- Script para sembrar perfiles de prueba
-- IMPORTANTE: Estos son perfiles ficticios para pruebas. 
-- Necesitarás crear usuarios en Supabase Auth primero y luego usar sus UUIDs aquí.

-- Ejemplo de cómo insertar perfiles de prueba:
-- Primero, ve a Supabase Dashboard > Authentication > Users y crea usuarios con email/password
-- Luego, reemplaza los UUIDs a continuación con los UUIDs reales de esos usuarios

-- NOTA: Este script es solo una plantilla. Debes ajustar los UUIDs después de crear usuarios reales.

-- Perfil de prueba 1 (Hombre)
INSERT INTO public.profiles (id, email, full_name, date_of_birth, gender, university, major, graduation_year, bio, interests, profile_complete)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, -- Reemplazar con UUID real
  'carlos.garcia@uaeh.edu.mx',
  'Carlos García',
  '2002-03-15',
  'male',
  'Universidad Autónoma del Estado de Hidalgo',
  'Ingeniería en Computación',
  2025,
  'Estudiante de ingeniería apasionado por la tecnología y el deporte. Me gusta el fútbol y la programación. Siempre buscando nuevas aventuras.',
  ARRAY['Deportes', 'Tecnología', 'Videojuegos', 'Música'],
  true
) ON CONFLICT (id) DO NOTHING;

-- Foto para perfil 1
INSERT INTO public.profile_photos (user_id, photo_url, photo_order)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, -- Reemplazar con UUID real
  '/placeholder.svg?height=400&width=400',
  0
) ON CONFLICT DO NOTHING;

-- Preferencias para perfil 1
INSERT INTO public.preferences (user_id, show_me, min_age, max_age, same_university_only)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, -- Reemplazar con UUID real
  'female',
  18,
  25,
  true
) ON CONFLICT (user_id) DO NOTHING;

-- Perfil de prueba 2 (Mujer)
INSERT INTO public.profiles (id, email, full_name, date_of_birth, gender, university, major, graduation_year, bio, interests, profile_complete)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid, -- Reemplazar con UUID real
  'ana.martinez@uaeh.edu.mx',
  'Ana Martínez',
  '2003-07-22',
  'female',
  'Universidad Autónoma del Estado de Hidalgo',
  'Medicina',
  2026,
  'Futura doctora con amor por los animales y la naturaleza. Me encanta leer, viajar y conocer gente nueva.',
  ARRAY['Lectura', 'Viajes', 'Animales', 'Fotografía'],
  true
) ON CONFLICT (id) DO NOTHING;

-- Foto para perfil 2
INSERT INTO public.profile_photos (user_id, photo_url, photo_order)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid, -- Reemplazar con UUID real
  '/placeholder.svg?height=400&width=400',
  0
) ON CONFLICT DO NOTHING;

-- Preferencias para perfil 2
INSERT INTO public.preferences (user_id, show_me, min_age, max_age, same_university_only)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid, -- Reemplazar con UUID real
  'male',
  19,
  27,
  true
) ON CONFLICT (user_id) DO NOTHING;

-- Perfil de prueba 3 (Mujer)
INSERT INTO public.profiles (id, email, full_name, date_of_birth, gender, university, major, graduation_year, bio, interests, profile_complete)
VALUES (
  '00000000-0000-0000-0000-000000000003'::uuid, -- Reemplazar con UUID real
  'sofia.lopez@uaeh.edu.mx',
  'Sofía López',
  '2001-11-08',
  'female',
  'Universidad Autónoma del Estado de Hidalgo',
  'Arquitectura',
  2024,
  'Creativa y soñadora. Amo el arte, el diseño y la música indie. Buscando a alguien con quien compartir aventuras.',
  ARRAY['Arte', 'Diseño', 'Música', 'Café'],
  true
) ON CONFLICT (id) DO NOTHING;

-- Foto para perfil 3
INSERT INTO public.profile_photos (user_id, photo_url, photo_order)
VALUES (
  '00000000-0000-0000-0000-000000000003'::uuid, -- Reemplazar con UUID real
  '/placeholder.svg?height=400&width=400',
  0
) ON CONFLICT DO NOTHING;

-- Preferencias para perfil 3
INSERT INTO public.preferences (user_id, show_me, min_age, max_age, same_university_only)
VALUES (
  '00000000-0000-0000-0000-000000000003'::uuid, -- Reemplazar con UUID real
  'everyone',
  20,
  28,
  true
) ON CONFLICT (user_id) DO NOTHING;

-- Perfil de prueba 4 (Hombre)
INSERT INTO public.profiles (id, email, full_name, date_of_birth, gender, university, major, graduation_year, bio, interests, profile_complete)
VALUES (
  '00000000-0000-0000-0000-000000000004'::uuid, -- Reemplazar con UUID real
  'miguel.ramirez@uaeh.edu.mx',
  'Miguel Ramírez',
  '2002-05-30',
  'male',
  'Universidad Autónoma del Estado de Hidalgo',
  'Administración de Empresas',
  2025,
  'Emprendedor en formación. Me gusta el gimnasio, los negocios y las películas de acción. Siempre positivo.',
  ARRAY['Gimnasio', 'Negocios', 'Cine', 'Emprendimiento'],
  true
) ON CONFLICT (id) DO NOTHING;

-- Foto para perfil 4
INSERT INTO public.profile_photos (user_id, photo_url, photo_order)
VALUES (
  '00000000-0000-0000-0000-000000000004'::uuid, -- Reemplazar con UUID real
  '/placeholder.svg?height=400&width=400',
  0
) ON CONFLICT DO NOTHING;

-- Preferencias para perfil 4
INSERT INTO public.preferences (user_id, show_me, min_age, max_age, same_university_only)
VALUES (
  '00000000-0000-0000-0000-000000000004'::uuid, -- Reemplazar con UUID real
  'female',
  18,
  26,
  true
) ON CONFLICT (user_id) DO NOTHING;

-- Perfil de prueba 5 (Mujer)
INSERT INTO public.profiles (id, email, full_name, date_of_birth, gender, university, major, graduation_year, bio, interests, profile_complete)
VALUES (
  '00000000-0000-0000-0000-000000000005'::uuid, -- Reemplazar con UUID real
  'laura.hernandez@uaeh.edu.mx',
  'Laura Hernández',
  '2003-01-17',
  'female',
  'Universidad Autónoma del Estado de Hidalgo',
  'Psicología',
  2026,
  'Estudiante de psicología con pasión por ayudar a los demás. Me encanta bailar, cocinar y las conversaciones profundas.',
  ARRAY['Baile', 'Cocina', 'Psicología', 'Yoga'],
  true
) ON CONFLICT (id) DO NOTHING;

-- Foto para perfil 5
INSERT INTO public.profile_photos (user_id, photo_url, photo_order)
VALUES (
  '00000000-0000-0000-0000-000000000005'::uuid, -- Reemplazar con UUID real
  '/placeholder.svg?height=400&width=400',
  0
) ON CONFLICT DO NOTHING;

-- Preferencias para perfil 5
INSERT INTO public.preferences (user_id, show_me, min_age, max_age, same_university_only)
VALUES (
  '00000000-0000-0000-0000-000000000005'::uuid, -- Reemplazar con UUID real
  'male',
  20,
  28,
  true
) ON CONFLICT (user_id) DO NOTHING;

-- INSTRUCCIONES PARA USAR ESTE SCRIPT:
-- 1. Ve a Supabase Dashboard
-- 2. Navega a Authentication > Users
-- 3. Crea 5 usuarios manualmente con emails de prueba (carlos.garcia@uaeh.edu.mx, etc.)
-- 4. Copia los UUIDs de cada usuario creado
-- 5. Reemplaza todos los UUIDs '00000000-0000-0000-0000-000000000001' etc. con los UUIDs reales
-- 6. Ejecuta este script en SQL Editor de Supabase
