import type { Article, ArticleDisplay, ContentItem } from '~/types/article'
import { useRuntimeConfig } from '#app'

export default function useContent() {
  // 获取应用的运行时配置
  const config = useRuntimeConfig()
  
  // API URL 配置，获取所有文章的接口地址
  const apiUrl = `${config.public.apiBase}/post/getAllPosts`

  // 定义响应式状态：存储文章数据、推荐内容、热门内容、加载状态、错误信息等
  const articles = useState<ArticleDisplay[]>('articles', () => [])
  const recommendedContent = useState<ContentItem[]>('recommendedContent', () => [])
  const hotContent = useState<ContentItem[]>('hotContent', () => [])
  const loading = useState<boolean>('content-loading', () => true)
  const error = useState<string | null>('content-error', () => null)

  // 当前页和每页文章数量
  const currentPage = useState<number>('currentPage', () => 1)
  const articlesPerPage = 5

  // 计算分页后的文章列表
  const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * articlesPerPage
    return articles.value.slice(start, start + articlesPerPage)
  })

  // 计算总页数
  const totalPages = computed(() => {
    const pages = Math.ceil(articles.value.length / articlesPerPage)
    console.log('总页数:', pages) // 调试输出总页数
    return pages
  })

  /**
   * 提取文章内容的摘要，最多显示100个字符
   * @param html 文章的 HTML 内容
   * @returns 文章摘要，超过100个字符的部分将被截断并加上 "..."
   */
  const extractSummary = (html: string): string => {
    return html ? html.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : ''
  }

  /**
   * 根据文章列表生成内容项，内容项包含文章标题和链接
   * @param articles 文章列表
   * @param prefix 用于生成标题的前缀
   * @returns 生成的内容项数组
   */
  const generateContentItems = (articles: ArticleDisplay[], prefix: string): ContentItem[] => {
    return articles.map(article => ({
      id: article.id,
      title: `${prefix}: ${article.title}`,  // 添加前缀以标识是推荐或热门内容
      link: `/articles/${article.id}`  // 生成链接
    }))
  }

  /**
   * 处理文章数据，将原始文章数据转换为显示用的格式
   * @param data 原始文章数据
   */
  const processArticles = (data: Article[]) => {
    try {
      // 验证数据格式
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received')
      }

      // 打印获取到的数据以便调试
      console.log('获取到的文章数据:', data)

      // 将每篇文章数据转化为显示用的格式，并提取摘要
      articles.value = data.map((post: Article) => ({
        ...post,
        summary: extractSummary(post.contentHtml)
      }))

      // 获取浏览量最高的前4篇文章作为推荐和热门内容
      const topArticles = articles.value
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 4)

      // 生成推荐和热门内容
      recommendedContent.value = generateContentItems(topArticles, '推荐')
      hotContent.value = generateContentItems(topArticles, '热门')

      // 清除错误信息
      error.value = null
    } catch (e) {
      // 捕获处理错误并设置错误信息
      error.value = e instanceof Error ? e.message : '处理文章数据时发生错误'
    }
  }

  return {
    articles,           // 文章数据
    paginatedArticles,  // 分页后的文章数据
    recommendedContent, // 推荐内容
    hotContent,         // 热门内容
    loading,            // 加载状态
    error,              // 错误信息
    processArticles,    // 处理文章数据的方法
    apiUrl,             // API 地址
    currentPage,        // 当前页
    totalPages          // 总页数
  }
}
