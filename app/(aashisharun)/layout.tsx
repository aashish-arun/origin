import type { ReactNode } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface AashishArunLayoutProps {
  children: ReactNode
}

export default function AashishArunLayout({
  children,
}: AashishArunLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />

      <main className="flex-1 pt-16">
        {children}
      </main>

      <Footer />
    </div>
  )
}