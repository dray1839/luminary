// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '@/lib/prisma'

const COSTS: Record<string, number> = {
  IMAGE: 1, VIDEO: 5, ANIMATION: 3, STYLE_TRANSFER: 2,
}

async function pollPrediction(id: string, token: string, maxAttempts = 40) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 3000))
    const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.status === 'succeeded') {
      return Array.isArray(data.output) ? data.output[0] : data.output
    }
    if (data.status === 'failed') {
      throw new Error(data.error || 'Generation failed')
    }
  }
  throw new Error('Generation timed out')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user) return res.status(401).json({ error: 'Not authenticated' })

  const userId = (session.user as any).id
  const { prompt, type = 'IMAGE', isPublic = false } = req.body

  if (!prompt) return res.status(400).json({ error: 'Prompt required' })

  const cost = COSTS[type] ?? 1
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (user.plan === 'STARTER' && user.credits < cost) {
    return res.status(402).json({ error: 'Not enough credits. Please upgrade.' })
  }

  const token = process.env.REPLICATE_API_TOKEN
  if (!token) return res.status(500).json({ error: 'Replicate token not configured' })

  const generation = await prisma.generation.create({
    data: { userId, type, prompt, status: 'PROCESSING', isPublic },
  })

  try {
    let outputUrl: string | null = null

    if (type === 'IMAGE' || type === 'STYLE_TRANSFER') {
      // Fast image with flux-schnell
      const res2 = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait=30',
        },
        body: JSON.stringify({
          input: { prompt, num_outputs: 1, output_format: 'webp', output_quality: 90 }
        }),
      })
      if (!res2.ok) {
        const err = await res2.json()
        throw new Error(err.detail ?? 'Image generation failed')
      }
      const data = await res2.json()
      outputUrl = Array.isArray(data.output) ? data.output[0] : data.output
      if (!outputUrl && data.id) {
        outputUrl = await pollPrediction(data.id, token)
      }

    } else if (type === 'VIDEO') {
      // Video with minimax
      const res2 = await fetch('https://api.replicate.com/v1/models/minimax/video-01/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { prompt, prompt_optimizer: true }
        }),
      })
      if (!res2.ok) {
        const err = await res2.json()
        throw new Error(err.detail ?? 'Video generation failed')
      }
      const data = await res2.json()
      outputUrl = await pollPrediction(data.id, token)

    } else if (type === 'ANIMATION') {
      // Animation with wan-i2v (image to video animation)
      // First generate a base image
      const imgRes = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait=30',
        },
        body: JSON.stringify({
          input: { prompt, num_outputs: 1, output_format: 'webp', output_quality: 90 }
        }),
      })
      if (!imgRes.ok) throw new Error('Animation base image failed')
      const imgData = await imgRes.json()
      let imageUrl = Array.isArray(imgData.output) ? imgData.output[0] : imgData.output
      if (!imageUrl && imgData.id) {
        imageUrl = await pollPrediction(imgData.id, token)
      }

      // Then animate it with wan-i2v
      const animRes = await fetch('https://api.replicate.com/v1/models/wavespeedai/wan-2.1-i2v-480p/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            image: imageUrl,
            prompt: prompt + ', smooth motion, cinematic animation',
            max_area: '480*832',
            fast_mode: 'Balanced',
          }
        }),
      })
      if (!animRes.ok) {
        // Fallback to video if animation model fails
        const err = await animRes.json()
        console.error('Animation failed, falling back to video:', err)
        outputUrl = imageUrl // Return the static image as fallback
      } else {
        const animData = await animRes.json()
        outputUrl = await pollPrediction(animData.id, token, 50)
      }
    }

    await prisma.$transaction([
      prisma.generation.update({
        where: { id: generation.id },
        data: { outputUrl, status: 'COMPLETED' },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: cost } },
      }),
    ])

    res.status(200).json({ id: generation.id, outputUrl, creditsUsed: cost })
  } catch (err: any) {
    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: 'FAILED' },
    })
    res.status(500).json({ error: err.message || 'Generation failed' })
  }
}