'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type UserInfo = {
  email: string
  role: 'Admin' | 'User'
}

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = useMemo(() => createClient(), [])

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  const isAdminRoute = pathname.startsWith('/firstoflast/admin')
  const isPortfolio =
    pathname === '/' ||
    pathname.startsWith('/aashish-arun') ||
    pathname.startsWith('/portfolio')
  const isFirstOfLast = pathname.startsWith('/firstoflast')

  const scrollToSection = (id: string): void => {
    const section = document.getElementById(id)

    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push(`/#${id}`)
    }
  }

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setUserInfo(null)
        return
      }

      const { data: admin } = await supabase
        .from('admin')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      setUserInfo({
        email: user.email ?? 'Signed in',
        role: admin?.is_active === true ? 'Admin' : 'User',
      })
    }

    loadUser()
  }, [pathname, supabase])

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    setUserInfo(null)
    router.push('/firstoflast')
    router.refresh()
  }

  const portfolioNav = [
    { label: 'About', id: 'about' },
    { label: 'Tech Stack', id: 'techstack' },
    { label: 'Projects', id: 'projects' },
    { label: 'Timeline', id: 'timeline' },
    { label: 'Contact', id: 'contact' },
  ]

  const firstOfLastNav = [
    { label: 'Status', href: '/firstoflast' },
    { label: 'Collection', href: '/firstoflast/collection' },
    { label: 'Gallery', href: '/firstoflast/gallery' },
  ]

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/70 shadow-lg backdrop-blur"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <span
          onClick={() => {
            if (isPortfolio) scrollToSection('about')
            else router.push('/firstoflast')
          }}
          className="cursor-pointer text-lg font-bold tracking-wide transition hover:text-blue-400"
        >
          {isAdminRoute
            ? 'FirstOfLast Admin'
            : isPortfolio
              ? 'Aashish Arun'
              : 'FirstOfLast'}
        </span>

        {isPortfolio && (
          <nav className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
            {portfolioNav.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="transition hover:text-blue-400"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {isFirstOfLast && (
          <nav className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
            {firstOfLastNav.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => router.push(item.href)}
                className="transition hover:text-blue-400"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {isFirstOfLast && userInfo && (
            <div className="hidden items-center justify-center gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-2 sm:flex">
              <div className="text-center text-xs leading-4">
                <p className="max-w-[180px] truncate text-gray-300">
                  {userInfo.email}
                </p>
                <p className="font-medium text-blue-400">{userInfo.role}</p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-gray-300 transition hover:border-blue-400/40 hover:text-white"
              >
                Logout
              </button>
            </div>
          )}

          {!isFirstOfLast && (
            <button
              type="button"
              onClick={() => router.push('/firstoflast')}
              className="rounded-full bg-linear-to-r from-blue-600 to-purple-600 px-5 py-2 text-sm font-semibold shadow-lg transition hover:shadow-xl"
            >
              Website →
            </button>
          )}

          {isFirstOfLast && (
            <button
              type="button"
              onClick={() => router.push('/')}
              className="rounded-full bg-linear-to-r from-blue-600 to-purple-600 px-5 py-2 text-sm font-semibold shadow-lg transition hover:shadow-xl"
            >
              ← Portfolio
            </button>
          )}
        </div>
      </div>
    </motion.header>
  )
}