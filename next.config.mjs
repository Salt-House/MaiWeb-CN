import bundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const assetsUrl = new URL(process.env.NEXT_PUBLIC_ASSETS_BASE || "https://assets2.lxns.net")
const staticUrl = new URL(process.env.NEXT_PUBLIC_STATIC_BASE || "https://static.maimai.moe")

const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: assetsUrl.protocol.replace(":", ""),
        hostname: assetsUrl.hostname,
        pathname: "/**",
      },
      {
        protocol: staticUrl.protocol.replace(":", ""),
        hostname: staticUrl.hostname,
        pathname: "/**",
      },
    ],
  },
  eslint: {
    // 警告：这就允许生产构建成功完成，即使你的项目存在 ESLint 错误。
    ignoreDuringBuilds: true,
  },
}

// 使用环境变量控制是否启用打包分析
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

export default withBundleAnalyzer(nextConfig)
