"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Droplets, HeartPulse, Utensils, RefreshCw } from "lucide-react"
import { Label } from "@/components/ui/label"
import Header from "@/components/layout/Header" // <-- 1. Impor komponen Header

// Definisikan tipe data untuk satu entri riwayat
type HistoryRecord = {
  id: number;
  timestamp: string;
  prediction_result: string;
  age: number;
  sugar: number;
  potassium: number;
  hypertension: boolean;
  diabetes_mellitus: boolean;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || result.msg || "Gagal mengambil data riwayat.");
        }

        const result = await response.json();
        setHistory(result.history);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  // --- FUNGSI handleLogout DIHAPUS DARI SINI ---
  // Karena fungsionalitasnya sudah ada di dalam komponen Header.

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
  };

  const getRiskBadgeClasses = (risk: string): string => {
    switch (risk) {
      case "Terindikasi Penyakit Ginjal": return "bg-destructive text-destructive-foreground"
      default: return "bg-green-600 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* --- 2. Gunakan komponen Header di sini --- */}
      <Header />

      <main className="p-4">
        <div className="max-w-4xl mx-auto">
          {/* Judul halaman dipindahkan ke sini agar lebih konsisten */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Riwayat Pemeriksaan</h1>
            <p className="text-gray-600">Berikut adalah daftar semua pemeriksaan yang telah Anda lakukan.</p>
          </div>

          {isLoading && (
            <div className="text-center py-10">
              <RefreshCw className="h-8 w-8 mx-auto text-primary animate-spin mb-4" />
              <p className="text-gray-600">Memuat riwayat...</p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive text-center p-4 rounded-lg">
              <p><strong>Terjadi Kesalahan:</strong> {error}</p>
            </div>
          )}

          {!isLoading && !error && history.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-600">Anda belum memiliki riwayat pemeriksaan.</p>
              <Button onClick={() => router.push('/examination')} className="mt-4">Mulai Pemeriksaan Baru</Button>
            </div>
          )}

          {!isLoading && !error && history.length > 0 && (
            <div className="space-y-6">
              {history.map((record) => (
                <Card key={record.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Pemeriksaan #{record.id}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(record.timestamp)}</span>
                        </CardDescription>
                      </div>
                      <Badge className={getRiskBadgeClasses(record.prediction_result)}>
                        {record.prediction_result}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Data Pengguna</Label>
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="h-4 w-4" />
                        <span>Usia: {record.age} tahun</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Data Patch</Label>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span>Gula: {record.sugar} mg/dL</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Droplets className="h-4 w-4 text-orange-500" />
                          <span>Kalium: {record.potassium} mEq/L</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Kondisi yang Dilaporkan</Label>
                      <div className="flex flex-wrap gap-2">
                        {record.hypertension && <Badge variant="outline"><HeartPulse className="h-3 w-3 mr-1" />Hipertensi</Badge>}
                        {record.diabetes_mellitus && <Badge variant="outline"><Utensils className="h-3 w-3 mr-1" />Diabetes</Badge>}
                        {!record.hypertension && !record.diabetes_mellitus && <span className="text-sm text-gray-500">-</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
