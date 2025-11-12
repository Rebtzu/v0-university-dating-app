# Guía de Testing - GarzaTinder

## Configuración Inicial

### 1. Desactivar Row Level Security (RLS)

**IMPORTANTE:** Para que la aplicación funcione completamente en modo de prueba, primero ejecuta este script SQL:

\`\`\`sql
-- En el SQL Editor de Supabase, ejecuta:
scripts/007_disable_rls_completely.sql
\`\`\`

Este script:
- Desactiva RLS en todas las tablas
- Elimina todas las políticas restrictivas
- Permite operaciones sin autenticación compleja
- Habilita acceso total al bucket de fotos

### 2. Crear Usuarios de Prueba

**Opción A: Crear manualmente en Supabase Dashboard**

1. Ve a: Dashboard de Supabase → Authentication → Users
2. Crea 5 usuarios con estos emails:
   - `carlos.garcia@uaeh.edu.mx` (Password: `TestPassword123!`)
   - `ana.martinez@uaeh.edu.mx` (Password: `TestPassword123!`)
   - `luis.rodriguez@uaeh.edu.mx` (Password: `TestPassword123!`)
   - `maria.lopez@uaeh.edu.mx` (Password: `TestPassword123!`)
   - `jorge.sanchez@uaeh.edu.mx` (Password: `TestPassword123!`)

3. Después de crear los usuarios, ejecuta en SQL Editor:
   \`\`\`sql
   -- Ejecuta scripts/006_seed_complete_profiles.sql
   -- Esto completará automáticamente los perfiles
   \`\`\`

**Opción B: Registrarse manualmente**

1. Ve a `/auth/sign-up`
2. Usa un email UAEH válido (`@uaeh.edu.mx` o `@uaeh.mx`)
3. Completa el perfil con fotos, bio, intereses, etc.
4. Repite para crear múltiples usuarios

## Cómo Probar Cada Interfaz

### 1. Landing Page (/)
- **Acceso:** Directo, no requiere autenticación
- **Características:** Hero section, features, botones de registro/login

### 2. Registro (/auth/sign-up)
- **Acceso:** Directo desde landing
- **Prueba:** 
  - Email válido UAEH: `test@uaeh.edu.mx`
  - Password: cualquier contraseña segura
- **Nota:** Verifica email institucional automáticamente

### 3. Login (/auth/login)
- **Acceso:** Directo desde landing
- **Credenciales de prueba:** Usa los usuarios creados arriba

### 4. Completar Perfil (/complete-profile)
- **Acceso:** Automático después del primer login
- **Características para probar:**
  - Subir 1-6 fotos (OBLIGATORIO: al menos 1 foto)
  - Agregar carrera, año de graduación
  - Escribir bio
  - Agregar intereses separados por comas

### 5. Configurar Preferencias (/preferences/setup)
- **Acceso:** Automático después de completar perfil
- **Opciones:**
  - Género que buscas (Hombres/Mujeres/Todos)
  - Rango de edad
  - Distancia máxima
  - Solo de mi universidad (toggle)

### 6. Descubrir Perfiles (/discover)
- **Acceso:** Página principal después de login completo
- **Funcionalidades:**
  - Swipe derecha (❤️): Like
  - Swipe izquierda (✕): Pass
  - **NUEVO:** Botón "Ver Todos" en header
    - Muestra TODOS los perfiles sin filtros
    - Ignora preferencias y swipes previos
    - Ideal para testing

### 7. Ver Matches (/matches)
- **Acceso:** Desde header en /discover
- **Cómo crear matches para probar:**

  **Método Rápido - SQL Manual:**
  \`\`\`sql
  -- En SQL Editor de Supabase
  -- Reemplaza USER_ID_1 y USER_ID_2 con IDs reales de tus usuarios
  
  -- 1. Crear swipes mutuos
  INSERT INTO swipes (swiper_id, swiped_id, action) VALUES 
    ('USER_ID_1', 'USER_ID_2', 'like'),
    ('USER_ID_2', 'USER_ID_1', 'like');
  
  -- 2. Crear match manualmente
  INSERT INTO matches (user1_id, user2_id) VALUES 
    ('USER_ID_1', 'USER_ID_2');
  \`\`\`

  **Método Normal:**
  1. Inicia sesión con Usuario A
  2. Da like al Usuario B en /discover
  3. Cierra sesión e inicia con Usuario B
  4. Da like al Usuario A
  5. ¡Match creado automáticamente!

### 8. Chat Individual (/chat/[matchId])
- **Acceso:** Click en un match desde /matches
- **Funcionalidades:**
  - Mensajería en tiempo real
  - Ver fotos del match
  - Historial de mensajes

  **Crear mensajes de prueba (SQL):**
  \`\`\`sql
  -- Obtén match_id de la tabla matches
  SELECT id FROM matches WHERE user1_id = 'TU_USER_ID' OR user2_id = 'TU_USER_ID';
  
  -- Inserta mensajes de prueba
  INSERT INTO messages (match_id, sender_id, receiver_id, content) VALUES 
    ('MATCH_ID', 'USER_ID_1', 'USER_ID_2', '¡Hola! ¿Cómo estás?'),
    ('MATCH_ID', 'USER_ID_2', 'USER_ID_1', '¡Bien! ¿Y tú?');
  \`\`\`

### 9. Mi Perfil (/profile)
- **Acceso:** Desde header en /discover
- **Funcionalidades:**
  - Ver tu información
  - Editar nombre, carrera, bio
  - Cambiar preferencias
  - Ver estadísticas (likes recibidos, matches)
  - Cerrar sesión

## Atajos de Testing

### Ver Todas las Interfaces Rápidamente

1. **Con RLS desactivado**, usa estos URLs directos:
   \`\`\`
   /                          → Landing
   /auth/sign-up              → Registro
   /auth/login                → Login
   /complete-profile          → Completar perfil
   /preferences/setup         → Preferencias
   /discover                  → Descubrir (Principal)
   /matches                   → Matches
   /profile                   → Mi perfil
   \`\`\`

2. **Para ver el chat sin crear match:**
   \`\`\`sql
   -- Crea un match falso en SQL
   INSERT INTO matches (user1_id, user2_id) VALUES 
     ('TU_USER_ID', 'OTRO_USER_ID');
   \`\`\`
   Luego ve a `/matches` y haz click en el match creado.

### Modo "Ver Todos" en Discover

- Usa el botón **"Ver Todos"** en el header de /discover
- Esto muestra TODOS los perfiles en la base de datos
- Ignora filtros, preferencias y swipes previos
- Perfecto para testing rápido

## Problemas Comunes

### No aparecen perfiles
- ✅ Verifica que ejecutaste `007_disable_rls_completely.sql`
- ✅ Asegúrate de tener usuarios creados y con perfiles completos
- ✅ Usa el botón "Ver Todos" en /discover

### No puedo subir fotos
- ✅ Verifica que el bucket "photos" existe en Supabase Storage
- ✅ Ejecuta `004_create_storage_bucket_v2.sql` si no existe
- ✅ Verifica que RLS está desactivado en Storage

### No veo matches
- ✅ Crea matches manualmente con SQL (ver arriba)
- ✅ O crea likes mutuos entre dos usuarios

### Errores de "row-level security policy"
- ✅ RLS aún está activo
- ✅ Ejecuta `007_disable_rls_completely.sql` de nuevo
- ✅ Verifica en Supabase Dashboard → Database → Policies

## Testing Completo - Checklist

- [ ] Landing page se ve correctamente
- [ ] Registro con email UAEH funciona
- [ ] Login con credenciales de prueba funciona
- [ ] Se pueden subir fotos en completar perfil
- [ ] Preferencias se guardan correctamente
- [ ] Descubrir muestra perfiles
- [ ] Botón "Ver Todos" muestra todos los perfiles
- [ ] Swipe like/pass funciona
- [ ] Matches aparecen en /matches
- [ ] Chat individual funciona
- [ ] Se pueden enviar mensajes
- [ ] Perfil propio se puede editar
- [ ] Logout funciona

## Datos de Prueba Recomendados

### Usuarios Sugeridos (5 perfiles diversos)

1. **Carlos García** - Ingeniería Informática
   - Intereses: Gaming, Programación, Anime
   - Bio: "Dev apasionado, gamer casual"

2. **Ana Martínez** - Psicología
   - Intereses: Lectura, Yoga, Café
   - Bio: "Amante de los libros y el café ☕"

3. **Luis Rodríguez** - Administración
   - Intereses: Deportes, Música, Viajes
   - Bio: "Atleta y aventurero"

4. **María López** - Medicina
   - Intereses: Medicina, Voluntariado, Naturaleza
   - Bio: "Futura doctora, salvando vidas 🏥"

5. **Jorge Sánchez** - Derecho
   - Intereses: Debate, Cine, Historia
   - Bio: "Futuro abogado, cinéfilo empedernido"

Con esta guía deberías poder probar todas las funcionalidades de GarzaTinder sin problemas. ¡Disfruta del testing!
