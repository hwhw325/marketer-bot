// pages/api/feedback.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

type Data = { ok: boolean; error?: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' })
  }

  const { message } = req.body as { message: string }
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ ok: false, error: 'Empty message' })
  }

  // SMTP 설정
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: `"피드백 서비스" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: '[CopyQuick] 신규 사용자 피드백 도착',
      text: message,
    })
    return res.status(200).json({ ok: true })
  } catch (error: any) {
    console.error('Mail error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
}
