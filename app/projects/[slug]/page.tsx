'use client'

import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { projects, type Project } from '@/data/aashisharun/projects'

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  const project = projects.find((item: Project) => item.slug === slug)

  if (!project) notFound()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const currentImage = project.images[currentImageIndex]

  useEffect(() => {
    if (project.images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === project.images.length - 1 ? 0 : prev + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [project.images.length])

  return (
    <section className="bg-black px-6 pb-20 pt-24 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
          >
            ← Back to Projects
          </Link>
        </div>

        <div className="mb-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Project Showcase
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-gray-400 sm:text-lg">
            {project.description}
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          {project.techUsed.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mb-14 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="relative h-[420px] bg-black sm:h-[520px] lg:h-[620px]">
            <Image
              src={currentImage.src}
              alt={currentImage.title}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-contain p-3"
              priority
            />

            {project.images.length > 1 && (
              <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 backdrop-blur">
                {project.images.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to ${image.title}`}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      currentImageIndex === index
                        ? 'bg-cyan-400'
                        : 'bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">
              Image {currentImageIndex + 1} of {project.images.length}
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {currentImage.title}
            </h2>

            {currentImage.description && (
              <p className="mt-3 max-w-3xl leading-7 text-gray-400">
                {currentImage.description}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-white">
              Overview
            </h2>
            <p className="leading-7 text-gray-400">
              {project.details.overview}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-white">
              Problem
            </h2>
            <p className="leading-7 text-gray-400">
              {project.details.problem}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-white">
              Solution
            </h2>
            <p className="leading-7 text-gray-400">
              {project.details.solution}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
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

        {(project.liveLink || project.githubLink) && (
          <div className="mt-10 flex flex-wrap gap-4">
            {project.liveLink && project.liveLink !== '#' && (
              <Link
                href={project.liveLink}
                target="_blank"
                className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
              >
                Live Demo
              </Link>
            )}

            {project.githubLink && project.githubLink !== '#' && (
              <Link
                href={project.githubLink}
                target="_blank"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
              >
                GitHub
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
