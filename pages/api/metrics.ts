// pages/api/metrics.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  // TODO: 실제 DB/로그로 교체
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600')
  res.status(200).json({
    avgMs: 2900,       // 평균 응답(ms)
    todayGen: 12482,   // 오늘 생성 개수
    saves: 24010,      // 저장 총합 (또는 오늘 저장)
    updatedAt: new Date().toISOString(),
  })
}
