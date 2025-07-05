"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, User, Droplets, Zap, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

export default function ResultsPage() {
  const [userData, setUserData] = useState<any>(null)
  const [examinationData, setExaminationData] = useState<any>(null)
  const [potassiumLevel, setPotassiumLevel] = useState(0)
  const [sugarLevel, setSugarLevel] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [riskLevel, setRiskLevel] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and has examination data
    const user = localStorage.getItem("user")
    const examination = localStorage.getItem("examinationData")

    if (!user || !examination) {
      router.push("/login")
      return
    }

    setUserData(JSON.parse(user))
    setExaminationData(JSON.parse(examination))

    // Simulate smartpatch connection
    setTimeout(() => {
      setIsConnected(true)
      startRealTimeMonitoring()
    }, 2000)
  }, [router])

  const startRealTimeMonitoring = () => {
    const interval = setInterval(() => {
      // Simulate real-time data from smartpatch
      const newPotassium = 3.5 + Math.random() * 2 // Normal range: 3.5-5.0 mEq/L
      const newSugar = 80 + Math.random() * 40 // Normal range: 80-120 mg/dL

      setPotassiumLevel(Number(newPotassium.toFixed(1)))
      setSugarLevel(Number(newSugar.toFixed(0)))
    }, 3000)

    return () => clearInterval(interval)
  }

  const calculateRiskLevel = () => {
    if (!examinationData) return "Menghitung..."

    let riskScore = 0
    const age = Number.parseInt(examinationData.age)

    // Risk factors scoring
    if (examinationData.diabetes === "ya") riskScore += 2
    if (examinationData.hypertension === "ya") riskScore += 2
    if (examinationData.edema === "ya") riskScore += 1
    if (examinationData.anemia === "ya") riskScore += 1
    if (examinationData.appetite === "ya") riskScore += 1
    if (age > 60) riskScore += 1
    if (potassiumLevel > 5.0 || potassiumLevel < 3.5) riskScore += 2
    if (sugarLevel > 120) riskScore += 1

    if (riskScore >= 6) return "Tinggi"
    if (riskScore >= 3) return "Sedang"
    return "Rendah"
  }

  useEffect(() => {
    if (potassiumLevel > 0 && sugarLevel > 0) {
      setRiskLevel(calculateRiskLevel())
    }
  }, [potassiumLevel, sugarLevel, examinationData])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Tinggi":
        return "destructive"
      case "Sedang":
        return "secondary"
      case "Rendah":
        return "default"
      default:
        return "outline"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Tinggi":
        return <AlertTriangle className="h-4 w-4" />
      case "Sedang":
        return <AlertTriangle className="h-4 w-4" />
      case "Rendah":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <RefreshCw className="h-4 w-4" />
    }
  }

  if (!userData || !examinationData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Renits</h1>
          </div>
          <h2 className="text-xl text-gray-600">Hasil Pemeriksaan</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Data Pengguna</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="text-base">{userData.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Usia</Label>
                <p className="text-base">{examinationData.age} tahun</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Riwayat Kesehatan</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {examinationData.diabetes === "ya" && <Badge variant="outline">Diabetes</Badge>}
                  {examinationData.hypertension === "ya" && <Badge variant="outline">Hipertensi</Badge>}
                  {examinationData.edema === "ya" && <Badge variant="outline">Edema</Badge>}
                  {examinationData.anemia === "ya" && <Badge variant="outline">Anemia</Badge>}
                  {examinationData.appetite === "ya" && <Badge variant="outline">Nafsu Makan Berkurang</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Smartpatch Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Status Smartpatch</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                <span className={`text-sm ${isConnected ? "text-green-600" : "text-gray-500"}`}>
                  {isConnected ? "Terhubung" : "Menghubungkan..."}
                </span>
              </div>
              {isConnected && (
                <p className="text-sm text-gray-600">
                  Smartpatch berhasil terhubung dan sedang menganalisis keringat Anda secara real-time.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Real-time Measurements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Droplets className="h-5 w-5" />
                <span>Pengukuran Real-time</span>
              </CardTitle>
              <CardDescription>Data dari analisis keringat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium">Kandungan Kalium</Label>
                  <span className="text-lg font-bold">{potassiumLevel} mEq/L</span>
                </div>
                <Progress value={(potassiumLevel / 6) * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Normal: 3.5-5.0 mEq/L</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium">Kandungan Gula</Label>
                  <span className="text-lg font-bold">{sugarLevel} mg/dL</span>
                </div>
                <Progress value={(sugarLevel / 200) * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Normal: 80-120 mg/dL</p>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Hasil Analisis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Tingkat Risiko Kerusakan Ginjal</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={getRiskColor(riskLevel)} className="flex items-center space-x-1">
                    {getRiskIcon(riskLevel)}
                    <span>{riskLevel}</span>
                  </Badge>
                </div>
              </div>

              {riskLevel === "Tinggi" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Rekomendasi:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Segera konsultasi dengan dokter spesialis ginjal</li>
                    <li>• Lakukan pemeriksaan laboratorium lengkap</li>
                    <li>• Kontrol tekanan darah dan gula darah secara rutin</li>
                  </ul>
                </div>
              )}

              {riskLevel === "Sedang" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Rekomendasi:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Konsultasi dengan dokter untuk evaluasi lebih lanjut</li>
                    <li>• Jaga pola makan dan olahraga teratur</li>
                    <li>• Monitor kesehatan secara berkala</li>
                  </ul>
                </div>
              )}

              {riskLevel === "Rendah" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Rekomendasi:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Pertahankan gaya hidup sehat</li>
                    <li>• Lakukan pemeriksaan rutin tahunan</li>
                    <li>• Jaga asupan cairan yang cukup</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center space-x-4">
          <Button onClick={() => router.push("/examination")} variant="outline">
            Pemeriksaan Ulang
          </Button>
          <Button onClick={() => window.print()}>Cetak Hasil</Button>
        </div>
      </div>
    </div>
  )
}

function Label({ children, className, ...props }: any) {
  return (
    <label className={`text-sm font-medium ${className || ""}`} {...props}>
      {children}
    </label>
  )
}
