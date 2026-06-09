// pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { buffer } from 'micro'

export const config = { api: { bodyParser: false } }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

const CREDITS: Record<string, number> = {
  CREATOR: 500,
  PRO: 999999,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return res.status(400).send('Webhook signature verification failed')
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { userId, plan } = session.metadata!

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: plan as any,
        credits: CREDITS[plan] ?? 30,
        stripeSubId: session.subscription as string,
      },
    })
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await prisma.user.updateMany({
      where: { stripeSubId: sub.id },
      data: { plan: 'STARTER', credits: 30, stripeSubId: null },
    })
  }

  res.status(200).json({ received: true })
}
