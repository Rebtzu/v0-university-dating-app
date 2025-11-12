# Instrucciones para Probar la App sin Hacer Match

## 1. Ver la interfaz de Matches sin tener matches reales

Para ver la interfaz de matches, simplemente ve a:
\`\`\`
/matches
\`\`\`

La página mostrará un mensaje de "No hay matches todavía" pero podrás ver el diseño completo de la interfaz.

## 2. Ver la interfaz de Chat sin tener un match real

Para ver la interfaz de chat, crea un match manualmente en la base de datos:

### Opción A: Desde Supabase Dashboard

1. Ve a tu Dashboard de Supabase → SQL Editor
2. Ejecuta este query (reemplaza los UUIDs con IDs reales de usuarios):

\`\`\`sql
-- Primero obtén los IDs de dos usuarios existentes
SELECT id, email FROM auth.users LIMIT 2;

-- Luego crea un match entre ellos (reemplaza los UUIDs)
INSERT INTO matches (user1_id, user2_id)
VALUES 
  ('UUID-del-usuario-1', 'UUID-del-usuario-2');
\`\`\`

3. Ahora podrás acceder al chat en: `/chat/[match-id]`

### Opción B: Crear un match haciendo swipes

1. Inicia sesión con un usuario
2. Da "like" a otro perfil en la página de descubrir
3. Cierra sesión e inicia con el otro usuario
4. Da "like" de vuelta al primer usuario
5. Se creará un match automáticamente

## 3. Modos de visualización de perfiles

La app ahora tiene dos modos:

### Modo Descubrir (por defecto)
- Solo muestra perfiles que no has visto
- Aplica tus preferencias de búsqueda
- Permite hacer swipe (like/pass)
- Se registran tus decisiones

### Modo Explorar Todos
- Muestra TODOS los perfiles completos en la base de datos
- No aplica filtros de preferencias
- No registra swipes
- Navegación con botones anterior/siguiente
- Perfecto para TESTING

## 4. Cómo cambiar entre modos

En la página `/discover`, verás dos botones en la parte superior:
- **Descubrir**: Modo normal con swipes
- **Explorar todos**: Ver todos los perfiles sin restricciones

## 5. Verificar que hay perfiles en la base de datos

Ejecuta este query en Supabase SQL Editor:

\`\`\`sql
SELECT 
  id, 
  full_name, 
  email, 
  profile_complete,
  (SELECT COUNT(*) FROM profile_photos WHERE user_id = profiles.id) as photo_count
FROM profiles
WHERE profile_complete = true;
\`\`\`

Si no hay perfiles con `profile_complete = true` y fotos, entonces no aparecerá nada. Asegúrate de:
1. Completar al menos un perfil con el flujo de registro
2. Subir al menos 1 foto
3. Configurar las preferencias

## 6. Navegación rápida

- `/` - Landing page
- `/auth/login` - Iniciar sesión
- `/auth/sign-up` - Registrarse
- `/complete-profile` - Completar perfil después del registro
- `/preferences/setup` - Configurar preferencias
- `/discover` - Página principal de swipe
- `/matches` - Ver tus matches
- `/chat/[matchId]` - Chat con un match específico
- `/profile` - Tu perfil y configuración
