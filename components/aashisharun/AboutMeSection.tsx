'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Code,
  Paintbrush,
  Server,
  Cloud,
} from 'lucide-react'
import { FaGithub, FaLinkedin, FaDiscord } from 'react-icons/fa'

type Skill = {
  label: string
  icon: LucideIcon
}

export default function AboutMeSection() {
  const skills: Skill[] = [
    { label: 'Frontend: Next.js, React, TypeScript', icon: Code },
    { label: 'Styling: Tailwind CSS, Fluent UI', icon: Paintbrush },
    { label: 'Backend: Node.js, Java, Python', icon: Server },
    { label: 'Data & DevOps: SQL, SharePoint, Docker, Git', icon: Cloud },
  ]

  return (
    <section
      id="about"
      className="min-h-screen flex items-center bg-black text-white"
    >
      <div className="w-full max-w-7xl mx-auto px-6 text-center">
        <motion.h1
          className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Hi, I&apos;m <span className="text-cyan-400">Aashish Arun</span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          I&apos;m a full-stack developer focused on building modern, scalable
          applications using Next.js, React, and TypeScript. I enjoy crafting
          clean user experiences, solving real-world problems, and working across
          web, backend, and cloud technologies.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {skills.map(({ label, icon: Icon }) => (
            <motion.span
              key={label}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              <Icon size={16} className="text-cyan-400" />
              {label}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center gap-6 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <a
            href="https://www.linkedin.com/in/aashish-arun-7489ab250/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-400 transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={26} />
          </a>

          <a
            href="https://github.com/aashish-arun"
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-400 transition-colors"
            aria-label="GitHub"
          >
            <FaGithub size={26} />
          </a>

          <a
            href="https://discord.com/users/FirstOfLast"
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-400 transition-colors"
            title="FirstOfLast#2254"
            aria-label="Discord"
          >
            <FaDiscord size={26} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}