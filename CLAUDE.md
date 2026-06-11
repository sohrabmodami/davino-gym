# Davino Climbing Gym — Claude Code Guide

## Project Overview

React 19 + Vite 5 SPA for Davino Climbing Gym (باشگاه سنگنوردی داوینو).
Full RTL layout, Vazirmatn font, Persian content throughout.
No TypeScript — plain JSX.

## Dev Server

```bash
npm run dev        # http://localhost:5173
npm run build      # output: dist/
npm run preview    # preview built dist
```

## Key Architecture

### State / Data
- All admin data lives in `src/data/adminStore.jsx` via React Context + localStorage (`davino_admin` key).
- Hook: `useAdmin()` — gives `trainers`, `classes`, `gallery`, `pricing`, `settings`, and their mutators.
- Default data is in the same file (`defaultClasses`, `defaultSettings`, etc.) and is only used when localStorage is empty.

### Routing
- `src/App.jsx` — public routes: `/`, `/trainer/:id`, `/classes`
- `src/pages/admin/AdminApp.jsx` — admin routes under `/admin/*`
- Navbar supports both anchor-scroll links (`id`) and page navigation links (`href`).

### Admin Panel
- Login password: stored in `src/pages/admin/AdminLogin.jsx` line 4 (`const PASS = ...`)
- Sections: Dashboard, Trainers, Classes, Pricing, Gallery, Settings
- Admin nav defined in `src/pages/admin/AdminLayout.jsx`

## File Map

| Path | Purpose |
|---|---|
| `src/data/adminStore.jsx` | Central store — all data + mutations |
| `src/data/trainers.js` | Default trainer seed data |
| `src/components/Navbar.jsx` | Top nav, mobile drawer, mixed anchor/route links |
| `src/components/Hero.jsx` | Homepage hero — reads `settings.heroWallHeight`, `heroRating`, `heroCardTitle` |
| `src/components/ClassesPreview.jsx` | Homepage classes preview section (first 4 active) |
| `src/pages/Classes.jsx` | Full `/classes` page — filter by day/level/trainer/sessions, card + week view |
| `src/pages/TrainerProfile.jsx` | Public trainer profile `/trainer/:id` |
| `src/pages/admin/AdminTrainers.jsx` | Trainer CRUD + `ImageCropModal` (crop-box-on-image, 800×800 output) |
| `src/pages/admin/AdminSettings.jsx` | Site settings + `HeroCropModal` (16:10, 1200×750 output) |
| `src/pages/admin/AdminClasses.jsx` | Classes CRUD — title, trainer, days, time, level, sessions (4/8), capacity, price, color |

## Image Crop Approach

Both `ImageCropModal` (trainer) and `HeroCropModal` (hero) use the same pattern:
- Fixed displayed image, draggable crop box on top
- Box-shadow overlay: `0 0 0 9999px rgba(0,0,0,0.55)`
- `metaRef` pattern for stable `useEffect([])` access to image bounds
- Canvas output at natural image resolution → high quality JPEG

## Classes Data Shape

```js
{
  id, title, trainerName,
  days: ['شنبه', 'سه‌شنبه'],   // subset of 7 Persian weekdays
  startTime: '16:00', endTime: '17:30',
  level: 'مبتدی' | 'متوسط' | 'پیشرفته',
  sessions: 4 | 8,               // per month
  capacity, enrolled,
  price: '۲۵۰,۰۰۰',
  color: '#22C55E',
  active: true,
}
```

## Trainer Data Shape

```js
{
  id, name, role, initial,
  gradFrom, gradTo,              // gradient for avatar fallback
  photo,                         // base64 set via AdminTrainers crop upload
  days, exp, tag, level, cert, sessions, bio, specialties, achievements,
}
```

## Settings Fields

Key fields editable in AdminSettings:
- `heroTitle`, `heroSubtitle`, `heroBadge`, `heroImage`
- `heroWallHeight`, `heroRating`, `heroCardTitle` (floating badges on hero)
- `gymName`, `address`, `phone`, `mobile`, `hours`
- Social links + visibility flags: `instagram`, `telegram`, `whatsapp`, `youtube`

## Deployment

Built with `npm run build` → static files in `dist/`.
All routes must fall back to `index.html` on the server (SPA routing).

For Nginx add:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```
