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

export default nextConfig;
