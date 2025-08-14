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
import { User, Calendar, QrCode } from "lucide-react"
import Header from "@/components/layout/Header"

export default function ExaminationPage() {
  const [formData, setFormData] = useState({
    patch_id: "",
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
    // Cek jika pengguna sudah login DENGAN MEMERIKSA TOKEN
    const token = localStorage.getItem("accessToken")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const token = localStorage.getItem("accessToken")
    if (!token) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.")
      router.push("/login")
      return
    }

    const dataToSend = {
      patch_id: formData.patch_id,
      age: parseFloat(formData.age),
      diabetes_mellitus: formData.diabetes_mellitus === "ya",
      hypertension: formData.hypertension === "ya",
      peda_edema: formData.peda_edema === "ya",
      coronary_artery_disease: formData.coronary_artery_disease === "ya",
      appetite: formData.appetite === "ya",
    }
    
    try {
      // --- PERBAIKAN KRITIS DI SINI ---
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/predict`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.setItem('predictionData', JSON.stringify(result))
        localStorage.setItem('questionnaireDataForDisplay', JSON.stringify(formData))
        router.push("/results")
      } else {
        const errorMessage = result.message || result.msg || "Terjadi kesalahan yang tidak diketahui."
        console.error("Error dari server:", errorMessage)
        alert(`Terjadi kesalahan: ${errorMessage}`)
      }
    } catch (error) {
      console.error("Tidak bisa terhubung ke server:", error)
      alert("Gagal terhubung ke server. Pastikan server back-end sudah berjalan.")
    } finally {
        setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormComplete = Object.values(formData).every((value) => value !== "")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      <main className="p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <User className="h-6 w-6" />
                <span>Form Pemeriksaan Kesehatan</span>
              </CardTitle>
              <CardDescription>Silakan isi ID Patch dan jawab pertanyaan berikut dengan jujur.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="patch_id" className="text-base font-medium">ID Smartpatch</Label>
                  <div className="relative">
                    <QrCode className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="patch_id" type="text" placeholder="Masukkan ID dari patch Anda" value={formData.patch_id} onChange={(e) => updateFormData("patch_id", e.target.value)} className="pl-10" required />
                  </div>
                </div>

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
      </main>
    </div>
  )
}
