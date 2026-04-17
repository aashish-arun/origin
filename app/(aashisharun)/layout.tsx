import type { ReactNode } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

interface AashishArunLayoutProps {
  children: ReactNode
}

export default function AashishArunLayout({ children }: AashishArunLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}