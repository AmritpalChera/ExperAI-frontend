import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ExperAI',
  description: 'Chat with AI experts on any topic. Upload custom context and share with friends.',
  openGraph: {
    images: '/logoShort.png'
  },
  keywords: ['experai', 'expertai', 'chatbot', 'ai chat', 'pdf chat', 'audio chat', 'ai support', 'chat bot']
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ToastContainer />
          {children}
        </Providers>
        
      </body>
    </html>
  )
}
