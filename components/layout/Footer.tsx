'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="border-t border-white/10 backdrop-blur bg-black/70"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between text-sm text-gray-300">
        
        {/* Left: Copyright */}
        <span>
          © {new Date().getFullYear()} Aashish Arun. All rights reserved.
        </span>

        {/* Right: Links */}
        <div className="flex gap-6">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/aashish-arun-7489ab250/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            LinkedIn
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/aashish-arun"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            GitHub
          </a>

          {/* Gmail */}
          <a
            href="mailto:aashish.ouo@gmail.com"
            className="hover:text-white transition"
          >
            Gmail
          </a>
        </div>
      </div>
    </motion.footer>
  )
}