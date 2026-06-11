// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '@/lib/prisma'

const COSTS: Record<string, number> = {
  IMAGE: 1, VIDEO: 5, ANIMATION: 3, STYLE_TRANSFER: 2,
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
    return res.status(402).json({ error: 'Not enough credits. Please upgrade your plan.' })
  }

  const token = process.env.REPLICATE_API_TOKEN
  if (!token) return res.status(500).json({ error: 'Replicate token not configured' })

  const generation = await prisma.generation.create({
    data: { userId, type, prompt, status: 'PROCESSING', isPublic },
  })

  try {
    let outputUrl: string | null = null

    if (type === 'IMAGE' || type === 'STYLE_TRANSFER') {
      // Fast image generation with flux-schnell
      const response = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
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
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail ?? 'Image generation failed')
      }
      const data = await response.json()
      outputUrl = Array.isArray(data.output) ? data.output[0] : data.output

    } else if (type === 'VIDEO') {
      // Video generation with minimax
      const response = await fetch('https://api.replicate.com/v1/models/minimax/video-01/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait=60',
        },
        body: JSON.stringify({
          input: { prompt, prompt_optimizer: true }
        }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail ?? 'Video generation failed')
      }
      const data = await response.json()
      // Poll for completion if not done
      if (data.status !== 'succeeded') {
        let prediction = data
        let attempts = 0
        while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && attempts < 30) {
          await new Promise(r => setTimeout(r, 3000))
          const poll = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          prediction = await poll.json()
          attempts++
        }
        outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output
      } else {
        outputUrl = Array.isArray(data.output) ? data.output[0] : data.output
      }

    } else if (type === 'ANIMATION') {
      // Animation - image to video with stable-video-diffusion
      const response = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait=30',
        },
        body: JSON.stringify({
          input: { prompt: prompt + ', motion blur, animated, cinematic', num_outputs: 1, output_format: 'webp' }
        }),
      })
      if (!response.ok) throw new Error('Animation generation failed')
      const data = await response.json()
      outputUrl = Array.isArray(data.output) ? data.output[0] : data.output
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