"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, AlertTriangle, CheckCircle, RefreshCw, Droplets, Zap } from "lucide-react"
import { Label } from "@/components/ui/label"

export default function ResultsPage() {
  const [userData, setUserData] = useState<any>(null)
  const [questionnaireData, setQuestionnaireData] = useState<any>(null)
  
  // State untuk data dari patch
  const [potassiumLevel, setPotassiumLevel] = useState(0)
  const [sugarLevel, setSugarLevel] = useState(0)
  
  const [predictionResult, setPredictionResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Pastikan kita punya data kuesioner untuk mendapatkan patch_id
    if (!questionnaireData?.patch_id) {
        return; // Keluar jika patch_id tidak ada
    }

    const patch_id = questionnaireData.patch_id;

    // Fungsi untuk mengambil data terbaru
    const fetchRealtimeData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/get-patch-data/${patch_id}`);
            const result = await response.json();

            if (response.ok) {
                console.log("Menerima data real-time:", result.data);
                setPotassiumLevel(result.data.potassium);
                setSugarLevel(result.data.sugar);
            }
        } catch (error) {
            console.error("Gagal mengambil data real-time:", error);
        }
    };

    // Jalankan polling setiap 10 detik
    const intervalId = setInterval(fetchRealtimeData, 10000); // 10000 ms = 10 detik

    // --- BAGIAN SANGAT PENTING: CLEANUP ---
    // Fungsi ini akan dijalankan saat komponen dihancurkan (misal: saat pindah halaman)
    // untuk menghentikan interval dan mencegah memory leak.
    return () => clearInterval(intervalId);

}, [questionnaireData]);


  // Helper functions untuk UI
  const getRiskBadgeClasses = (risk: string) => {
    if (!risk) return "bg-gray-200 text-gray-800"
    if (risk.startsWith("Error")) return "bg-gray-400 text-white"
    switch (risk) {
      case "Terindikasi Penyakit Ginjal": return "bg-destructive text-destructive-foreground"
      default: return "bg-green-600 text-white"
    }
  }
  const getRiskIcon = (risk: string) => {
    if (!risk) return <RefreshCw className="h-4 w-4" />
    if (risk.startsWith("Error")) return <AlertTriangle className="h-4 w-4" />
    switch (risk) {
      case "Terindikasi Penyakit Ginjal": return <AlertTriangle className="h-4 w-4" />
      default: return <CheckCircle className="h-4 w-4" />
    }
  }
  const getKaliumStatus = (level: number) => {
    if (level >= 3.5 && level <= 5.0) return { status: "Normal", color: "text-green-600" }
    return { status: "Tidak Normal", color: "text-destructive" }
  }
  const getSugarStatus = (level: number) => {
    if (level >= 80 && level <= 120) return { status: "Normal", color: "text-green-600" }
    return { status: "Tidak Normal", color: "text-destructive" }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Memuat Hasil...</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
                <Image src="https://placehold.co/40x40/3B82F6/FFFFFF?text=R" alt="RenITS Logo" width={40} height={40} className="h-10 w-10" />
                <h1 className="text-2xl font-bold text-foreground">RenITS</h1>
            </div>
            <h2 className="text-xl text-gray-600">Hasil Pemeriksaan</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader><CardTitle className="flex items-center space-x-2"><User className="h-5 w-5" /><span>Data Pengguna</span></CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div><Label className="text-sm font-medium text-gray-500">Email</Label><p className="text-base">{userData?.email}</p></div>
                    <div><Label className="text-sm font-medium text-gray-500">Usia</Label><p className="text-base">{questionnaireData?.age} tahun</p></div>
                    <div>
                        <Label className="text-sm font-medium text-gray-500">Jawaban Kuesioner</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {questionnaireData?.diabetes_mellitus === "ya" && <Badge variant="outline">Diabetes</Badge>}
                            {questionnaireData?.hypertension === "ya" && <Badge variant="outline">Hipertensi</Badge>}
                            {questionnaireData?.peda_edema === "ya" && <Badge variant="outline">Edema</Badge>}
                            {questionnaireData?.coronary_artery_disease === "ya" && <Badge variant="outline">Penyakit Jantung</Badge>}
                            {questionnaireData?.appetite === "ya" && <Badge variant="outline">Nafsu Makan Berkurang</Badge>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center space-x-2"><Zap className="h-5 w-5" /><span>Status Smartpatch</span></CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-sm text-green-600">Data berhasil diterima dan dianalisis</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="flex items-center space-x-2"><Image src="https://placehold.co/24x24/3B82F6/FFFFFF?text=R" alt="RenITS Logo" width={24} height={24} className="h-6 w-6" /><span>Hasil Analisis</span></CardTitle></CardHeader>
                    <CardContent>
                        <Label className="text-sm font-medium text-gray-500">Tingkat Risiko Kerusakan Ginjal</Label>
                        <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getRiskBadgeClasses(predictionResult || "")}>
                                {getRiskIcon(predictionResult || "")}
                                <span>{predictionResult || "N/A"}</span>
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2"><Droplets className="h-5 w-5" /><span>Pengukuran dari Keringat</span></CardTitle>
                    <CardDescription>Data yang digunakan untuk analisis</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label className="text-sm font-medium">Kandungan Kalium</Label>
                            <div className="text-right">
                                <span className="text-lg font-bold">{potassiumLevel} mEq/L</span>
                                <p className={`text-xs font-medium ${getKaliumStatus(potassiumLevel).color}`}>{getKaliumStatus(potassiumLevel).status}</p>
                            </div>
                        </div>
                        <Progress value={(potassiumLevel / 6) * 100} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">Normal: 3.5-5.0 mEq/L</p>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label className="text-sm font-medium">Kandungan Gula</Label>
                            <div className="text-right">
                                <span className="text-lg font-bold">{sugarLevel} mg/dL</span>
                                <p className={`text-xs font-medium ${getSugarStatus(sugarLevel).color}`}>{getSugarStatus(sugarLevel).status}</p>
                            </div>
                        </div>
                        <Progress value={(sugarLevel / 200) * 100} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">Normal: 80-120 mg/dL</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Rekomendasi berdasarkan hasil */}
        {predictionResult === "Terindikasi Penyakit Ginjal" && (
            <div className="mt-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <h4 className="font-semibold text-destructive mb-2">Rekomendasi Penting:</h4>
                <ul className="text-sm text-destructive list-disc list-inside space-y-1">
                    <li>Segera konsultasi dengan dokter spesialis ginjal (nefrolog).</li>
                    <li>Lakukan pemeriksaan laboratorium lengkap (tes darah dan urin).</li>
                    <li>Kontrol tekanan darah dan gula darah Anda secara rutin.</li>
                </ul>
            </div>
        )}
        {predictionResult === "Tidak Terindikasi Penyakit Ginjal" && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Rekomendasi:</h4>
                <ul className="text-sm text-green-700 list-disc list-inside space-y-1">
                    <li>Hasil menunjukkan risiko rendah. Pertahankan gaya hidup sehat.</li>
                    <li>Lakukan pemeriksaan kesehatan rutin setidaknya setahun sekali.</li>
                    <li>Pastikan asupan cairan (air putih) Anda cukup setiap hari.</li>
                </ul>
            </div>
        )}

        <div className="mt-8 text-center space-x-4">
          <Button onClick={() => router.push("/examination")} variant="outline">
            Pemeriksaan Ulang
          </Button>
          <Button
            onClick={() => {
              // Simpan status kesehatan untuk digunakan di halaman rekomendasi
              if (predictionResult) {
                localStorage.setItem("healthStatus", predictionResult);
              }
              router.push("/recommendations");
            }}
            className="bg-primary hover:bg-primary/90"
          >
            Lihat Rekomendasi
          </Button>
        </div>
      </div>
    </div>
  )
}
