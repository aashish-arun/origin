'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  const isPortfolio =
    pathname === '/' ||
    pathname.startsWith('/aashish-arun') ||
    pathname.startsWith('/portfolio')

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className={[
        'bg-black/70 backdrop-blur',
        isPortfolio ? '' : 'border-t border-white/10',
      ].join(' ')}
    >
      <div
        className={[
          'mx-auto flex min-h-16 items-center justify-between px-6 text-sm',
          isPortfolio
            ? 'max-w-5xl py-6 text-gray-500'
            : 'h-16 max-w-7xl text-gray-300',
        ].join(' ')}
      >
        <span>
          © {new Date().getFullYear()} Aashish Arun. All rights reserved.
        </span>

        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/aashish-arun-7489ab250/"
            target="_blank"
            rel="noreferrer"
            className={[
              'transition',
              isPortfolio ? 'hover:text-cyan-400' : 'hover:text-white',
            ].join(' ')}
          >
            LinkedIn
          </a>

          <a
            href="https://github.com/aashish-arun"
            target="_blank"
            rel="noreferrer"
            className={[
              'transition',
              isPortfolio ? 'hover:text-cyan-400' : 'hover:text-white',
            ].join(' ')}
          >
            GitHub
          </a>

          <a
            href="mailto:aashish.ouo@gmail.com"
            className={[
              'transition',
              isPortfolio ? 'hover:text-cyan-400' : 'hover:text-white',
            ].join(' ')}
          >
            Gmail
          </a>
        </div>
      </div>
    </motion.footer>
  )
}