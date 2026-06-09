// pages/api/user/generations.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user) return res.status(401).json({ error: 'Not authenticated' })

  const userId = (session.user as any).id
  const generations = await prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  res.status(200).json(generations)
}
