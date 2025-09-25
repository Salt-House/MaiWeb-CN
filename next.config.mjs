import bundleAnalyzer from '@next/bundle-analyzer'

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets2.lxns.net',
                // 若只想放某条目录，可以写 '/maimai/jacket/**'
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'static.maimai.moe',
                // 若只想放某条目录，可以写 '/maimai/jacket/**'
                pathname: '/**',
            },
        ],
    },
};

// 使用环境变量控制是否启用打包分析
const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig);
