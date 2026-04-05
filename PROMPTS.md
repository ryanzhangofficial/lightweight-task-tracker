# Prompts

This file maps each feature prompt to its corresponding CHANGELOG entry. Use these as reference for reproducing or iterating on features.

---

## [0.1.0] — Initial Release

### Prompt: Project Setup & Core Features

> It's AP season and I want to develop better habits during test season. I've tried using notion and other available apps but there just seems to be too much going on. I'm also going into college next year so I must be able to track things quickly, easily, and efficiently. Please create a responsive web app using Next JS, tailwind css, etc to help me with this issue. I want it to be classy smooth and lightweight perfect for a college student in the modern era.

**What was built:**
- Next.js 16 + TypeScript + Tailwind CSS 4 project
- Dashboard with stats cards, upcoming exams, today's sessions
- Exam tracker with topic mastery, color coding, search
- Study session logger with duration, notes, productivity rating
- Habit tracker with streaks, 7/14/30 day views, calendar grid
- Responsive bottom nav (mobile) / top nav (desktop)
- Framer Motion page transitions
- LocalStorage persistence (zero backend)
- Dark theme with zinc color palette

**Key files created:**
- `src/types/index.ts` — Data models
- `src/lib/storage.ts` — LocalStorage helpers
- `src/store/AppContext.tsx` — Global state
- `src/components/Dashboard.tsx`
- `src/components/ExamTracker.tsx`
- `src/components/StudyLogger.tsx`
- `src/components/HabitTracker.tsx`
- `src/components/TrackerApp.tsx`
- `src/app/globals.css`

---

### Prompt: Fix Server/Client Component Boundary

> (Implicit — build error fix)

**What was fixed:**
- Added `'use client'` directive to `AppContext.tsx`
- Created `Providers.tsx` wrapper to separate server/client boundaries
- `layout.tsx` remains a server component, imports client `Providers`

**Key files modified:**
- `src/store/AppContext.tsx`
- `src/components/Providers.tsx` (new)
- `src/app/layout.tsx`

---

## [0.2.0] — Dark/Light Theme System

### Prompt: Theme Toggle

> Can you create a dark and light mode smooth toggle that fits the vibe. Remember to update CHANGELOG.md with new features for this and in the future.

**What was built:**
- `ThemeContext` with `isDark` state and `toggle()` function
- Animated pill-shaped toggle with spring physics (Framer Motion)
- Sun/moon icons with fade + rotate transitions
- Full CSS variable theming system (`--background`, `--foreground`, `--surface`, `--border`, `--muted`, `--accent`, etc.)
- Separate light/dark variable definitions in `globals.css`
- 300ms smooth transitions on all themed elements
- localStorage persistence for theme preference
- All components refactored to use CSS variables instead of hardcoded Tailwind zinc classes
- Reusable `Card`, `Input`, `TextArea`, `Select` wrapper components per file

**Key files created/modified:**
- `src/store/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/components/Providers.tsx` (updated to wrap ThemeProvider)
- `src/app/layout.tsx` (added `dark` class to html)
- `src/app/globals.css` (full CSS variable system)
- `src/components/TrackerApp.tsx` (theme-aware styling)
- `src/components/Dashboard.tsx` (CSS variable migration)
- `src/components/ExamTracker.tsx` (CSS variable migration)
- `src/components/StudyLogger.tsx` (CSS variable migration)
- `src/components/HabitTracker.tsx` (CSS variable migration)
