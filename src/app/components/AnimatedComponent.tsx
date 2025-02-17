'use client';

// import { useEffect, useState, ReactNode } from 'react';

// const AnimatedComponent = ({ children }: { children: ReactNode }) => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//     return () => {
//       setIsVisible(false); // Cleanup function to reset visibility
//     };
//   }, []);

//   return (
//     <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
//       {children}
//     </div>
//   );
// };

// export default AnimatedComponent;


import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedComponentSub = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedComponent = ({ children, isVisible }: { children: ReactNode; isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && ( // 条件渲染
        <AnimatedComponentSub>
          {children}
        </AnimatedComponentSub>
      )}
    </AnimatePresence>
  );
};

export default AnimatedComponent;