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

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/complete-profile")
  }

  // Get user preferences
  const { data: preferences } = await supabase.from("preferences").select("*").eq("user_id", user.id).single()

  // If no preferences, redirect to setup
  if (!preferences) {
    redirect("/preferences/setup")
  }

  return <DiscoverClient userId={user.id} preferences={preferences} />
}
