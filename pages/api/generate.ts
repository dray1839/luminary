// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '@/lib/prisma'
import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })

// Credit costs per generation type
const COSTS: Record<string, number> = {
  IMAGE: 1,
  VIDEO: 5,
  ANIMATION: 3,
  STYLE_TRANSFER: 2,
}

// Replicate model IDs
const MODELS: Record<string, string> = {
  IMAGE: 'stability-ai/stable-diffusion-3',
  VIDEO: 'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
  ANIMATION: 'andreasjansson/stable-diffusion-animation:ca1f5e306e5721e19c473e0d094e6603f0456fe759c10715fcd6c1b79242d4a5',
  STYLE_TRANSFER: 'stability-ai/stable-diffusion-img2img:15a3689ee13b0d2616e98820eca31d4af4a0e80d261fc7220cd7b32f9bea6954',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user) return res.status(401).json({ error: 'Not authenticated' })

  const userId = (session.user as any).id
  const { prompt, type = 'IMAGE', isPublic = false, inputImage } = req.body

  if (!prompt) return res.status(400).json({ error: 'Prompt required' })

  const cost = COSTS[type] ?? 1
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) return res.status(404).json({ error: 'User not found' })
  if (user.plan === 'STARTER' && user.credits < cost) {
    return res.status(402).json({ error: 'Not enough credits. Please upgrade your plan.' })
  }

  // Create generation record
  const generation = await prisma.generation.create({
    data: { userId, type, prompt, status: 'PROCESSING', isPublic },
  })

  try {
    let output: any

    if (type === 'IMAGE') {
      output = await replicate.run(
        'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        { input: { prompt, num_outputs: 1, width: 1024, height: 1024 } }
      )
    } else if (type === 'VIDEO') {
      output = await replicate.run(MODELS.VIDEO as any, {
        input: { prompt, num_frames: 24, width: 1024, height: 576 },
      })
    } else if (type === 'ANIMATION') {
      output = await replicate.run(MODELS.ANIMATION as any, {
        input: { prompt_start: prompt, prompt_end: prompt + ', motion', num_frames: 16 },
      })
    }

    const outputUrl = Array.isArray(output) ? output[0] : output

    // Update generation and deduct credits
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
