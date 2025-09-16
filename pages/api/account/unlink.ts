// pages/api/account/unlink.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import prisma from "../../../lib/prisma"

const BLOCKED = new Set(["email"]) // 안전차단: email은 Account에 없지만 혹시 몰라서

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) return res.status(401).json({ ok: false })

  const { provider } = req.body as { provider?: string }
  if (!provider || BLOCKED.has(provider)) {
    return res.status(400).json({ ok: false, message: "잘못된 provider 입니다." })
  }

  // 안전장치: 다른 로그인 수단이 전혀 없으면 해제 막기
  const [user, accounts] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true } }),
    prisma.account.findMany({ where: { userId: session.user.id } }),
  ])

  const remaining = accounts.filter(a => a.provider !== provider)
  const isLast = remaining.length === 0 && !user?.email // 이메일 로그인조차 없으면 마지막 수단
  if (isLast) {
    return res.status(400).json({ ok: false, message: "연결을 해제할 수 없어요. 다른 로그인 방법이 없습니다." })
  }

  await prisma.account.deleteMany({ where: { userId: session.user.id, provider } })
  return res.json({ ok: true })
}
