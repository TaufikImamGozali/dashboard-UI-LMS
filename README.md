# Coursue - E-Learning & LMS Dashboard

A pixel-accurate, modern, and responsive web platform for **"Coursue"**, built with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, **Recharts**, and **Lucide React**.

Includes:
1. **LMS Dashboard**: 3-column layout, progress cards, continue watching carousel, your lesson table, statistic charts, and mentor directory.
2. **Authentication Suite**: 2-column Login page with validation and loading state, Register page, and Forgot Password recovery.
3. **Course Detail Page (`/course/:id`)**: Rich video player, curriculum accordion, tabs (Overview, Lessons, Reviews), progress ring, course information, mentor card with follow toggle, favorite/share actions, and related courses.

---

## 🌟 Key Features

### 1. Course Detail View (`/course/:id`)
- **Breadcrumb & Header**: Clean hierarchy (`Dashboard > Lesson > Course Title`), category pill badge, star rating, student count, duration, and last updated timestamp.
- **Interactive Video Player**:
  - High-resolution video container with smooth controls (play/pause, timeline scrubber, replay, volume mute/unmute, and fullscreen).
  - Displays current lesson title and "Mark as Complete" button that immediately recalculates the course completion percentage.
- **Tabbed Course Content**:
  - **Overview Tab**: Detailed course description, "What you'll learn" checklist with green icons, and prerequisites/requirements list.
  - **Lessons Tab**: Accordion curriculum grouped into structured sections. Shows lesson status (Completed checkmark, Active playing indicator, or Locked status with tooltip feedback) and duration. Clicking an unlocked lesson switches the active player.
  - **Reviews Tab**: Rating distribution breakdown (5, 4, 3 stars) and authentic review cards with avatars, timestamps, and star ratings.
- **Right Sidebar Panels**:
  - **Your Progress**: Circular SVG progress ring with percentage, completed lessons count, and a primary pill "Continue Learning" button that automatically jumps to the next uncompleted lesson.
  - **Course Information**: Skill level, language, lessons count, certificate availability, and access type.
  - **Instructor Profile**: Mentor avatar, bio, rating, student count, and interactive `Follow` / `Following` toggle.
  - **Actions**: "Favorite" toggle button (filled heart) and "Share" button (copies link to clipboard with confirmation).
- **Related Courses**: 3 curated course recommendation cards below the main content.
- **Course Not Found (404)**: Graceful error state when navigating to an invalid ID, with a button to return to the dashboard.
- **Responsive Adaptations**:
  - ≥1280px: Two-column layout (8 cols main content, 4 cols sidebar).
  - 768-1279px: Sidebar docks and right panel stacks neatly below the video player.
  - <768px: Single column with horizontally scrollable tabs and a sticky bottom "Continue Learning" bar.

---

## 🛠️ Tech Stack

- **Framework**: React 18 (with React DOM 18)
- **Routing**: React Router DOM (`BrowserRouter`, `Routes`, `Route`, `useParams`, `useNavigate`)
- **Bundler & Tooling**: Vite 8 + TypeScript (with `verbatimModuleSyntax`)
- **Styling**: Tailwind CSS with custom theme tokens
- **Icons**: Lucide React
- **Typography**: Google Fonts "Plus Jakarta Sans"

---

## 🚀 Installation & Running Locally

1. Clone or navigate to the project directory:
   ```bash
   cd d:/NGODING/UI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser:
   ```
   http://localhost:5173/
   ```

5. Production build validation:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
├── index.html                           # Plus Jakarta Sans font & metadata
├── tailwind.config.js                   # Custom brand colors, category tokens, shadows
├── tsconfig.json                        # TypeScript configuration
├── package.json                         # Dependencies & scripts
└── src/
    ├── types/
    │   └── index.ts                     # Types (CourseDetail, Section, Lesson, Review, etc.)
    ├── data/
    │   ├── mockData.ts                  # Dashboard courses, mentors, lessons, stats
    │   └── courses.ts                   # 6 detailed courses with curriculum & reviews
    ├── components/
    │   ├── ui/
    │   │   ├── Button.tsx               # Reusable button with loading & variants
    │   │   ├── TextField.tsx            # Accessible input with icons & error states
    │   │   └── PasswordField.tsx        # Password input with show/hide toggle
    │   ├── auth/
    │   │   ├── AuthLayout.tsx           # Two-column auth layout with gradient panel
    │   │   └── ProtectedRoute.tsx       # Route guard based on localStorage
    │   ├── course/
    │   │   ├── CourseHeader.tsx         # Breadcrumb, title, rating & metadata
    │   │   ├── VideoPlayer.tsx          # Video player with controls & complete toggle
    │   │   ├── CourseTabs.tsx           # Overview, Lessons & Reviews tab panels
    │   │   ├── CurriculumAccordion.tsx  # Section accordion with lesson status
    │   │   ├── ReviewCard.tsx           # Testimonial & rating card
    │   │   ├── ProgressRing.tsx         # Circular SVG progress ring
    │   │   ├── CourseProgressPanel.tsx  # Progress card, continue CTA, favorite & share
    │   │   ├── CourseInfoCard.tsx       # Course specifications & metadata
    │   │   └── CourseMentorCard.tsx     # Instructor profile & follow button
    │   ├── Sidebar.tsx                  # Left navigation, friends & logout
    │   ├── Topbar.tsx                   # Search bar, actions & user avatar
    │   ├── HeroBanner.tsx               # Gradient hero card with sparkles & CTA
    │   ├── CourseProgressCard.tsx       # 3 summary progress cards (links to detail)
    │   ├── CourseCard.tsx               # Continue watching course card (links to detail)
    │   ├── ContinueWatchingSection.tsx   # Carousel wrapper & controls
    │   ├── LessonTable.tsx              # Lesson table (responsive table & cards)
    │   ├── StatisticCard.tsx            # SVG progress ring & Recharts bar chart
    │   ├── MentorList.tsx               # Mentor cards with follow toggles
    │   ├── CategoryBadge.tsx            # Reusable pill badge component
    │   └── PlaceholderView.tsx          # Secondary page view for router
    ├── pages/
    │   ├── CourseDetailPage.tsx         # Course detail view with video, tabs & curriculum
    │   ├── LoginPage.tsx                # Login page with validation & loading
    │   ├── RegisterPage.tsx             # Register account page
    │   └── ForgotPasswordPage.tsx       # Password recovery page
    ├── App.tsx                          # App router, protected routes & state
    ├── main.tsx                         # Entry point
    └── index.css                        # Tailwind directives & smooth scrollbar
```
