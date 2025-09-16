// pages/api/user/marketing.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import prisma from "../../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ ok: false, message: "Method Not Allowed" })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) {
    return res.status(401).json({ ok: false, message: "Unauthorized" })
  }

  try {
    const { marketingConsent } = (req.body ?? {}) as { marketingConsent?: boolean }

    if (typeof marketingConsent !== "boolean") {
      return res.status(400).json({
        ok: false,
        message: "marketingConsent(boolean) is required",
      })
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      // @updatedAt가 스키마에 설정돼 있다면 updatedAt은 자동 갱신됩니다.
      data: { marketingConsent },
      select: { id: true, email: true, marketingConsent: true, updatedAt: true },
    })

    return res.status(200).json({ ok: true, user })
  } catch (e) {
    console.error("PATCH /api/user/marketing error:", e)
    return res.status(500).json({ ok: false, message: "Failed to update marketing consent" })
  }
}
