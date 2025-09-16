// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

// env 토글
const isDev = process.env.NODE_ENV !== "production"
const logLevels = isDev
  ? (process.env.PRISMA_LOG_QUERIES === "true"
      ? (["query", "warn", "error"] as const)
      : (["warn", "error"] as const))
  : (["error"] as const)

// 개발시 HMR 중복 인스턴스 방지 (전역 캐시)
const g = globalThis as unknown as {
  __prisma?: PrismaClient
  __prismaLogged?: boolean
}

export const prisma =
  g.__prisma ??
  new PrismaClient({
    // v6에서도 안전: 문자열 리터럴 배열만 사용 (타입 import 불필요)
    log: [...logLevels],
  })

// 개발환경에서만 전역에 고정 + 민감정보 없이 DB 설정 로그
if (isDev) {
  g.__prisma = prisma
  if (!g.__prismaLogged) {
    const url = process.env.DATABASE_URL || ""
    if (url.startsWith("file:")) {
      console.log("[Prisma] Using SQLite:", url) // dev 경로 확인용
    } else if (url) {
      console.log("[Prisma] DATABASE_URL detected (hidden).")
    } else {
      console.warn("[Prisma] DATABASE_URL is empty!")
    }
    g.__prismaLogged = true
  }
}

export default prisma
