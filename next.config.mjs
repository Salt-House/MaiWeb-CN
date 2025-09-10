/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
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
    async rewrites() {
        return [
            {
                source: '/api/geocoder/:path*',
                destination: 'https://apis.map.qq.com/ws/geocoder/v1/:path*',
            },
        ];
    },
};

export default nextConfig;
