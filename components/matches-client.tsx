"use client"

import type { Match, Profile, ProfilePhoto } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useEffect } from "react"

interface MatchesClientProps {
  matches: Match[]
  profiles: (Profile & { profile_photos: ProfilePhoto[] })[]
  currentUserId: string
  unreadCounts: Record<string, number>
}

export default function MatchesClient({ matches, profiles, currentUserId, unreadCounts }: MatchesClientProps) {
  useEffect(() => {
    console.log("[v0] MatchesClient - Matches:", matches)
    console.log("[v0] MatchesClient - Profiles:", profiles)
    console.log("[v0] MatchesClient - Current user:", currentUserId)
  }, [matches, profiles, currentUserId])

  const getMatchedUser = (match: Match) => {
    const matchedUserId = match.user1_id === currentUserId ? match.user2_id : match.user1_id
    return profiles.find((p) => p.id === matchedUserId)
  }

  const formatLastMessageTime = (timestamp: string | undefined) => {
    if (!timestamp) return "Nuevo match"

    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return "Ahora"
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`
    if (diffInHours < 24) return `Hace ${diffInHours}h`
    if (diffInDays < 7) return `Hace ${diffInDays}d`
    return date.toLocaleDateString()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold text-[#8B1538]">UniMatch</h1>
          <nav className="flex gap-4">
            <Link href="/discover" className="flex items-center gap-2 text-muted-foreground hover:text-[#8B1538]">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Descubrir
            </Link>
            <Link href="/matches" className="flex items-center gap-2 text-[#8B1538]">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Matches
            </Link>
            <Link href="/profile" className="flex items-center gap-2 text-muted-foreground hover:text-[#8B1538]">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Perfil
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto max-w-4xl p-6">
          <h2 className="mb-6 text-3xl font-bold">Tus Matches</h2>

          {matches.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#8B1538]/10">
                <svg className="h-8 w-8 text-[#8B1538]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Aún no tienes matches</h3>
              <p className="mb-6 text-muted-foreground">Comienza a deslizar para conocer personas nuevas</p>
              <Button asChild className="bg-[#8B1538] hover:bg-[#6B0F2B]">
                <Link href="/discover">Ir a Descubrir</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {matches.map((match) => {
                const matchedUser = getMatchedUser(match)
                console.log("[v0] Rendering match:", match.id, "Matched user:", matchedUser?.full_name || "Not found")

                if (!matchedUser) {
                  console.warn("[v0] No matched user found for match:", match.id)
                  return null
                }

                const unreadCount = unreadCounts[match.id] || 0
                const photo = matchedUser.profile_photos?.[0]

                return (
                  <Link key={match.id} href={`/chat/${match.id}`} className="group">
                    <Card className="overflow-hidden transition-all hover:shadow-lg">
                      <div className="flex items-center gap-4 p-4">
                        <div className="relative h-16 w-16 flex-shrink-0">
                          {photo ? (
                            <Image
                              src={photo.photo_url || "/placeholder.svg"}
                              alt={matchedUser.full_name}
                              fill
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#8B1538]/10">
                              <svg
                                className="h-8 w-8 text-[#8B1538]/40"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                          )}
                          {unreadCount > 0 && (
                            <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#8B1538] text-xs font-bold text-white">
                              {unreadCount}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h3 className="font-semibold group-hover:text-[#8B1538]">{matchedUser.full_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatLastMessageTime(match.last_message_at)}
                          </p>
                        </div>
                        <svg
                          className="h-5 w-5 text-muted-foreground group-hover:text-[#8B1538]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
