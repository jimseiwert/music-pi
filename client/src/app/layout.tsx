import { AudioProvider } from '@/components/audio-provider'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hockey Game Music Admin',
  description: 'Admin interface for hockey game music player',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body className={inter.className}>
      <AudioProvider>{children}</AudioProvider>
    </body>
  </html>
  )
} 