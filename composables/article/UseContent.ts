// composables/useContent.ts
import type { Article, ArticleDisplay, ContentItem, ArticleListResponse } from '~/types/article/article'

export default function useContent() {
  const config = useRuntimeConfig()
  const apiUrl = computed(() => `${config.public.apiBase}/post/getAllPosts`)  

  // 响应式状态
  const articles = useState<ArticleDisplay[]>('articles', () => [])
  const recommendedContent = useState<ContentItem[]>('recommendedContent', () => [])
  const hotContent = useState<ContentItem[]>('hotContent', () => [])
  const loading = useState<boolean>('content-loading', () => false)
  const error = useState<string | null>('content-error', () => null)
  const currentPage = useState<number>('currentPage', () => 1)

  // 每页 5 篇文章
  const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * 5
    return articles.value.slice(start, start + 5)
  })

  const totalPages = computed(() => {
    return Math.ceil(articles.value.length / 5)
  })

  /**
   * 提取文章摘要，默认100字符
   */
  const extractSummary = (html: string): string => {
    return html 
      ? html.replace(/<[^>]+>/g, '').substring(0, 100) + '...' 
      : ''
  }

  /**
   * 生成内容项列表
   */
  const generateContentItems = (articles: ArticleDisplay[]): ContentItem[] => {
    return articles.map(article => ({
      id: article.id,
      title: article.title,
      link: `/articles/${article.id}`
    }))
  }

  /**
   * 处理文章数据
   */
  const processArticles = (data: Article[]) => {
    try {
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received')
      }

      articles.value = data.map((post: Article) => ({
        ...post,
        summary: extractSummary(post.contentHtml)
      }))

      // 获取热门文章（取前2篇）
      const topArticles = articles.value
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 2)

      recommendedContent.value = generateContentItems(topArticles)
      hotContent.value = generateContentItems(topArticles)

      error.value = null
    } catch (e) {
      error.value = e instanceof Error ? e.message : '处理文章数据时发生错误'
      console.error('Process articles error:', e)
    }
  }

  /**
   * 获取文章列表
   */
  const fetchArticles = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { data: response } = await useFetch<ArticleListResponse>(apiUrl.value, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        retry: 1,
        onRequestError({ error }) {
          console.error('Request error:', error)
        },
        onResponseError({ error }) {
          console.error('Response error:', error)
        }
      })

      console.log('Raw response:', response.value)

      if (!response.value) {
        throw new Error('未收到响应数据')
      }

      // 直接处理数据数组
      if (Array.isArray(response.value.data)) {
        processArticles(response.value.data)
      } else {
        console.error('Invalid data format:', response.value.data)
        throw new Error('返回的数据格式不正确')
      }

    } catch (e) {
      console.error('Fetch articles error:', e)
      error.value = e instanceof Error ? e.message : '获取文章列表失败'
    } finally {
      loading.value = false
    }
  }

  // 页面切换
  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  return {
    articles,
    paginatedArticles,
    recommendedContent,
    hotContent,
    loading,
    error,
    currentPage,
    totalPages,
    fetchArticles,
    changePage
  }
}
