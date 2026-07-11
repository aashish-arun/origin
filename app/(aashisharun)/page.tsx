"use client"

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react"
import Image from "next/image"
import Link from "next/link"
import { FaDiscord, FaGithub, FaLinkedin } from "react-icons/fa"
import {
  Briefcase,
  Code,
  GraduationCap,
} from "lucide-react"

import {
  techCategories,
  techIcons,
  techMeta,
} from "@/data/aashisharun/techStack"

import { projects } from "@/data/aashisharun/projects"
import { timelineEvents, formatDate } from "@/data/aashisharun/timeline"

type ContactFormData = {
  name: string
  email: string
  message: string
}

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  message: "",
}

const fullStackEnvironment = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Supabase",
  "SQL",
  "Git",
  "GitHub",
  "Vercel",
]

const microsoftEnvironment = [
  "Microsoft 365",
  "SharePoint Framework",
  "SharePoint",
  "Microsoft Entra ID",
  "Power Automate",
  "Microsoft Teams",
  "PnPjs",
  "PnP PowerShell",
]

type Certificate = {
  name: string
  image: string
  issuedYear: string
  expiryYear?: string
}

const certificates: Certificate[] = [
  {
    name: "GitHub Essential Training",
    image: "/images/certificates/github-essential-training.png",
    issuedYear: "Dec 2024",
  },
]

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="inline-block border-b border-cyan-400/60 pb-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
      {title}
    </h2>
  )
}

function LineItem({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full bg-cyan-400" />
      {children}
    </div>
  )
}

function TechBadge({ tech }: { tech: string }) {
  const Icon = techIcons[tech] ?? Code
  return (
    <span
      title={techMeta[tech] ?? "Development Tool"}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300"
    >
      <Icon size={15} className="text-cyan-400" />
      {tech}
    </span>
  )
}

