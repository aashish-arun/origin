'use client'

import { GraduationCap, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'
import { timelineEvents, formatDate } from '@/data/aashisharun/timeline'

type TimelineEvent = {
  title: string
  startDate: string
  endDate: string
  type: 'study' | 'work'
  achievements: string[]
}

export default function TimelineSection() {
  const sortedEvents = [...(timelineEvents as TimelineEvent[])].sort(
    (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )

  return (
    <section id="timeline" className="bg-black text-white py-24 sm:py-28">
      <div className="relative w-full max-w-7xl mx-auto px-6 text-center">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Journey So Far
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-5">
            Timeline
          </h2>

          <p className="text-base sm:text-lg leading-7 text-gray-400 max-w-2xl mx-auto">
            My journey through education and work, highlighting milestones,
            growth, and hands-on experience.
          </p>
        </motion.div>

        <div className="relative space-y-20">
          <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/10 -translate-x-1/2 md:block" />

          {sortedEvents.map((event, i) => {
            const Icon = event.type === 'study' ? GraduationCap : Briefcase
            const isWork = event.type === 'work'

            return (
              <motion.div
                key={`${event.title}-${event.startDate}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative flex flex-col md:flex-row items-center ${
                  isWork ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="w-full md:w-1/2 px-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-7 shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10 text-left">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400 mb-3">
                      {formatDate(event.startDate)} — {formatDate(event.endDate)}
                    </p>

                    <h3 className="text-2xl font-semibold tracking-tight text-white mb-4">
                      {event.title}
                    </h3>

                    <ul className="space-y-2 text-sm sm:text-base leading-7 text-gray-300 list-disc list-inside">
                      {event.achievements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="relative z-10 my-6 md:my-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <div className="rounded-full border border-cyan-400/30 bg-black p-3 shadow-[0_0_20px_rgba(34,211,238,0.12)]">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}