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
const GITHUB_ID = process.env.GITHUB_CLIENT_ID || process.env.GITHUB_ID
const GITHUB_SECRET = process.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_SECRET

// Email (필수) — 표준 + 레거시 키 모두 허용
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

// ✅ (선택) 프로덕션 런타임 가드 — 필수 SMTP 값이 없으면 즉시 실패
if (process.env.NODE_ENV === "production") {
  const missing: string[] = []
  if (!EMAIL_HOST) missing.push("EMAIL_SERVER_HOST")
  if (!process.env.EMAIL_SERVER_PORT) missing.push("EMAIL_SERVER_PORT")
  if (typeof process.env.EMAIL_SERVER_SECURE === "undefined") missing.push("EMAIL_SERVER_SECURE")
  if (!EMAIL_USER) missing.push("EMAIL_SERVER_AUTH_USER|EMAIL_SERVER_USER")
  if (!EMAIL_PASS) missing.push("EMAIL_SERVER_AUTH_PASSWORD|EMAIL_SERVER_PASS")
  if (!EMAIL_FROM) missing.push("EMAIL_FROM")
  if (missing.length) {
    throw new Error(`[NextAuth][Email] Missing SMTP env(s): ${missing.join(", ")}`)
  }
}

// ---------- 간단 레이트리밋 ----------
const EMAIL_RATE_LIMIT_MS = Number(process.env.EMAIL_RATE_LIMIT_MS || "30000")
const lastEmailSentAt = new Map<string, number>()

function remainingCooldown(email: string): number {
  const key = (email || "").toLowerCase().trim()
  const now = Date.now()
  const last = lastEmailSentAt.get(key) ?? 0
  const diff = now - last
  return diff < EMAIL_RATE_LIMIT_MS ? EMAIL_RATE_LIMIT_MS - diff : 0
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // ───────── Email (Magic link) ─────────
    EmailProvider({
      maxAge: 10 * 60, // 10분
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
            code: e?.code, command: e?.command, response: e?.response, message: e?.message,
            host: EMAIL_HOST, port: EMAIL_PORT, secure: EMAIL_SECURE, from: EMAIL_FROM, userSet: !!EMAIL_USER,
          })
          throw e
        })

        // 2) 메일 발송
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
            code: e?.code, command: e?.command, response: e?.response, message: e?.message,
          })
          throw e
        }
      },
    }),

    // ───────── GitHub OAuth ─────────
    GithubProvider({
      clientId: GITHUB_ID!,
      clientSecret: GITHUB_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
    newUser: "/auth/signup",
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  // ✅ redirect만 제외하고 callbacks는 유지해야 합니다.
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        ;(token as any).userId = (user as any).id
        ;(token as any).plan = (user as any).plan ?? DEFAULT_PLAN
        ;(token as any).marketingConsent = (user as any).marketingConsent ?? false
        ;(token as any).termsAcceptedAt = (user as any).termsAcceptedAt ?? null
      }
      if (trigger === "update" && (session as any)?.user) {
        const u = (session as any).user
        ;(token as any).plan = u.plan ?? (token as any).plan
        ;(token as any).marketingConsent = u.marketingConsent ?? (token as any).marketingConsent
        ;(token as any).termsAcceptedAt = u.termsAcceptedAt ?? (token as any).termsAcceptedAt
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = (token as any).userId as string
        ;(session.user as any).plan = ((token as any).plan as string) ?? DEFAULT_PLAN
        ;(session.user as any).marketingConsent = Boolean((token as any).marketingConsent)
        ;(session.user as any).termsAcceptedAt = (token as any).termsAcceptedAt
          ? new Date((token as any).termsAcceptedAt as any)
          : null
      }
      return session
    },
  },

  events: {
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: (user as any).id },
        data: { plan: DEFAULT_PLAN },
      })
    },
  },
}

export default NextAuth(authOptions)
