'use client'

import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Code,
  Paintbrush,
  Server,
  Database,
  GitBranch,
  Cloud,
  Cpu,
  Monitor,
} from 'lucide-react'
import { techCategories, allTech } from '@/data/aashisharun/techStack'

type CategoryKey = 'All' | keyof typeof techCategories

const categoryIcons: Record<CategoryKey, LucideIcon> = {
  All: Cpu,
  Frontend: Code,
  Backend: Server,
  Database: Database,
  DevOps: Cloud,
  Design: Paintbrush,
  OS: Monitor,
}

const techIcons: Record<string, LucideIcon> = {
  HTML: Code,
  CSS: Paintbrush,
  JavaScript: Code,
  React: Code,
  'Next.js': Code,
  'React Native': Code,
  'Tailwind CSS': Paintbrush,

  Java: Server,
  'C#': Server,
  Python: Server,
  'Node.js': Server,
  'Oracle APEX': Database,
  Firebase: Cloud,

  MySQL: Database,
  'Oracle Database': Database,
  SQL: Database,
  'PL/SQL': Database,
  HeidiSQL: Database,

  Git: GitBranch,
  GitHub: Code,
  Docker: Cloud,

  Figma: Paintbrush,
  'Software Ideas Modular': Cpu,

  Windows: Monitor,
  'Windows Server': Monitor,
  Linux: Monitor,
  'Linux Server': Monitor,
}

export default function TechStackSection() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('All')

  const categories: CategoryKey[] = [
    'All',
    ...(Object.keys(techCategories) as Array<keyof typeof techCategories>),
  ]

  const techToShow: string[] =
    selectedCategory === 'All' ? allTech : techCategories[selectedCategory]

  return (
    <section
      id="techstack"
      className="bg-black text-white py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Explore My Stack
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
            Tech Stack
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-7 text-gray-400">
            Technologies I use to design, build, and ship full-stack applications.
          </p>
        </motion.div>

        <motion.div
          className="mb-12 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {categories.map((cat) => {
            const Icon = categoryIcons[cat]
            const isActive = selectedCategory === cat

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={[
                  'inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'border-cyan-400 bg-cyan-400 text-black shadow-[0_0_24px_rgba(34,211,238,0.18)]'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                <Icon size={16} />
                <span>{cat}</span>
              </button>
            )
          })}
        </motion.div>

        <motion.div
          className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.55 }}
        >
          {techToShow.map((tech) => {
            const Icon = techIcons[tech] ?? Code

            return (
              <div
                key={tech}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-200 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
              >
                <Icon size={15} className="text-cyan-400" />
                <span>{tech}</span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}