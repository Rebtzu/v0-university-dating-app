import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#8B1538]/5 via-background to-[#C9325F]/5 p-6">
      <div className="w-full max-w-md">
        <Card className="border-[#8B1538]/20">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#8B1538]/10">
              <svg className="h-8 w-8 text-[#8B1538]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-[#8B1538]">¡Revisa tu correo!</CardTitle>
            <CardDescription className="text-base">Te hemos enviado un correo de confirmación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Hemos enviado un enlace de verificación a tu correo electrónico. Por favor, revisa tu bandeja de entrada y
              haz clic en el enlace para activar tu cuenta.
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full border-[#8B1538] text-[#8B1538] hover:bg-[#8B1538]/10 bg-transparent"
            >
              <Link href="/auth/login">Volver al inicio de sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
