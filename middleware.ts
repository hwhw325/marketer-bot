// middleware.ts
// ------------------------------------------------------------------
// ✅ 목적
// - 정적/내부/NextAuth 콜백은 항상 통과 (루프 방지)
// - 공개 페이지는 통과
// - 로그인이 필요한 "보호 경로"만 엄격 가드
// - 약관 동의(termsAcceptedAt) 미완료 시 온보딩으로 유도(옵션)
// - 하드코딩 금지: 비밀/도메인은 .env에서만
// ------------------------------------------------------------------

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// 🚧 로그인 필수인 경로 prefix만 나열 (필요 시 추가/삭제)
const PROTECTED_PREFIXES = ["/mypage", "/saved", "/settings", "/checkout"]

// 🌐 공개 경로(정확히 일치)
const PUBLIC_EXACT = new Set<string>([
  "/",
  "/pricing",
  "/terms",
  "/privacy",
  "/guide",
  "/feedback",
  "/login",
  "/auth/signin",
  "/auth/signup",
  "/auth/verify-request",
  "/auth/error",
])

// 🔓 정적/내부/SEO 리소스는 항상 통과
function isAlwaysAllowed(pathname: string) {
  return (
    pathname.startsWith("/_next") ||      // Next.js 내부 자원
    pathname.startsWith("/images") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname === "/favicon.svg" ||
    pathname === "/og.png" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/sitemap-") ||   // e.g. /sitemap-0.xml
    // 확장자 기반 정적 파일(안전망)
    /\.(png|jpg|jpeg|svg|gif|ico|css|js|map|txt|xml)$/.test(pathname)
  )
}

// 🌿 공개 경로 판별(일치 + 일부 하위 경로 허용)
function isPublicPath(pathname: string) {
  if (PUBLIC_EXACT.has(pathname)) return true
  // 필요 시 섹션 전체 공개
  if (
    pathname.startsWith("/guide/") ||
    pathname.startsWith("/auth/")   // 로그인/회원가입/검증 등
  ) {
    return true
  }
  return false
}

// (선택) 프로덕션에서만 도메인 정규화: .env에 CANONICAL_HOST 넣으면 사용
// 예) CANONICAL_HOST=copyquick.co.kr
function needsCanonicalRedirect(req: NextRequest) {
  if (process.env.NODE_ENV !== "production") return false
  const canonical = process.env.CANONICAL_HOST
  if (!canonical) return false
  const host = req.headers.get("host")
  return !!host && host !== canonical
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // A) 내부/정적/SEO 파일은 항상 통과
  if (isAlwaysAllowed(pathname)) return NextResponse.next()

  // B) NextAuth 콜백/엔드포인트는 무조건 통과 (막으면 로그인 자체가 막힘)
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/auth/")) {
    return NextResponse.next()
  }

  // C) (선택) 프로덕션 정규 도메인 강제
  if (needsCanonicalRedirect(req)) {
    const url = req.nextUrl.clone()
    url.host = process.env.CANONICAL_HOST as string
    url.protocol = "https"
    return NextResponse.redirect(url, 308)
  }

  // D) 공개 경로는 통과
  if (isPublicPath(pathname)) return NextResponse.next()

  // E) 보호 대상 여부 판단: 지정한 prefix만 가드
  const needsAuth = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  )
  if (!needsAuth) return NextResponse.next()

  // F) 로그인 토큰 확인
  // ❗ NEXTAUTH_SECRET 값은 .env(Vercel Env)에만! (하드코딩 금지)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = "/auth/signin"
    url.searchParams.set("callbackUrl", pathname + search) // 원래 목적지 보존
    return NextResponse.redirect(url)
  }

  // G) (옵션) 최초 약관 동의 요구: JWT에 termsAcceptedAt을 넣어둔 경우만 사용
  const lacksTerms = !(token as any).termsAcceptedAt
  const lacksAge = !(token as any).ageConfirmed
  if ((lacksTerms || lacksAge) && !pathname.startsWith("/auth/signup")) {
   const url = req.nextUrl.clone()
   url.pathname = "/auth/signup"
   url.searchParams.set("callbackUrl", pathname + search)
   return NextResponse.redirect(url)
}

  // H) 통과
  return NextResponse.next()
}

// 🧩 매처: API/정적/파비콘/사이트맵 등은 아예 매칭 제외해서 이중 안전
export const config = {
  matcher: [
    // 모든 경로를 대상으로 하되, 아래 리소스는 제외 (negative lookahead)
    "/((?!_next|api|auth/.*|images|assets|static|.*\\.(?:png|jpg|jpeg|svg|gif|ico|css|js|map|txt|xml)$|favicon\\.ico|robots\\.txt|sitemap\\.xml|sitemap-.*\\.xml|og\\.png).*)",
  ],
}
