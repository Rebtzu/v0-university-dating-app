"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { ProfileWithPhotos, Preferences } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DiscoverClientProps {
  userId: string
  preferences: Preferences
}

export default function DiscoverClient({ userId, preferences }: DiscoverClientProps) {
  const [profiles, setProfiles] = useState<ProfileWithPhotos[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    setIsLoading(true)
    try {
      // Get profiles that user hasn't swiped on yet
      const { data: swipedIds } = await supabase.from("swipes").select("swiped_id").eq("swiper_id", userId)

      const swipedUserIds = swipedIds?.map((s) => s.swiped_id) || []

      // Build query for profiles
      let query = supabase
        .from("profiles")
        .select("*, profile_photos(*)")
        .neq("id", userId)
        .eq("profile_complete", true)

      // Apply preferences
      if (preferences.show_me !== "everyone") {
        query = query.eq("gender", preferences.show_me)
      }

      if (preferences.same_university_only) {
        const { data: myProfile } = await supabase.from("profiles").select("university").eq("id", userId).single()

        if (myProfile) {
          query = query.eq("university", myProfile.university)
        }
      }

      // Exclude already swiped profiles
      if (swipedUserIds.length > 0) {
        query = query.not("id", "in", `(${swipedUserIds.join(",")})`)
      }

      const { data, error } = await query.limit(20)

      if (error) throw error

      // Sort photos by order
      const profilesWithSortedPhotos = (data || []).map((profile) => ({
        ...profile,
        profile_photos: (profile.profile_photos || []).sort((a, b) => a.photo_order - b.photo_order),
      }))

      setProfiles(profilesWithSortedPhotos as ProfileWithPhotos[])
    } catch (error) {
      console.error("[v0] Error loading profiles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwipe = async (action: "like" | "pass") => {
    const currentProfile = profiles[currentIndex]
    if (!currentProfile) return

    setSwipeDirection(action === "like" ? "right" : "left")

    try {
      // Record the swipe
      const { error } = await supabase.from("swipes").insert({
        swiper_id: userId,
        swiped_id: currentProfile.id,
        action,
      })

      if (error) throw error

      // Wait for animation
      setTimeout(() => {
        setSwipeDirection(null)
        setCurrentIndex((prev) => prev + 1)
      }, 300)
    } catch (error) {
      console.error("[v0] Error recording swipe:", error)
      setSwipeDirection(null)
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B1538] border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Cargando perfiles...</p>
        </div>
      </div>
    )
  }

  const currentProfile = profiles[currentIndex]

  if (!currentProfile) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b bg-white">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold text-[#8B1538]">UniMatch</h1>
            <nav className="flex gap-4">
              <Link href="/matches" className="flex items-center gap-2 text-muted-foreground hover:text-[#8B1538]">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
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

        <main className="flex flex-1 items-center justify-center p-6">
          <Card className="w-full max-w-md p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#8B1538]/10">
              <svg className="h-8 w-8 text-[#8B1538]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-[#8B1538]">No hay más perfiles</h2>
            <p className="mb-6 text-muted-foreground">
              Has visto todos los perfiles disponibles. Vuelve más tarde para ver nuevos usuarios.
            </p>
            <Button onClick={() => router.refresh()} className="bg-[#8B1538] hover:bg-[#6B0F2B]">
              Actualizar
            </Button>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold text-[#8B1538]">UniMatch</h1>
          <nav className="flex gap-4">
            <Link href="/matches" className="flex items-center gap-2 text-muted-foreground hover:text-[#8B1538]">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
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

      <main className="flex flex-1 items-center justify-center p-4 md:p-6">
        <div className="relative w-full max-w-sm">
          <Card
            className={`relative h-[600px] w-full overflow-hidden transition-transform duration-300 ${
              swipeDirection === "right"
                ? "translate-x-[200px] rotate-12 opacity-0"
                : swipeDirection === "left"
                  ? "-translate-x-[200px] -rotate-12 opacity-0"
                  : ""
            }`}
          >
            <div className="relative h-full w-full">
              {currentProfile.profile_photos.length > 0 ? (
                <Image
                  src={currentProfile.profile_photos[0].photo_url || "/placeholder.svg"}
                  alt={currentProfile.full_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#8B1538]/10">
                  <svg className="h-24 w-24 text-[#8B1538]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h2 className="text-3xl font-bold">
                  {currentProfile.full_name}, {calculateAge(currentProfile.date_of_birth)}
                </h2>
                <p className="mt-1 text-sm opacity-90">{currentProfile.university}</p>
                {currentProfile.major && <p className="text-sm opacity-75">{currentProfile.major}</p>}
                {currentProfile.bio && <p className="mt-3 text-sm leading-relaxed">{currentProfile.bio}</p>}
                {currentProfile.interests && currentProfile.interests.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentProfile.interests.slice(0, 5).map((interest) => (
                      <span key={interest} className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="mt-6 flex items-center justify-center gap-6">
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleSwipe("pass")}
              className="h-16 w-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>

            <Button
              size="lg"
              onClick={() => handleSwipe("like")}
              className="h-20 w-20 rounded-full bg-[#8B1538] hover:bg-[#6B0F2B]"
            >
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {profiles.length - currentIndex - 1} perfiles restantes
          </p>
        </div>
      </main>
    </div>
  )
}
