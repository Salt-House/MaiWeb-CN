// src/config/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "https://maimaimoe.cn"
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_API_BASE) {
  // 强制生产环境使用正确的 API 地址，防止 dev.maimai.moe 被意外注入
  // 除非显式设置了环境变量
}
const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_BASE || "https://assets2.lxns.net"
const STATIC_BASE_URL = process.env.NEXT_PUBLIC_STATIC_BASE || "https://img.maimaimoe.cn/Texture2D"

export const CONFIG = {
  API: {
    BASE: API_BASE_URL,
    // API endpoints
    ENDPOINTS: {
      API: `${API_BASE_URL}/api`,
      EMAIL: `${API_BASE_URL}/email`,
      BLOG: `${API_BASE_URL}/email/list_github_blog`,
    },
    // Web links
    WEB: {
      MUSIC: `${API_BASE_URL}/music`,
    },
  },
  ASSETS: {
    BASE: ASSETS_BASE_URL,
    STATIC: STATIC_BASE_URL,
    MAIMAI: {
      BASE: `${ASSETS_BASE_URL}/maimai`,
      MUSIC: `${ASSETS_BASE_URL}/maimai/music`,
      JACKET: `${ASSETS_BASE_URL}/maimai/jacket`,
    },
  },
}

export default CONFIG
