// pages/auth/register.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { toast.error('Password must be 6+ characters'); return }
    setLoading(true)
    try {
      await axios.post('/api/auth/register', { name, email, password })
      await signIn('credentials', { email, password, redirect: false })
      toast.success('Account created! Welcome to Luminary 🎉')
      router.push('/create')
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Create account — Luminary AI</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Link href="/" style={{ display: 'block', textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', background: 'linear-gradient(90deg,#F5A623,#E63887)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Luminary</span>
          </Link>

          <div className="card" style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>Create your account</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>30 free credits included, no card needed</p>

            <button onClick={() => signIn('google', { callbackUrl: '/create' })}
              style={{ width: '100%', padding: '0.7rem', marginBottom: 8, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem' }}>
              Sign up with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '1rem 0' }}>
              <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>or</span>
              <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.1)' }} />
            </div>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
              <input className="input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              <input className="input" type="password" placeholder="Password (6+ chars)" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating account...' : 'Create free account'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '1.2rem' }}>
            Already have an account? <Link href="/auth/login" style={{ color: '#F5A623' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  )
}
