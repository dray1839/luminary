// pages/auth/login.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.ok) {
      toast.success('Welcome back!')
      router.push('/dashboard')
    } else {
      toast.error('Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Sign in — Luminary AI</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Link href="/" style={{ display: 'block', textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', background: 'linear-gradient(90deg,#F5A623,#E63887)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Luminary</span>
          </Link>

          <div className="card" style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>Welcome back</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Sign in to your account</p>

            {/* OAuth */}
            <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              style={{ width: '100%', padding: '0.7rem', marginBottom: 8, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem' }}>
              Continue with Google
            </button>
            <button onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
              style={{ width: '100%', padding: '0.7rem', marginBottom: '1.2rem', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem' }}>
              Continue with GitHub
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.2rem' }}>
              <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>or</span>
              <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.1)' }} />
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '1.2rem' }}>
            No account? <Link href="/auth/register" style={{ color: '#F5A623' }}>Create one free</Link>
          </p>
        </div>
      </div>
    </>
  )
}
