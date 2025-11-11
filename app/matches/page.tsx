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

  // Get user's matches with profile information
  const { data: matches } = await supabase
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
    .order("last_message_at", { ascending: false, nullsFirst: false })

  // Get profiles for all matched users
  const matchedUserIds = (matches || []).map((match) => (match.user1_id === user.id ? match.user2_id : match.user1_id))

  let profiles = []
  if (matchedUserIds.length > 0) {
    const { data } = await supabase.from("profiles").select("id, full_name, profile_photos(*)").in("id", matchedUserIds)

    profiles = data || []
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

  return (
    <MatchesClient matches={matches || []} profiles={profiles} currentUserId={user.id} unreadCounts={unreadCounts} />
  )
}
