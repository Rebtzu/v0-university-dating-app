import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProfileClient from "@/components/profile-client"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*, profile_photos(*)").eq("id", user.id).single()

  if (!profile) {
    redirect("/complete-profile")
  }

  // Get preferences
  const { data: preferences } = await supabase.from("preferences").select("*").eq("user_id", user.id).single()

  // Get match count
  const { count: matchCount } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true })
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)

  return <ProfileClient profile={profile} preferences={preferences} matchCount={matchCount || 0} />
}
