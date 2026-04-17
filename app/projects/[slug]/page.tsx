'use client'

import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { projects } from '@/data/aashisharun/projects'
import { notFound } from 'next/navigation'

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  const project = projects.find((p) => p.slug === slug)

  if (!project) notFound()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    )
  }

  const goToNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    )
  }

  useEffect(() => {
    if (project.images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === project.images.length - 1 ? 0 : prev + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [project.images.length])

  return (
    <section className="bg-black px-6 py-24 sm:py-28 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 backdrop-blur-sm transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
          >
            ← Back to Projects
          </Link>
        </div>

        <div className="relative mb-12 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <div className="relative h-72 sm:h-80 md:h-112">
            <Image
              src={project.images[currentImageIndex]}
              alt={`${project.title} image ${currentImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              priority
            />

            {project.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPreviousImage}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-2.5 text-white backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:bg-black/70"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={goToNextImage}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-2.5 text-white backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:bg-black/70"
                >
                  <ChevronRight size={22} />
                </button>

                <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                  {project.images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to image ${index + 1}`}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        currentImageIndex === index
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

        <div className="mb-10">
          <p className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Project Showcase
          </p>

          <h1 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>

          <p className="max-w-3xl text-base leading-7 text-gray-400 sm:text-lg">
            {project.description}
          </p>
        </div>

        <div className="mb-14 flex flex-wrap gap-3">
          {project.techUsed.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-white">
              Overview
            </h2>
            <p className="leading-7 text-gray-400">
              {project.details.overview}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-white">
              Problem
            </h2>
            <p className="leading-7 text-gray-400">
              {project.details.problem}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-white">
              Solution
            </h2>
            <p className="leading-7 text-gray-400">
              {project.details.solution}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-white">
              Key Features
            </h2>
            <ul className="list-inside list-disc space-y-2 leading-7 text-gray-400">
              {project.details.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          {project.liveLink && project.liveLink !== '#' && (
            <Link
              href={project.liveLink}
              target="_blank"
              className="inline-flex items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400 px-6 py-3 font-semibold text-black transition-all duration-200 hover:bg-cyan-300"
            >
              Live Demo
            </Link>
          )}

          {project.githubLink && project.githubLink !== '#' && (
            <Link
              href={project.githubLink}
              target="_blank"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-gray-300 backdrop-blur-sm transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              GitHub
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}