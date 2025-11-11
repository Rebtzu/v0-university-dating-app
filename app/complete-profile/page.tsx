"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function CompleteProfile() {
  const [formData, setFormData] = useState({
    major: "",
    graduationYear: "",
    bio: "",
    interests: "",
  })
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + photoFiles.length > 6) {
      setError("Máximo 6 fotos permitidas")
      return
    }

    setPhotoFiles([...photoFiles, ...files])

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setPhotoPreviews([...photoPreviews, ...newPreviews])
    setError(null)
  }

  const removePhoto = (index: number) => {
    const newFiles = photoFiles.filter((_, i) => i !== index)
    const newPreviews = photoPreviews.filter((_, i) => i !== index)
    setPhotoFiles(newFiles)
    setPhotoPreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      console.log("[v0] Starting profile completion for user:", user.id)

      const interestsArray = formData.interests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0)

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          major: formData.major || null,
          graduation_year: formData.graduationYear ? Number.parseInt(formData.graduationYear) : null,
          bio: formData.bio || null,
          interests: interestsArray.length > 0 ? interestsArray : null,
          profile_complete: true,
        })
        .eq("id", user.id)

      if (profileError) {
        console.error("[v0] Profile update error:", profileError)
        throw profileError
      }

      console.log("[v0] Profile updated successfully")

      if (photoFiles.length > 0) {
        console.log("[v0] Uploading", photoFiles.length, "photos")

        for (let i = 0; i < photoFiles.length; i++) {
          const file = photoFiles[i]
          const fileExt = file.name.split(".").pop()
          const fileName = `${user.id}-${Date.now()}-${i}.${fileExt}`
          const filePath = `${fileName}`

          console.log("[v0] Uploading photo:", filePath)

          // Upload to Supabase Storage
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from("photos")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            })

          if (uploadError) {
            console.error("[v0] Upload error:", uploadError)
            throw uploadError
          }

          console.log("[v0] Photo uploaded:", uploadData)

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("photos").getPublicUrl(filePath)

          console.log("[v0] Public URL:", publicUrl)

          // Save photo URL to database
          const { error: photoError } = await supabase.from("profile_photos").insert({
            user_id: user.id,
            photo_url: publicUrl,
            photo_order: i,
          })

          if (photoError) {
            console.error("[v0] Photo DB error:", photoError)
            throw photoError
          }

          console.log("[v0] Photo saved to database")
        }
      }

      console.log("[v0] Profile completion successful, redirecting...")
      router.push("/preferences/setup")
    } catch (error: unknown) {
      console.error("[v0] Complete profile error:", error)
      setError(error instanceof Error ? error.message : "Error al completar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#8B1538]/5 via-background to-[#C9325F]/5 p-6">
      <Card className="w-full max-w-md border-[#8B1538]/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#8B1538]">Completa tu perfil</CardTitle>
          <CardDescription>Cuéntanos más sobre ti y tu vida en la UAEH</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photos">Fotos de perfil (hasta 6)</Label>
              <div className="grid grid-cols-3 gap-2">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {photoFiles.length < 6 && (
                  <label
                    htmlFor="photos"
                    className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#8B1538]/30 hover:border-[#8B1538] hover:bg-[#8B1538]/5"
                  >
                    <svg className="h-8 w-8 text-[#8B1538]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </label>
                )}
              </div>
              <Input
                id="photos"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">Sube al menos 1 foto para comenzar</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="major">Carrera (opcional)</Label>
              <Input
                id="major"
                placeholder="Ej: Ingeniería Informática"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="border-[#8B1538]/20 focus:border-[#8B1538] focus:ring-[#8B1538]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear">Año de graduación (opcional)</Label>
              <Input
                id="graduationYear"
                type="number"
                placeholder="2025"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                className="border-[#8B1538]/20 focus:border-[#8B1538] focus:ring-[#8B1538]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografía (opcional)</Label>
              <Textarea
                id="bio"
                placeholder="Cuéntanos algo sobre ti..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="min-h-24 border-[#8B1538]/20 focus:border-[#8B1538] focus:ring-[#8B1538]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Intereses (separados por comas, opcional)</Label>
              <Input
                id="interests"
                placeholder="Deportes, Música, Viajes..."
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="border-[#8B1538]/20 focus:border-[#8B1538] focus:ring-[#8B1538]"
              />
            </div>

            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

            <Button type="submit" className="w-full bg-[#8B1538] hover:bg-[#6B0F2B]" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Continuar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
