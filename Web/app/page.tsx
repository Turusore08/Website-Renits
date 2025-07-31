"use client"

import { useState, useEffect } from "react" // <-- Impor kembali
import Link from "next/link"
import Image from "next/image" // <-- Impor Image
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Zap } from "lucide-react"
import Header from "@/components/layout/Header"

export default function HomePage() {
  // --- TAMBAHKAN KEMBALI LOGIKA INI, KHUSUS UNTUK HALAMAN INI ---
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // useEffect ini hanya berjalan di sisi klien, aman untuk localStorage
    const token = localStorage.getItem("accessToken")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])
  // -----------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Deteksi Dini Penyakit Ginjal dengan Teknologi Smart</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            RenITS adalah patch pintar yang dapat mendeteksi penyakit ginjal hanya dengan beberapa parameter
            sederhana menggunakan teknologi machine learning yang menganalisis kandungan keringat Anda.
          </p>
          {/* --- Tautan Dinamis ini sekarang akan berfungsi --- */}
          <Link href={isLoggedIn ? "/examination" : "/login"}>
            <Button size="lg" className="text-lg px-8 py-3 bg-primary hover:bg-primary/90">
              Mulai Pemeriksaan
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Sisa dari halaman Anda tetap sama... */}
      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Mengapa Memilih RenITS?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Deteksi Cepat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Hasil pemeriksaan dalam hitungan menit dengan akurasi tinggi menggunakan teknologi smartpatch.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Non-Invasif</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tidak memerlukan pengambilan darah atau prosedur invasif lainnya. Cukup dengan analisis keringat.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Mudah Digunakan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Interface yang user-friendly dan proses pemeriksaan yang sederhana untuk semua kalangan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Cara Kerja RenITS</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Login & Registrasi</h4>
              <p className="text-gray-600">Masuk ke akun Anda atau daftar jika belum memiliki akun</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Isi Form Pemeriksaan</h4>
              <p className="text-gray-600">Jawab pertanyaan tentang riwayat kesehatan dan masukkan usia Anda</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Pasang Smartpatch</h4>
              <p className="text-gray-600">Tempelkan smartpatch di badan untuk menganalisis keringat</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Lihat Hasil</h4>
              <p className="text-gray-600">Dapatkan hasil analisis dan rekomendasi kesehatan ginjal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
       <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
              <Image
                src="https://placehold.co/40x40/FFFFFF/3B82F6?text=R"
                alt="RenITS Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <h3 className="text-2xl font-bold">RenITS</h3>
            </Link>
            <p className="text-gray-400 mb-4">Teknologi deteksi dini penyakit ginjal untuk hidup yang lebih sehat</p>
            <p className="text-sm text-gray-500">© 2024 RenITS. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
