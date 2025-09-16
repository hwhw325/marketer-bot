// components/BelowFold.tsx
import { motion, type Variants, type Transition, type Target } from "framer-motion"
import { useRouter } from "next/router"

const ROUTES = {
  home: "/",
  pricing: "/pricing",
  signin: "/auth/signin",
} as const


// 아주 은은한 페이드업(variants) + 카드 살짝 상승 + 스프링 트랜지션
const fv: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

const hoverRaise: Target = { y: -4 }

// NOTE: 타입 지정이 핵심! (ts2322 제거)
const softSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 28,
  mass: 0.6,
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useSession, signIn } from "next-auth/react"

declare global { interface Window { gtag?: any; umami?: any } }
// ── 가벼운 트래킹 헬퍼 (GA/Umami 있으면 자동 호출)
function track(event: string, props: Record<string, any> = {}) {
  if (typeof window === "undefined") return
  if (window.gtag)  window.gtag("event", event, props)
  if (window.umami) window.umami.track(event, props)
}

type PublicMetrics = {
  avgMs: number
  todayGen: number
  saves: number
  updatedAt: string
}

const nf = typeof window !== "undefined" ? new Intl.NumberFormat() : { format: (n: number) => String(n) }

// 퍼블릭 메트릭스 로드 훅
function usePublicMetrics() {
  const [data, setData] = useState<PublicMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const r = await fetch("/api/metrics")
        if (!r.ok) throw new Error(String(r.status))
        const json = (await r.json()) as PublicMetrics
        if (alive) setData(json)
      } catch {/* noop */}
      finally { if (alive) setLoading(false) }
    })()
    return () => { alive = false }
  }, [])
  return { data, loading }
}

// 1) 숫자 3칸 신뢰바 (실시간 API 연동 + 뷰 트래킹)
export function SocialProofStrip() {
  const { data: m, loading } = usePublicMetrics()
  useEffect(() => { track("view_belowfold_socialproof") }, [])

  const items = [
    { k: "gen",   label: "오늘 생성",  value: m ? `${nf.format(m.todayGen)}+` : "12,482+" },
    { k: "save",  label: "저장된 문구", value: m ? `${nf.format(m.saves)}+`    : "24,010+" },
    { k: "speed", label: "평균 응답",  value: m ? `${Math.round(m.avgMs/100)/10}s` : "⩽ 3초" },
  ]

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pt-8 pb-6" aria-label="사회적 증거">
      <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
        {items.map((s) => (
          <div key={s.k} className="rounded-2xl bg-white/70 px-5 py-5 shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10">
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{loading ? "—" : s.value}</div>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{s.label}</div>
          </div>
        ))}
      </div>
      {!loading && m?.updatedAt && (
        <div className="mt-2 text-center text-[11px] text-gray-500 dark:text-gray-400">
          업데이트: {new Date(m.updatedAt).toLocaleTimeString()}
        </div>
      )}
    </section>
  )
}

