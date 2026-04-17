'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { projects } from '@/data/aashisharun/projects'
import { techIcons, categoryIcons } from '@/data/aashisharun/techIcons'
import { projectFilters } from '@/data/aashisharun/projectFilters'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

type Filters = Record<string, string[]>

const ProjectGallery = ({ images }: { images: string[] }) => {
  const [active, setActive] = useState(0)

  const goToPreviousImage = () => {
    setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNextImage = () => {
    setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="w-full">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={images[active]}
          alt={`Project image ${active + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                goToPreviousImage()
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:bg-black/70"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                goToNextImage()
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:bg-black/70"
            >
              <ChevronRight size={18} />
            </button>

            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setActive(i)
                  }}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    active === i
                      ? 'bg-cyan-400'
                      : 'bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function ProjectsSection() {
  const [selectedFilters, setSelectedFilters] = useState<Filters>({})
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || []

      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      }
    })
  }

  const filteredProjects = projects.filter((project) =>
    Object.entries(selectedFilters).every(([category, values]) => {
      if (values.length === 0) return true

      if (category === 'Status') {
        return values.includes(project.status)
      }

      return values.every((value) => project.techUsed.includes(value))
    })
  )

  return (
    <section
      id="projects"
      className="min-h-screen bg-black py-24 sm:py-28 text-white"
    >
      <div className="mx-auto max-w-7xl px-6 text-center">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Selected Work
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
            Projects
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-7 text-gray-400">
            A collection of projects focused on full-stack development,
            enterprise solutions, and practical problem-solving.
          </p>
        </motion.div>

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {Object.entries(projectFilters).map(([category, options]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons]

            return (
              <div key={category} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === category ? null : category)
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 backdrop-blur-sm transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
                >
                  {Icon ? <Icon size={16} className="text-cyan-400" /> : null}
                  {category}
                  <ChevronDown size={14} />
                </button>

                {openDropdown === category && (
                  <div className="absolute z-20 mt-3 w-60 rounded-2xl border border-white/10 bg-black/95 p-4 text-left shadow-2xl backdrop-blur-md">
                    <div className="space-y-2">
                      {options.map((value: string) => (
                        <label
                          key={value}
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-cyan-400"
                        >
                          <input
                            type="checkbox"
                            checked={
                              selectedFilters[category]?.includes(value) || false
                            }
                            onChange={() => toggleFilter(category, value)}
                            className="accent-cyan-400"
                          />
                          {value}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10"
            >
              <ProjectGallery images={project.images} />

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    {project.title}
                  </h3>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      project.status === 'In Progress'
                        ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
                        : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="mb-5 text-sm leading-7 text-gray-400">
                  {project.description}
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {project.techUsed.map((tech: string) => {
                    const Icon = techIcons[tech as keyof typeof techIcons]

                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300"
                      >
                        {Icon ? <Icon size={12} className="text-cyan-400" /> : null}
                        {tech}
                      </span>
                    )
                  })}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="mt-auto inline-flex items-center text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                >
                  View More →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}