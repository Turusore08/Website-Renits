"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image" // Import Image component
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Heart,
  MapPin,
  ExternalLink,
  BookOpen,
  Dumbbell,
  AlertTriangle,
  Stethoscope,
  Clock,
  Users,
} from "lucide-react" // Removed Activity

export default function RecommendationsPage() {
  const [healthStatus, setHealthStatus] = useState("")
  const router = useRouter()

  useEffect(() => {
    const status = localStorage.getItem("healthStatus")
    if (!status) {
      router.push("/results")
      return
    }
    setHealthStatus(status)
  }, [router])

  const isHealthy = healthStatus === "Rendah"

  const healthyArticles = [
    {
      title: "10 Kebiasaan Sehat untuk Menjaga Kesehatan Ginjal",
      description: "Pelajari kebiasaan harian yang dapat membantu menjaga fungsi ginjal tetap optimal",
      readTime: "5 menit",
    },
    {
      title: "Makanan Terbaik untuk Kesehatan Ginjal",
      description: "Daftar makanan yang baik untuk ginjal dan yang harus dihindari",
      readTime: "7 menit",
    },
    {
      title: "Pentingnya Hidrasi untuk Kesehatan Ginjal",
      description: "Mengapa minum air yang cukup sangat penting untuk fungsi ginjal",
      readTime: "4 menit",
    },
    {
      title: "Deteksi Dini Penyakit Ginjal: Yang Perlu Anda Ketahui",
      description: "Tanda-tanda awal penyakit ginjal dan pentingnya pemeriksaan rutin",
      readTime: "6 menit",
    },
  ]

  const healthyExercises = [
    {
      name: "Jalan Kaki",
      duration: "30 menit/hari",
      benefit: "Meningkatkan sirkulasi darah dan kesehatan jantung",
    },
    {
      name: "Berenang",
      duration: "2-3x seminggu",
      benefit: "Olahraga low-impact yang baik untuk seluruh tubuh",
    },
    {
      name: "Yoga",
      duration: "20-30 menit",
      benefit: "Mengurangi stress dan meningkatkan fleksibilitas",
    },
    {
      name: "Bersepeda",
      duration: "45 menit, 3x seminggu",
      benefit: "Meningkatkan stamina dan kesehatan kardiovaskular",
    },
  ]

  const kidneyFriendlyExercises = [
    {
      name: "Jalan Santai",
      duration: "15-20 menit",
      benefit: "Olahraga ringan yang aman untuk ginjal",
    },
    {
      name: "Stretching",
      duration: "10-15 menit",
      benefit: "Meningkatkan fleksibilitas tanpa memberatkan ginjal",
    },
    {
      name: "Tai Chi",
      duration: "20-30 menit",
      benefit: "Olahraga lembut yang baik untuk keseimbangan",
    },
    {
      name: "Senam Ringan",
      duration: "15-25 menit",
      benefit: "Menjaga mobilitas dengan intensitas rendah",
    },
  ]

  if (!healthStatus) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali</span>
          </Button>
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 mb-2">
              <Image
                src="/images/LOGO_PP_IG-removebg-preview.png"
                alt="RenITS Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <h1 className="text-2xl font-bold text-foreground">RenITS</h1> {/* Changed to text-logo-blue */}
            </div>
            <h2 className="text-xl text-gray-600">Rekomendasi Kesehatan</h2>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Status Badge */}
        <div className="text-center mb-8">
          <Badge className={isHealthy ? "bg-green-600 text-white" : "bg-destructive text-destructive-foreground"}>
            {isHealthy ? "Status: Sehat" : "Status: Perlu Perhatian Medis"}
          </Badge>
        </div>

        {isHealthy ? (
          // Healthy Recommendations
          <div className="space-y-8">
            {/* Health Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-logo-blue" /> {/* Changed to text-logo-blue */}
                  <span>Artikel Kesehatan Ginjal</span>
                </CardTitle>
                <CardDescription>Baca artikel-artikel berikut untuk menjaga kesehatan ginjal Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {healthyArticles.map((article, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{article.readTime}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Baca Artikel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Doctor Consultation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5 text-green-600" />
                  <span>Konsultasi Dokter</span>
                </CardTitle>
                <CardDescription>
                  Meskipun hasil menunjukkan kondisi sehat, konsultasi rutin tetap penting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">Rekomendasi Konsultasi:</h4>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Lakukan pemeriksaan kesehatan ginjal rutin setiap 6-12 bulan</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Konsultasikan pola makan dan gaya hidup dengan dokter</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Diskusikan rencana olahraga yang sesuai dengan kondisi Anda</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Pantau tekanan darah dan kadar gula darah secara berkala</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Dumbbell className="h-5 w-5 text-purple-600" />
                  <span>Rekomendasi Olahraga</span>
                </CardTitle>
                <CardDescription>Olahraga yang baik untuk menjaga kesehatan ginjal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {healthyExercises.map((exercise, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                        <Badge variant="outline">{exercise.duration}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{exercise.benefit}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-secondary border border-secondary-foreground/20 rounded-lg">
                  <p className="text-sm text-secondary-foreground">
                    <strong>Tips:</strong> Mulai dengan intensitas ringan dan tingkatkan secara bertahap. Selalu
                    konsultasikan dengan dokter sebelum memulai program olahraga baru.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Unhealthy Recommendations
          <div className="space-y-8">
            {/* Urgent Medical Attention */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Perhatian Medis Segera</span>
                </CardTitle>
                <CardDescription className="text-destructive">
                  Hasil pemeriksaan menunjukkan adanya risiko pada kesehatan ginjal Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-destructive mb-3">Tindakan yang Harus Segera Dilakukan:</h4>
                  <ul className="space-y-2 text-sm text-destructive">
                    <li className="flex items-start space-x-2">
                      <span className="text-destructive mt-1">•</span>
                      <span>Segera konsultasi dengan dokter spesialis ginjal (nefrologi)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-destructive mt-1">•</span>
                      <span>Lakukan pemeriksaan laboratorium lengkap (ureum, kreatinin, GFR)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-destructive mt-1">•</span>
                      <span>Kontrol tekanan darah dan gula darah secara ketat</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-destructive mt-1">•</span>
                      <span>Ikuti diet khusus yang direkomendasikan dokter</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Hospital Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-logo-blue" /> {/* Changed to text-logo-blue */}
                  <span>Cari Rumah Sakit Terdekat</span>
                </CardTitle>
                <CardDescription>Temukan rumah sakit dengan layanan nefrologi di sekitar Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Klik tombol di bawah untuk mencari rumah sakit dengan layanan spesialis ginjal terdekat:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="https://www.google.com/search?q=rumah+sakit+spesialis+ginjal+nefrologi+terdekat"
                      target="_blank"
                      className="flex-1"
                    >
                      <Button className="w-full flex items-center space-x-2">
                        <ExternalLink className="h-4 w-4" />
                        <span>Cari Rumah Sakit Nefrologi</span>
                      </Button>
                    </Link>
                    <Link
                      href="https://www.google.com/search?q=dokter+spesialis+ginjal+terdekat"
                      target="_blank"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full flex items-center space-x-2 bg-transparent">
                        <Users className="h-4 w-4" />
                        <span>Cari Dokter Spesialis</span>
                      </Button>
                    </Link>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-700">
                      <strong>Catatan:</strong> Pastikan rumah sakit memiliki layanan hemodialisis dan dokter spesialis
                      nefrologi yang berpengalaman.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safe Exercise Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-green-600" />
                  <span>Olahraga yang Disarankan</span>
                </CardTitle>
                <CardDescription>Aktivitas fisik ringan yang aman untuk kondisi ginjal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {kidneyFriendlyExercises.map((exercise, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                        <Badge variant="secondary">{exercise.duration}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{exercise.benefit}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Peringatan Penting:</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Konsultasikan dengan dokter sebelum memulai program olahraga</li>
                    <li>• Hindari olahraga berat atau yang menyebabkan dehidrasi</li>
                    <li>• Hentikan aktivitas jika merasa pusing, mual, atau sesak napas</li>
                    <li>• Pantau tekanan darah sebelum dan sesudah olahraga</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Back to Results */}
        <div className="mt-8 text-center">
          <Button onClick={() => router.push("/results")} variant="outline">
            Kembali ke Hasil Pemeriksaan
          </Button>
        </div>
      </div>
    </div>
  )
}
