import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ঈদ কার্ড | Virtual Eid Card Generator',
  description: 'Create and share beautiful virtual Eid cards. ঈদের শুভেচ্ছা জানান আপনার প্রিয়জনদের।',
  openGraph: {
    title: 'ঈদ কার্ড | Eid Mubarak',
    description: 'Someone sent you a special Eid card! ঈদ মোবারক 🌙',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
  <html lang="bn">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700&family=Playfair+Display:ital,wght@0,400;0,700&family=Nunito:wght@400;600;700;800;900&family=Scheherazade+New:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>{children}</body>
  </html>
  )
}
