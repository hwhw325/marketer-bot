// pages/api/auth/[...nextauth].ts
import NextAuth, { type NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prisma"
import nodemailer from "nodemailer"

// ---------- 안전한 Base URL 유틸 ----------
function getBaseUrl() {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  const port = process.env.PORT ?? "3000"
  return `http://localhost:${port}`
}

// ---------- ENV ----------
const DEFAULT_PLAN = process.env.DEFAULT_PLAN || "free"
const BRAND = process.env.APP_BRAND_NAME ?? "CopyQuick"

// GitHub (양쪽 키명 호환)
const GITHUB_ID = process.env.GITHUB_CLIENT_ID || process.env.GITHUB_ID || ""
const GITHUB_SECRET =
  process.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_SECRET || ""

// 프리뷰에서 GitHub 허용 플래그 (기본 false)
const ALLOW_GITHUB_ON_PREVIEW = /^true|1|yes$/i.test(
  process.env.GITHUB_ALLOW_PREVIEW ?? ""
)

// Email (표준 + 레거시 키 허용)
const EMAIL_HOST = process.env.EMAIL_SERVER_HOST
const EMAIL_PORT = Number(process.env.EMAIL_SERVER_PORT || "465")
const EMAIL_SECURE =
  typeof process.env.EMAIL_SERVER_SECURE === "string"
    ? /^true|1|yes$/i.test(process.env.EMAIL_SERVER_SECURE)
    : true
const EMAIL_USER =
  process.env.EMAIL_SERVER_AUTH_USER || process.env.EMAIL_SERVER_USER
const EMAIL_PASS =
  process.env.EMAIL_SERVER_AUTH_PASSWORD || process.env.EMAIL_SERVER_PASS
const EMAIL_FROM = process.env.EMAIL_FROM

// ---------- 런타임 가드(운영만 강제) ----------
const VERCEL_ENV = process.env.VERCEL_ENV // 'production' | 'preview' | 'development' | undefined
const ENFORCE_SMTP = VERCEL_ENV === "production"
if (ENFORCE_SMTP) {
  const missing: string[] = []
  if (!EMAIL_HOST) missing.push("EMAIL_SERVER_HOST")
  if (!process.env.EMAIL_SERVER_PORT) missing.push("EMAIL_SERVER_PORT")
  if (typeof process.env.EMAIL_SERVER_SECURE === "undefined")
    missing.push("EMAIL_SERVER_SECURE")
  if (!EMAIL_USER) missing.push("EMAIL_SERVER_AUTH_USER|EMAIL_SERVER_USER")
  if (!EMAIL_PASS) missing.push("EMAIL_SERVER_AUTH_PASSWORD|EMAIL_SERVER_PASS")
  if (!EMAIL_FROM) missing.push("EMAIL_FROM")
  if (missing.length) {
    throw new Error(
      `[NextAuth][Email] Missing SMTP env(s): ${missing.join(", ")}`
    )
  }
} else {
  if (
    !EMAIL_HOST ||
    !process.env.EMAIL_SERVER_PORT ||
    typeof process.env.EMAIL_SERVER_SECURE === "undefined" ||
    !EMAIL_USER ||
    !EMAIL_PASS ||
    !EMAIL_FROM
  ) {
    console.warn(
      "[NextAuth][Email] SMTP envs incomplete in non-production; Email provider will be omitted."
    )
  }
}

// ---------- 프로바이더 조건부 등록 ----------
function hasEmailEnv() {
  return Boolean(
    EMAIL_HOST &&
      process.env.EMAIL_SERVER_PORT &&
      typeof process.env.EMAIL_SERVER_SECURE !== "undefined" &&
      EMAIL_USER &&
      EMAIL_PASS &&
      EMAIL_FROM
  )
}
function hasGithubEnv() {
  return Boolean(GITHUB_ID && GITHUB_SECRET)
}
function githubAllowedHere() {
  // Preview에서는 플래그가 true여야 노출, 그 외 환경은 env만 있으면 노출
  return hasGithubEnv() && (VERCEL_ENV !== "preview" || ALLOW_GITHUB_ON_PREVIEW)
}

// ---------- 레이트리밋(이메일) ----------
const EMAIL_RATE_LIMIT_MS = Number(process.env.EMAIL_RATE_LIMIT_MS || "30000")
const lastEmailSentAt = new Map<string, number>()
function remainingCooldown(email: string): number {
  const key = (email || "").toLowerCase().trim()
  const now = Date.now()
  const last = lastEmailSentAt.get(key) ?? 0
  const diff = now - last
  return diff < EMAIL_RATE_LIMIT_MS ? EMAIL_RATE_LIMIT_MS - diff : 0
}

// ---------- 프로바이더 배열을 "동적 구성" ----------
const providersList: any[] = []

// Email Provider (값이 모두 있을 때만 등록)
if (hasEmailEnv()) {
  providersList.push(
    EmailProvider({
      maxAge: 10 * 60,
      server: {
        host: EMAIL_HOST!,
        port: EMAIL_PORT,
        secure: EMAIL_SECURE,
        auth: { user: EMAIL_USER!, pass: EMAIL_PASS! },
      },
      from: EMAIL_FROM!,
      async sendVerificationRequest({ identifier, url, provider }) {
        const email = (identifier || "").toLowerCase().trim()
        const { host } = new URL(url)
        const transport = nodemailer.createTransport(provider.server as any)

        // 0) 레이트리밋
        const rest = remainingCooldown(email)
        if (rest > 0) {
          const err = new Error("RateLimited")
          ;(err as any).name = "RateLimited"
          ;(err as any).remainingMs = rest
          throw err
        }

        // 1) SMTP 연결 사전 검증
        await transport.verify().catch((e: any) => {
          console.error("🔌 [NextAuth][Email] SMTP verify 실패:", {
            code: e?.code,
            command: e?.command,
            response: e?.response,
            message: e?.message,
            host: EMAIL_HOST,
            port: EMAIL_PORT,
            secure: EMAIL_SECURE,
            from: EMAIL_FROM,
            userSet: !!EMAIL_USER,
          })
          throw e
        })

        // 2) 발송
        try {
          const baseUrl = getBaseUrl()
          const logoUrl = new URL("/logo-light.png", baseUrl).toString()
          const info = await transport.sendMail({
            to: email,
            from: provider.from as string,
            subject: `🔑 ${BRAND} 로그인 링크 (${host})`,
            html: `
              <div style="max-width:420px;margin:auto;padding:1.25rem;
                          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans',sans-serif;color:#111;">
                <a href="${baseUrl}" style="display:inline-block;margin-bottom:1rem;">
                  <img src="${logoUrl}" alt="${BRAND}" width="120" style="vertical-align:middle;" />
                </a>
                <h2 style="margin:0 0 .5rem;">로그인 확인</h2>
                <p style="margin:.25rem 0 1rem;color:#4b5563;">
                  아래 버튼을 눌러 안전하게 로그인하세요. (링크는 10분 뒤 만료)
                </p>
                <a href="${url}"
                   style="display:inline-block;padding:.75rem 1.25rem;background:#2563eb;color:#fff;
                          border-radius:8px;text-decoration:none;font-weight:600">
                  로그인하기
                </a>
                <p style="margin-top:1rem;font-size:.9rem;color:#6b7280;">
                  이 메일을 요청하지 않으셨다면 무시하셔도 됩니다.<br/>
                  발신: ${BRAND} • ${host}
                </p>
              </div>
            `,
            text: `아래 링크를 눌러 로그인하세요.\n\n${url}\n\n링크는 10분 뒤 만료됩니다.\n요청하지 않으셨다면 이 메일을 무시하셔도 됩니다.`,
          })
          const rejectedCount = (info as any)?.rejected?.length ?? 0
          if (rejectedCount > 0) throw new Error("EmailDeliveryFailed")
          lastEmailSentAt.set(email, Date.now())
        } catch (e: any) {
          console.error("📧 [NextAuth][Email] sendMail 실패:", {
            code: e?.code,
            command: e?.command,
            response: e?.response,
            message: e?.message,
          })
          throw e
        }
      },
    })
  )
} else {
  console.warn(
    "[NextAuth] Email provider omitted (incomplete SMTP envs in non-production)."
  )
}

// GitHub Provider (프리뷰 기본 비활성, 허용 플래그 있으면 활성)
if (githubAllowedHere()) {
  providersList.push(
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    })
  )
} else {
  // 진단 로그(민감값 노출 없이 존재 여부만)
  if (VERCEL_ENV === "preview") {
    console.log(
      "[NextAuth] GitHub provider omitted in Preview.",
      "hasEnv:",
      hasGithubEnv(),
      "allowFlag:",
      ALLOW_GITHUB_ON_PREVIEW
    )
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: providersList,

  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
    newUser: "/auth/signup",
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        ;(token as any).userId = (user as any).id
        ;(token as any).plan = (user as any).plan ?? DEFAULT_PLAN
        ;(token as any).marketingConsent =
          (user as any).marketingConsent ?? false
        ;(token as any).termsAcceptedAt =
          (user as any).termsAcceptedAt ?? null
        ;(token as any).ageConfirmed = (user as any).ageConfirmed ?? false
      }
      if (trigger === "update" && (session as any)?.user) {
        const u = (session as any).user
        ;(token as any).plan = u.plan ?? (token as any).plan
        ;(token as any).marketingConsent =
          u.marketingConsent ?? (token as any).marketingConsent
        ;(token as any).termsAcceptedAt =
          u.termsAcceptedAt ?? (token as any).termsAcceptedAt
        ;(token as any).ageConfirmed = u.ageConfirmed ?? (token as any).ageConfirmed
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = (token as any).userId as string
        ;(session.user as any).plan =
          ((token as any).plan as string) ?? DEFAULT_PLAN
        ;(session.user as any).marketingConsent = Boolean(
          (token as any).marketingConsent
        )
        ;(session.user as any).termsAcceptedAt = (token as any).termsAcceptedAt
          ? new Date((token as any).termsAcceptedAt as any)
          : null
        ;(session.user as any).ageConfirmed = Boolean((token as any).ageConfirmed)
      }
      return session
    },
  },

  events: {
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: (user as any).id },
        data: { plan: DEFAULT_PLAN, ageConfirmed: false, marketingConsent: false, termsAcceptedAt: null },
      })
    },
  },
}

export default NextAuth(authOptions)
