// src/config/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://maimaimoe.cn"
const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_BASE || "https://assets2.lxns.net"
const STATIC_BASE_URL = process.env.NEXT_PUBLIC_STATIC_BASE || "http://img.maimaimoe.cn/Texture2D"

export const CONFIG = {
  API: {
    BASE: API_BASE_URL,
    // API endpoints
    ENDPOINTS: {
      API: `${API_BASE_URL}/api`,
      EMAIL: `${API_BASE_URL}/email`,
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
