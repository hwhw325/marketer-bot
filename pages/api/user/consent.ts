// pages/api/user/consent.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import prisma from "../../../lib/prisma"

type Body = {
  // 필수 동의
  accepted?: boolean // 약관/개인정보 동의 묶음 (필수)
  ageConfirmed?: boolean // 만 14세 이상 확인 (필수)
  // 선택 동의
  marketingConsent?: boolean
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH")
    return res.status(405).json({ ok: false, message: "허용되지 않은 메서드입니다." })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) {
    return res.status(401).json({ ok: false, message: "로그인이 필요합니다." })
  }

  try {
    const { accepted, ageConfirmed, marketingConsent } = (req.body ?? {}) as Body

    // ── 필수 동의 검사 ───────────────────────────────────────────
    if (accepted !== true) {
      return res.status(400).json({ ok: false, message: "약관/개인정보 필수 동의가 필요합니다." })
    }
    if (ageConfirmed !== true) {
      return res.status(400).json({ ok: false, message: "만 14세 이상만 가입할 수 있습니다." })
    }

    // ── 저장 데이터 구성 ─────────────────────────────────────────
    const data: Record<string, any> = {
      termsAcceptedAt: new Date(),
      ageConfirmed: true,
    }
    if (typeof marketingConsent === "boolean") {
      data.marketingConsent = marketingConsent
    }

    await prisma.user.update({
      where: { id: session.user.id as string },
      data,
    })

    // 클라이언트에서 next-auth의 session.update()로 JWT 즉시 갱신하게 설계
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error("consent API error:", e)
    return res.status(500).json({ ok: false, message: "동의 저장 중 오류가 발생했습니다." })
  }
}
