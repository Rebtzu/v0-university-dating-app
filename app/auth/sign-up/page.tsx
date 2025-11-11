"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    university: "Universidad Autónoma del Estado de Hidalgo",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    const emailDomain = formData.email.split("@")[1]?.toLowerCase()
    if (emailDomain !== "uaeh.edu.mx" && emailDomain !== "uaeh.mx") {
      setError("Debes usar tu correo institucional de la UAEH (@uaeh.edu.mx o @uaeh.mx)")
      setIsLoading(false)
      return
    }

    if (!formData.gender || !formData.university) {
      setError("Por favor completa todos los campos")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/complete-profile`,
          data: {
            full_name: formData.fullName,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender,
            university: formData.university,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#8B1538]/5 via-background to-[#C9325F]/5 p-6">
      <div className="w-full max-w-md">
        <Card className="border-[#8B1538]/20">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-[#8B1538]">Únete a UAEH Dating</CardTitle>
            <CardDescription>Crea tu cuenta con tu correo institucional</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="border-[#8B1538]/20 focus:border-[#8B1538] focus:ring-[#8B1538]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo institucional UAEH</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@uaeh.edu.mx"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-[#8B1538]/20 focus:border-[#8B1538] focus:ring-[#8B1538]"
                />
                <p className="text-xs text-muted-foreground">
                  Debes usar tu correo institucional (@uaeh.edu.mx o @uaeh.mx)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fecha de nacimiento</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="border-[#8B1538]/20 focus:border-[#8B1538] focus:ring-[#8B1538]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Género</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger className="border-[#8B1538]/20 focus:border-[#8B1538] focus:ring-[#8B1538]">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Hombre</SelectItem>
                      <SelectItem value="female">Mujer</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="border-[#8B1538]/20 focus:border-[#8B1538] focus:ring-[#8B1538]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="border-[#8B1538]/20 focus:border-[#8B1538] focus:ring-[#8B1538]"
                />
              </div>

              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

              <Button type="submit" className="w-full bg-[#8B1538] hover:bg-[#6B0F2B]" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
              <Link href="/auth/login" className="font-medium text-[#8B1538] hover:underline">
                Inicia sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
