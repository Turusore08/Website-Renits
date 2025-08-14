"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Mail, Lock } from "lucide-react"
import Header from "@/components/layout/Header" // <-- 1. Impor komponen Header

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  // Menampilkan pesan sukses setelah registrasi
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Registrasi berhasil! Silakan masuk.")
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const dataToSend = {
        email: email,
        password: password,
      }

      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json()

      if (response.ok) {
        console.log("Login berhasil. Token diterima.")
        localStorage.setItem("accessToken", result.access_token)
        localStorage.setItem("user", JSON.stringify({ email }))
        router.push("/examination")
      } else {
        setError(result.message || "Terjadi kesalahan saat login.")
      }
    } catch (error) {
      console.error("Tidak bisa terhubung ke server:", error)
      setError("Gagal terhubung ke server. Pastikan server back-end sudah berjalan.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* --- 2. Gunakan komponen Header di sini --- */}
      <Header />

      <main className="flex items-center justify-center p-4 pt-16">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Masuk ke Akun Anda</CardTitle>
              <CardDescription>Masukkan email dan password untuk mengakses pemeriksaan</CardDescription>
            </CardHeader>
            <CardContent>
              {successMessage && <p className="text-green-600 text-sm mb-4 bg-green-50 p-3 rounded-md">{successMessage}</p>}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
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
