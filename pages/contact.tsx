// pages/contact.tsx
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
  }

  return (
    <>
      <Head><title>Contact — Luminary AI</title></Head>
      <Navbar />
      <div className="container" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <span className="tag tag-pink" style={{ marginBottom: '1rem' }}>Get in touch</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.5rem' }}>
            We'd love to <span className="grad">hear from you</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Questions, feedback, or partnership inquiries — we read every message.</p>

          {sent ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✦</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Message sent!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>We'll get back to you at {form.email} within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Name</label>
                <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Email</label>
                <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Message</label>
                <textarea className="input" rows={5} placeholder="What's on your mind?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: 'none' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
                Send message ✦
              </button>
            </form>
          )}

          <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Email', value: 'hello@luminary.ai' },
              { label: 'Response time', value: 'Within 24 hours' },
            ].map(i => (
              <div key={i.label} className="card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{i.label}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{i.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
