# Instrucciones para Crear Perfiles de Prueba

Sigue estos pasos para crear 5 perfiles de prueba en tu aplicación:

## Paso 1: Crear Usuarios en Supabase Dashboard

1. Ve a tu **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Authentication** → **Users**
4. Haz clic en **"Add user"** (o "Invite")
5. Crea los siguientes 5 usuarios (uno por uno):

### Usuarios a Crear:

| Email | Password |
|-------|----------|
| carlos.garcia@uaeh.edu.mx | TestPassword123! |
| ana.martinez@uaeh.edu.mx | TestPassword123! |
| sofia.lopez@uaeh.edu.mx | TestPassword123! |
| miguel.ramirez@uaeh.edu.mx | TestPassword123! |
| laura.hernandez@uaeh.edu.mx | TestPassword123! |

**Importante:** 
- Marca la opción "Auto Confirm User" para que no necesiten verificar el email
- Usa la contraseña exacta: `TestPassword123!`

## Paso 2: Ejecutar Scripts de Base de Datos

Después de crear los usuarios, ejecuta los scripts SQL en orden:

### 2.1 - Crear Tablas (si no lo has hecho):
1. Ve a **SQL Editor** en Supabase
2. Ejecuta los siguientes scripts en orden:
   - `001_create_tables.sql`
   - `002_enable_rls.sql`
   - `003_create_functions.sql`
   - `004_create_storage_bucket.sql`

### 2.2 - Sembrar Perfiles de Prueba:
1. En **SQL Editor**, ejecuta: `006_seed_complete_profiles.sql`
2. Este script detectará automáticamente los usuarios que creaste y completará sus perfiles

## Paso 3: Verificar

1. Ve a **Table Editor** → **profiles**
2. Deberías ver 5 perfiles completos con:
   - Nombres completos
   - Fechas de nacimiento
   - Géneros
   - Carreras universitarias
   - Biografías
   - Intereses
   - Fotos de perfil

## Paso 4: Iniciar Sesión y Probar

Ahora puedes iniciar sesión con cualquiera de estos usuarios:

\`\`\`
Email: carlos.garcia@uaeh.edu.mx
Password: TestPassword123!
\`\`\`

Los otros usuarios estarán disponibles para hacer swipe y crear matches.

## Información de los Perfiles de Prueba:

1. **Carlos García** - Hombre, Ingeniería en Computación, busca mujeres
2. **Ana Martínez** - Mujer, Medicina, busca hombres  
3. **Sofía López** - Mujer, Arquitectura, busca todos
4. **Miguel Ramírez** - Hombre, Administración, busca mujeres
5. **Laura Hernández** - Mujer, Psicología, busca hombres

## Troubleshooting

**Error: "function seed_test_profiles() does not exist"**
- Asegúrate de ejecutar todo el script `006_seed_complete_profiles.sql`

**Error: "Debes crear los usuarios en Supabase Dashboard primero"**
- Ve al Paso 1 y crea los 5 usuarios manualmente en el dashboard

**Los perfiles no aparecen:**
- Verifica en Table Editor que la tabla `profiles` tiene datos
- Asegúrate de que `profile_complete = true` para cada perfil
