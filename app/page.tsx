import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
              Encuentra tu <span className="text-[#8B1538]">match perfecto</span> en la UAEH
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-balance md:text-xl">
              La app de citas exclusiva para estudiantes de la Universidad Autónoma del Estado de Hidalgo. Conecta con
              estudiantes de tu campus y vive tu experiencia universitaria al máximo.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full bg-[#8B1538] hover:bg-[#6B0F2B] sm:w-auto">
              <Link href="/auth/sign-up">Crear cuenta</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-[#8B1538] text-[#8B1538] hover:bg-[#8B1538]/10 sm:w-auto bg-transparent"
            >
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#8B1538]/10">
                <svg className="h-6 w-6 text-[#8B1538]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Solo UAEH</h3>
              <p className="text-sm text-muted-foreground">
                Exclusivo para estudiantes verificados de la Universidad Autónoma del Estado de Hidalgo
              </p>
            </div>

            <div className="space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#8B1538]/10">
                <svg className="h-6 w-6 text-[#8B1538]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Matches instantáneos</h3>
              <p className="text-sm text-muted-foreground">Cuando ambos se gustan, es un match y pueden chatear</p>
            </div>

            <div className="space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#8B1538]/10">
                <svg className="h-6 w-6 text-[#8B1538]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Seguro y privado</h3>
              <p className="text-sm text-muted-foreground">
                Tus datos están protegidos y solo compartes lo que quieres
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground">
          <p>UAEH Dating - Exclusivo para la Universidad Autónoma del Estado de Hidalgo</p>
        </div>
      </footer>
    </div>
  )
}
