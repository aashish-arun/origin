'use client'

import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const isAdminRoute = pathname.startsWith('/firstoflast/admin')
  const isPortfolio =
    pathname === '/' ||
    pathname.startsWith('/aashish-arun') ||
    pathname.startsWith('/portfolio')
  const isFirstOfLastPublic =
    pathname.startsWith('/firstoflast') && !isAdminRoute

  const scrollToSection = (id: string): void => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-black/70 border-b border-white/10 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span
          onClick={() => {
            if (isAdminRoute) router.push('/firstoflast/admin')
            else if (isPortfolio) scrollToSection('about')
            else router.push('/firstoflast')
          }}
          className="font-bold text-lg tracking-wide cursor-pointer hover:text-blue-400 transition"
        >
          {isAdminRoute
            ? 'FirstOfLast Admin'
            : isPortfolio
            ? 'Aashish Arun'
            : 'FirstOfLast'}
        </span>

        {!isAdminRoute && isPortfolio && (
          <nav className="hidden md:flex gap-8 text-sm text-gray-300">
            <button type="button" onClick={() => scrollToSection('about')}>
              About
            </button>
            <button type="button" onClick={() => scrollToSection('techstack')}>
              Tech Stack
            </button>
            <button type="button" onClick={() => scrollToSection('projects')}>
              Projects
            </button>
            <button type="button" onClick={() => scrollToSection('timeline')}>
              Timeline
            </button>
            <button type="button" onClick={() => scrollToSection('contact')}>
              Contact
            </button>
          </nav>
        )}

        {!isAdminRoute && isFirstOfLastPublic && (
          <nav className="hidden md:flex gap-8 text-sm text-gray-300">
            <button type="button" onClick={() => router.push('/firstoflast')}>
              Home
            </button>
            <button type="button" onClick={() => router.push('/firstoflast/blog')}>
              Blog
            </button>
            <button type="button" onClick={() => router.push('/firstoflast/contact')}>
              Contact
            </button>
          </nav>
        )}

        {isAdminRoute && (
          <nav className="hidden md:flex gap-8 text-sm text-gray-300">
            <button type="button" onClick={() => router.push('/firstoflast/admin')}>
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => router.push('/firstoflast/admin/inventory')}
            >
              Inventory
            </button>
            <button
              type="button"
              onClick={() => router.push('/firstoflast/admin/gallery')}
            >
              Gallery
            </button>
            <button
              type="button"
              onClick={() => router.push('/firstoflast/admin/status')}
            >
              Status
            </button>
          </nav>
        )}

        <div className="flex items-center gap-4">
          {!isAdminRoute && (
            <button
              type="button"
              onClick={() => router.push(isPortfolio ? '/firstoflast' : '/')}
              className="px-5 py-2 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-sm font-semibold shadow-lg hover:shadow-xl transition"
            >
              {isPortfolio ? 'Website →' : '← Portfolio'}
            </button>
          )}
        </div>
      </div>
    </motion.header>
  )
}