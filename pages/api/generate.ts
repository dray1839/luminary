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
    await new Promise(r => setTimeout(r, 4000))
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
  throw new Error('Generation timed out after 2.5 minutes')
}

async function generateImage(prompt: string, token: string) {
  // Use the standard predictions endpoint which is more reliable
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'black-forest-labs/flux-schnell',
      input: {
        prompt,
        num_outputs: 1,
        output_format: 'png',
        output_quality: 90,
        aspect_ratio: '1:1',
      }
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail ?? JSON.stringify(err))
  }

  const data = await res.json()
  let outputUrl = Array.isArray(data.output) ? data.output[0] : data.output

  if (!outputUrl && data.id) {
    outputUrl = await pollPrediction(data.id, token)
  }

  if (!outputUrl) throw new Error('No output from image model')
  return outputUrl
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
      outputUrl = await generateImage(prompt, token)

    } else if (type === 'VIDEO') {
      const videoRes = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'minimax/video-01',
          input: { prompt, prompt_optimizer: true }
        }),
      })
      if (!videoRes.ok) {
        const err = await videoRes.json()
        throw new Error(err.detail ?? 'Video generation failed')
      }
      const videoData = await videoRes.json()
      outputUrl = await pollPrediction(videoData.id, token, 50)

    } else if (type === 'ANIMATION') {
      // Step 1: Generate base image
      const imageUrl = await generateImage(prompt, token)

      // Step 2: Animate using stable-video-diffusion
      const animRes = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
          input: {
            input_image: imageUrl,
            frames_per_second: 6,
            sizing_strategy: 'maintain_aspect_ratio',
            motion_bucket_id: 127,
            cond_aug: 0.02,
          }
        }),
      })

      if (!animRes.ok) {
        // Fallback: return the static image
        console.error('SVD animation failed, returning image')
        outputUrl = imageUrl
      } else {
        const animData = await animRes.json()
        outputUrl = await pollPrediction(animData.id, token, 50)
        if (!outputUrl) outputUrl = imageUrl // fallback to image
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