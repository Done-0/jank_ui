import type { BaseResponse } from "~/types/base/base"

export interface Article {
  id: number
  title: string
  contentHtml: string
  image?: string
  visibility: string
  createdAt?: string
  viewCount?: number
  contentMarkdown?: string
}

export interface ArticleDisplay extends Article {
  summary: string
}

export interface ContentItem {
  id: number
  title: string
  link: string
}

export interface ApiResponse<T> {
  data: T
  requestId: string
  timestamp: number
}


export type ArticleListResponse = BaseResponse<Article[]>