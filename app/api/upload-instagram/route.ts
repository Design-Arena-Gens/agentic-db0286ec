import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, caption } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL gambar diperlukan' },
        { status: 400 }
      )
    }

    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    const userId = process.env.INSTAGRAM_USER_ID

    if (!accessToken || !userId) {
      return NextResponse.json(
        {
          error: 'Kredensial Instagram tidak dikonfigurasi. Tambahkan INSTAGRAM_ACCESS_TOKEN dan INSTAGRAM_USER_ID di .env.local',
          details: 'Untuk mendapatkan token, kunjungi: https://developers.facebook.com/docs/instagram-api/getting-started'
        },
        { status: 500 }
      )
    }

    // Step 1: Create container
    const containerResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${userId}/media`,
      {
        image_url: imageUrl,
        caption: caption || 'AI Generated Art',
        access_token: accessToken,
      }
    )

    const containerId = containerResponse.data.id

    // Step 2: Publish container
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${userId}/media_publish`,
      {
        creation_id: containerId,
        access_token: accessToken,
      }
    )

    return NextResponse.json({
      success: true,
      postId: publishResponse.data.id,
      message: 'Berhasil diunggah ke Instagram!',
    })
  } catch (error: any) {
    console.error('Error uploading to Instagram:', error.response?.data || error)

    let errorMessage = 'Gagal mengunggah ke Instagram'
    let errorDetails = ''

    if (error.response?.data?.error) {
      const igError = error.response.data.error
      errorMessage = igError.message || errorMessage
      errorDetails = igError.error_user_msg || ''

      if (igError.code === 190) {
        errorMessage = 'Access token tidak valid atau kedaluwarsa'
        errorDetails = 'Perbarui INSTAGRAM_ACCESS_TOKEN Anda'
      } else if (igError.code === 100) {
        errorMessage = 'Parameter tidak valid'
        errorDetails = igError.message
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
        fullError: error.response?.data,
      },
      { status: error.response?.status || 500 }
    )
  }
}
