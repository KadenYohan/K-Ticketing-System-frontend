# K-Ticketing System — Figma Design Brief
## Website Version (Separate from Kiosk & App)

> **Scope of this document:** This brief covers the **website version** of the K-Ticketing System — a full-screen browser experience accessible from any desktop or laptop. It is architecturally separate from (1) the in-terminal Kiosk (`/kiosk`), and (2) the conductor mobile scanner (`/scanner`), but all three share the same React frontend repository and backend API. The website version is designed around a **wider viewport (1280px+)** with richer layouts, persistent navigation, and an admin dashboard layer not present in the kiosk or app versions.

---

## Table of Contents

1. [Design System & Tokens](#1-design-system--tokens)
2. [Typography](#2-typography)
3. [Spacing & Grid](#3-spacing--grid)
4. [Component Library](#4-component-library)
5. [Page Routes & Navigation Map](#5-page-routes--navigation-map)
6. [Customer-Facing Pages (Website Version)](#6-customer-facing-pages-website-version)
7. [Admin Dashboard Pages](#7-admin-dashboard-pages)
8. [Existing Kiosk Version (Reference)](#8-existing-kiosk-version-reference)
9. [Existing Conductor Scanner Version (Reference)](#9-existing-conductor-scanner-version-reference)
10. [Full Figma Prompt](#10-full-figma-prompt)

---

## 1. Design System & Tokens

### Color Palette

The existing frontend uses a purple-accent design system. The website version extends this with a structured semantic scale.

#### Primary Colors

| Token                | Light Mode Value                | Dark Mode Value                 | Usage                         |
|---------------------|---------------------------------|---------------------------------|-------------------------------|
| `--color-bg`        | `#FFFFFF`                       | `#16171D`                       | Page background                |
| `--color-surface`   | `#F9F8FD`                       | `#1E1F27`                       | Card / panel background        |
| `--color-surface-2` | `#F4F3EC`                       | `#1F2028`                       | Code blocks, nested surfaces   |
| `--color-border`    | `#E5E4E7`                       | `#2E303A`                       | Dividers, card outlines        |
| `--color-text`      | `#6B6375`                       | `#9CA3AF`                       | Body text / secondary text     |
| `--color-text-h`    | `#08060D`                       | `#F3F4F6`                       | Headlines, primary text        |
| `--color-accent`    | `#AA3BFF`                       | `#C084FC`                       | Brand accent — CTAs, highlights|
| `--color-accent-bg` | `rgba(170,59,255,0.10)`         | `rgba(192,132,252,0.15)`        | Accent tinted backgrounds      |
| `--color-accent-bd` | `rgba(170,59,255,0.50)`         | `rgba(192,132,252,0.50)`        | Accent tinted borders          |

#### Semantic / Status Colors

| Token                  | Value (both modes)       | Usage                             |
|-----------------------|--------------------------|-----------------------------------|
| `--color-success`     | `#22C55E`                | Valid tickets, available seats    |
| `--color-success-bg`  | `rgba(34,197,94,0.10)`   | Success state backgrounds         |
| `--color-warning`     | `#F59E0B`                | Reserved seats, expiry warnings   |
| `--color-warning-bg`  | `rgba(245,158,11,0.10)`  | Warning state backgrounds         |
| `--color-danger`      | `#EF4444`                | Invalid tickets, booked seats     |
| `--color-danger-bg`   | `rgba(239,68,68,0.10)`   | Error state backgrounds           |
| `--color-info`        | `#3B82F6`                | Selected seats, info alerts       |
| `--color-info-bg`     | `rgba(59,130,246,0.10)`  | Info state backgrounds            |

#### Seat Status Color Map (used in SeatGrid)

| Seat Status   | Background Color | Label Color | Meaning                    |
|--------------|-----------------|-------------|----------------------------|
| `available`  | `#22C55E`       | `#FFFFFF`   | Open for selection         |
| `selected`   | `#3B82F6`       | `#FFFFFF`   | User's active choice       |
| `reserved`   | `#9CA3AF`       | `#FFFFFF`   | Temporarily held by someone|
| `booked`     | `#EF4444`       | `#FFFFFF`   | Permanently taken          |
| `boarded`    | `#EF4444`       | `#FFFFFF`   | Already boarded (= taken)  |

#### Payment / System Colors

| Token                | Value            | Usage                        |
|---------------------|-----------------|------------------------------|
| `--color-gcash`     | `#007DFF`        | GCash brand blue              |
| `--color-gcash-bg`  | `rgba(0,125,255,0.10)` | GCash tinted panel    |
| `--color-cash`      | `#16A34A`        | Cash payment brand green      |
| `--color-cash-bg`   | `rgba(22,163,74,0.10)` | Cash tinted panel      |

---

## 2. Typography

### Font Stack

```
Primary:  'Inter', system-ui, 'Segoe UI', Roboto, sans-serif
Heading:  'Inter', system-ui, 'Segoe UI', Roboto, sans-serif
Mono:     ui-monospace, 'Cascadia Code', Consolas, monospace
```

> Import from Google Fonts: `Inter` (weights 400, 500, 600, 700)

### Type Scale

| Name        | Size    | Line Height | Weight | Letter Spacing | Usage                   |
|------------|---------|-------------|--------|----------------|-------------------------|
| `display`  | 56px    | 110%        | 700    | −2.8px         | Hero headlines          |
| `h1`       | 48px    | 115%        | 600    | −1.68px        | Page titles             |
| `h2`       | 32px    | 120%        | 600    | −0.64px        | Section headers         |
| `h3`       | 24px    | 125%        | 600    | −0.24px        | Card titles             |
| `h4`       | 18px    | 130%        | 600    | 0              | Sub-section labels      |
| `body-lg`  | 18px    | 145%        | 400    | +0.18px        | Lead paragraphs         |
| `body`     | 16px    | 145%        | 400    | +0.16px        | General body copy       |
| `body-sm`  | 14px    | 145%        | 400    | +0.14px        | Captions, meta text     |
| `label`    | 12px    | 130%        | 600    | +0.6px (uppercase) | Form labels, badges |
| `mono`     | 15px    | 135%        | 400    | 0              | Code, ticket IDs, QR values |

---

## 3. Spacing & Grid

### Spacing Scale (8px base grid)

| Token   | Value | Usage                               |
|---------|-------|-------------------------------------|
| `sp-1`  | 4px   | Micro gaps (icon + label)           |
| `sp-2`  | 8px   | Inner padding, tight spacing        |
| `sp-3`  | 12px  | Small components                    |
| `sp-4`  | 16px  | Default padding                     |
| `sp-5`  | 20px  | Section padding (mobile)            |
| `sp-6`  | 24px  | Card padding                        |
| `sp-8`  | 32px  | Section gaps                        |
| `sp-10` | 40px  | Large section padding               |
| `sp-12` | 48px  | Hero vertical padding               |
| `sp-16` | 64px  | Page-level section gaps             |
| `sp-20` | 80px  | Extra-large section separators      |

### Layout Grid (Website)

- **Max container width:** `1280px`  
- **Gutter:** `40px` on each side  
- **Column count:** 12  
- **Column gap:** `24px`  
- **Breakpoints:**
  - Mobile: `< 640px` (single column)
  - Tablet: `640px – 1024px` (6-column adapted)
  - Desktop: `> 1024px` (full 12-column)
  - Wide: `> 1440px` (still max-width 1280px, centered)

### Border Radius Scale

| Token    | Value  | Usage                     |
|---------|--------|---------------------------|
| `r-sm`  | 4px    | Small badges, code chips  |
| `r-md`  | 8px    | Buttons, inputs           |
| `r-lg`  | 12px   | Cards, modals             |
| `r-xl`  | 16px   | Large card panels         |
| `r-2xl` | 24px   | Hero sections, splash     |
| `r-full`| 9999px | Pills, avatar circles     |

### Shadow Scale

| Token      | Value                                                                 |
|-----------|-----------------------------------------------------------------------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)`                                      |
| `shadow-md` | `0 4px 6px -2px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.10)` |
| `shadow-lg` | `0 10px 25px -5px rgba(0,0,0,0.10), 0 20px 40px -10px rgba(0,0,0,0.15)` |
| `shadow-accent` | `0 0 0 3px rgba(170,59,255,0.30)` (focus ring / selection state) |

---

## 4. Component Library

### Atoms

#### Button Variants
```
Primary:    bg=--color-accent, text=white, hover=darken 8%
Secondary:  bg=--color-accent-bg, text=--color-accent, border=--color-accent-bd
Outline:    bg=transparent, border=--color-border, text=--color-text-h
Ghost:      bg=transparent, text=--color-text, hover=--color-surface
Danger:     bg=--color-danger, text=white
Success:    bg=--color-success, text=white
```
- Height: 40px (default), 48px (large), 32px (small)
- Padding: 16px horizontal (default)
- Border radius: `r-md`
- Transition: `background 0.2s, box-shadow 0.2s, transform 0.1s`
- Active state: `translateY(1px)` + remove shadow

#### Input / Select / Textarea
- Height: 44px (input, select), auto (textarea)
- Border: `1px solid --color-border`
- Border radius: `r-md`
- Focus: `border-color --color-accent`, `shadow-accent`
- Placeholder: `--color-text` at 60% opacity

#### Badge / Status Pill
- Variants: `success`, `warning`, `danger`, `info`, `neutral`
- Height: 22px, padding: `4px 10px`
- Font: `label` style (12px, 600, uppercase)
- Border radius: `r-full`

#### Seat Button (SeatGrid cell)
- Size: 48px × 48px (website), 40px × 40px (kiosk)
- Border radius: `r-md`
- Font: 14px, 700
- States: available (green), selected (blue ring 3px), reserved (grey), booked (red), disabled cursor

### Molecules

#### Bus Card
A card showing one bus departure entry in the list:
```
┌────────────────────────────────────────────────────┐
│  🕐 08:00 AM     →  Manila               [Select]  │
│  ₱ 250 / seat    |  42 available   |  Scheduled    │
└────────────────────────────────────────────────────┘
```
- Border: `1px solid --color-border`
- Border radius: `r-lg`
- Padding: `sp-6`
- Hover: `shadow-md`, border changes to `--color-accent-bd`
- Status badge on the right edge (Scheduled / Departed / Cancelled)

#### Ticket Card (Success State)
```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│         ✔ BOOKING CONFIRMED            │
│  Destination: MANILA                   │
│  Departure: June 23, 2026 @ 08:00 AM   │
│  Seats: 12, 13, 14                     │
│  Passengers: 3 Pax                     │
│  Payment: GCash                        │
│  ─────────────────────────────────     │
│          [QR Code — 200×200]           │
│     Scan this to board your bus        │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```
- Background: `--color-surface`
- Border: `2px dashed --color-border`
- Border radius: `r-xl`
- Dashed border style evokes a physical ticket
- Save/Screenshot CTA button below

#### Countdown Timer Bar
```
  ⏱ Reservation expires in: 04:32
  ████████████████░░░░░░░░  (progress bar, fills left→right, red when < 60s)
```

#### Payment Method Card
- Two-panel layout side by side (GCash | Cash) on desktop
- Single stacked on mobile
- Selected state: border `--color-accent`, background `--color-accent-bg`, checkmark icon

#### Step Progress Indicator
```
  ① Destination  ─────  ② Bus  ─────  ③ Seats  ─────  ④ Payment  ─────  ⑤ Ticket
       ●                  ●               ●               ○                 ○
   (completed)       (completed)      (current)        (future)          (future)
```
- Circle size: 32px, filled (completed), outlined (future), pulsing ring (current)
- Connector: 2px line, accent color when completed, border color when not

### Organisms

#### Top Navigation Bar (Website)
```
[K-Ticketing Logo]         [Book a Ticket]  [My Tickets]  [How It Works]  [Login / Admin]
```
- Height: 64px
- Background: `--color-bg` with `border-bottom: 1px solid --color-border`
- Sticky on scroll with `backdrop-filter: blur(12px)` + semi-transparent bg
- Logo: Bold "K" monogram in `--color-accent` + "Ticketing" text

#### Footer (Website Customer)
```
[K-Ticketing Logo + tagline]     [Quick Links]     [Routes]     [Contact/Support]
─────────────────────────────────────────────────────────────────────────────────
© 2026 K-Ticketing. All rights reserved.             [LAN indicator badge]
```

#### Admin Sidebar (Admin Dashboard)
```
│ K-TICKETING ADMIN           │
│─────────────────────────────│
│ 📊 Dashboard Overview       │
│ 🚌 Bus Management           │
│ 🎫 Ticket Registry          │
│ 💳 Payment Transactions     │
│ 💺 Seat Monitor             │
│ 📡 Live Bus Status          │
│─────────────────────────────│
│ ⚙️ System Settings          │
│ 🔄 Seed / Reset Data        │
│─────────────────────────────│
│ [Admin Avatar + Name]       │
│ Sign Out                    │
```

---

## 5. Page Routes & Navigation Map

### Customer (Website) Routes

```
/                           ← Landing / Home
/book                       ← Booking Wizard (Step 1: Destination)
  ?step=2                   ← Step 2: Bus Selection
  ?step=3                   ← Step 3: Seat Selection
  ?step=4                   ← Step 4: Payment
  ?step=5                   ← Step 5: Ticket Confirmation
/tickets                    ← "View My Ticket" (QR lookup by ticket ID)
/routes                     ← Browse destinations & schedules (read-only)
/how-it-works               ← FAQ / explainer page
```

### Admin Routes

```
/admin                      ← Admin Login (if no session)
/admin/dashboard            ← Overview stats
/admin/buses                ← Bus list + status management
/admin/buses/:busId         ← Single bus detail + seat map live view
/admin/tickets              ← All tickets with filters
/admin/tickets/:ticketId    ← Single ticket detail
/admin/payments             ← Payment transactions (GCash + Cash)
/admin/scanner              ← Embedded conductor scanner (same as /scanner)
/admin/settings             ← API config, mock toggle, system info
/admin/seed                 ← Seed/reset data tool
```

### Existing Routes (Kiosk & Conductor — NOT website)

```
/kiosk                      ← Terminal kiosk (full-screen, no nav bar)
/scanner                    ← Conductor QR scanner (mobile, no nav bar)
```

---

## 6. Customer-Facing Pages (Website Version)

### 6.1 Landing Page (`/`)

**Purpose:** First touchpoint. Communicates the product value and drives bookings.

**Layout:**
- Full-width hero section (100vh) with animated gradient background (purple → dark violet)
- Centered headline, subtitle, and a prominent "Book a Ticket" CTA
- Below the fold: 3-column feature grid, destination cards, "How It Works" mini-section
- Footer

**Hero Section Content:**
```
[Animated background: subtle moving gradient blobs in #AA3BFF + #3B82F6]

    K-Ticketing
    Fast. Simple. Reliable.
    Bus tickets for [Manila | Baguio | Pampanga] — no queuing required.

    [Book a Ticket Now →]  [View Routes]

    ↓ scroll
```

**Feature Strip (3 columns):**
| Icon | Heading | Body |
|------|---------|------|
| 🎫 | Instant Booking | Select your seat and pay via GCash or cash at the terminal. |
| 📱 | Book from Your Phone | No app download needed. Open the website and you're ready. |
| ✅ | Scan & Board | Your QR ticket is your boarding pass. Show it to the conductor. |

**Destination Cards (3 cards in a row):**
Each card: destination photo/illustration + destination name + next available departure time + CTA "Book →"

**"How It Works" (4 steps, horizontal on desktop):**
1. Choose destination & bus
2. Select your seats
3. Pay (GCash or cash)
4. Show QR code to board

---

### 6.2 Booking Wizard (`/book`)

The booking wizard is a **multi-step flow** maintained in a single-page with URL query parameter tracking. The page should show:
- A sticky top progress bar (step indicator: Destination → Bus → Seats → Payment → Ticket)
- Main content area for the current step
- A sticky bottom summary bar (shows destination, bus time, seats selected, total) once user is past step 1

#### Step 1 — Destination Selection

**URL:** `/book` or `/book?step=1`

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  ① Destination  ──  ② Bus  ──  ③ Seats  ──  ④ Pay  ──  ⑤ Done │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   Where are you traveling today?                             │
│                                                              │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│   │  📍 Manila   │  │  📍 Baguio   │  │ 📍 Pampanga  │      │
│   │  3 hrs       │  │  6 hrs       │  │  2 hrs       │      │
│   │  from ₱150   │  │  from ₱300   │  │  from ₱100   │      │
│   └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
- API: `GET /destinations`
- Destination cards are large, full-color, with hover lift animation
- Tapping a card advances to Step 2 (calls `GET /buses?destination={d}&date={today}`)

#### Step 2 — Bus / Schedule Selection

**URL:** `/book?step=2`

**Layout:**
```
  ← Back to Destinations

  Departures to Manila — June 23, 2026
  ─────────────────────────────────────
  [Bus Card — 06:00 AM — 8 seats left — ₱250]
  [Bus Card — 08:00 AM — 42 seats left — ₱250]  ← highlighted (most available)
  [Bus Card — 10:00 AM — DEPARTED]  ← greyed out, non-selectable
  ...
```
- API: `GET /buses?date={date}&destination={dest}`
- Each row is a Bus Card molecule (see Section 4)
- Departed buses show greyed-out card with "Departed" badge — not clickable
- Selecting a bus calls `GET /buses/{busId}/seats` then advances to Step 3

#### Step 3 — Seat Selection

**URL:** `/book?step=3`

**Layout (2-panel on desktop):**
```
  Left panel (2/3 width):          Right panel (1/3 width):
  ┌──────────────────────────┐     ┌────────────────────────┐
  │  Choose Your Seats       │     │  📋 Summary            │
  │  Bus to Manila @ 08:00   │     │  Manila @ 08:00 AM     │
  │  [Refresh Map]           │     │  ₱250 / seat           │
  │                          │     │                        │
  │  LEGEND:                 │     │  Selected: 2 seats     │
  │  🟢 Available            │     │  Seats: 12, 13         │
  │  🔵 Selected             │     │  Total: ₱500           │
  │  ⚫ Reserved             │     │                        │
  │  🔴 Booked/Boarded       │     │  [Proceed to Payment →]│
  │                          │     │  (disabled if 0 seats) │
  │  [5-column Seat Grid]    │     └────────────────────────┘
  │  Seats 1–50              │
  └──────────────────────────┘
```
- API: `GET /buses/{busId}/seats`
- SeatGrid: 5 columns × 10 rows = 50 cells
- Manual "Refresh Map" button (no auto-refresh per spec)
- On "Proceed to Payment": calls `POST /reservations` — on 409 (conflict), show inline error banner and refresh map
- Countdown timer does NOT start here; it starts after reservation is created (Step 4)

#### Step 4 — Payment

**URL:** `/book?step=4`

**Layout:**
```
  ⚠ Reservation expires in: 04:32  [████████████████░░░░]

  Payment for 2 seats to Manila @ 08:00 AM
  Total: ₱500

  ┌──────────────────────────────────┐
  │  💙 Pay with GCash (GCash only)  │  ← Only option in website/app version
  │                                  │
  │  [Generate GCash QR Code]        │
  │  (after click: QR image appears) │
  │  Status: PENDING → PAID          │
  └──────────────────────────────────┘

  [Cancel Reservation & Go Back]
```
- **Website version shows GCash ONLY** (no cash payment option)
- API: `POST /payments` → returns `qrImageUrl` + `redirectUrl`
- Show QR image for scan; also show a "Open GCash Checkout" button that uses `redirectUrl`
- Poll `GET /payments/{id}/status` every 2 seconds
- Countdown timer bar shows remaining reservation time (derived from `expiresAt`)
- If reservation expires → alert → redirect to step 1
- If payment fails → show error state with option to retry

#### Step 5 — Ticket Confirmation

**URL:** `/book?step=5`

**Layout:**
```
  ✅ Booking Confirmed!

  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  │      K-TICKETING TICKET        │
  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
  │  DESTINATION: MANILA           │
  │  Date: June 23, 2026           │
  │  Departure: 08:00 AM           │
  │  Seats: 12, 13                 │
  │  Passengers: 2 Pax             │
  │  Payment: GCash ✓              │
  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
  │     [QR Code — 240×240px]      │
  │   Present this QR to board     │
  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘

  📸 Take a screenshot to save your ticket.
  [Book Another Ticket]
```
- No auto-return timer (website version — user navigates away manually)
- QR code generated from `ticket.qrCode` UUID using `qrcode.react`
- Screenshot prompt is visible text (no system API needed)
- "Book Another Ticket" resets to Step 1

---

### 6.3 Ticket Lookup Page (`/tickets`)

**Purpose:** Allow a passenger who lost their tab to re-access their QR ticket.

> **Note:** This page is a website-only convenience page. The backend does not have a "get ticket by ID" API in the current spec; this page could use local storage to retrieve the last ticket UUID and display the QR, or it could be a future API endpoint. Design it as a future-ready page.

**Layout:**
```
  Find Your Ticket

  [Enter your Ticket ID]  [Look Up →]

  (After lookup:)
  ┌──────────────────────┐
  │  Ticket found!       │
  │  Destination: Manila │
  │  Seats: 12, 13       │
  │  [QR Code]           │
  └──────────────────────┘
```

---

### 6.4 Routes Page (`/routes`)

**Purpose:** Browseable schedule of all available buses — read-only, no booking.

**Layout:**
- Destination filter tabs (Manila | Baguio | Pampanga)
- Date picker (defaults to today)
- Table/card list of all buses with departure time, available seats, price, status
- "Book This Bus" CTA on each row → deep-links to `/book?step=3&busId={id}`

---

### 6.5 How It Works Page (`/how-it-works`)

**Purpose:** FAQ and process explainer for new passengers.

**Layout:**
- Large illustrated step-by-step section (4 steps, alternating image/text)
- FAQ accordion at the bottom
- CTA at the bottom → "Ready? Book Now"

---

## 7. Admin Dashboard Pages

> **Auth note:** For the prototype, admin pages are protected by a simple session/token pattern. No full auth system is in scope, but the login page should be designed.

### 7.1 Admin Login (`/admin`)

**Layout:**
```
  ┌───────────────────────────────────┐
  │  K-Ticketing Admin                │
  │                                   │
  │  [Username input]                 │
  │  [Password input]                 │
  │  [Sign In →]                     │
  │                                   │
  │  Authorized personnel only.       │
  └───────────────────────────────────┘
```
- Centered card on dark background
- Subtle animated gradient background (same accent colors)
- No "forgot password" for prototype

---

### 7.2 Admin Dashboard Overview (`/admin/dashboard`)

**Layout (2-column sidebar + main):**
```
┌──────────────┬───────────────────────────────────────────────────────┐
│ SIDEBAR      │  DASHBOARD OVERVIEW                                   │
│              │                                                       │
│ Dashboard    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│ Buses        │  │ 24   │ │ 847  │ │ ₱212K│ │  97% │                │
│ Tickets      │  │ Buses│ │Tickets│ │Revenue│ │Occup.│               │
│ Payments     │  └──────┘ └──────┘ └──────┘ └──────┘                │
│ Live Status  │                                                       │
│ Settings     │  Buses by Destination (Bar chart)                    │
│ Seed/Reset   │  ┌────────────────────────────────────────────────┐  │
│              │  │  Manila ████████████████ 8 buses               │  │
│              │  │  Baguio ████████████████ 8 buses               │  │
│              │  │  Pampanga ██████████████ 8 buses               │  │
│              │  └────────────────────────────────────────────────┘  │
│              │                                                       │
│              │  Recent Tickets (last 10)                            │
│              │  [Table: Ticket ID | Route | Seats | Payment | Time] │
└──────────────┴───────────────────────────────────────────────────────┘
```

**KPI Cards (4 across top):**
1. **Total Buses Today** — count of all buses (24 if fully seeded)
2. **Tickets Issued Today** — count from tickets table
3. **Revenue Today** — sum of `total_amount` from tickets (paid only)
4. **Occupancy Rate** — `(booked + boarded seats) / total seats × 100`

**Charts:**
- Booking timeline chart (x=hour, y=tickets issued) — line or bar
- Destination breakdown (pie or bar chart)
- Payment method split (GCash vs Cash) — donut chart

---

### 7.3 Bus Management (`/admin/buses`)

**Layout:**
```
  BUS MANAGEMENT                     [+ Seed New Buses]  [Reset All Data]

  Destination: [All ▾]   Status: [All ▾]   Date: [Today ▾]   [Search bus ID]

  ┌────────┬────────────┬─────────┬───────────┬────────────┬──────────┬─────────┐
  │ Bus ID │ Destination│ Departs │ Available │  Reserved  │  Booked  │ Status  │
  ├────────┼────────────┼─────────┼───────────┼────────────┼──────────┼─────────┤
  │ abc123 │ Manila     │ 08:00   │    42     │     3      │    5     │ Sched.  │
  │ ...    │ ...        │ ...     │ ...       │ ...        │ ...      │ ...     │
  └────────┴────────────┴─────────┴───────────┴────────────┴──────────┴─────────┘

  [View Details] button on each row
```
- Rows are color-coded: white = scheduled, light yellow = near departure, light grey = departed
- Clicking a row navigates to `/admin/buses/:busId`
- Status badge (Scheduled / Departed / Cancelled) on each row

---

### 7.4 Bus Detail / Live Seat Monitor (`/admin/buses/:busId`)

**Layout (2-panel):**
```
  ← Back to Buses

  Bus: Manila @ 08:00 AM (abc123)
  Status: SCHEDULED | Available: 42 | Reserved: 3 | Booked: 5 | Boarded: 0
  Price: ₱250/seat

  ┌────────────────────────────────────────┐   ┌──────────────────────────────┐
  │  LIVE SEAT MAP                  [↺ Refresh]│  Recent Activity             │
  │                                        │   │                              │
  │  [50-seat grid — full admin view]      │   │  12:30 — Seat 12 booked      │
  │                                        │   │  12:28 — Seat 13 reserved    │
  │  Legend: 🟢 Avail 🔵 Reserved 🔴 Booked 🟡 Boarded │   │  12:25 — Seat 5 boarded      │
  │                                        │   │  ...                         │
  └────────────────────────────────────────┘   └──────────────────────────────┘
```
- API: `GET /buses/{busId}/seats` (auto-refresh every 10s)
- Admin view shows all 4 seat states including `boarded` (shown in amber)
- Activity log is a scrollable list (design only; may be local state in prototype)

---

### 7.5 Ticket Registry (`/admin/tickets`)

**Layout:**
```
  TICKET REGISTRY

  Search: [Ticket ID or destination]   Payment: [All ▾]   Date: [Today ▾]

  ┌────────┬────────────┬────────┬───────────┬────────────┬───────────┬─────────┐
  │Ticket  │ Destination│ Seats  │  Pax      │  Payment   │  Amount   │ Boarded │
  ├────────┼────────────┼────────┼───────────┼────────────┼───────────┼─────────┤
  │ abc... │ Manila     │ 12,13  │    2      │  GCash ✓   │  ₱500     │  Yes    │
  │ ...    │ ...        │ ...    │ ...       │ ...        │ ...       │ ...     │
  └────────┴────────────┴────────┴───────────┴────────────┴───────────┴─────────┘
```
- Pagination at the bottom
- Row click → `/admin/tickets/:ticketId` (detail view with QR code)

---

### 7.6 Single Ticket Detail (`/admin/tickets/:ticketId`)

**Layout:**
```
  ← Back to Tickets

  ┌─────────────────────────────────────────────────────┐
  │  TICKET DETAIL                                      │
  │  Ticket ID: abc-123-... (UUID)                      │
  │  ─────────────────────────────────────────────────  │
  │  Destination: Manila     |  Departure: 08:00 AM     │
  │  Date: June 23, 2026     |  Seats: 12, 13           │
  │  Passengers: 2 Pax       |  Amount: ₱500            │
  │  Payment Method: GCash   |  Status: PAID            │
  │  Boarded At: 07:45 AM    |  Created At: 07:30 AM    │
  │  ─────────────────────────────────────────────────  │
  │  [QR Code — 200×200]                               │
  │  QR Value: abc-123-...                              │
  └─────────────────────────────────────────────────────┘
```

---

### 7.7 Payment Transactions (`/admin/payments`)

**Layout:**
```
  PAYMENT TRANSACTIONS

  Type: [All ▾ | GCash | Cash]   Status: [All ▾ | Pending | Paid | Failed]

  ┌──────────┬────────────┬───────────┬──────────┬──────────┬──────────────────┐
  │ Pay. ID  │ Ticket ID  │  Method   │  Amount  │  Status  │  Timestamp       │
  ├──────────┼────────────┼───────────┼──────────┼──────────┼──────────────────┤
  │ pay-...  │ tix-...    │  GCash    │  ₱500    │  PAID ✓  │  2026-06-23 07:30│
  │ pay-...  │ tix-...    │  Cash     │  ₱250    │  PAID ✓  │  2026-06-23 08:12│
  │ pay-...  │ (expired)  │  GCash    │  ₱300    │  FAILED  │  2026-06-23 09:00│
  └──────────┴────────────┴───────────┴──────────┴──────────┴──────────────────┘
```

---

### 7.8 Live Bus Status (`/admin/scanner` or `/admin/live`)

**Purpose:** Admin-embedded version of the conductor scanner with a wider layout and status overlay. The admin can see a live seat map alongside the scanner.

**Layout (2-panel):**
```
  ┌──────────────────────────────┬──────────────────────────────────────┐
  │  CONDUCTOR SCANNER           │  LIVE SEAT MAP (selected bus)         │
  │  Bus: [dropdown selector]    │  [50-seat grid, auto-refresh 5s]     │
  │                              │                                      │
  │  [Camera preview]            │  Boarded: 12  |  Remaining: 30       │
  │  [Scan result result panel]  │                                      │
  └──────────────────────────────┴──────────────────────────────────────┘
```

---

### 7.9 System Settings (`/admin/settings`)

**Layout:**
```
  SYSTEM SETTINGS

  ┌──────────────────────────────────────────────────────────────┐
  │  API Configuration                                           │
  │  API Base URL:  [http://localhost:3000        ] [Save]       │
  │  Use Mock Data: [Toggle ON/OFF]                              │
  │  Mock Datetime: [_____________ ISO-8601] [Apply]            │
  │  ─────────────────────────────────────────────────────────  │
  │  System Info                                                 │
  │  Frontend Version: 1.0.0                                    │
  │  Build Mode: Development / Production                        │
  │  Connected to Backend: ✅ (green dot + latency ms)          │
  └──────────────────────────────────────────────────────────────┘
```

---

### 7.10 Seed & Reset Tool (`/admin/seed`)

**Layout:**
```
  SEED / RESET DATA

  ⚠ WARNING: These actions affect all booking data.

  ┌──────────────────────────────────────────┐
  │  Seed Buses                              │
  │  Date: [2026-06-23] Destination: [All ▾] │
  │  [Run Seed Script]                       │
  └──────────────────────────────────────────┘

  ┌──────────────────────────────────────────┐
  │  Full Reset                              │
  │  This deletes ALL tickets, reservations, │
  │  payments, and resets all seats.         │
  │  [🔴 Reset All Data — Irreversible]      │
  └──────────────────────────────────────────┘

  Seed Log:
  ─────────────────────────────────
  [2026-06-23 08:00] Seeded 24 buses, 1200 seats.
  [2026-06-22 23:00] Full reset completed.
```

---

## 8. Existing Kiosk Version (Reference)

> These pages already exist in the codebase (`/kiosk` route → `KioskPage.jsx`). They should be documented in Figma as a **separate platform** with their own frame set. The design on these pages does NOT include a top nav bar or footer.

### Kiosk Flow (5 steps, single component with step state)

| Step | Screen Name               | Key Elements                              |
|------|--------------------------|-------------------------------------------|
| 1    | Destination Selection     | Large tap-target buttons, destination list from `/destinations` API |
| 2    | Bus Selection             | Bus cards with departure time, price, seat count; Back button |
| 3    | Seat Selection            | 5-column SeatGrid (50 seats), color-coded, Refresh + Proceed buttons |
| 4    | Payment Gate              | Countdown timer (from `expiresAt`); GCash QR + Cash confirm side by side; Cancel |
| 5    | Ticket Display            | Ticket card with QR, 30-second countdown auto-return timer |

**Kiosk Design Differences from Website:**
- No navigation bar, no footer
- Larger touch targets (buttons ≥ 60px height)
- Font sizes larger (h1 = 48px+)
- Full-width single-column layout
- GCash AND Cash payment (both available)
- Auto-return to Step 1 after 30 seconds on ticket screen

**Color context:** Same design tokens but heavier emphasis on large readable text for distance viewing.

---

## 9. Existing Conductor Scanner Version (Reference)

> These pages already exist in the codebase (`/scanner` route → `ScannerPage.jsx`). Design as a **mobile-first** frame set in Figma.

### Scanner Flow

| Step | Screen Name          | Key Elements                                     |
|------|---------------------|--------------------------------------------------|
| 1    | Bus Selection       | Full-width dropdown, bus list from `/buses` API (all destinations) |
| 2    | Scanning Active     | Camera viewport (250×250 QR box), bus info header |
| 3a   | Valid Result        | Green panel, seat numbers (large text), remaining unboarded count, Check In + Cancel |
| 3b   | Invalid Result      | Red panel, denial reason text, Dismiss button    |

**Scanner Design Differences:**
- Mobile viewport (375px width)
- No sidebar, no nav bar
- High-contrast colors (green/red panels) for quick recognition in transit environments
- Large action buttons (full-width, 56px height)
- Session persistence: selected bus ID stored in `sessionStorage`

---

## 10. Full Figma Prompt

Use the following prompt verbatim in Figma's AI or your design team brief to recreate the full K-Ticketing System design. Copy from the block below.

---

```
FIGMA DESIGN BRIEF — K-TICKETING SYSTEM

=== PROJECT OVERVIEW ===
Design a complete UI/UX system for "K-Ticketing" — a local-network bus ticketing
system for a P2P bus terminal in the Philippines. The system has three platforms:
1. A WEBSITE version (desktop-first, full nav) — THIS IS THE PRIMARY DESIGN TARGET
2. A KIOSK version (full-screen terminal display, existing)
3. A CONDUCTOR SCANNER version (mobile camera scanner, existing)

All three platforms share the same API and visual design language but are laid out
differently. Design them in separate Figma frames/sections.

=== BRAND & DESIGN LANGUAGE ===
Brand name: K-Ticketing
Brand mark: "K" in bold, deep purple; "Ticketing" in medium weight alongside it.
Tone: Modern, trustworthy, efficient. Think government-grade reliability with
      modern fintech aesthetics.

Style keywords: dark-mode ready, glassmorphism accents, purple-violet brand,
                clean card-based layouts, micro-animations indicated via notes,
                accessible contrast ratios.

=== COLOR SYSTEM ===
PRIMARY COLORS:
- Brand Accent:     #AA3BFF  (light mode) / #C084FC (dark mode)
- Accent BG:        rgba(170,59,255,0.10) / rgba(192,132,252,0.15)
- Accent Border:    rgba(170,59,255,0.50) / rgba(192,132,252,0.50)
- Page BG:          #FFFFFF (light) / #16171D (dark)
- Surface/Card:     #F9F8FD (light) / #1E1F27 (dark)
- Nested Surface:   #F4F3EC (light) / #1F2028 (dark)
- Border:           #E5E4E7 (light) / #2E303A (dark)
- Text Body:        #6B6375 (light) / #9CA3AF (dark)
- Text Headline:    #08060D (light) / #F3F4F6 (dark)

STATUS COLORS (shared both modes):
- Success Green:    #22C55E  |  Success BG: rgba(34,197,94,0.10)
- Warning Amber:    #F59E0B  |  Warning BG: rgba(245,158,11,0.10)
- Danger Red:       #EF4444  |  Danger BG:  rgba(239,68,68,0.10)
- Info Blue:        #3B82F6  |  Info BG:    rgba(59,130,246,0.10)

SEAT STATUS COLORS (for SeatGrid component):
- Available:  #22C55E (green)   — open seat
- Selected:   #3B82F6 (blue)    — user has chosen this seat, blue ring 3px
- Reserved:   #9CA3AF (grey)    — held by someone else, temporarily
- Booked:     #EF4444 (red)     — permanently taken
- Boarded:    #EF4444 (red)     — passenger has checked in (same as booked visually)

PAYMENT BRAND COLORS:
- GCash Blue: #007DFF  |  GCash BG: rgba(0,125,255,0.10)
- Cash Green: #16A34A  |  Cash BG:  rgba(22,163,74,0.10)

=== TYPOGRAPHY ===
Font: Inter (Google Fonts) — import weights 400, 500, 600, 700

TYPE SCALE:
- Display:  56px / 110% / 700 / letter-spacing -2.8px   (Hero headline)
- H1:       48px / 115% / 600 / letter-spacing -1.68px  (Page title)
- H2:       32px / 120% / 600 / letter-spacing -0.64px  (Section header)
- H3:       24px / 125% / 600 / letter-spacing -0.24px  (Card title)
- H4:       18px / 130% / 600                           (Sub-label)
- Body LG:  18px / 145% / 400 / letter-spacing +0.18px  (Lead paragraph)
- Body:     16px / 145% / 400 / letter-spacing +0.16px  (General copy)
- Body SM:  14px / 145% / 400 / letter-spacing +0.14px  (Caption/meta)
- Label:    12px / 130% / 600 / UPPERCASE / letter-spacing +0.6px  (Badges)
- Mono:     15px / 135% / 400  (Ticket IDs, QR codes)

=== SPACING SYSTEM (8px base grid) ===
sp-1=4px, sp-2=8px, sp-3=12px, sp-4=16px, sp-5=20px, sp-6=24px,
sp-8=32px, sp-10=40px, sp-12=48px, sp-16=64px, sp-20=80px

=== GRID ===
Max width: 1280px | Gutter: 40px | Columns: 12 | Gap: 24px
Breakpoints: Mobile <640px | Tablet 640–1024px | Desktop >1024px

=== BORDER RADIUS ===
r-sm=4px, r-md=8px, r-lg=12px, r-xl=16px, r-2xl=24px, r-full=9999px

=== SHADOWS ===
shadow-sm:     0 1px 2px rgba(0,0,0,0.05)
shadow-md:     0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.10)
shadow-lg:     0 10px 25px rgba(0,0,0,0.10), 0 20px 40px rgba(0,0,0,0.15)
shadow-accent: 0 0 0 3px rgba(170,59,255,0.30)  [used for focus/selected states]

=== COMPONENT SYSTEM ===

BUTTONS:
- Primary:    bg=#AA3BFF, text=white, hover=darken 8%, radius=r-md, height=40px
- Secondary:  bg=accent-bg, text=#AA3BFF, border=accent-bd, radius=r-md
- Outline:    bg=transparent, border=--border, text=text-heading, radius=r-md
- Ghost:      bg=transparent, text=body text, hover=surface, radius=r-md
- Danger:     bg=#EF4444, text=white
- Large size: height=48px, padding=20px horizontal
- Active:     translateY(1px), shadow removed
- Transition: 0.2s ease

INPUTS:
- Height: 44px | Border: 1px solid #E5E4E7 | Radius: r-md
- Focus: border #AA3BFF + shadow-accent
- Label: Body SM, 600, shown above input

BADGES:
- Height: 22px | Padding: 4px 10px | Radius: r-full | Font: 12px/600/UPPERCASE
- Variants: success (green), warning (amber), danger (red), info (blue), neutral (grey)

SEAT BUTTON (SeatGrid cell):
- Size: 48×48px | Radius: r-md | Font: 14px/700
- States: available=green, selected=blue+3px ring, reserved=grey, booked/boarded=red

BUS CARD:
- Border: 1px solid #E5E4E7 | Radius: r-lg | Padding: sp-6
- Hover: shadow-md + border color change to accent-bd
- Contains: departure time (H4), destination (Body), price, seat count, status badge

TICKET DISPLAY CARD:
- Background: surface | Border: 2px dashed #E5E4E7 | Radius: r-xl
- "Dashed border" style evokes a physical tear-off ticket
- Sections: header (checkmark + "CONFIRMED"), body (trip details), divider, QR code (240×240)

PAYMENT METHOD CARD:
- Two side-by-side panels on desktop (GCash + Cash)
- Selected: accent border + accent-bg background + checkmark
- Contains: payment icon, method name, description

STEP PROGRESS INDICATOR:
- Horizontal, 5 steps: Destination → Bus → Seats → Payment → Ticket
- Step circle: 32px diameter | completed=filled accent | current=accent+pulse | future=outline grey
- Connector line: 2px | accent when completed, border when future

COUNTDOWN TIMER BAR:
- Shows: "⏱ Reservation expires in: MM:SS"
- Progress bar below text: fills from left, green → amber (<2min) → red (<60s)
- Full width at top of payment step

=== NAVIGATION ===

WEBSITE TOP NAV:
- Height: 64px | Background: white/dark + backdrop-filter blur(12px)
- Sticky | Border-bottom: 1px solid #E5E4E7
- Left: [K logo + "K-Ticketing" wordmark]
- Center: [Book a Ticket] [Routes] [How It Works]
- Right: [Admin Login button in outline style]

ADMIN SIDEBAR:
- Width: 260px | Background: dark surface | Height: 100vh
- Items: Dashboard, Bus Management, Tickets, Payments, Live Status, Settings, Seed & Reset
- Active item: accent background highlight + left accent bar
- Bottom: admin avatar + name + sign out

WEBSITE FOOTER:
- 4-column layout: Brand/tagline | Quick Links | Routes | Support
- Bottom bar: copyright + "K-Ticketing v1.0"

=== PLATFORM 1: WEBSITE (DESKTOP-FIRST) ===
Frame size: 1440×900 (or 1280×800 at minimum)
Include both light and dark mode variants.

PAGE 1 — LANDING PAGE (/)
Full-width hero with animated gradient background (deep purple #AA3BFF to dark violet
#5B21B6). Center the hero text. Below: 3-column feature strip, 3 destination cards,
"How It Works" 4-step horizontal section, footer.

Hero text:
  Display: "K-Ticketing"
  H2: "Fast. Simple. Reliable."
  Body LG: "Bus tickets for Manila, Baguio, and Pampanga — no queuing required."
  Buttons: [Book a Ticket Now →] (Primary) + [View Routes] (Outline)
  Background: animated gradient blobs in #AA3BFF + #7C3AED + #2563EB

Destination Cards (3, in a row):
  Each: photo/illustration of destination, city name (H3), "from ₱XXX" label,
  "Next departure in X hours" badge, [Book →] button
  Border-radius: r-xl | Hover: lift shadow + slight scale

How It Works (4 horizontal steps):
  1. Choose destination & bus
  2. Select your seats
  3. Pay with GCash or cash
  4. Show QR code to board

PAGE 2 — BOOKING WIZARD (/book)
Sub-pages: Step 1 through Step 5. Show as 5 separate artboards labeled:
/book — Step 1: Destination, /book — Step 2: Bus, etc.

Show the 5-step progress indicator at the top of every step.
Show a sticky "Trip Summary" panel on the right (1/3 width) for steps 2–5.

Step 1: Destination — 3 large destination selection cards in a row.
Step 2: Bus Selection — scrollable list of Bus Cards with time, price, seat count,
        status badges. Departed buses are greyed out and unclickable.
Step 3: Seat Selection — left: 5-column SeatGrid (50 seats, color-coded) + legend +
        Refresh button; right: summary panel with seat count, total cost, CTA.
Step 4: Payment — countdown timer bar at top; GCash QR code panel (after trigger click
        shows 200×200 QR image, status polling badge PENDING→PAID); 
        Cancel Reservation link at bottom. Website shows GCash only.
Step 5: Ticket — centered Ticket Display Card with dashed border and QR code;
        screenshot prompt text; Book Another Ticket button below.

PAGE 3 — ROUTES PAGE (/routes)
Destination tabs (Manila | Baguio | Pampanga), date picker, scrollable table/card
list of all buses. Each row: time, seats available, price, status badge, Book CTA.

PAGE 4 — HOW IT WORKS (/how-it-works)
Large illustrated steps (alternating image-left/text-right), FAQ accordion, CTA.

PAGE 5 — TICKET LOOKUP (/tickets)
Centered card with search input for Ticket ID, lookup button, result panel with
QR code display.

=== PLATFORM 2: KIOSK (FULL-SCREEN TERMINAL) ===
Frame size: 1920×1080 (Full HD, landscape, touch-optimized)
NO navigation bar, NO footer. Single full-screen page with step state.
Larger font sizes, bigger touch targets (min 60px height buttons).

KIOSK — Step 1: Destination
H1: "K-TICKETING TERMINAL KIOSK" at top center.
H2: "Where are you traveling today?"
3 very large destination buttons (min 200px × 100px each).

KIOSK — Step 2: Bus Selection
H2: "Select Departure to [Destination]"
Bus Cards (wider, larger text). Back button at bottom.

KIOSK — Step 3: Seat Selection
H2: "Choose Your Seats (X Selected)"
5-column SeatGrid (50 cells, 60×60px each). Refresh + Proceed buttons.

KIOSK — Step 4: Payment Gate
H2: "Payment — Time Remaining: [MM:SS]" in red countdown
Side-by-side panels: Left = GCash (QR code after trigger), Right = Cash confirm button.
Cancel button at bottom. BOTH GCash and Cash are available on kiosk.

KIOSK — Step 5: Ticket Display
"TICKET PURCHASED SUCCESSFULLY!" in H2 success green.
Ticket card with destination, departure, seats, pax count, payment method, QR code.
30-second auto-return countdown text + "Return to Start Immediately" button.

=== PLATFORM 3: CONDUCTOR SCANNER (MOBILE) ===
Frame size: 390×844 (iPhone 14 viewport)
NO navigation bar, NO footer. Full-height mobile-first layout.

SCANNER — Bus Selection
H2: "CONDUCTOR BOARDING CONTROL" at top.
Full-width dropdown: "Select Your Assigned Bus Run"
Large green "Activate Camera Scanner" button once bus is selected.

SCANNER — Scanning Active
Camera preview box (250×250px, center of screen).
Selected bus info shown as header above.

SCANNER — Valid Result (green)
Full-screen green panel overlay.
"TICKET VALID" in large H2 (green).
Seat numbers in H1 size (very large, easy to read).
"Remaining unboarded: X" below.
Two buttons: [Check In & Board] (full-width green) + [Cancel] (grey).

SCANNER — Invalid Result (red)
Full-screen red panel overlay.
"ACCESS DENIED" in large H2 (red).
Reason text in bold.
[Dismiss & Continue Scanning] button (full-width grey).

=== ADMIN DASHBOARD PAGES ===
Frame size: 1440×900 with persistent left sidebar (260px wide).

ADMIN — Login (/admin)
Centered card on dark background with gradient. Username + Password fields + Sign In.

ADMIN — Dashboard (/admin/dashboard)
4 KPI cards at top (Total Buses, Tickets Issued, Revenue, Occupancy %).
Bar chart: buses by destination.
Line chart: bookings over time (hourly).
Donut chart: GCash vs Cash payment split.
Recent tickets table (last 10).

ADMIN — Bus Management (/admin/buses)
Filterable table with columns: Bus ID, Destination, Departure, Available, Reserved,
Booked, Status. Color-coded rows (white=scheduled, light yellow=near departure,
grey=departed). View Details button per row.

ADMIN — Bus Detail + Live Seat Map (/admin/buses/:busId)
Two-panel: Left = 50-seat SeatGrid with admin color coding (add amber for boarded).
Right = stats (boarded count, remaining) + activity log (recent bookings/boardings).
Auto-refresh every 10 seconds (annotate with note).

ADMIN — Ticket Registry (/admin/tickets)
Searchable/filterable table: Ticket ID, Destination, Seats, Pax, Payment Method,
Amount, Boarded status. Pagination. Row click → detail page.

ADMIN — Ticket Detail (/admin/tickets/:ticketId)
Full ticket details card with QR code display. All metadata visible including
created_at and used_at timestamps.

ADMIN — Payment Transactions (/admin/payments)
Filterable table: Payment ID, Ticket ID, Method (GCash/Cash), Amount, Status badge
(PAID/PENDING/FAILED), timestamp. GCash rows show PayMongo reference.

ADMIN — Live Scanner View (/admin/scanner)
Split: Left = embedded conductor scanner panel; Right = live seat map of selected bus.
Boarded count + remaining count shown as large numbers above the map.

ADMIN — Settings (/admin/settings)
Two setting cards: API Configuration (URL + mock toggle + mock datetime) and
System Info (version, mode, backend connection status with ping indicator).

ADMIN — Seed & Reset (/admin/seed)
Warning banner at top. Two action cards: (1) Seed Buses (date picker + destination
filter + run button), (2) Full Reset (red danger button with confirmation).
Scrollable seed log below with timestamped entries.

=== INTERACTION NOTES (for prototyping) ===
- Step progress indicator: clicking a completed step navigates back to that step
- Seat cells: hover = slight scale(1.05), click = toggle selected state
- Bus Cards: hover = shadow-md elevation, cursor pointer
- Payment status: annotate with "auto-polls every 2 seconds" note on the QR panel
- Countdown timer: annotate with "derived from API expiresAt field"
- Admin sidebar: active state = accent left border + accent background item
- Modal/overlay: confirm dialogs for Cancel Reservation and Reset All Data
- Toast notifications: success (green, slides from top-right) for booking confirmed,
  error (red) for conflict/failure states

=== FIGMA ORGANIZATION ===
Organize in these Figma Sections (use section frames):
1. "Design System" — color styles, type styles, spacing, icons, component library
2. "Website — Customer" — all /book, /, /routes, /how-it-works, /tickets pages
3. "Kiosk — Terminal" — all kiosk step screens
4. "Scanner — Conductor" — all scanner screens (mobile)
5. "Admin — Dashboard" — all /admin/* pages
6. "Prototyping Map" — a flow diagram showing page navigation for each platform

Use Auto Layout for all components. All text should use the defined text styles.
All colors should reference the shared color styles, not hard-coded hex values.

Include both LIGHT and DARK mode frames for the Website platform pages.
Include only LIGHT mode for Kiosk and Scanner (they run in controlled environments).
Include only DARK mode for Admin Dashboard (easier on the eyes for staff use).

=== END OF BRIEF ===
```

---

## Appendix: API Endpoints Quick Reference

These are the endpoints the frontend calls — useful for annotating interactions in Figma.

| Method | Endpoint                        | Called From                     | Purpose                          |
|--------|--------------------------------|---------------------------------|----------------------------------|
| GET    | `/destinations`                | Website Step 1, Kiosk Step 1   | List of available destinations   |
| GET    | `/buses?date=&destination=`    | Website Step 2, Kiosk Step 2, Scanner Step 1 | Filtered bus list  |
| GET    | `/buses/:busId/seats`          | Website Step 3, Kiosk Step 3   | Live seat map for one bus        |
| POST   | `/reservations`                | Website Step 3→4, Kiosk Step 3→4 | Reserve seats (starts 5-min timer) |
| DELETE | `/reservations/:id`            | Website Step 4, Kiosk Step 4   | Cancel active reservation        |
| POST   | `/payments`                    | Website Step 4, Kiosk Step 4   | Create GCash payment via PayMongo|
| GET    | `/payments/:id/status`         | Website Step 4, Kiosk Step 4   | Poll GCash payment status        |
| POST   | `/tickets`                     | Website Step 4→5, Kiosk Step 4→5 | Finalize booking (create ticket) |
| POST   | `/validate`                    | Scanner Scan Step              | Validate scanned QR code         |
| POST   | `/checkin`                     | Scanner Result Step            | Confirm boarding                 |

---

*Document generated: June 23, 2026*  
*Repository: K-Ticketing-System-frontend*  
*Version: 1.0 — Initial Figma Design Brief*
