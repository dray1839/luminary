// pages/pricing.tsx
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useState } from 'react'

const PLANS = [
  {
    name: 'Starter', price: 0, tag: null,
    color: 'rgba(255,255,255,0.08)',
    features: ['30 image generations/mo', '720p video, 5 sec', 'Basic animation tools', 'Public gallery access', '— No commercial license', '— No priority queue'],
    cta: 'Start free', plan: null,
  },
  {
    name: 'Creator', price: 22, tag: 'Most popular',
    color: 'rgba(230,56,135,0.2)',
    features: ['500 image generations/mo', '1080p video, 30 sec', 'Full animation suite', '✓ Commercial license', '✓ Priority GPU queue', '✓ Style presets + brand kit'],
    cta: 'Get Creator', plan: 'CREATOR',
  },
  {
    name: 'Pro', price: 65, tag: null,
    color: 'rgba(123,63,242,0.15)',
    features: ['Unlimited generations', '4K video up to 2 min', 'Everything in Creator', '✓ API access', '✓ First in GPU queue', '✓ White-label exports'],
    cta: 'Get Pro', plan: 'PRO',
  },
]

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (plan: string) => {
    if (!session) { router.push('/auth/register'); return }
    setLoading(plan)
    try {
      const { data } = await axios.post('/api/stripe/checkout', { plan })
      window.location.href = data.url
    } catch {
      toast.error('Could not start checkout. Please try again.')
      setLoading(null)
    }
  }

  return (
    <>
      <Head><title>Pricing — Luminary AI</title></Head>
      <Navbar />

      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <span className="tag tag-violet" style={{ marginBottom: '1rem' }}>Pricing</span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.7rem' }}>
          Simple, <span className="grad">transparent</span> pricing
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '3rem', fontSize: '1rem' }}>
          Start free. Scale as you grow. Cancel anytime.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, maxWidth: 900, margin: '0 auto' }}>
          {PLANS.map(plan => (
            <div key={plan.name}
              style={{
                background: plan.color, border: `0.5px solid ${plan.tag ? 'rgba(230,56,135,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 20, padding: '2rem', textAlign: 'left', position: 'relative',
                boxShadow: plan.tag ? '0 0 0 1px rgba(230,56,135,0.2)' : 'none',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>

              {plan.tag && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
                  <span className="tag tag-pink" style={{ fontSize: '0.68rem', padding: '3px 12px' }}>{plan.tag}</span>
                </div>
              )}

              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.4rem' }}>{plan.name}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.4rem', marginBottom: '0.2rem' }}>
                ${plan.price}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>/mo</span>
              </div>

              <ul style={{ listStyle: 'none', margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: '0.85rem', color: f.startsWith('—') ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => plan.plan ? handleUpgrade(plan.plan) : router.push('/auth/register')}
                disabled={loading === plan.plan}
                className={`btn ${plan.tag ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width: '100%', justifyContent: 'center', opacity: loading === plan.plan ? 0.7 : 1 }}>
                {loading === plan.plan ? 'Redirecting...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '2.5rem' }}>
          Payments processed securely by Stripe. Cancel anytime from your dashboard.
        </p>
      </div>
    </>
  )
}
