import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { topic, tone, mood, audience, purpose } = req.body

  if (!topic) {
    return res.status(400).json({ result: '토픽이 없습니다.' })
  }

  const prompt = `다음 정보를 참고하여 이모지 1개가 자연스럽게 포함된 마케팅 문구를 3개 작성해줘.
각 문장 앞에는 숫자(1. 2. 3.)를 붙여줘. 문장은 간결하고 강렬하게 써줘.

- 주제: ${topic}
- 말투 스타일: ${tone || '기본'}
- 분위기: ${mood || '기본'}
- 타깃층: ${audience || '일반'}
- 목적: ${purpose || '일반'}

형식 예시:
1. ✨ 밝고 생기 넘치는 피부를 위한 비타민 세럼을 만나보세요!
2. 🌟 바쁜 하루 속에서도 촉촉함을 지켜주는 우리의 보습 크림!
3. 💡 당신의 피부에 자신감을 더하는 마법같은 한 방울!`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
    })

    const rawResult = completion.choices[0].message.content || ''

    // 숫자로 시작하는 3개 문장 분리
    const resultLines = rawResult
      .split(/\d\.\s?/)
      .filter(Boolean)
      .map((line, idx) => `${idx + 1}. ${line.trim()}`)

    res.status(200).json({ result: resultLines.join('\n') })
  } catch (error) {
    console.error('OpenAI API 오류:', error)
    res.status(500).json({ result: '문구 생성 중 오류가 발생했습니다.' })
  }
}
