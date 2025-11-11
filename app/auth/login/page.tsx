"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/discover")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#8B1538]/5 via-background to-[#C9325F]/5 p-6">
      <div className="w-full max-w-md">
        <Card className="border-[#8B1538]/20">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-[#8B1538]">Bienvenido de vuelta</CardTitle>
            <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo universitario</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@universidad.edu"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#8B1538]/20 focus:border-[#8B1538] focus:ring-[#8B1538]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#8B1538]/20 focus:border-[#8B1538] focus:ring-[#8B1538]"
                />
              </div>
              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
              <Button type="submit" className="w-full bg-[#8B1538] hover:bg-[#6B0F2B]" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">¿No tienes cuenta? </span>
              <Link href="/auth/sign-up" className="font-medium text-[#8B1538] hover:underline">
                Regístrate aquí
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
