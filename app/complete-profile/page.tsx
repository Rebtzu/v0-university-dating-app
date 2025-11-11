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

export default function CompleteProfile() {
  const [formData, setFormData] = useState({
    major: "",
    graduationYear: "",
    bio: "",
    interests: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const interestsArray = formData.interests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0)

      const { error } = await supabase
        .from("profiles")
        .update({
          major: formData.major || null,
          graduation_year: formData.graduationYear ? Number.parseInt(formData.graduationYear) : null,
          bio: formData.bio || null,
          interests: interestsArray.length > 0 ? interestsArray : null,
          profile_complete: true,
        })
        .eq("id", user.id)

      if (error) throw error

      router.push("/preferences/setup")
    } catch (error: unknown) {
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
