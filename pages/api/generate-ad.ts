// pages/api/generate-ad.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { product } = req.body;

  // 임시로 고정된 문구 생성 로직
  const ad = `지금 만나보세요! ${product} - 한정 특가로 만나볼 수 있는 절호의 기회입니다!`;

  res.status(200).json({ result: ad });
}