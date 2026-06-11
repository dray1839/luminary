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
    // Call Replicate API directly using fetch
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
      throw new Error(err.detail ?? 'Replicate error')
    }

    const prediction = await response.json()
    const outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output

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