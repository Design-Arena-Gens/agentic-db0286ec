import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
})

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt diperlukan' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key tidak dikonfigurasi. Tambahkan OPENAI_API_KEY di .env.local' },
        { status: 500 }
      )
    }

    // Enhanced prompt untuk fokus pada seni potret manusia
    const enhancedPrompt = `High-quality artistic portrait: ${prompt}. Professional art style, detailed human features, artistic composition, museum quality.`

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid',
    })

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Gagal menghasilkan URL gambar' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      imageUrl,
      revisedPrompt: response.data?.[0]?.revised_prompt,
    })
  } catch (error: any) {
    console.error('Error generating image:', error)

    let errorMessage = 'Gagal menghasilkan gambar'

    if (error.status === 401) {
      errorMessage = 'API key tidak valid'
    } else if (error.status === 429) {
      errorMessage = 'Terlalu banyak permintaan. Coba lagi nanti'
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: error.status || 500 }
    )
  }
}
