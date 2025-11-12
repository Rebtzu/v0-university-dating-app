import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DiscoverClient from "@/components/discover-client"

export default async function DiscoverPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/complete-profile")
  }

  if (!profile.profile_complete) {
    redirect("/complete-profile")
  }

  const { data: preferencesData } = await supabase.from("preferences").select("*").eq("user_id", user.id)

  const preferences = preferencesData && preferencesData.length > 0 ? preferencesData[0] : null

  if (!preferences) {
    redirect("/preferences/setup")
  }

  return <DiscoverClient userId={user.id} preferences={preferences} userProfile={profile} />
}
