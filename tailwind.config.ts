import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "test": "test 1s infinite",
        "moveStar": "moveStar 3s linear infinite",
        "moveDot": "moveDot 30s linear infinite",
        "volume": "volume 1s infinite",
        "leftToRight": "leftToRight 2s ease-in-out infinite",
        "text-scroll": "textScroll 5s linear infinite",
        "text-scroll-region": "textScrollRegionName 5s linear infinite",
        "floatUpDown":"floatUpDown 4s ease-in-out infinite",
      },
      fontFamily: {
        douyin: ['DouyinSansBold', 'sans-serif'], // 自定义字体
      },
      boxShadow: {
        'text': '2px 2px 5px rgba(255, 255, 255, 0.8)', // 自定义文字阴影
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('tailwindcss-text-stroke'),
  ],
};
export default config;
