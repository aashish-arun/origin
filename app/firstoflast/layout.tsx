import type { ReactNode } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

interface FirstOfLastLayoutProps {
  children: ReactNode
}

export default function FirstOfLastLayout({
  children,
}: FirstOfLastLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}