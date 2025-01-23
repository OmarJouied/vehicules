import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/containers/Header'
import ClientProvider from '@/components/ClientProvider'
import { getServerSession } from 'next-auth'
import { options } from './api/auth/[...nextauth]/options'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vehicules',
  description: 'gestion globale de votre parc automobile',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(options);

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ClientProvider session={session}>
          <Header />
          {children}
          <Toaster />
        </ClientProvider>
      </body>
    </html>
  )
}
