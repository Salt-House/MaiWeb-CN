'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

export default function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [stableKey, setStableKey] = useState(pathname);
  const [isClient, setIsClient] = useState(false);

  // 确保组件在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // ✅ 防抖路径变化，避免动画触发两次
    const timer = setTimeout(() => {
      setStableKey(pathname);
    }, 50); // 50ms 防抖

    return () => clearTimeout(timer);
  }, [pathname, isClient]);

  // 在服务端渲染时不使用动画，避免hydration不匹配
  if (!isClient) {
    return <div style={{ width: '100%' }}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stableKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 1.0 }}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
