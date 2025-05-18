// pages/api/gpt.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// 🔐 환경변수에서 API 키 불러오기 (.env.local에 있어야 함!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않은 요청입니다.' });
  }

  const { prompt } = req.body;

  // ✅ 프론트에서 온 prompt 확인
  console.log('📨 받은 프롬프트:', prompt);

  if (!prompt) {
    return res.status(400).json({ error: '프롬프트가 없습니다.' });
  }

  try {
    // 🔍 GPT-3.5 Turbo 모델에 요청 보내기
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const result = completion.choices?.[0]?.message?.content?.trim() || '';

    // ✅ 실제 생성된 결과 출력
    console.log('🎯 생성된 결과:', result);

    res.status(200).json({ result });
  } catch (error: any) {
    console.error('❌ OpenAI API 오류:', error.response?.data || error.message);
    res.status(500).json({ error: '문구 생성 중 오류가 발생했어요.' });
  }
}
