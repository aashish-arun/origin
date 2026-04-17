import nodemailer from 'nodemailer'
import twilio from 'twilio'
import { NextRequest, NextResponse } from 'next/server'

type ContactFormBody = {
  name: string
  email: string
  message: string
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormBody = await req.json()
    const { name, email, message } = body

    /* ---------- EMAIL ---------- */
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    })

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Portfolio Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    })

    /* ---------- WHATSAPP ---------- */
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    )

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM!,
      to: process.env.WHATSAPP_TO!,
      body: `📩 New Portfolio Message

Name: ${name}
Email: ${email}

Message:
${message}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API Error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}