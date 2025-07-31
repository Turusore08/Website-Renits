"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { History, LogOut } from "lucide-react"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  // Cek status login saat komponen dimuat di sisi klien.
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    // Hapus semua data sesi dari localStorage
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    // ... hapus item localStorage lain jika ada ...
    setIsLoggedIn(false)
    router.push("/")
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            {/* --- PERUBAHAN KRITIS DI SINI --- */}
            <Image
              src="/images/LOGO_PP_IG-removebg-preview.png" // Ganti dengan path yang benar
              alt="RenITS Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <h1 className="text-2xl font-bold text-foreground">RenITS</h1>
          </Link>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/history">
                  <Button variant="ghost">
                    <History className="h-4 w-4 mr-2" />
                    Riwayat
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button>Masuk</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
