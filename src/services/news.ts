import http from "./request"

export interface NewsProps {
  title: string
  content: string
  image_url: string
  source: string
  source_url: string
  source_author: string
  source_created_at: string
}

export const getNews = (limit: number, offset: number) => {
  return http.get<NewsProps[]>("/api/maimai/maiweb/news", { limit, offset })
}
