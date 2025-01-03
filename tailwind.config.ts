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
        "test":"test 1s infinite",
        "moveStar":"moveStar 3s linear infinite",
        "moveDot":"moveDot 30s linear infinite",
        "volume":"volume 1s infinite"
      },
      fontFamily: {
        douyin: ['DouyinSansBold', 'sans-serif'], // 自定义字体
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('tailwindcss-text-stroke'),
  ],
};
export default config;