// 2) 3단계 사용 장면
export function HowItWorks() {
  useEffect(() => { track("view_belowfold_howitworks") }, [])

  const steps = [
    { emoji: "📝", title: "키워드 입력", desc: "상품/이벤트 핵심만 적어주세요." },
    { emoji: "🎛️", title: "옵션 선택", desc: "말투·감정·타깃·목적을 고르면" },
    { emoji: "⚡", title: "3초 생성", desc: "가장 어울리는 문구 3개 제안!" },
  ]

  return (
    <motion.section
      className="mx-auto w-full max-w-6xl px-5 py-12"
      aria-label="작동 방식"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger}
    >
      <motion.h2
        className="text-center text-2xl font-bold text-gray-900 dark:text-white"
        variants={fv}
        transition={softSpring}
      >
        어떻게 작동하나요?
      </motion.h2>

      <motion.p
        className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600 dark:text-gray-300"
        variants={fv}
        transition={softSpring}
      >
        상황에 맞는 옵션만 고르면, 나머지는 CopyQuick이 알아서.
      </motion.p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((it, i) => (
          <motion.div
            key={i}
            variants={fv}
            transition={softSpring}
            whileHover={hoverRaise}
            whileTap={{ y: -1 }}
            className="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur
                       transition-shadow duration-200 hover:shadow-md
                       dark:bg-white/5 dark:ring-white/10"
          >
            <div className="text-3xl">{it.emoji}</div>
            <div className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">{it.title}</div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}


// 3) 10초 선택형 미니 퀴즈 → 1줄 샘플 (CTA 트래킹 포함)
// 가벼운 체험형 + Advanced 토글 버전
// 10초 선택형 미니 샘플 — 프리셋(키워드) + 라이트 3개 + "자세히 설정"(템플릿·연령·성별)
// ✅ 선택된 버튼이 확실히 보이도록 스타일 개선(인디고 필로 채움 + 체크아이콘)
// ✅ "자세히 설정" 토글 복원
export function TemplateQuizLite() {
  useEffect(() => { track("view_belowfold_quiz") }, [])

  // ① 샘플 주제(키워드) 프리셋 — 업종별 "진짜 쓰는" 문구가 바로 나오게
  const presets = [
    { id: "cafe",    label: "카페 · 시그니처 라떼",   keyword: "시그니처 라떼",      hook: "오늘만 2천원 할인",    benefit: "부드러운 우유 거품",      proof: "바리스타 추천" },
    { id: "beauty",  label: "뷰티 · 저자극 수분크림", keyword: "저자극 수분크림",    hook: "민감성 테스트 완료",    benefit: "48시간 촉촉 보습",        proof: "EWG 그린 등급" },
    { id: "fashion", label: "패션 · 여름 린넨 셔츠",  keyword: "여름 린넨 셔츠",     hook: "신상 10% OFF",         benefit: "시원한 통기성",           proof: "100% 프리미엄 린넨" },
    { id: "dessert", label: "디저트 · 딸기 케이크",   keyword: "딸기 생크림 케이크", hook: "주말 한정",             benefit: "당일 구움의 신선함",      proof: "베스트셀러" },
    { id: "ecom",    label: "전자제품 · 무선 이어폰", keyword: "무선 이어폰",        hook: "오늘 밤 무료배송",       benefit: "액티브 노이즈 캔슬링",    proof: "평점 4.8/5" },
  ] as const

  // ② 라이트(기본) 3개 — 가볍게 체험
  const styles    = ["말랑한", "신뢰감", "재치있는", "고급스러운"]
  const emotions  = ["감성적인", "활기찬", "차분한", "발랄한"]
  const purposes  = ["상세페이지", "광고 배너", "SNS 홍보", "슬로건"]

  // ③ 자세히 설정(Advanced) — 접힘 패널
  const templates = ["기본", "AIDA", "BAB", "PAS"]
  const ages      = ["10대", "20대", "30대", "40대", "50대 이상"]
  const genders   = ["모두", "여성", "남성"]

  // 상태
  const [presetId, setPresetId] = useState<(typeof presets)[number]["id"]>("cafe")
  const [style, setStyle]       = useState(styles[0])
  const [emotion, setEmotion]   = useState(emotions[0])
  const [purpose, setPurpose]   = useState(purposes[2]) // SNS 기본
  const [advanced, setAdvanced] = useState(false)
  const [tpl, setTpl]           = useState(templates[0])
  const [age, setAge]           = useState(ages[1])     // 20대
  const [gender, setGender]     = useState(genders[0])  // 모두
  const [variant, setVariant]   = useState(0)           // 🎲 다른표현

  const { data: session } = useSession()
  const router = useRouter()

// 쿼리 객체 생성 (문자열 조립 금지)
const buildQuery = (mode: "start" | "ab") => {
  const q: Record<string, string> = {
    [mode]: "1",
    p: presetId,
    style,
    emotion,
    purpose,
  }
  if (advanced) Object.assign(q, { tpl, age, gender })
  return q
}

// 같은 URL이면 noop, 다르면 shallow push
const goMode = (mode: "start" | "ab") => {
  const query = buildQuery(mode)
  const samePath = router.pathname === ROUTES.home
  const sameQuery =
    samePath &&
    Object.keys(query).length === Object.keys(router.query).length &&
    Object.entries(query).every(([k, v]) => String(router.query[k] ?? "") === v)
  if (sameQuery) return
  router.push({ pathname: ROUTES.home, query }, undefined, { shallow: true })
}

  const authed = !!session

  // ── 문장 생성 로직
  const styleAdj: Record<string, string> = {
    말랑한: "말랑하게", 신뢰감: "신뢰감 있게", 재치있는: "재치 있게", 고급스러운: "고급스럽게",
  }
  const emoLead: Record<string, string> = {
    감성적인: "오늘의 작은 설렘으로", 활기찬: "에너지 가득하게", 차분한: "담백하게 핵심만", 발랄한: "가볍고 경쾌하게",
  }
  function buildPatterns(preset: typeof presets[number]) {
    const { keyword, hook, benefit, proof } = preset
    return {
      "상세페이지": [
        () => `${keyword}, ${emoLead[emotion]} ${styleAdj[style]} 장점만 쏙— ${benefit}. ${proof} · ${hook}`,
        () => `${keyword}의 포인트를 한눈에: ${benefit} · ${proof}. 지금은 ${hook}`,
        () => `${styleAdj[style]} ${keyword} 소개— ${benefit}을(를) 경험해 보세요. (${hook})`,
      ],
      "광고 배너": [
        () => `${keyword} 지금 ${hook} — ${benefit}`,
        () => `${benefit} ${keyword} | ${proof}`,
        () => `${styleAdj[style]} ${keyword} ✨ ${hook}`,
      ],
      "SNS 홍보": [
        () => `${keyword} 좋아하는 사람 손! ${emoLead[emotion]} ${benefit} #${keyword.replace(/\s+/g,"")}`,
        () => `${styleAdj[style]} ${keyword}로 오늘 기분 전환 🙌 ${hook} #${proof.replace(/\s|\./g,"")}`,
        () => `스크롤 멈춰! ${keyword}의 ${benefit} 지금 확인해요 👉 ${hook}`,
      ],
      "슬로건": [
        () => `${keyword}, ${benefit}의 기준`,
        () => `${styleAdj[style]} ${keyword}`,
        () => `${keyword} — ${proof}`,
      ],
    }[purpose]
  }
  const samples = useMemo(() => {
    const preset = presets.find(p => p.id === presetId)!
    const patterns = buildPatterns(preset)
    const a = patterns[(variant)   % patterns.length]()
    const b = patterns[(variant+1) % patterns.length]()
    return [a, b]
  }, [presetId, style, emotion, purpose, variant])

  // ── 버튼 스타일(선택 가시성 업그레이드)
  // 베이스: 얇은 테두리 칩
  const btnBase =
    "rounded-xl px-3 py-2 text-xs ring-1 transition-colors select-none"
  const btnRest =
    "bg-white text-gray-800 ring-black/10 " +
    "dark:bg-white/10 dark:text-gray-200 dark:ring-white/10"
  const btnHover = "hover:bg-white/90 dark:hover:bg-white/20"
  // 선택됨: 인디고 필 + 체크아이콘 + 두꺼운 링
  const btnActive =
    "bg-indigo-600 text-white ring-indigo-600 hover:bg-indigo-600 " +                // 라이트
    "dark:bg-indigo-400 dark:text-gray-900 dark:ring-indigo-300 dark:hover:bg-indigo-400" // 다크

  const Chip = ({
    label, selected, onClick, ariaLabel
  }: { label: string; selected: boolean; onClick:()=>void; ariaLabel?: string }) => (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={ariaLabel || label}
      onClick={onClick}
      className={[
        btnBase,
        selected ? btnActive : `${btnRest} ${btnHover}`,
        "flex items-center justify-center gap-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 " +
        "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
      ].join(" ")}
    >
      {selected && <span className="text-[10px] leading-none">✓</span>}
      {label}
    </button>
  )

  return (
    <section id="sample" className="mx-auto w-full max-w-6xl px-5 py-12" aria-label="10초 선택으로 미리 보는 샘플">
      <div
  className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-black/10 backdrop-blur-sm dark:bg-slate-900/90 dark:ring-white/10"
  style={{ ['--accent' as any]: '#0ea5a4' }}  // 필요시 다른 색으로 바꿔도 됨
>
  <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-black/20 dark:bg-white/30" />

  <div className="rounded-[calc(theme(borderRadius.3xl)-4px)] bg-white/95 p-6 backdrop-blur-sm dark:bg-slate-900/90">
    <span className="absolute left-4 top-4 rounded-full bg-indigo-600/90 px-2 py-0.5 text-[10px] font-semibold text-white">
      체험
    </span>

        <h3 className="text-center text-2xl font-bold text-gray-900 dark:text-white">10초 선택으로 미리 보는 샘플</h3>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          <b>샘플 주제</b>를 고르고, <b>스타일·감정·목적</b>만 톡톡— 실제 니즈에 맞춘 2줄 샘플이 바로 보여요.
          <b> 사용은 로그인/가입 후</b> 가능합니다.
        </p>

        {/* (A) 샘플 주제 */}
        <div className="mt-6 rounded-2xl bg-white/80 p-4 ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300" htmlFor="preset">🔎 샘플 키워드 예시</label>
          <select
            id="preset"
            className="mt-2 w-full rounded-xl border border-black/10 bg-white/90 p-2 text-sm dark:border-white/10 dark:bg-white/10 dark:text-gray-100"
            value={presetId}
            onChange={(e) => { setPresetId(e.target.value as any); setVariant(0); track("quiz_pick_preset",{ id: e.target.value }) }}
          >
            {presets.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>

        {/* (B) 라이트 3개 */}
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-300">💎 브랜드 스타일</div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {styles.map(v => (
                <Chip key={v} label={v} selected={style===v} onClick={()=>{ setStyle(v); setVariant(0); track("quiz_pick_style",{v}) }} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-300">🎭 감정 느낌</div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {emotions.map(v => (
                <Chip key={v} label={v} selected={emotion===v} onClick={()=>{ setEmotion(v); setVariant(0); track("quiz_pick_emotion",{v}) }} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-300">📝 문구 목적</div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {purposes.map(v => (
                <Chip key={v} label={v} selected={purpose===v} onClick={()=>{ setPurpose(v); setVariant(0); track("quiz_pick_purpose",{v}) }} />
              ))}
            </div>
          </div>
        </div>

        {/* (C) 자세히 설정 토글 + 패널 (템플릿·연령·성별) */}
        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={() => { setAdvanced(x=>{ const nx=!x; track("quiz_toggle_advanced",{open:nx}); return nx }) }}
            aria-expanded={advanced}
            className="text-xs text-gray-700 underline-offset-2 hover:underline dark:text-gray-300"
            type="button"
          >
            {advanced ? "간단히 보기" : "자세히 설정 (템플릿·연령·성별)"}
          </button>
        </div>

        {advanced && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-300">📄 템플릿</div>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {templates.map(v => (
                  <Chip key={v} label={v} selected={tpl===v} onClick={()=>{ setTpl(v); setVariant(0); track("quiz_pick_template",{v}) }} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-300">🎯 타깃 연령대</div>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {ages.map(v => (
                  <Chip key={v} label={v} selected={age===v} onClick={()=>{ setAge(v); setVariant(0); track("quiz_pick_age",{v}) }} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-300">🚻 성별</div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {genders.map(v => (
                  <Chip key={v} label={v} selected={gender===v} onClick={()=>{ setGender(v); setVariant(0); track("quiz_pick_gender",{v}) }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* (D) 결과 + CTA + 🎲 리믹스 */}
        <div className="mt-6 rounded-2xl bg-white/80 p-4 ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-300">샘플 미리보기</div>
            <button
              className="text-xs text-gray-700 underline-offset-2 hover:underline dark:text-gray-300"
              onClick={() => { setVariant(v => (v+1)%3); track("quiz_remix") }}
              aria-label="다른 표현 보기"
              type="button"
            >
              🎲 다른 표현 보기
            </button>
          </div>

          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-gray-900 dark:text-gray-100">
            {samples.map((s, i) => (<li key={i}>• {s}</li>))}
          </ul>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              샘플은 미리보기용입니다. <b>로그인 후</b> 전체 결과·저장·다운로드 사용 가능.
            </div>
            <div className="flex gap-2">
              <button
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white
           dark:bg-indigo-400 dark:text-gray-900 dark:hover:bg-indigo-300"

                onClick={() => {
                  const preset = presets.find(p => p.id === presetId)!
                  track("cta_quiz_generate", {
                    preset: preset.id, style, emotion, purpose,
                    ...(advanced && { tpl, age, gender })
                  })
                  if (!authed) return signIn()
                  goMode("start")          // ✅ 객체 라우팅 + 동일 URL 가드
                }}

              >
                ✨ 로그인하고 생성하기
              </button>
              <button
                className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black
           dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"

                onClick={() => {
                  const preset = presets.find(p => p.id === presetId)!
                  track("cta_quiz_ab", {
                    preset: preset.id, style, emotion, purpose,
                    ...(advanced && { tpl, age, gender })
                  })
                  if (!authed) return signIn()
                  goMode("ab")             // ✅ 객체 라우팅 + 동일 URL 가드
                }}

              >
                ✍️ A/B 추천 미리보기
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}



// 4) 기능 4칸
export function FeatureGrid() {
  useEffect(() => { track("view_belowfold_features") }, [])
  const feats = [
    { h: "A/B 추천 문구", p: "두 스타일을 비교해 우승 문구를 고르세요. 저장/다운로드까지 지원.", badge: "신규" },
    { h: "템플릿 (AIDA/BAB 등)", p: "구조에 맞춰 자동 추천. 초보도 고수처럼 써집니다.", badge: "인기" },
    { h: "태그 필터 & 자동완성", p: "저장 문구를 태그로 정리하고, 나중에 빠르게 찾기.", badge: "UX" },
    { h: "다운로드 (Pro)", p: "팀과 공유하거나 보관용으로 저장하세요.", badge: "Pro" },
  ]
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12" aria-label="핵심 기능">
      <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">실전 기능으로 바로 써먹기</h2>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {feats.map((f, i) => (
          <motion.div
            key={i}
            className="relative overflow-hidden rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10"
            variants={fv}
            transition={softSpring}
            whileHover={hoverRaise}
            whileTap={{ y: -1 }}
          >
            <span className="absolute right-3 top-3 select-none rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white dark:bg-white dark:text-gray-900">{f.badge}</span>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{f.h}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{f.p}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// 5) 가격 스냅샷 (Free/Pro) — CTA 트래킹 포함
export function PricingSnapshot() {
  useEffect(() => { track("view_belowfold_pricing_snapshot") }, [])
  const { data: session } = useSession()
  const authed = !!session
  const tiers = [
    {
      name: "Free",
      price: "₩0",
      perks: ["문구 생성 체험", "기본 템플릿", "A/B 미리보기"],
      cta: { href: "/auth/signin", label: authed ? "바로 사용" : "로그인하고 시작" },
      sub: "사용을 위해 로그인/가입이 필요합니다",
      highlight: false,
    },
    {
      name: "Basic",
      price: "₩5,900/월",
      perks: ["생성 횟수 확장", "템플릿 확장", "저장/다운로드"],
      cta: { href: "/pricing", label: "자세히 보기" },
      sub: "토스 결제 시 카드 등록 후 즉시 사용 · 언제든 해지",
      highlight: false,
    },
    {
      name: "Pro",
      price: "₩12,900/월",
      perks: ["무제한 생성", "A/B 우승 저장", "태그/관리 고급 기능"],
      cta: { href: "/pricing", label: "자세히 보기" },
      sub: "토스 결제 시 카드 등록 후 즉시 사용 · 언제든 해지",
      highlight: true,
    },
  ]

  return (
    <motion.section
      className="mx-auto w-full max-w-6xl px-5 py-12"
      aria-label="가격 한눈에 보기"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h2
        className="text-center text-2xl font-bold text-gray-900 dark:text-white"
        variants={fv}
        transition={softSpring}
      >
        가격 한눈에 보기
      </motion.h2>

      <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
        {tiers.map((t) => {
          const CardTag = motion.div
          return (
            <CardTag
              key={t.name}
              className={`rounded-2xl p-6 shadow-sm ring-1 backdrop-blur ${
                t.highlight
                  ? "bg-white/90 ring-black/10 dark:bg-slate-900/90 dark:ring-white/10"
                  : "bg-white/70 ring-black/5 dark:bg-white/5 dark:ring-white/10"
              }`}
              variants={fv}
              transition={softSpring}
              {...(t.highlight ? { whileHover: hoverRaise, whileTap: { y: -1 } } : {})}
            >
              <div className="flex items-baseline justify-between">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{t.name}</div>
                {t.highlight && (
                  <span className="rounded-full bg-[var(--accent,theme(colors.indigo.600))] px-2 py-0.5 text-[10px] font-semibold text-white">
                    추천
                  </span>
                )}
              </div>
              <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{t.price}</div>
              <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {t.perks.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
              <Link
                href={t.cta.href}
                onClick={() => track(t.name === "Free" ? "cta_free_login_start" : "cta_pricing_view", { tier: t.name })}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                {t.cta.label}
              </Link>
              <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">{t.sub}</div>
              {t.name !== "Free" && (
                <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                  해지 시 다음 결제부터 과금 중단 · 잔여 기간은 계속 이용
                </div>
              )}
            </CardTag>
          )
        })}
      </div>
    </motion.section>
  )
}



// 6) ROI 슬라이더 바 — Pro CTA 트래킹 포함
export function ROIBar() {
  useEffect(() => { track("view_belowfold_roi") }, [])
  const [mins, setMins] = useState(10)
  const [outsourcing, setOutsourcing] = useState(15)
  const days = 22
  const savedHours = useMemo(() => Math.round(((mins * days) / 60) * 10) / 10, [mins])
  const savedKRW = useMemo(() => outsourcing * 10000, [outsourcing])
  const formatComma = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  return (
    <motion.section
      className="mx-auto w-full max-w-5xl px-5 pb-8"
      aria-label="ROI 계산"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-500 p-1 shadow-lg ring-1 ring-black/10 dark:from-indigo-500 dark:to-indigo-400"
        variants={fv}
        transition={softSpring}
      >
        <div className="rounded-[calc(theme(borderRadius.3xl)-4px)] bg-white/90 p-6 backdrop-blur dark:bg-slate-900/90">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">한 달에 얼마나 이득일까요?</h3>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">하루 절약 시간과 대체 가능한 외주비를 움직여 보세요.</p>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="text-xs text-gray-600 dark:text-gray-300">
                  하루 절약 시간(분)
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={mins}
                    onChange={(e) => setMins(parseInt(e.target.value))}
                    className="mt-1 w-full"
                  />
                  <span className="ml-1 text-xs">
                    {mins}분 × {days}일 = <b>{savedHours}시간/월</b>
                  </span>
                </label>
                <label className="text-xs text-gray-600 dark:text-gray-300">
                  외주비 대체(만원)
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={5}
                    value={outsourcing}
                    onChange={(e) => setOutsourcing(parseInt(e.target.value))}
                    className="mt-1 w-full"
                  />
                  <span className="ml-1 text-xs">약 <b>{formatComma(savedKRW)}원/월</b> 절감</span>
                </label>
              </div>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 text-sm ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10">
              <div className="text-gray-900 dark:text-white">이 정도면 Pro(₩12,900/월)는</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {savedHours >= 1 || savedKRW >= 12900 ? "스스로 비용 회수" : "가볍게 테스트"}
              </div>
              <Link href={ROUTES.pricing}
                onClick={() => track("cta_pricing_view", { source: "roi" })}
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                Pro 자세히 보기
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}


// 7) FAQ
export function FAQList() {
  useEffect(() => { track("view_belowfold_faq") }, [])
  const items = [
    {
      q: "정말 3초 안에 문구가 나오나요?",
      a: "네. 캐싱/프롬프트 최적화로 평균 3초 내외를 유지합니다. 네트워크 상황에 따라 다소 차이가 있을 수 있어요.",
    },
    {
      q: "Free로도 충분히 써볼 수 있나요?",
      a: "사용을 위해서는 로그인/가입이 필요합니다. 로그인 후 Free로 바로 시작할 수 있으며, Basic/Pro에서는 저장/다운로드 등 고급 기능이 열립니다.",
    },
    {
      q: "결제 전 카드 정보가 꼭 필요한가요?",
      a: "Free는 로그인만 하면 바로 사용 가능하고 카드가 필요 없습니다. Basic/Pro는 토스 결제 과정에서 카드 등록 후 즉시 사용되며, 언제든 해지할 수 있어요.",
    },
  ]
  return (
    <motion.section
      className="mx-auto w-full max-w-5xl px-5 py-12"
      aria-label="FAQ"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h2
        className="text-center text-2xl font-bold text-gray-900 dark:text-white"
        variants={fv}
        transition={softSpring}
      >
        자주 묻는 질문
      </motion.h2>

      <div className="mt-8 space-y-4">
        {items.map((f, i) => (
          <motion.div
            key={i}
            className="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10"
            variants={fv}
            transition={softSpring}
          >
            <dt className="text-base font-semibold text-gray-900 dark:text-white">{f.q}</dt>
            <dd className="mt-1 text-sm text-gray-600 dark:text-gray-300">{f.a}</dd>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}


// 8) 마지막 CTA — 버튼 트래킹 포함
export function FinalCTA() {
  useEffect(() => { track("view_belowfold_finalcta") }, [])
  return (
    <section className="mx-auto w-full max-w-4xl px-5 pb-24" aria-label="최종 CTA">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-500 p-1 shadow-lg ring-1 ring-black/10 dark:from-indigo-500 dark:to-indigo-400">
        <div className="grid grid-cols-1 items-center gap-6 rounded-[calc(theme(borderRadius.3xl)-4px)] bg-white/90 p-8 backdrop-blur dark:bg-slate-900/90 md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">지금 바로 Free로 시작해 보세요</h3>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">회원가입 1분, 카드 정보 없이도 체험 가능해요. Pro에서 더 강력한 기능을 만나보세요.</p>
          </div>
          <div className="flex justify-start md:justify-end">
            <Link href={ROUTES.signin} onClick={() => track("cta_final")} className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
              무료로 시작
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
