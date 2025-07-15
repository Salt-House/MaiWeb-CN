/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: '**', pathname: '**' },
        ],
    },
};

export default nextConfig;
