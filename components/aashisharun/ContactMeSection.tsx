'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { motion } from 'framer-motion'

type FormData = {
  name: string
  email: string
  message: string
}

type FormErrors = {
  name: string
  email: string
  message: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  message: '',
}

const initialErrors: FormErrors = {
  name: '',
  email: '',
  message: '',
}

const ContactMeSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>(initialErrors)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const sanitizeInput = (value: string): string => {
    return value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trimStart()
  }

  const validateName = (name: string): string => {
    const trimmed = name.trim()

    if (!trimmed) return 'Name is required.'
    if (trimmed.length < 2) return 'Name must be at least 2 characters.'
    if (trimmed.length > 50) return 'Name must be less than 50 characters.'
    if (!/^[a-zA-Z\s'.-]+$/.test(trimmed)) {
      return 'Name can only contain letters, spaces, apostrophes, periods, and hyphens.'
    }

    return ''
  }

  const validateEmail = (email: string): string => {
    const trimmed = email.trim()

    if (!trimmed) return 'Email is required.'
    if (trimmed.length > 100) return 'Email must be less than 100 characters.'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) return 'Please enter a valid email address.'

    return ''
  }

  const validateMessage = (message: string): string => {
    const trimmed = message.trim()

    if (!trimmed) return 'Message is required.'
    if (trimmed.length < 10) return 'Message must be at least 10 characters.'
    if (trimmed.length > 1000) return 'Message must be less than 1000 characters.'

    return ''
  }

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case 'name':
        return validateName(value)
      case 'email':
        return validateEmail(value)
      case 'message':
        return validateMessage(value)
      default:
        return ''
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const fieldName = name as keyof FormData
    const sanitizedValue =
      fieldName === 'email'
        ? sanitizeInput(value).toLowerCase()
        : sanitizeInput(value)

    setFormData((prev) => ({
      ...prev,
      [fieldName]: sanitizedValue,
    }))

    setErrors((prev) => ({
      ...prev,
      [fieldName]: validateField(fieldName, sanitizedValue),
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const sanitizedFormData: FormData = {
      name: sanitizeInput(formData.name).trim(),
      email: sanitizeInput(formData.email).trim().toLowerCase(),
      message: sanitizeInput(formData.message).trim(),
    }

    const newErrors: FormErrors = {
      name: validateName(sanitizedFormData.name),
      email: validateEmail(sanitizedFormData.email),
      message: validateMessage(sanitizedFormData.message),
    }

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((error) => error !== '')
    if (hasErrors) return

    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedFormData),
      })

      if (!res.ok) {
        throw new Error('Failed to send')
      }

      setSubmitted(true)
      setFormData(initialFormData)
      setErrors(initialErrors)
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="bg-black text-white py-24 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Get In Touch
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-5">
            Let’s Talk
          </h2>

          <motion.p
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-7"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Have an idea, a question, or a project in mind? Drop me a message —
            I’d love to hear from you.
          </motion.p>
        </motion.div>

        {submitted && (
          <motion.div
            className="mb-8 max-w-2xl mx-auto rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Message sent successfully. I’ll get back to you soon.
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-2xl mx-auto w-full flex flex-col gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="text-left">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              maxLength={50}
              aria-label="Your name"
              aria-invalid={!!errors.name}
              className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400/40 transition"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          <div className="text-left">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              required
              maxLength={100}
              aria-label="Your email"
              aria-invalid={!!errors.email}
              className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400/40 transition"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="text-left">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me a bit about your idea…"
              rows={5}
              required
              maxLength={1000}
              aria-label="Your message"
              aria-invalid={!!errors.message}
              className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400/40 transition resize-none"
            />
            <div className="mt-2 flex items-center justify-between">
              {errors.message ? (
                <p className="text-sm text-red-400">{errors.message}</p>
              ) : (
                <span />
              )}
              <p className="text-sm text-gray-500">
                {formData.message.length}/1000
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400 text-black py-4 font-semibold text-lg transition-all duration-200 hover:bg-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Sending…
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </motion.form>
      </div>
    </section>
  )
}

export default ContactMeSection