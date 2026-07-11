'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type UserInfo = {
  email: string
  role: 'Admin' | 'User'
}

type PortfolioNavItem = {
  label: string
  id: string
}

type FirstOfLastNavItem = {
  label: string
  href: string
}

const portfolioImage = '/images/aashish-pfp.jpg'
const firstOfLastImage = '/images/pfp/firstoflast-pfp.png'

const portfolioNav: PortfolioNavItem[] = [
  { label: 'About', id: 'about' },
  { label: 'Tech Stack', id: 'techstack' },
  { label: 'Experience', id: 'timeline' },
  { label: 'Projects', id: 'projects' },
  { label: 'Certificates', id: 'certificates' },
  { label: 'Contact', id: 'contact' },
]

const firstOfLastNav: FirstOfLastNavItem[] = [
  { label: 'Status', href: '/firstoflast' },
  { label: 'Collection', href: '/firstoflast/collection' },
  { label: 'Gallery', href: '/firstoflast/gallery' },
]

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

  const scrollToSection = useCallback(
    (id: string): void => {
      const section = document.getElementById(id)

      if (!section) {
        router.push(`/#${id}`)
        return
      }

      const headerOffset = 88
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY

      window.scrollTo({
        top: Math.max(sectionPosition - headerOffset, 0),
        behavior: 'smooth',
      })

      window.history.replaceState(null, '', `#${id}`)
    },
    [router]
  )

  useEffect(() => {
    if (!isPortfolio) return

    const hash = window.location.hash.replace('#', '')

    if (!hash) return

    const timeout = window.setTimeout(() => {
      scrollToSection(hash)
    }, 100)

    return () => window.clearTimeout(timeout)
  }, [isPortfolio, pathname, scrollToSection])

  useEffect(() => {
    let mounted = true

    async function loadUser(): Promise<void> {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!mounted) return

      if (!user) {
        setUserInfo(null)
        return
      }

      const { data: admin } = await supabase
        .from('admin')
        .select('is_active')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!mounted) return

      setUserInfo({
        email: user.email ?? 'Signed in',
        role: admin?.is_active === true ? 'Admin' : 'User',
      })
    }

    void loadUser()

    return () => {
      mounted = false
    }
  }, [pathname, supabase])

  async function handleLogout(): Promise<void> {
    await fetch('/auth/logout', {
      method: 'POST',
    })

    setUserInfo(null)
    router.push('/firstoflast')
    router.refresh()
  }

  function handleLogoClick(): void {
    if (isPortfolio) {
      scrollToSection('about')
      return
    }

    router.push('/firstoflast')
  }

  function handlePortfolioNavigation(id: string): void {
    if (isPortfolio) {
      scrollToSection(id)
      return
    }

    router.push(`/#${id}`)
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/70 shadow-lg backdrop-blur"
    >
      <div
        className={[
          'mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6',
          isPortfolio ? 'max-w-6xl' : 'max-w-7xl',
        ].join(' ')}
      >
        <button
          type="button"
          onClick={handleLogoClick}
          className={[
            'shrink-0 font-bold tracking-wide text-white transition',
            isPortfolio
              ? 'text-sm hover:text-cyan-400'
              : 'text-lg hover:text-blue-400',
          ].join(' ')}
        >
          {isAdminRoute
            ? 'FirstOfLast Admin'
            : isPortfolio
              ? 'Aashish Arun'
              : 'FirstOfLast'}
        </button>

        {isPortfolio && (
          <nav className="hidden flex-1 items-center justify-center gap-5 text-sm text-gray-400 lg:flex">
            {portfolioNav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handlePortfolioNavigation(item.id)}
                className="whitespace-nowrap transition hover:text-cyan-400"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {isFirstOfLast && (
          <nav className="hidden flex-1 items-center justify-center gap-8 text-sm text-gray-300 md:flex">
            {firstOfLastNav.map((item) => {
              const isActive =
                item.href === '/firstoflast'
                  ? pathname === item.href
                  : pathname.startsWith(item.href)

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className={[
                    'transition hover:text-blue-400',
                    isActive ? 'text-blue-400' : 'text-gray-300',
                  ].join(' ')}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>
        )}

        <div className="flex shrink-0 items-center gap-3">
          {isFirstOfLast && userInfo && (
            <div className="hidden items-center gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 xl:flex">
              <div className="text-center text-xs leading-4">
                <p className="max-w-[160px] truncate text-gray-300">
                  {userInfo.email}
                </p>

                <p className="font-medium text-blue-400">
                  {userInfo.role}
                </p>
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

          {isPortfolio && (
            <button
              type="button"
              onClick={() => router.push('/firstoflast')}
              className="group flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-1.5 pr-3 text-sm font-semibold text-gray-300 transition hover:border-cyan-400/40 hover:text-white"
            >
               <motion.span
                className="relative h-8 w-8 overflow-hidden rounded-full border border-cyan-400/40"
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.5 }}
              >
               {/* <Image
                  src={portfolioImage}
                  alt="FirstOfLast profile"
                  fill
                  sizes="32px"
                  className="object-cover"
                />*/}
              </motion.span>
              

              <span className="hidden sm:inline">Portfolio</span>
            </button>
          )}

          {isFirstOfLast && (
            <button
              type="button"
              onClick={() => router.push('/')}
              className="group flex h-10 items-center gap-2 rounded-full bg-linear-to-r from-blue-600 to-purple-600 px-1.5 pr-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
            >
              <motion.span
                className="relative h-8 w-8 overflow-hidden rounded-full border border-white/30"
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={firstOfLastImage}
                  alt="Aashish Arun profile"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </motion.span>

              <span className="hidden sm:inline">FirstOfLast</span>
            </button>
          )}
        </div>
      </div>
    </motion.header>
  )
}