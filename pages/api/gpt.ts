import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // .env.local에 OPENAI_API_KEY가 반드시 있어야 함!
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않은 요청입니다.' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: '프롬프트가 없습니다.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const result = completion.choices?.[0]?.message?.content?.trim() || '';
    res.status(200).json({ result });
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    res.status(500).json({ error: '문구 생성 중 오류가 발생했어요.' });
  }
}
