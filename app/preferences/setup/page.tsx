"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

export default function PreferencesSetup() {
  const [preferences, setPreferences] = useState({
    showMe: "everyone",
    minAge: 18,
    maxAge: 30,
    sameUniversityOnly: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { error } = await supabase.from("preferences").insert({
        user_id: user.id,
        show_me: preferences.showMe,
        min_age: preferences.minAge,
        max_age: preferences.maxAge,
        same_university_only: preferences.sameUniversityOnly,
      })

      if (error) throw error

      router.push("/discover")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al guardar preferencias")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#8B1538]/5 via-background to-[#C9325F]/5 p-6">
      <Card className="w-full max-w-md border-[#8B1538]/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#8B1538]">Configura tus preferencias</CardTitle>
          <CardDescription>Personaliza tu experiencia de búsqueda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Quiero ver</Label>
            <Select
              value={preferences.showMe}
              onValueChange={(value) => setPreferences({ ...preferences, showMe: value })}
            >
              <SelectTrigger className="border-[#8B1538]/20">
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
                <Label htmlFor="minAge" className="text-sm text-muted-foreground">
                  Mínimo
                </Label>
                <Select
                  value={preferences.minAge.toString()}
                  onValueChange={(value) => setPreferences({ ...preferences, minAge: Number.parseInt(value) })}
                >
                  <SelectTrigger className="border-[#8B1538]/20">
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
                <Label htmlFor="maxAge" className="text-sm text-muted-foreground">
                  Máximo
                </Label>
                <Select
                  value={preferences.maxAge.toString()}
                  onValueChange={(value) => setPreferences({ ...preferences, maxAge: Number.parseInt(value) })}
                >
                  <SelectTrigger className="border-[#8B1538]/20">
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

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="sameUniversity" className="flex-1">
              Solo mi universidad
            </Label>
            <Switch
              id="sameUniversity"
              checked={preferences.sameUniversityOnly}
              onCheckedChange={(checked) => setPreferences({ ...preferences, sameUniversityOnly: checked })}
              className="data-[state=checked]:bg-[#8B1538]"
            />
          </div>

          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <Button onClick={handleSave} className="w-full bg-[#8B1538] hover:bg-[#6B0F2B]" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Continuar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
