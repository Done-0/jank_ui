export interface Article {
  id: number
  title: string
  contentHtml: string
  image?: string
  visibility: string
  createdAt?: string
  viewCount?: number
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
  code: number
  msg: string
  data: T
}
