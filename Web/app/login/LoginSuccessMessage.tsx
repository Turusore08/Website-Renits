"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LoginSuccessMessage() {
  const [successMessage, setSuccessMessage] = useState("")
  const searchParams = useSearchParams()

  // Logika ini sekarang terisolasi di komponennya sendiri
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Registrasi berhasil! Silakan masuk.")
    }
  }, [searchParams])

  // Jangan render apa pun jika tidak ada pesan
  if (!successMessage) {
    return null
  }

  return (
    <p className="text-green-600 text-sm mb-4 bg-green-50 p-3 rounded-md">
      {successMessage}
    </p>
  )
}
