import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ChatClient from "@/components/chat-client"

interface ChatPageProps {
  params: Promise<{ matchId: string }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { matchId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get match details
  const { data: match } = await supabase.from("matches").select("*").eq("id", matchId).single()

  if (!match) {
    redirect("/matches")
  }

  // Verify user is part of this match
  if (match.user1_id !== user.id && match.user2_id !== user.id) {
    redirect("/matches")
  }

  // Get the other user's profile
  const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id

  const { data: otherUserProfile } = await supabase
    .from("profiles")
    .select("*, profile_photos(*)")
    .eq("id", otherUserId)
    .single()

  if (!otherUserProfile) {
    redirect("/matches")
  }

  // Get messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true })

  // Mark messages as read
  await supabase
    .from("messages")
    .update({ read: true })
    .eq("match_id", matchId)
    .eq("receiver_id", user.id)
    .eq("read", false)

  return (
    <ChatClient
      matchId={matchId}
      currentUserId={user.id}
      otherUser={otherUserProfile}
      initialMessages={messages || []}
    />
  )
}
