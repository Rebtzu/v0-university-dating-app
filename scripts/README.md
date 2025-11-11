# Scripts de la Base de Datos

Este directorio contiene los scripts SQL y TypeScript para configurar y poblar la base de datos.

## Orden de Ejecución

### 1. Scripts SQL (Ejecutar en Supabase SQL Editor)

Ejecuta estos scripts en orden en el SQL Editor de tu dashboard de Supabase:

1. `001_create_tables.sql` - Crea todas las tablas necesarias
2. `002_enable_rls.sql` - Habilita Row Level Security
3. `003_create_functions.sql` - Crea funciones y triggers
4. `004_create_storage_bucket.sql` - Configura el bucket de almacenamiento para fotos

### 2. Script de Siembra (Ejecutar desde terminal)

Para crear perfiles de prueba automáticamente:

\`\`\`bash
# Desde la raíz del proyecto
npx tsx scripts/seed-test-profiles.ts
\`\`\`

Este script creará 5 perfiles de prueba:
- Carlos García (carlos.garcia@uaeh.edu.mx)
- Ana Martínez (ana.martinez@uaeh.edu.mx)
- Sofía López (sofia.lopez@uaeh.edu.mx)
- Miguel Ramírez (miguel.ramirez@uaeh.edu.mx)
- Laura Hernández (laura.hernandez@uaeh.edu.mx)

**Contraseña para todos:** `TestPassword123!`

## Variables de Entorno Requeridas

El script de siembra necesita estas variables de entorno (ya están configuradas en tu proyecto):
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Notas

- Los scripts SQL deben ejecutarse solo una vez al configurar la base de datos
- El script de siembra puede ejecutarse múltiples veces (los usuarios duplicados serán ignorados)
- Todos los perfiles de prueba pertenecen a la UAEH y tienen el flag `profile_complete` en `true`
