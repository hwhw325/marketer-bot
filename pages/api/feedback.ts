// pages/api/feedback.ts
import type { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || "465", 10),
  secure: process.env.MAIL_SECURE === "true", // 465=true / 587=false 보통
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

// 필요하면 제한 타입을 쓰세요 (UI와 맞춰서)
const ALLOWED_TYPES = new Set(["버그 신고", "기능 제안", "결제/환불", "기타"])

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ ok: false, message: "허용되지 않은 요청입니다." })
  }

  const { email, type, message } = req.body ?? {}

  const cleanEmail = typeof email === "string" ? email.trim() : ""
  const cleanType = typeof type === "string" ? type.trim() : ""
  const cleanMessage = typeof message === "string" ? message.trim() : ""

  if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
    return res.status(400).json({ ok: false, message: "올바른 이메일을 입력해주세요." })
  }
  if (!cleanType || cleanType.length > 50) {
    return res.status(400).json({ ok: false, message: "문의 유형을 선택해주세요." })
  }
  // 제한하려면 주석 해제
  // if (!ALLOWED_TYPES.has(cleanType)) {
  //   return res.status(400).json({ ok: false, message: "올바른 문의 유형이 아닙니다." })
  // }
  if (!cleanMessage || cleanMessage.length < 5) {
    return res.status(400).json({ ok: false, message: "내용을 5자 이상 입력해주세요." })
  }

  const to = process.env.MAIL_TO || process.env.MAIL_USER
  if (!to) {
    return res.status(500).json({ ok: false, message: "메일 수신자(MAIL_TO)가 설정되어 있지 않습니다." })
  }

  const subject = `[문의] ${cleanType.slice(0, 40)}`
  const text = `보낸 사람: ${cleanEmail}\n유형: ${cleanType}\n\n내용:\n${cleanMessage}`
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
      <p><strong>보낸 사람:</strong> ${escapeHtml(cleanEmail)}</p>
      <p><strong>유형:</strong> ${escapeHtml(cleanType)}</p>
      <hr />
      <pre style="white-space:pre-wrap">${escapeHtml(cleanMessage)}</pre>
    </div>
  `

  try {
    // SMTP 설정 오류를 빠르게 잡기 위해 사전 검증
    await transporter.verify()

    await transporter.sendMail({
      from: `"CopyQuick 문의" <${process.env.MAIL_USER}>`,
      to,
      replyTo: cleanEmail, // 답변 시 사용자가 넣은 주소로 회신되도록
      subject,
      text,
      html,
    })

    return res.status(200).json({ ok: true, message: "문의가 성공적으로 전송되었습니다." })
  } catch (error: any) {
    console.error("📮 메일 전송 오류:", {
      code: error?.code,
      command: error?.command,
      response: error?.response,
      message: error?.message,
    })
    return res.status(500).json({ ok: false, message: "서버 오류로 문의를 전송할 수 없습니다." })
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
