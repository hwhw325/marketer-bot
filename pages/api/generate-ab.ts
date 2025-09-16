// pages/api/generate-ab.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { systemPrompt, userPrompt } = req.body;

  if (!systemPrompt || !userPrompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const chatRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.9,
    });

    const output = chatRes.choices[0]?.message?.content ?? '';
    
    // 결과에서 A안 / B안 문장만 추출
    const abLines = output
      .split('\n')
      .filter(line => line.trim().startsWith('A안') || line.trim().startsWith('B안'));

    res.status(200).json({ abLines });
  } catch (err) {
    console.error('❌ A/B 문구 생성 오류:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
