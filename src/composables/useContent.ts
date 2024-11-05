import { ref } from 'vue'
import type { Article } from '@/types/article'

export default function useContent() {
  const recommendedContent = ref('')
  const articles = ref<Article[]>([])

  const fetchRecommendedContent = () => {
    // 模拟API调用
    recommendedContent.value = '欢迎来到我们的平台！这里有最新的内容等待您的发现。'
  }

  const fetchArticles = () => {
    // 模拟API调用
    articles.value = [
      {
        id: 1,
        title: '第一篇文章',
        content: '这是第一篇文章的内容...'
      },
      {
        id: 2,
        title: '第二篇文章',
        content: '这是第二篇文章的内容...'
      },
      {
        id: 3,
        title: '第三篇文章',
        content: '这是第三篇文章的内容...'
      }
    ]
  }

  return {
    recommendedContent,
    articles,
    fetchRecommendedContent,
    fetchArticles
  }
}
