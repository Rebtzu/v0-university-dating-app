import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import MatchesClient from "@/components/matches-client"

export default async function MatchesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  console.log("[v0] Loading matches for user:", user.id)

  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select(
      `
      id,
      user1_id,
      user2_id,
      created_at,
      last_message_at
    `,
    )
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  if (matchesError) {
    console.error("[v0] Error loading matches:", matchesError)
  }

  console.log("[v0] Found", matches?.length || 0, "matches")

  // Get profiles for all matched users
  const matchedUserIds = (matches || []).map((match) => (match.user1_id === user.id ? match.user2_id : match.user1_id))

  console.log("[v0] Loading profiles for matched users:", matchedUserIds)

  let profiles = []
  if (matchedUserIds.length > 0) {
    const { data, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, profile_photos(*)")
      .in("id", matchedUserIds)

    if (profilesError) {
      console.error("[v0] Error loading profiles:", profilesError)
    }

    profiles = data || []
    console.log("[v0] Loaded", profiles.length, "profiles")
  }

  // Get unread message counts for each match
  const unreadCounts: Record<string, number> = {}
  if (matches && matches.length > 0) {
    for (const match of matches) {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("match_id", match.id)
        .eq("receiver_id", user.id)
        .eq("read", false)

      unreadCounts[match.id] = count || 0
    }
  }

  console.log("[v0] Unread counts:", unreadCounts)

  return (
    <MatchesClient matches={matches || []} profiles={profiles} currentUserId={user.id} unreadCounts={unreadCounts} />
  )
}
