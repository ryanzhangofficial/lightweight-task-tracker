'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/store/ThemeContext';

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full bg-zinc-800 dark:bg-zinc-200 transition-colors duration-300 overflow-hidden"
      style={{
        backgroundColor: isDark ? 'var(--surface)' : '#e4e4e7',
      }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs"
        animate={{
          x: isDark ? 2 : 30,
          backgroundColor: isDark ? '#27272a' : '#ffffff',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <motion.span
          animate={{ opacity: isDark ? 1 : 0, rotate: isDark ? 0 : 90 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          ☾
        </motion.span>
        <motion.span
          animate={{ opacity: isDark ? 0 : 1, rotate: isDark ? -90 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          ☀
        </motion.span>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <span className="text-[10px] opacity-40">☀</span>
        <span className="text-[10px] opacity-40">☾</span>
      </div>
    </button>
  );
}
