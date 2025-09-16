// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"

// ✅ next-auth의 타입 보강
declare module "next-auth" {
  // DB(User)에서 추가로 다루는 필드
  interface User {
    id: string
    plan?: string
    marketingConsent?: boolean
    termsAcceptedAt?: Date | null
    createdAt?: Date
  }

  // 세션에 내려줄 사용자 필드 (클라이언트에서 사용)
  interface Session {
    user: {
      id: string
      plan: string
      marketingConsent: boolean
      termsAcceptedAt: Date | null
      createdAt?: Date | string
    } & DefaultSession["user"]
  }
}

// ✅ jwt 콜백에서 사용할 커스텀 토큰 필드
declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    plan?: string
    marketingConsent?: boolean
    // 날짜는 토큰 내부에서 보통 string으로 직렬화되므로 string|null 로 둡니다.
    termsAcceptedAt?: string | null
  }
}
