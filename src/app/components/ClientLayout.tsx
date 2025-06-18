"use client"

import { useEffect, ReactNode } from "react";

interface ClientLayoutProps {
  children: ReactNode;
  textstroke: React.CSSProperties;
  textDonate: React.CSSProperties;
}

export default function ClientLayout({ children, textstroke, textDonate }: ClientLayoutProps) {
  // 添加动态视口高度调整
  useEffect(() => {
    // 设置视口高度CSS变量
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // 初始设置
    setViewportHeight();

    // 监听窗口大小变化
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    // 清理函数
    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  return (
    <div className="relative overflow-scroll max-sm:w-full max-sm:mx-auto" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {children}
    </div>
  );
}