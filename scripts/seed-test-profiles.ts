import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const testProfiles = [
  {
    email: "carlos.garcia@uaeh.edu.mx",
    password: "TestPassword123!",
    profile: {
      full_name: "Carlos García",
      date_of_birth: "2002-03-15",
      gender: "male",
      university: "Universidad Autónoma del Estado de Hidalgo",
      major: "Ingeniería en Computación",
      graduation_year: 2025,
      bio: "Estudiante de ingeniería apasionado por la tecnología y el deporte. Me gusta el fútbol y la programación. Siempre buscando nuevas aventuras.",
      interests: ["Deportes", "Tecnología", "Videojuegos", "Música"],
    },
    preferences: {
      show_me: "female",
      min_age: 18,
      max_age: 25,
    },
  },
  {
    email: "ana.martinez@uaeh.edu.mx",
    password: "TestPassword123!",
    profile: {
      full_name: "Ana Martínez",
      date_of_birth: "2003-07-22",
      gender: "female",
      university: "Universidad Autónoma del Estado de Hidalgo",
      major: "Medicina",
      graduation_year: 2026,
      bio: "Futura doctora con amor por los animales y la naturaleza. Me encanta leer, viajar y conocer gente nueva.",
      interests: ["Lectura", "Viajes", "Animales", "Fotografía"],
    },
    preferences: {
      show_me: "male",
      min_age: 19,
      max_age: 27,
    },
  },
  {
    email: "sofia.lopez@uaeh.edu.mx",
    password: "TestPassword123!",
    profile: {
      full_name: "Sofía López",
      date_of_birth: "2001-11-08",
      gender: "female",
      university: "Universidad Autónoma del Estado de Hidalgo",
      major: "Arquitectura",
      graduation_year: 2024,
      bio: "Creativa y soñadora. Amo el arte, el diseño y la música indie. Buscando a alguien con quien compartir aventuras.",
      interests: ["Arte", "Diseño", "Música", "Café"],
    },
    preferences: {
      show_me: "everyone",
      min_age: 20,
      max_age: 28,
    },
  },
  {
    email: "miguel.ramirez@uaeh.edu.mx",
    password: "TestPassword123!",
    profile: {
      full_name: "Miguel Ramírez",
      date_of_birth: "2002-05-30",
      gender: "male",
      university: "Universidad Autónoma del Estado de Hidalgo",
      major: "Administración de Empresas",
      graduation_year: 2025,
      bio: "Emprendedor en formación. Me gusta el gimnasio, los negocios y las películas de acción. Siempre positivo.",
      interests: ["Gimnasio", "Negocios", "Cine", "Emprendimiento"],
    },
    preferences: {
      show_me: "female",
      min_age: 18,
      max_age: 26,
    },
  },
  {
    email: "laura.hernandez@uaeh.edu.mx",
    password: "TestPassword123!",
    profile: {
      full_name: "Laura Hernández",
      date_of_birth: "2003-01-17",
      gender: "female",
      university: "Universidad Autónoma del Estado de Hidalgo",
      major: "Psicología",
      graduation_year: 2026,
      bio: "Estudiante de psicología con pasión por ayudar a los demás. Me encanta bailar, cocinar y las conversaciones profundas.",
      interests: ["Baile", "Cocina", "Psicología", "Yoga"],
    },
    preferences: {
      show_me: "male",
      min_age: 20,
      max_age: 28,
    },
  },
]

async function seedProfiles() {
  console.log("🌱 Comenzando a sembrar perfiles de prueba...")

  for (const testUser of testProfiles) {
    try {
      // Crear usuario con auth
      console.log(`\n📝 Creando usuario: ${testUser.email}`)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
      })

      if (authError) {
        console.error(`❌ Error creando usuario ${testUser.email}:`, authError.message)
        continue
      }

      const userId = authData.user.id
      console.log(`✅ Usuario creado con ID: ${userId}`)

      // Actualizar perfil
      console.log(`📋 Actualizando perfil para ${testUser.profile.full_name}`)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          ...testUser.profile,
          profile_complete: true,
        })
        .eq("id", userId)

      if (profileError) {
        console.error(`❌ Error actualizando perfil:`, profileError.message)
        continue
      }

      // Crear foto de perfil placeholder
      console.log(`📸 Agregando foto de perfil`)
      const { error: photoError } = await supabase.from("profile_photos").insert({
        user_id: userId,
        photo_url: `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(testUser.profile.full_name + " profile photo")}`,
        photo_order: 0,
      })

      if (photoError) {
        console.error(`❌ Error agregando foto:`, photoError.message)
      }

      // Crear preferencias
      console.log(`⚙️ Configurando preferencias`)
      const { error: preferencesError } = await supabase.from("preferences").insert({
        user_id: userId,
        ...testUser.preferences,
        same_university_only: true,
      })

      if (preferencesError) {
        console.error(`❌ Error configurando preferencias:`, preferencesError.message)
      }

      console.log(`✅ Perfil completado para ${testUser.profile.full_name}`)
    } catch (error) {
      console.error(`❌ Error general:`, error)
    }
  }

  console.log("\n🎉 ¡Proceso de siembra completado!")
  console.log("\n📋 Perfiles creados:")
  console.log("   - Carlos García (carlos.garcia@uaeh.edu.mx)")
  console.log("   - Ana Martínez (ana.martinez@uaeh.edu.mx)")
  console.log("   - Sofía López (sofia.lopez@uaeh.edu.mx)")
  console.log("   - Miguel Ramírez (miguel.ramirez@uaeh.edu.mx)")
  console.log("   - Laura Hernández (laura.hernandez@uaeh.edu.mx)")
  console.log("\n🔑 Contraseña para todos: TestPassword123!")
}

seedProfiles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error fatal:", error)
    process.exit(1)
  })
