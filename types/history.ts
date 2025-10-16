// types/history.ts
export interface LikeEntry {
  liked: boolean
  tag?: string
}

export interface HistoryItem {
  keyword: string
  category: string
  tone: string
  emotion: string
  target: string
  gender: string
  purpose: string
  result: string
  likes?: LikeEntry[]
  savedAt?: string
  memo?: string
  tags?: string[]
}
