"use client"

import type React from "react"
import { useState, Suspense } from "react" // <-- 1. Impor Suspense
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Mail, Lock } from "lucide-react"
import Header from "@/components/layout/Header"
import LoginSuccessMessage from "./LoginSuccessMessage" // <-- 2. Impor komponen baru

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // --- Logika untuk pesan sukses DIHAPUS dari sini ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const dataToSend = { email, password }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })
      const result = await response.json()

      if (response.ok) {
        localStorage.setItem("accessToken", result.access_token)
        localStorage.setItem("user", JSON.stringify({ email }))
        router.push("/examination")
      } else {
        setError(result.message || "Terjadi kesalahan saat login.")
      }
    } catch (err) {
      console.error("Tidak bisa terhubung ke server:", err)
      setError("Gagal terhubung ke server. Pastikan server back-end sudah berjalan.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      <main className="flex items-center justify-center p-4 pt-16">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Masuk ke Akun Anda</CardTitle>
              <CardDescription>Masukkan email dan password untuk mengakses pemeriksaan</CardDescription>
            </CardHeader>
            <CardContent>
              {/* --- 3. Bungkus komponen baru dengan Suspense --- */}
              <Suspense fallback={null}>
                <LoginSuccessMessage />
              </Suspense>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="password" type="password" placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
                  </div>
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Memproses..." : "Masuk"}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Daftar di sini
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
