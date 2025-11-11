"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Message, Profile, ProfilePhoto } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ChatClientProps {
  matchId: string
  currentUserId: string
  otherUser: Profile & { profile_photos: ProfilePhoto[] }
  initialMessages: Message[]
}

export default function ChatClient({ matchId, currentUserId, otherUser, initialMessages }: ChatClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel(`match-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => [...prev, newMsg])

          // Mark as read if it's for current user
          if (newMsg.receiver_id === currentUserId) {
            supabase
              .from("messages")
              .update({ read: true })
              .eq("id", newMsg.id)
              .then(() => {})
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId, currentUserId, supabase])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const messageContent = newMessage.trim()
    setNewMessage("")

    try {
      const { error } = await supabase.from("messages").insert({
        match_id: matchId,
        sender_id: currentUserId,
        receiver_id: otherUser.id,
        content: messageContent,
        read: false,
      })

      if (error) throw error
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      setNewMessage(messageContent) // Restore message on error
    } finally {
      setIsSending(false)
    }
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const photo = otherUser.profile_photos[0]

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/matches")} className="hover:bg-[#8B1538]/10">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>

          <Link href={`/profile/${otherUser.id}`} className="flex items-center gap-3 flex-1">
            <div className="relative h-10 w-10 flex-shrink-0">
              {photo ? (
                <Image
                  src={photo.photo_url || "/placeholder.svg"}
                  alt={otherUser.full_name}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#8B1538]/10">
                  <svg className="h-6 w-6 text-[#8B1538]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h2 className="font-semibold">{otherUser.full_name}</h2>
              <p className="text-xs text-muted-foreground">{otherUser.university}</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-4">
        <div className="container mx-auto max-w-3xl space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#8B1538]/10">
                <svg className="h-8 w-8 text-[#8B1538]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#8B1538]">Es un match!</h3>
              <p className="text-muted-foreground">Empieza la conversación con {otherUser.full_name}</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === currentUserId
              return (
                <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isOwn ? "bg-[#8B1538] text-white" : "bg-white text-foreground"
                    }`}
                  >
                    <p className="break-words text-sm leading-relaxed">{message.content}</p>
                    <p className={`mt-1 text-xs ${isOwn ? "text-white/70" : "text-muted-foreground"}`}>
                      {formatMessageTime(message.created_at)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="border-t bg-white p-4">
        <form onSubmit={handleSendMessage} className="container mx-auto flex max-w-3xl gap-2">
          <Input
            type="text"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
            className="flex-1 border-[#8B1538]/20 focus:border-[#8B1538] focus:ring-[#8B1538]"
          />
          <Button type="submit" disabled={!newMessage.trim() || isSending} className="bg-[#8B1538] hover:bg-[#6B0F2B]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </form>
      </footer>
    </div>
  )
}
