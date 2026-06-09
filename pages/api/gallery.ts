// pages/api/gallery.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { page = '1', type } = req.query
    const take = 24
    const skip = (parseInt(page as string) - 1) * take

    const where: any = { isPublic: true, status: 'COMPLETED', outputUrl: { not: null } }
    if (type && type !== 'ALL') where.type = type

    const [items, total] = await Promise.all([
      prisma.generation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: { user: { select: { name: true, image: true } } },
      }),
      prisma.generation.count({ where }),
    ])

    return res.status(200).json({ items, total, pages: Math.ceil(total / take) })
  }

  if (req.method === 'POST') {
    // Like a generation
    const { id } = req.body
    const updated = await prisma.generation.update({
      where: { id },
      data: { likes: { increment: 1 } },
    })
    return res.status(200).json({ likes: updated.likes })
  }

  res.status(405).end()
}
