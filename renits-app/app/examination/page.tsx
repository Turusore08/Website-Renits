"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Activity, User, Calendar } from "lucide-react"

export default function ExaminationPage() {
  const [formData, setFormData] = useState({
    diabetes: "",
    hypertension: "",
    edema: "",
    anemia: "",
    appetite: "",
    age: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Store examination data
    localStorage.setItem("examinationData", JSON.stringify(formData))

    setTimeout(() => {
      setIsLoading(false)
      router.push("/results")
    }, 2000)
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
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Renits</h1>
          </div>
          <h2 className="text-xl text-gray-600">Form Pemeriksaan Kesehatan</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informasi Kesehatan</span>
            </CardTitle>
            <CardDescription>Silakan jawab pertanyaan berikut dengan jujur untuk hasil yang akurat</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question 1: Diabetes */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  1. Apakah anda memiliki riwayat penyakit diabetes melitus?
                </Label>
                <RadioGroup value={formData.diabetes} onValueChange={(value) => updateFormData("diabetes", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ya" id="diabetes-ya" />
                    <Label htmlFor="diabetes-ya">Ya</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tidak" id="diabetes-tidak" />
                    <Label htmlFor="diabetes-tidak">Tidak</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 2: Hypertension */}
              <div className="space-y-3">
                <Label className="text-base font-medium">2. Apakah anda memiliki riwayat penyakit hipertensi?</Label>
                <RadioGroup
                  value={formData.hypertension}
                  onValueChange={(value) => updateFormData("hypertension", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ya" id="hypertension-ya" />
                    <Label htmlFor="hypertension-ya">Ya</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tidak" id="hypertension-tidak" />
                    <Label htmlFor="hypertension-tidak">Tidak</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 3: Edema */}
              <div className="space-y-3">
                <Label className="text-base font-medium">3. Apakah anda memiliki riwayat penyakit edema?</Label>
                <RadioGroup value={formData.edema} onValueChange={(value) => updateFormData("edema", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ya" id="edema-ya" />
                    <Label htmlFor="edema-ya">Ya</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tidak" id="edema-tidak" />
                    <Label htmlFor="edema-tidak">Tidak</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 4: Anemia */}
              <div className="space-y-3">
                <Label className="text-base font-medium">4. Apakah anda pernah atau sedang mengalami anemia?</Label>
                <RadioGroup value={formData.anemia} onValueChange={(value) => updateFormData("anemia", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ya" id="anemia-ya" />
                    <Label htmlFor="anemia-ya">Ya</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tidak" id="anemia-tidak" />
                    <Label htmlFor="anemia-tidak">Tidak</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 5: Appetite */}
              <div className="space-y-3">
                <Label className="text-base font-medium">5. Apakah nafsu makan anda berkurang?</Label>
                <RadioGroup value={formData.appetite} onValueChange={(value) => updateFormData("appetite", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ya" id="appetite-ya" />
                    <Label htmlFor="appetite-ya">Ya</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tidak" id="appetite-tidak" />
                    <Label htmlFor="appetite-tidak">Tidak</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 6: Age */}
              <div className="space-y-3">
                <Label htmlFor="age" className="text-base font-medium">
                  6. Berapa usia anda saat ini?
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="age"
                    type="number"
                    placeholder="Masukkan usia (tahun)"
                    value={formData.age}
                    onChange={(e) => updateFormData("age", e.target.value)}
                    className="pl-10"
                    min="1"
                    max="120"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!isFormComplete || isLoading}>
                {isLoading ? "Memproses Data..." : "Lanjut ke Pemeriksaan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
