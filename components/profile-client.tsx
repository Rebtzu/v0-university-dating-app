"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Profile, ProfilePhoto, Preferences } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ProfileClientProps {
  profile: Profile & { profile_photos: ProfilePhoto[] }
  preferences: Preferences | null
  matchCount: number
}

export default function ProfileClient({
  profile: initialProfile,
  preferences: initialPreferences,
  matchCount,
}: ProfileClientProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [preferences, setPreferences] = useState(initialPreferences)
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingPrefs, setIsEditingPrefs] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [editForm, setEditForm] = useState({
    full_name: profile.full_name,
    major: profile.major || "",
    graduation_year: profile.graduation_year?.toString() || "",
    bio: profile.bio || "",
    interests: profile.interests?.join(", ") || "",
  })

  const [prefsForm, setPrefsForm] = useState({
    show_me: preferences?.show_me || "everyone",
    min_age: preferences?.min_age || 18,
    max_age: preferences?.max_age || 30,
    same_university_only: preferences?.same_university_only ?? true,
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const interestsArray = editForm.interests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0)

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name,
          major: editForm.major || null,
          graduation_year: editForm.graduation_year ? Number.parseInt(editForm.graduation_year) : null,
          bio: editForm.bio || null,
          interests: interestsArray.length > 0 ? interestsArray : null,
        })
        .eq("id", profile.id)

      if (error) throw error

      setProfile({
        ...profile,
        full_name: editForm.full_name,
        major: editForm.major || undefined,
        graduation_year: editForm.graduation_year ? Number.parseInt(editForm.graduation_year) : undefined,
        bio: editForm.bio || undefined,
        interests: interestsArray.length > 0 ? interestsArray : undefined,
      })

      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)
    try {
      if (preferences) {
        const { error } = await supabase
          .from("preferences")
          .update({
            show_me: prefsForm.show_me,
            min_age: prefsForm.min_age,
            max_age: prefsForm.max_age,
            same_university_only: prefsForm.same_university_only,
          })
          .eq("user_id", profile.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("preferences").insert({
          user_id: profile.id,
          show_me: prefsForm.show_me,
          min_age: prefsForm.min_age,
          max_age: prefsForm.max_age,
          same_university_only: prefsForm.same_university_only,
        })

        if (error) throw error
      }

      setPreferences({
        id: preferences?.id || "",
        user_id: profile.id,
        show_me: prefsForm.show_me as "male" | "female" | "everyone",
        min_age: prefsForm.min_age,
        max_age: prefsForm.max_age,
        same_university_only: prefsForm.same_university_only,
        created_at: preferences?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      setIsEditingPrefs(false)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating preferences:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
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

  const photo = profile.profile_photos[0]

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
            <Link href="/profile" className="flex items-center gap-2 text-[#8B1538]">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              Perfil
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-muted/30 p-6">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mi Perfil</CardTitle>
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-[#8B1538] text-[#8B1538] hover:bg-[#8B1538]/10 bg-transparent"
                  >
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                    <DialogDescription>Actualiza tu información personal</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Nombre completo</Label>
                      <Input
                        id="edit-name"
                        value={editForm.full_name}
                        onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-major">Carrera</Label>
                      <Input
                        id="edit-major"
                        value={editForm.major}
                        onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-year">Año de graduación</Label>
                      <Input
                        id="edit-year"
                        type="number"
                        value={editForm.graduation_year}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            graduation_year: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-bio">Biografía</Label>
                      <Textarea
                        id="edit-bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        className="min-h-24"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-interests">Intereses (separados por comas)</Label>
                      <Input
                        id="edit-interests"
                        value={editForm.interests}
                        onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                      />
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      className="w-full bg-[#8B1538] hover:bg-[#6B0F2B]"
                      disabled={isSaving}
                    >
                      {isSaving ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <div className="relative h-32 w-32 flex-shrink-0">
                  {photo ? (
                    <Image
                      src={photo.photo_url || "/placeholder.svg"}
                      alt={profile.full_name}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#8B1538]/10">
                      <svg
                        className="h-16 w-16 text-[#8B1538]/40"
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
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold">
                    {profile.full_name}, {calculateAge(profile.date_of_birth)}
                  </h2>
                  <p className="text-muted-foreground">{profile.university}</p>
                  {profile.major && (
                    <p className="text-sm text-muted-foreground">
                      {profile.major}
                      {profile.graduation_year && ` • ${profile.graduation_year}`}
                    </p>
                  )}

                  {profile.bio && <p className="mt-4 text-sm leading-relaxed">{profile.bio}</p>}

                  {profile.interests && profile.interests.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {profile.interests.map((interest) => (
                        <span key={interest} className="rounded-full bg-[#8B1538]/10 px-3 py-1 text-xs text-[#8B1538]">
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-[#8B1538]/5 p-4">
                  <div className="text-3xl font-bold text-[#8B1538]">{matchCount}</div>
                  <div className="text-sm text-muted-foreground">Matches totales</div>
                </div>
                <div className="rounded-lg bg-[#8B1538]/5 p-4">
                  <div className="text-3xl font-bold text-[#8B1538]">{profile.interests?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Intereses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences Card */}
          {preferences && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Preferencias de búsqueda</CardTitle>
                <Dialog open={isEditingPrefs} onOpenChange={setIsEditingPrefs}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-[#8B1538] text-[#8B1538] hover:bg-[#8B1538]/10 bg-transparent"
                    >
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Editar Preferencias</DialogTitle>
                      <DialogDescription>Personaliza tu experiencia de búsqueda</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Quiero ver</Label>
                        <Select
                          value={prefsForm.show_me}
                          onValueChange={(value) => setPrefsForm({ ...prefsForm, show_me: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Hombres</SelectItem>
                            <SelectItem value="female">Mujeres</SelectItem>
                            <SelectItem value="everyone">Todos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <Label>Rango de edad</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Mínimo</Label>
                            <Select
                              value={prefsForm.min_age.toString()}
                              onValueChange={(value) =>
                                setPrefsForm({
                                  ...prefsForm,
                                  min_age: Number.parseInt(value),
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 13 }, (_, i) => i + 18).map((age) => (
                                  <SelectItem key={age} value={age.toString()}>
                                    {age}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Máximo</Label>
                            <Select
                              value={prefsForm.max_age.toString()}
                              onValueChange={(value) =>
                                setPrefsForm({
                                  ...prefsForm,
                                  max_age: Number.parseInt(value),
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 23 }, (_, i) => i + 18).map((age) => (
                                  <SelectItem key={age} value={age.toString()}>
                                    {age}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      

                      <Button
                        onClick={handleSavePreferences}
                        className="w-full bg-[#8B1538] hover:bg-[#6B0F2B]"
                        disabled={isSaving}
                      >
                        {isSaving ? "Guardando..." : "Guardar cambios"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mostrar:</span>
                  <span className="font-medium">
                    {preferences.show_me === "male"
                      ? "Hombres"
                      : preferences.show_me === "female"
                        ? "Mujeres"
                        : "Todos"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rango de edad:</span>
                  <span className="font-medium">
                    {preferences.min_age} - {preferences.max_age}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Solo mi universidad:</span>
                  <span className="font-medium">{preferences.same_university_only ? "Sí" : "No"}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleLogout} variant="destructive" className="w-full">
                Cerrar sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
