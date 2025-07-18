'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useDeferredValue, useEffect, useState } from 'react';

export default function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [stableKey, setStableKey] = useState(pathname);

  useEffect(() => {
    // ✅ 防抖路径变化，避免动画触发两次
    const timer = setTimeout(() => {
      setStableKey(pathname);
    }, 50); // 50ms 防抖

    return () => clearTimeout(timer);
  }, [pathname]);
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
