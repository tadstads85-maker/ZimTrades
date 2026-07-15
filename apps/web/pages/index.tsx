import Link from 'next/link'

export default function Home() {
  return (
    <main style={{padding: 40}}>
      <h1>ZimTrades</h1>
      <p>Modern African marketplace — placeholder home.</p>
      <p>
        <Link href="/api/auth/signin">Sign in</Link>
      </p>
    </main>
  )
}
