# Coursue

Coursue is a polished, responsive learning-management dashboard built as a front-end demonstration. It includes course progress, lesson discovery, task management, messaging, and study-group collaboration with mock data persisted in the browser.

## Screenshot

> Screenshot placeholder — add the latest desktop and mobile captures under `docs/screenshots/` when release artwork is available.

## Highlights

- Responsive dashboard shell with desktop, tablet, and mobile navigation
- Light and dark themes with system preference detection
- Course catalog and detailed learning experience
- Task board with drag and drop, calendar, filters, and local persistence
- Inbox with conversations, attachments, typing simulation, and auto replies
- Study groups with discussion, member, resource, and session views
- Accessible keyboard navigation, focus-managed dialogs, reduced-motion support, and skip link
- Lazy-loaded routes, error boundary, skeleton loading, shared empty states, and 404 handling

## Tech stack

- React 18
- TypeScript with strict mode
- Vite 8
- Tailwind CSS 3
- React Router 7
- Lucide React
- Recharts
- dnd-kit
- oxlint

No back-end service is required. Authentication and feature data are simulated through `localStorage`.

## Getting started

Requirements:

- Node.js 20 or newer
- npm

Install and run:

```bash
npm install
npm run dev
```

The development server prints its local URL, normally `http://localhost:5173`.

Production checks:

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Mock login

The login is validation-only. Use any valid email address and any password containing at least eight characters.

Example:

```text
Email: student@coursue.test
Password: learn1234
```

The Google login button also enters the mock authenticated session.

## Routes

| Route | Description | Access |
| --- | --- | --- |
| `/login` | Mock sign in | Public |
| `/register` | Mock account registration | Public |
| `/forgot-password` | Password recovery form | Public |
| `/` | Learning dashboard | Protected |
| `/lesson` | Course and lesson catalog | Protected |
| `/course/:id` | Course detail and curriculum | Protected |
| `/task` | Task board and planner | Protected |
| `/inbox` | Mentor and friend messages | Protected |
| `/group` | Joined and discoverable study groups | Protected |
| `/group/:id` | Group discussion, members, and resources | Protected |
| `/settings` | Profile, appearance, notification, and account settings | Protected |
| `/notifications` | Full notification history and type filters | Protected |
| `/help` | Help and support placeholder | Protected |
| `*` | Friendly not-found page | Protected |

## Project structure

```text
src/
├── assets/                 Static project artwork
├── components/
│   ├── auth/               Authentication layout and route guard
│   ├── course/             Course-detail components
│   ├── group/              Study-group components
│   ├── inbox/              Messaging components
│   ├── lessons/            Lesson-list components
│   ├── task/               Task-board components
│   └── ui/                 Shared UI primitives and barrel exports
├── data/                   Typed mock data
├── hooks/                  Feature, theme, toast, and focus hooks
├── pages/                  Lazy-loaded route pages
├── types/                  Shared TypeScript models
├── App.tsx                 Router and application shell
├── index.css               Semantic theme variables and global styles
└── main.tsx                React entry point
```

## Design system and themes

Semantic colors such as `surface`, `content`, and `outline` are mapped to CSS variables in `src/index.css` and exposed through `tailwind.config.js`. The theme toggle stores its choice under `coursue_theme`; without a stored choice, Coursue follows `prefers-color-scheme`.

The early theme script in `index.html` applies the correct root class before React loads, preventing a light-theme flash.

## Browser storage

Coursue uses the following keys:

- `coursue_auth`
- `coursue_remember`
- `coursue_theme`
- `coursue_accent`
- `coursue_profile_v1`
- `coursue_notification_preferences_v1`
- `coursue_notifications_v1`
- `coursue_tasks_v1`
- `coursue_conversations_v1`
- `coursue_groups_v1`

Clear these keys in browser developer tools to reset the demo state.

## Environment variables

The current project does not use environment variables, so an `.env.example` file is intentionally unnecessary. If an API is added later, expose client-safe values with Vite's `VITE_` prefix and document them here.

## Accessibility

The interface includes visible keyboard focus, a skip link, semantic landmarks, labelled icon buttons, accessible tabs and live regions, focus trapping and restoration for overlays, 44px mobile touch targets, and a global reduced-motion mode.
