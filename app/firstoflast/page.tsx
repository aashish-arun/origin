'use client'

import { motion } from 'framer-motion'
import { Wrench } from 'lucide-react'

export default function FirstOfLastPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <motion.div
        className="text-center max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <Wrench className="text-cyan-400" size={28} />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
          Under Construction
        </h1>

        <p className="text-gray-400 text-lg mb-4 leading-7">
          This section is currently being built.
        </p>

        <p className="text-gray-500 text-sm leading-6">
          I’m working on something exciting here — check back soon.
        </p>

        <div className="mt-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 backdrop-blur-sm transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
          >
            ← Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  )
}