# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-04-04

### Initial Release

#### Added
- **Next.js 15 project setup** with TypeScript, Tailwind CSS, ESLint, and App Router
  - Reason: Foundation for the AP Tracker web app
  - Dependencies: `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `eslint`

- **Core data models and types** (`src/types/index.ts`)
  - `APExam`, `Topic`, `StudySession`, `Habit` interfaces
  - `Tab` type for navigation
  - Reason: Type-safe data structures for all tracked entities

- **LocalStorage persistence layer** (`src/lib/storage.ts`)
  - CRUD helpers for exams, sessions, and habits
  - Reason: Zero-config client-side data persistence, no backend needed

- **React Context state management** (`src/store/AppContext.tsx`)
  - Global state for exams, study sessions, and habits
  - Actions: add/update/delete exams, add/delete sessions, add/toggle/delete habits
  - Streak calculation for habits
  - Reason: Lightweight state management without external libraries

- **Dashboard** (`src/components/Dashboard.tsx`)
  - Stats cards: total study hours, exam count, mastery %, active habits
  - Upcoming exams with countdown
  - Today's study sessions
  - Reason: Quick overview of AP season progress at a glance

- **Exam Tracker** (`src/components/ExamTracker.tsx`)
  - Add/edit/delete AP exams with name, date, target score, color
  - Topic management with mastery tracking
  - Search/filter functionality
  - Visual progress bars per exam
  - Autocomplete suggestions for common AP exams
  - Reason: Track all AP exams and topic mastery in one place

- **Study Logger** (`src/components/StudyLogger.tsx`)
  - Log study sessions with exam, duration, date, productivity rating, notes
  - Filter by exam
  - Aggregate stats: total time, average rating
  - Reason: Track study time and productivity patterns

- **Habit Tracker** (`src/components/HabitTracker.tsx`)
  - Add habits with custom icons
  - Daily toggle with streak tracking
  - 7/14/30 day views
  - Visual calendar grid
  - Reason: Build and maintain consistent study habits during AP season

- **Main app shell** (`src/components/TrackerApp.tsx`)
  - Tab-based navigation: Dashboard, Exams, Study, Habits
  - Responsive bottom nav (mobile) / top nav (desktop)
  - Page transition animations with Framer Motion
  - Reason: Smooth, intuitive navigation across all features

- **Custom styling** (`src/app/globals.css`)
  - Dark theme with zinc color palette
  - Custom scrollbar styling
  - Select dropdown styling
  - Reason: Classy, modern dark UI

#### Dependencies Added
- `framer-motion` - Page and component animations
- `date-fns` - Date formatting and manipulation
- `uuid` - Unique ID generation for entities
- `@types/uuid` - TypeScript definitions for uuid

#### Fixed
- **Added `'use client'` directive to `AppContext.tsx`**
  - Reason: Next.js App Router requires explicit client component markers for hooks and context
  - Created `Providers.tsx` wrapper to properly separate server/client component boundaries

## [0.2.0] - 2026-04-05

### Dark/Light Theme System

#### Added
- **Theme context and provider** (`src/store/ThemeContext.tsx`)
  - `useTheme()` hook for accessing `isDark` state and `toggle()` function
  - Persists theme preference to localStorage
  - Applies `dark` class to `<html>` element for CSS targeting
  - Reason: Enable smooth theme switching with preference persistence

- **Animated theme toggle** (`src/components/ThemeToggle.tsx`)
  - Pill-shaped toggle with spring-animated knob
  - Sun/moon icons with fade + rotate transitions
  - Positioned in header next to app title
  - Reason: Classy, smooth theme switcher that fits the minimalist aesthetic

- **CSS variable theming system** (`src/app/globals.css`)
  - Full set of semantic CSS variables: `--background`, `--foreground`, `--surface`, `--border`, `--muted`, `--accent`, etc.
  - Separate variable definitions for dark (default) and light modes
  - Smooth 300ms transition on background and color changes
  - Updated scrollbar and date input styling for both themes
  - Reason: Clean, maintainable dual-theme support without Tailwind class duplication

- **Updated all components** to use CSS variables instead of hardcoded zinc colors
  - Reusable `Card`, `Input`, `TextArea`, `Select` wrapper components in each file
  - Hover effects and transitions respect current theme
  - Reason: Consistent theming across all pages and components

#### Dependencies Added
- None (uses existing `framer-motion` for toggle animation)

## [0.3.0] - 2026-04-05

### Interactive Calendar on Dashboard

#### Added
- **Calendar component** (`src/components/Calendar.tsx`)
  - Monthly view with prev/next navigation
  - Visual dots on days with exams (color-coded by exam color)
  - Interactive day selection with smooth expand/collapse animation
  - Shows both exams and study sessions for selected day
  - Today indicator with accent color highlight
  - Past days dimmed
  - Responsive compact grid layout
  - Reason: Quick visual overview of upcoming exams and study sessions at a glance

- **Updated Dashboard** (`src/components/Dashboard.tsx`)
  - Integrated Calendar component
  - Calendar only shows when exams exist
  - Reason: Keep dashboard clean until user has data to display

#### Dependencies Added
- None (uses existing `date-fns` for date manipulation)

## [0.3.1] - 2026-04-05

### Calendar Layout Fix

#### Changed
- **Calendar and Upcoming Exams side-by-side layout**
  - Calendar and Upcoming Exams now share a grid row on larger screens
  - Compact mode added to Calendar component with smaller sizing
  - Updated Dashboard grid: `lg:grid-cols-2` for side-by-side layout
  - Upcoming Exams list now has max-height with scroll for overflow
  - Reason: Better space utilization on dashboard, both widgets visible at once

#### Files Modified
- `src/components/Dashboard.tsx` — grid layout, compact Card wrappers
- `src/components/Calendar.tsx` — added `compact` prop, smaller sizing variants

## [0.3.2] - 2026-04-05

### Calendar Layout & Selected Day Fix

#### Changed
- **Dashboard grid layout reordering**
  - Calendar now on LEFT side, Upcoming Exams on RIGHT side
  - Grid uses `grid-cols-5` with Calendar taking `col-span-3` and Upcoming Exams taking `col-span-2`
  - Reason: Better visual balance, Calendar needs more space

- **Prominent selected day info in compact mode**
  - Selected day panel now uses accent color background with accent border
  - Exam badge uses filled accent background (not just soft accent)
  - Bold "Exam" labels stand out more
  - Reason: Selected day info was not visible enough before

#### Files Modified
- `src/components/Dashboard.tsx` — grid columns reordered (3:2 ratio)
- `src/components/Calendar.tsx` — enhanced compact mode selected day styling
