import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html>
      <body>
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0f1c', color: 'white', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>404 - Not Found</h1>
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>The page you are looking for could not be found.</p>
          <Link href="/" style={{ marginTop: '2rem', padding: '1rem 2rem', backgroundColor: '#2563eb', borderRadius: '0.5rem', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
            Return Home
          </Link>
        </main>
      </body>
    </html>
  );
}
