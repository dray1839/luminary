// pages/blog.tsx
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const POSTS = [
  { slug: '1', title: 'How to write better AI image prompts', date: 'June 8, 2026', tag: 'Tips', excerpt: 'The difference between a good and great AI image comes down to how you describe it. Here are our top techniques.' },
  { slug: '2', title: 'Introducing 4K video generation', date: 'June 1, 2026', tag: 'Product', excerpt: 'We\'re excited to launch 4K video generation for all Pro subscribers. Here\'s what you can do with it.' },
  { slug: '3', title: 'From prompt to profit: selling AI art', date: 'May 25, 2026', tag: 'Creators', excerpt: 'Thousands of creators are turning their Luminary creations into real income. Here\'s how they do it.' },
  { slug: '4', title: '10 creative ways to use style transfer', date: 'May 18, 2026', tag: 'Tips', excerpt: 'Style transfer is one of the most powerful tools on Luminary. These 10 ideas will inspire your next project.' },
  { slug: '5', title: 'Luminary hits 147,000 creators', date: 'May 10, 2026', tag: 'News', excerpt: 'We\'re humbled and grateful. Here\'s a look back at our journey and what\'s coming next.' },
]

const TAG_COLORS: Record<string, string> = { Tips: 'tag-amber', Product: 'tag-violet', Creators: 'tag-teal', News: 'tag-pink' }

export default function BlogPage() {
  return (
    <>
      <Head><title>Blog — Luminary AI</title></Head>
      <Navbar />
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <span className="tag tag-teal" style={{ marginBottom: '0.8rem' }}>Blog</span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.5rem' }}>
          Stories & <span className="grad">Updates</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Tips, tutorials, and news from the Luminary team.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {POSTS.map(post => (
            <div key={post.slug} className="card" style={{ cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className={`tag ${TAG_COLORS[post.tag] ?? 'tag-violet'}`}>{post.tag}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>{post.date}</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.6rem', lineHeight: 1.35 }}>{post.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{post.excerpt}</p>
              <div style={{ marginTop: '1.2rem', fontSize: '0.82rem', color: 'var(--violet)', fontWeight: 500 }}>Read more →</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
