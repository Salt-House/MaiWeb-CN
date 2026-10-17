import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "maimai-pink": "#FF5FA5",
        "maimai-pink-light": "#FFB7CE",
        "mai-green": "#41B48F",
        "mai-green-light": "#7BE0B6",
        "mai-blue": "#00619B",
        "mai-blue-deep": "#012D7B",
        "mai-blue-dark": "#053264",
        "mai-ink": "#17466D",
        "mai-purple": "#6F34B0",
        "mai-purple-light": "#8E92E1",
        "mai-indigo": "#2B2EA3",
        "mai-pink-soft": "#FF90C8",
        "mai-rose": "#FD4A81",
        "mai-rose-deep": "#D6306B", // 官方粉系深档(hover/强调)
        "mai-sky": "#319DF8",
        "mai-sky-bg": "#3AADEE", // 官网 maiDecorationBg 天空蓝底色
        "mai-yellow": "#FBE426",
        "mai-red": "#FF4646",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-50% - 1rem))" },
        },
      },
      animation: {
        test: "test 1s infinite",
        moveStar: "moveStar 3s linear infinite",
        moveDot: "moveDot 30s linear infinite",
        volume: "volume 1s infinite",
        leftToRight: "leftToRight 2s ease-in-out infinite",
        "text-scroll": "textScroll 5s linear infinite",
        "text-scroll-region": "textScrollRegionName 5s linear infinite",
        floatUpDown: "floatUpDown 4s ease-in-out infinite",
        marquee: "marquee 10s linear infinite",
        textScroll: "textScroll 15s linear infinite",
      },
      fontFamily: {
        douyin: ["DouyinSansBold", "sans-serif"], // 自定义字体
        mai: [
          "M PLUS Rounded 1c",
          "Montserrat",
          "DouyinSansBold",
          "sans-serif",
        ], // v2 官网圆体风格 (Google Fonts link 加载, 中文回退 DouyinSansBold)
      },
      boxShadow: {
        text: "2px 2px 5px rgba(255, 255, 255, 0.8)", // 自定义文字阴影
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide"), require("tailwindcss-text-stroke")],
}
export default config
