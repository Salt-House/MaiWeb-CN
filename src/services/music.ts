import http from "./request"
import { Song } from "@/types/music"

export const getSongs = (queryString: string, page: number = 1, pageSize: number = 100) => {
  // Construct the full query string manually or let axios handle it if we passed an object.
  // Since the component passes a pre-built query string like "version=xxx&genre=yyy",
  // we can append page and page_size to it.
  
  const url = `/api/maimai/songs?${queryString}&page=${page}&page_size=${pageSize}`
  return http.get<Song[]>(url)
}

export const getSongDetail = (id: string, hasToken: boolean) => {
  if (hasToken) {
    return http.get<any>(`/api/maimai/maiweb/minfo?id=${id}`)
  } else {
    return http.get<Song[]>(`/api/maimai/songs?id=${id}&page=1&page_size=1`)
  }
}

export const getSongRecentUpdated = (page: number = 1, pageSize: number = 100) => {
  return http.get<Song[]>(`/email/recent`)
}