function ProjectCarousel({
  images,
  title,
}: {
  images: { src: string; title: string; description?: string }[]
  title: string
}) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(
      () => setActive((p) => (p === images.length - 1 ? 0 : p + 1)),
      3500
    )
    return () => clearInterval(id)
  }, [images.length])
  if (images.length === 0) return null
  return (
    <div className="relative h-48 overflow-hidden rounded-xl border border-white/10 bg-white/5 md:h-full md:min-h-[180px]">
      <Image
        src={images[active].src}
        alt={images[active].title || `${title} screenshot ${active + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 300px"
        className="object-cover"
      />
    </div>
  )
}

function CertificateImage({ image, name }: { image: string; name: string }) {
  return (
    <div className="relative h-48 overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <Image src={image} alt={`${name} certificate`} fill className="object-cover" />
    </div>
  )
}

export default function Home() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const sortedEvents = [...timelineEvents].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )

  const clean = (v: string) =>
    v.replace(/[<>]/g, "").replace(/\s+/g, " ").trimStart()

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((p) => ({
      ...p,
      [name]: name === "email" ? clean(value).toLowerCase() : clean(value),
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          message: formData.message.trim(),
        }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      setFormData(initialFormData)
      setTimeout(() => setSubmitted(false), 5000)
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-20 px-6 pb-16 pt-8">
      <section id="about">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">
          Software Developer
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Building modern web applications and enterprise solutions.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-400">
          I do this because I have nothing else to do.
        </p>
        <div className="mt-6 flex gap-5 text-gray-400">
          <a
            href="https://www.linkedin.com/in/aashish-arun-7489ab250/"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-cyan-400"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={25} />
          </a>
          <a
            href="https://github.com/aashish-arun"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-cyan-400"
            aria-label="GitHub"
          >
            <FaGithub size={25} />
          </a>
          <a
            href="https://discord.com/users/FirstOfLast"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-cyan-400"
            aria-label="Discord"
          >
            <FaDiscord size={25} />
          </a>
        </div>
      </section>

      <section id="techstack">
        <SectionHeading title="Tech Stack" />
        <div className="mt-6 space-y-4 border-l border-cyan-400/30 pl-6">
          <LineItem>
            <h3 className="text-xl font-semibold text-white">Full-Stack</h3>
            <p className="mt-3 max-w-2xl leading-7 text-gray-400">
              My main development stack for building modern, full-stack web applications.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {fullStackEnvironment.map((tech) => (
                <TechBadge key={tech} tech={tech} />
              ))}
            </div>
          </LineItem>

          <LineItem>
            <h3 className="text-xl font-semibold text-white">Microsoft 365 & Azure</h3>
            <p className="mt-3 max-w-2xl leading-7 text-gray-400">
              Tools I use for SharePoint solutions, Microsoft 365 development, automation, identity, and enterprise workflows.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {microsoftEnvironment.map((tech) => (
                <TechBadge key={tech} tech={tech} />
              ))}
            </div>
          </LineItem>

          <LineItem>
            <details>
              <summary className="cursor-pointer text-sm font-semibold text-cyan-400">
                Show all skills
              </summary>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {Object.entries(techCategories).map(([category, techs]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-white">{category}</h4>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {techs.map((tech) => (
                        <span
                          key={tech}
                          title={techMeta[tech] ?? "Development Tool"}
                          className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-gray-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </LineItem>
        </div>
      </section>

      <section id="timeline">
        <SectionHeading title="Experience" />

        <p className="mt-4 max-w-2xl leading-7 text-gray-400">
          A simple overview of my education, work experience, and hands-on growth.
        </p>

        <div className="mt-6 space-y-4 border-l border-cyan-400/30 pl-6">
          {sortedEvents.map((event) => {
            const Icon = event.type === "study" ? GraduationCap : Briefcase

            return (
              <LineItem key={`${event.title}-${event.startDate}`}>
                <div className="flex items-center gap-3 text-cyan-400">
                  <Icon size={18} />

                  <p className="text-sm">
                    {formatDate(event.startDate)} — {formatDate(event.endDate)}
                  </p>
                </div>

                <h3 className="mt-3 text-xl font-semibold text-white">
                  {event.title}
                </h3>

                {(event.gpa || event.cgpa) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {event.gpa && (
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                        GPA: {event.gpa}
                      </span>
                    )}

                    {event.cgpa && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                        CGPA: {event.cgpa}
                      </span>
                    )}
                  </div>
                )}

                {event.achievements.length > 0 && (
                  <ul className="mt-4 list-inside list-disc space-y-1 text-gray-400">
                    {event.achievements.map((achievement) => (
                      <li key={achievement}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </LineItem>
            )
          })}
        </div>
      </section>

      <section id="projects">
        <SectionHeading title="Projects" />
        <p className="mt-4 max-w-2xl leading-7 text-gray-400">
          Projects focused on full-stack development, Microsoft 365 solutions, automation, and real-world problem solving.
        </p>
        <div className="mt-6 space-y-4 border-l border-cyan-400/30 pl-6">
          {projects.map((project) => (
            <LineItem key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="group grid gap-5 md:grid-cols-[300px_1fr] md:items-stretch"
              >
                <ProjectCarousel images={project.images} title={project.title} />
                <div className="flex min-w-0 flex-col">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400">
                      {project.title}
                    </h3>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-3 leading-7 text-gray-400">
                    {project.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.techUsed.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex text-sm font-medium text-cyan-400 transition group-hover:text-cyan-300">
                    View project →
                  </span>
                </div>
              </Link>
            </LineItem>
          ))}
        </div>
      </section>

      <section id="certificates">
        <SectionHeading title="Certificates" />
        <p className="mt-4 max-w-2xl leading-7 text-gray-400">
          Certifications and completed learning credentials that support my technical foundation.
        </p>
        <div className="mt-6 space-y-4 border-l border-cyan-400/30 pl-6">
          {certificates.map((certificate) => (
            <LineItem key={certificate.name}>
              <div className="grid gap-5 md:grid-cols-[300px_1fr] md:items-stretch">
                <CertificateImage image={certificate.image} name={certificate.name} />
                <div className="flex min-w-0 flex-col justify-center">
                  <h3 className="text-xl font-semibold text-white">{certificate.name}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                      Issued {certificate.issuedYear}
                    </span>
                    {certificate.expiryYear && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                        Expires {certificate.expiryYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </LineItem>
          ))}
        </div>
      </section>

      <section id="contact">
        <SectionHeading title="Contact" />
        <p className="mt-4 max-w-2xl leading-7 text-gray-400">
          Have an idea, question, or project in mind? Send me a message.
        </p>
        <div className="mt-6 space-y-4 border-l border-cyan-400/30 pl-6">
          <LineItem>
            {submitted && (
              <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                Message sent successfully. I'll get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                maxLength={50}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder-gray-500 outline-none transition focus:border-cyan-400/40"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                required
                maxLength={100}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder-gray-500 outline-none transition focus:border-cyan-400/40"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me a bit about your idea..."
                rows={5}
                required
                maxLength={1000}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder-gray-500 outline-none transition focus:border-cyan-400/40"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </LineItem>
        </div>
      </section>
    </div>
  )
}