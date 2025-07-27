"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Calendar, QrCode } from "lucide-react" // Menambahkan ikon untuk Patch ID

export default function ExaminationPage() {
  // State untuk menyimpan data form. Ditambahkan 'patch_id'.
  const [formData, setFormData] = useState({
    patch_id: "", // <-- FIELD BARU YANG KRUSIAL
    diabetes_mellitus: "",
    hypertension: "",
    peda_edema: "",
    coronary_artery_disease: "",
    appetite: "",
    age: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
    }
  }, [router])

  // --- FUNGSI INI DIUBAH TOTAL UNTUK MEMANGGIL API /predict ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 1. Siapkan data untuk dikirim, sesuai dengan format yang diharapkan backend
    const dataToSend = {
      patch_id: formData.patch_id,
      age: parseFloat(formData.age),
      diabetes_mellitus: formData.diabetes_mellitus === "ya",
      hypertension: formData.hypertension === "ya",
      peda_edema: formData.peda_edema === "ya",
      coronary_artery_disease: formData.coronary_artery_disease === "ya",
      appetite: formData.appetite === "ya",
    }

    // --- KRITIS: Tambahkan ini untuk debugging ---
    // Baris ini akan mencetak data yang akan dikirim ke console browser.
    console.log("Data yang akan dikirim ke backend:", JSON.stringify(dataToSend, null, 2));
    
    try {
      // 2. Lakukan panggilan fetch ke endpoint /predict
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json()

      // 3. Tangani respons dari server
      if (response.ok) { // Jika status HTTP adalah 200 (OK)
        // Simpan hasil prediksi ke localStorage untuk dibaca oleh halaman hasil
        localStorage.setItem('predictionResult', result.prediction)
        // Pindahkan pengguna ke halaman hasil
        router.push("/results")
      } else {
        // Jika server mengembalikan error (misal: 404 karena patch_id tidak ditemukan)
        console.error("Error dari server:", result.message)
        alert(`Terjadi kesalahan: ${result.message}`)
        setIsLoading(false) // Hentikan loading agar pengguna bisa mencoba lagi
      }
    } catch (error) {
      // Jika terjadi error jaringan (misal: server back-end mati)
      console.error("Tidak bisa terhubung ke server:", error)
      alert("Gagal terhubung ke server. Pastikan server back-end sudah berjalan.")
      setIsLoading(false) // Hentikan loading
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormComplete = Object.values(formData).every((value) => value !== "")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
                <Image src="https://placehold.co/40x40/3B82F6/FFFFFF?text=R" alt="RenITS Logo" width={40} height={40} className="h-10 w-10" />
                <h1 className="text-2xl font-bold text-foreground">RenITS</h1>
            </div>
            <h2 className="text-xl text-gray-600">Form Pemeriksaan Kesehatan</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><User className="h-5 w-5" /><span>Informasi Kesehatan</span></CardTitle>
            <CardDescription>Silakan isi ID Patch dan jawab pertanyaan berikut dengan jujur.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* --- INPUT BARU UNTUK PATCH ID --- */}
              <div className="space-y-3">
                <Label htmlFor="patch_id" className="text-base font-medium">ID Smartpatch</Label>
                <div className="relative">
                  <QrCode className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="patch_id" type="text" placeholder="Masukkan ID dari patch Anda" value={formData.patch_id} onChange={(e) => updateFormData("patch_id", e.target.value)} className="pl-10" required />
                </div>
              </div>

              {/* Pertanyaan Kuesioner */}
              <div className="space-y-3">
                <Label className="text-base font-medium">1. Apakah anda memiliki riwayat penyakit diabetes melitus?</Label>
                <RadioGroup value={formData.diabetes_mellitus} onValueChange={(value) => updateFormData("diabetes_mellitus", value)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="ya" id="diabetes-ya" /><Label htmlFor="diabetes-ya">Ya</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="tidak" id="diabetes-tidak" /><Label htmlFor="diabetes-tidak">Tidak</Label></div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">2. Apakah anda memiliki riwayat penyakit hipertensi?</Label>
                <RadioGroup value={formData.hypertension} onValueChange={(value) => updateFormData("hypertension", value)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="ya" id="hypertension-ya" /><Label htmlFor="hypertension-ya">Ya</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="tidak" id="hypertension-tidak" /><Label htmlFor="hypertension-tidak">Tidak</Label></div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">3. Apakah anda memiliki riwayat penyakit edema (pembengkakan)?</Label>
                <RadioGroup value={formData.peda_edema} onValueChange={(value) => updateFormData("peda_edema", value)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="ya" id="edema-ya" /><Label htmlFor="edema-ya">Ya</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="tidak" id="edema-tidak" /><Label htmlFor="edema-tidak">Tidak</Label></div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">4. Apakah anda memiliki riwayat penyakit jantung koroner?</Label>
                <RadioGroup value={formData.coronary_artery_disease} onValueChange={(value) => updateFormData("coronary_artery_disease", value)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="ya" id="cad-ya" /><Label htmlFor="cad-ya">Ya</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="tidak" id="cad-tidak" /><Label htmlFor="cad-tidak">Tidak</Label></div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">5. Apakah nafsu makan anda berkurang?</Label>
                <RadioGroup value={formData.appetite} onValueChange={(value) => updateFormData("appetite", value)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="ya" id="appetite-ya" /><Label htmlFor="appetite-ya">Ya</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="tidak" id="appetite-tidak" /><Label htmlFor="appetite-tidak">Tidak</Label></div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="age" className="text-base font-medium">6. Berapa usia anda saat ini?</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="age" type="number" placeholder="Masukkan usia (tahun)" value={formData.age} onChange={(e) => updateFormData("age", e.target.value)} className="pl-10" min="1" max="120" required />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!isFormComplete || isLoading}>
                {isLoading ? "Memproses..." : "Lihat Hasil Analisis"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
