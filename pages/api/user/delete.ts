// pages/api/user/delete.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import prisma from "../../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    // 허용 메서드 명시
    res.setHeader("Allow", "DELETE")
    return res.status(405).json({ ok: false, message: "Method Not Allowed" })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user) {
    return res.status(401).json({ ok: false, message: "Unauthorized" })
  }

  // next-auth 콜백에서 session.user.id 를 넣어두었으니 우선 사용
  let targetUserId = (session.user as any).id as string | undefined
  const userEmail = session.user.email ?? undefined

  try {
    // userId가 없다면 email로 조회(안전장치)
    if (!targetUserId && userEmail) {
      const u = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
      })
      targetUserId = u?.id
    }

    if (!targetUserId) {
      return res.status(400).json({ ok: false, message: "User id not found in session" })
    }

    await prisma.$transaction(async (tx) => {
      // 1) 연결된 계정/세션 정리
      await tx.account.deleteMany({ where: { userId: targetUserId } })
      await tx.session.deleteMany({ where: { userId: targetUserId } })
      // VerificationToken 은 이메일 기준이라, 있으면 정리(없어도 OK)
      if (userEmail) {
        // 표준 next-auth 스키마: identifier = 이메일
        try {
          await (tx as any).verificationToken?.deleteMany?.({ where: { identifier: userEmail } })
        } catch {
          /* 프로젝트에 VerificationToken 테이블이 없을 수도 있으니 무시 */
        }
      }

      // (옵션) 프로젝트 사용자 데이터가 더 있다면 여기서 함께 정리:
      // await tx.entry.deleteMany({ where: { userId: targetUserId } })  // 예시
      // await tx.history.deleteMany({ where: { userId: targetUserId } }) // 예시

      // 2) 최종적으로 사용자 삭제
      await tx.user.delete({ where: { id: targetUserId } })
    })

    // 성공
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error("❌ delete user failed:", err)
    return res.status(500).json({ ok: false, message: "Failed to delete user" })
  }
}
