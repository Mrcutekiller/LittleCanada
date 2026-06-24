import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Little Canada Café | Premium Digital Menu',
  description: 'Order your favourite burgers, pizzas, breakfast and desserts from Little Canada Café. Interactive 3D menu experience.',
  keywords: ['Little Canada', 'café', 'burger', 'pizza', 'Addis Ababa', 'digital menu'],
  openGraph: {
    title: 'Little Canada Café Menu',
    description: 'Premium café experience — burgers, pizza, breakfast & desserts.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0C0A09',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-[#0C0A09] text-[#F5F5F4] ${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
