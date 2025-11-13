'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GeneratedImage {
  url: string
  prompt: string
  timestamp: number
}

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const artStyles = [
    'Potret realistis',
    'Gaya cat minyak klasik',
    'Ilustrasi digital modern',
    'Sketsa pensil artistik',
    'Gaya Renaissance',
    'Lukisan impresionisme',
    'Seni pop art',
    'Gaya anime',
  ]

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Silakan masukkan deskripsi gambar')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghasilkan gambar')
      }

      setGeneratedImage({
        url: data.imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
      })
      setSuccess('Gambar berhasil dibuat!')
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const uploadToInstagram = async () => {
    if (!generatedImage) {
      setError('Tidak ada gambar untuk diunggah')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/upload-instagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: generatedImage.url,
          caption: `AI Art: ${generatedImage.prompt}\n\n#AIArt #DigitalArt #AIGenerated #ArtificialIntelligence #Portrait #HumanArt`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengunggah ke Instagram')
      }

      setSuccess('Berhasil diunggah ke Instagram! ✓')
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengunggah')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          🎨 AI Art Instagram Agent
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Buat karya seni potret manusia dengan AI dan unggah ke Instagram
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Generator Gambar
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Gambar
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Potret seorang wanita dengan rambut panjang, gaya Renaissance klasik..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gaya Seni Populer
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {artStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setPrompt(`Potret manusia dengan ${style.toLowerCase()}`)}
                  className="px-3 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateImage}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Membuat Gambar...' : '🎨 Buat Gambar'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {generatedImage && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Hasil Gambar
            </h2>

            <div className="mb-4">
              <img
                src={generatedImage.url}
                alt={generatedImage.prompt}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Prompt:</strong> {generatedImage.prompt}
              </p>
            </div>

            <button
              onClick={uploadToInstagram}
              disabled={uploading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? 'Mengunggah...' : '📸 Unggah ke Instagram'}
            </button>

            <p className="text-xs text-gray-500 mt-2 text-center">
              Pastikan Anda sudah mengatur kredensial Instagram di .env.local
            </p>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">📋 Cara Setup:</h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Dapatkan OpenAI API key dari platform.openai.com</li>
            <li>Buat Instagram Business/Creator account</li>
            <li>Dapatkan Instagram Access Token dari Facebook Developer</li>
            <li>Copy .env.local.example ke .env.local dan isi dengan kredensial Anda</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
