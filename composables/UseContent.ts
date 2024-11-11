import { ref } from 'vue'
import type { Article } from '~/types/article'

export default function UseContent() {
  const recommendedContent = ref('')
  const hotContent = ref('')
  const articles = ref<Article[]>([])

  const fetchRecommendedContent = () => {
    // 模拟API调用
    recommendedContent.value = '当前最热门的内容都在这里！快来看看大家都在关注什么。'
  }

  const fetchHotContent = () => {
    // 模拟API调用
    hotContent.value = '欢迎来到我们的平台！这里有最新的内容等待您的发现。'
  }

  const fetchArticles = () => {
    // 模拟API调用
    articles.value = [
      {
        id: 1,
        title: '第一篇文章',
        content: '这是第一篇文章的内容...',
        image: 'https://haowallpaper.com/link/common/file/previewFileImg/15703734405796160',
        summary: '这是第一篇文章的摘要...'
      },
      {
        id: 2,
        title: '第二篇文章',
        content: '这是第二篇文章的内容...',
        image: 'https://haowallpaper.com/link/common/file/previewFileImg/15618355479613760',
        summary: '这是第二篇文章的摘要...'
      },
      {
        id: 3,
        title: '第三篇文章',
        content: '这是第三篇文章的内容...',
        image: 'https://haowallpaper.com/link/common/file/previewFileImg/15556743616106816',
        summary: '这是第三篇文章的摘要...'
      }
    ]
  }

  return {
    recommendedContent,
    hotContent,
    articles,
    fetchRecommendedContent,
    fetchHotContent,
    fetchArticles
  }
}
