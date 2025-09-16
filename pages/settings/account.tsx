// pages/settings/account.tsx
import { useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import Head from "next/head"

type Status = { ok: boolean; providers?: string[] }

export default function AccountSettings() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState<{ github: boolean }>({ github: false })

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/account/status")
        const json: Status = await res.json()
        if (alive && json.ok) {
          setConnected({ github: json.providers!.includes("github") })
        }
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  if (status === "loading") return null

  return (
    <>
      <Head><title>계정 연결 | CopyQuick</title></Head>

      <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px",
        fontFamily: `"Pretendard", system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, sans-serif` }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>계정 연결</h1>
        <p style={{ color: "#475569", marginBottom: 24 }}>
          현재 로그인: <b>{session?.user?.email ?? "알 수 없음"}</b>
        </p>

        {/* GitHub */}
        <section style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700 }}>GitHub</div>
              <div style={{ fontSize: ".9rem", color: "#64748b" }}>
                {connected.github ? "연결됨" : "연결되지 않음"}
              </div>
            </div>

            {connected.github ? (
              <button
                onClick={async () => {
                  setLoading(true)
                  const res = await fetch("/api/account/unlink", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ provider: "github" }),
                  })
                  setLoading(false)
                  if (res.ok) {
                    setConnected(c => ({ ...c, github: false }))
                  } else {
                    const j = await res.json().catch(() => null)
                    alert(j?.message ?? "연결 해제에 실패했습니다.")
                  }
                }}
                disabled={loading}
                style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer" }}
              >
                연결 해제
              </button>
            ) : (
              <button
                onClick={() => signIn("github", { callbackUrl: "/settings/account?linked=1" })}
                disabled={loading}
                style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: "#111827", color: "#fff", cursor: "pointer" }}
              >
                GitHub 연결
              </button>
            )}
          </div>
        </section>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <Link href="/dashboard" style={{ textDecoration: "underline" }}>대시보드로</Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{ marginLeft: "auto", padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 10, background: "#fff", cursor: "pointer" }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </>
  )
}
