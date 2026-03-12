# homeprojectiq_frontend_build_instructions.md
## Claude-Ready Frontend Build Instructions for HomeProjectIQ

## Objective

Build the **HomeProjectIQ** front end as a premium, mobile-first product with:

- modern Apple-level polish
- restrained glassmorphism
- the supplied HomeProjectIQ logo and mascot family
- a strong focus on clarity, trust, and guidance
- a responsive experience across mobile and web
- screen flows based on the existing architecture, UI system, and wireframe specs

This document is intended to be dropped directly into Claude Code or used by a frontend team as the implementation brief.

---

# 1. Product Summary

HomeProjectIQ is an AI-powered home repair and home readiness product.

The front end should help users quickly answer:

- What is the issue?
- How serious is it?
- Is DIY worth it?
- Do I have the tools?
- What do I do next?
- Am I doing the repair correctly as I go?
- What is most at risk in my home?
- How prepared is my household?

The UI should feel like:

- a premium consumer product
- a calm home intelligence dashboard
- a guided repair GPS
- a trustworthy decision engine

---

# 2. Tech Stack Requirements

Build using:

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** for base components where useful
- **Framer Motion** for subtle transitions
- **Lucide React** for icons when custom brand icons are not required

Use a clean app-router architecture.

---

# 3. Global Design Direction

## Design goals

The interface must feel:

- clean
- premium
- layered
- airy
- highly readable
- emotionally warm
- modern
- brand-consistent

## Visual style

Use:

- frosted glass panels
- soft translucent surfaces
- subtle blur
- refined shadows
- soft gradients
- crisp typography
- strong hierarchy

Avoid:

- clutter
- excessive glow
- overly playful layouts
- neon colors
- dense enterprise dashboard styling

---

# 4. Brand Asset Usage

Use the supplied files as the official brand system:

- app icon / logo
- mascot wave
- mascot magnify
- mascot arms crossed
- mascot clipboard
- mascot lightbulb

## Asset placement rules

### Logo
Use in:
- splash screen
- app header
- authentication / onboarding
- top-left app identity area

### Waving mascot
Use in:
- onboarding
- welcome states
- empty states
- repair completion success

### Magnifying mascot
Use in:
- diagnose / scan screen
- analysis loading state
- retry / low-confidence states

### Arms-crossed mascot
Use in:
- caution states
- borderline DIY recommendation
- “hire a pro” emphasis
- high-risk explanation cards

### Clipboard mascot
Use in:
- guided repair
- project checklist
- maintenance completion
- success cards after guided steps

### Lightbulb mascot
Use in:
- recommendations
- insight cards
- capability score improvement prompts
- “next best move” cards

## Important
Do not flood the app with mascots.
Use them strategically for warmth and memorability.

---

# 5. Brand Color System

Base the UI on this palette derived from the supplied assets:

- Midnight Navy: `#022D52`
- Royal Cobalt: `#0B5491`
- Electric Teal: `#069CA8`
- Soft Aqua Glow: `#A0E6F2`
- Frost White: `#EEF3F7`
- Slate Ink: `#1E2B3A`

## Semantic colors

- Success: refined green
- Warning: muted amber
- Danger: muted coral red
- Neutral: layered blue-grays and frosted whites

---

# 6. Glassmorphism Rules

Use restrained glassmorphism.

## Glass treatment for major cards
Each hero or elevated card should include:

- translucent white or blue-white background
- soft backdrop blur
- subtle 1px border
- soft layered shadow
- very light inner highlight
- rounded corners, 20px to 24px

## Use glass on
- hero cards
- floating bottom nav
- modal sheets
- scan upload panel
- insight cards
- score panels

## Avoid strong glass on
- long lists
- dense table-like rows

---

# 7. Typography and Spacing

## Typography
Aim for crisp, modern typography with:

- bold display numerics
- medium section headings
- highly readable body copy
- concise CTA labels

## Spacing rhythm
Use a consistent spacing scale such as:

- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40

The interface should feel breathable.

---

# 8. App Structure

## Primary navigation

Build a mobile-first bottom nav with:

- Home
- Diagnose
- Projects
- Tools
- More

This bottom nav should feel:

- floating
- frosted
- premium
- softly rounded
- lightly shadowed

## Web / desktop navigation

Provide a responsive web layout using either:

- left sidebar navigation, or
- hybrid top + side navigation

Sections:

- Overview
- Diagnose
- Projects
- Toolbox
- Systems
- Timeline
- Documents
- Insights
- Network
- Settings

---

# 9. Required Screens to Build

Build these screens first.

## MVP screen list

1. Splash Screen
2. Onboarding Welcome
3. Home Dashboard
4. Diagnose / Scan
5. Diagnosis Result
6. DIY vs Pro Decision Detail
7. Guided Repair Mode
8. Guided Repair Success
9. Toolbox
10. Repair Readiness
11. Handy Friends
12. Tool Loan Tracker
13. Systems
14. Risk Radar Detail
15. Capability Score Detail
16. Timeline
17. Documents
18. Notifications Center
19. Profile / Settings

---

# 10. Screen-by-Screen Implementation Instructions

## 10.1 Splash Screen

### Build
- centered app icon
- HomeProjectIQ wordmark
- soft premium background gradient
- subtle fade or rise animation

### Goal
Make the product feel premium immediately.

---

## 10.2 Onboarding Welcome

### Build
- waving mascot
- headline
- 2 to 3 product value bullets
- primary CTA: Set Up My Home
- secondary CTA: Explore Demo

### Goal
Warm, clear introduction without marketing fluff.

---

## 10.3 Home Dashboard

### Build sections
- greeting + property label
- Home Capability Score hero card
- Next Best Move card
- Home Risk Radar card
- Active Issues list
- Repair Readiness card
- Savings & Progress card

### Important
The capability score hero must be visually dominant.

### Goal
This screen should instantly answer:
- how prepared am I
- what matters most now
- what should I do next

---

## 10.4 Diagnose / Scan Screen

### Build
- title
- large frosted upload panel
- Camera CTA
- Gallery CTA
- Manual Entry CTA
- secondary entry points for Guided Walkthrough and Emergency
- magnifying mascot as helper art

### Goal
Fast issue intake with premium feel.

---

## 10.5 Diagnosis Result Screen

### Build blocks
- issue title
- severity badge
- confidence badge
- recommendation panel
- DIY cost
- pro cost
- estimated savings
- tool readiness
- why AI thinks this
- risk if ignored
- CTA row:
  - Start Guided Repair
  - Find a Pro
  - Save Project

### Goal
This is the trust screen.
Keep it extremely clear and calm.

---

## 10.6 DIY vs Pro Decision Detail

### Build
- problem summary
- difficulty
- tools owned
- tools borrowable
- tools missing
- time cost
- materials cost
- pro cost
- final recommendation
- arms-crossed mascot for caution states
- lightbulb mascot for recommendation states

### Goal
Make the decision feel personalized, not generic.

---

## 10.7 Guided Repair Mode

### Build
- project title
- step progress
- current step card
- safety note
- tools for this step
- checkpoint upload area
- AI feedback card
- Previous / Need Help / Next footer controls
- clipboard mascot in subtle supporting role

### Goal
Feel like GPS guidance, not a static checklist.

---

## 10.8 Guided Repair Success

### Build
- success message
- project completed summary
- money saved
- capability score increased
- timeline updated
- CTA: Done / View Timeline
- waving or clipboard mascot

### Goal
Celebrate without being childish.

---

## 10.9 Toolbox

### Build
- hero summary of owned tools
- categorized tool list
- missing common tools
- lendable tools section
- add tool CTA
- optional recommendation module with lightbulb mascot

### Goal
Make the toolbox feel useful and organized, not like an inventory spreadsheet.

---

## 10.10 Repair Readiness

### Build
- project title
- required tools
- owned tools
- borrowable tools nearby
- missing tools
- recommendation summary
- CTA to borrow, buy, or continue

### Goal
Answer: do I actually have what I need?

---

## 10.11 Handy Friends

### Build
- friend cards with:
  - avatar
  - name
  - handy level
  - reliability
  - available tools
  - request tool action

### Goal
Make network support feel practical and trustworthy.

---

## 10.12 Tool Loan Tracker

### Build
- tabs for Lent / Borrowed
- active loans
- due soon
- overdue
- returned
- clear status chips

### Goal
Track tool lending cleanly and simply.

---

## 10.13 Systems

### Build
- list of major systems
- condition score
- install date
- expected lifespan
- next maintenance
- risk level

### Goal
Feel like a home systems record, not an engineering panel.

---

## 10.14 Risk Radar Detail

### Build
- ranked system risk list
- reason for each risk
- estimated exposure
- recommended action
- optional caution support using arms-crossed mascot

### Goal
Show what is likely to fail next in a calm, useful way.

---

## 10.15 Capability Score Detail

### Build
- large score
- level label
- change over time
- category breakdown
- top 3 ways to improve
- lightbulb mascot for improvement panel

### Goal
Make readiness feel motivating and grounded.

---

## 10.16 Timeline

### Build
- filter chips
- date-separated event list
- event cards with thumbnail when relevant
- related project or system
- cost where relevant

### Goal
Create a durable memory of the home.

---

## 10.17 Documents

### Build
- category filters
- document list
- upload action
- preview
- attach to system or project

### Goal
A clean home file cabinet.

---

## 10.18 Notifications Center

### Build
- grouped sections:
  - repair flow
  - maintenance
  - risk alerts
  - lending
  - score / progress
- clean rows
- clear status chips

### Goal
Useful and calm, not noisy.

---

## 10.19 Profile / Settings

### Build
- household info
- property info
- hourly time value
- notification preferences
- lending preferences
- privacy
- future appearance options

### Goal
Simple control center.

---

# 11. Component System to Build

Create reusable components for:

- `GlassPanel`
- `FloatingBottomNav`
- `ScoreCard`
- `MetricRing`
- `RiskChip`
- `SeverityBadge`
- `StatusChip`
- `RecommendationCard`
- `ToolReadinessCard`
- `GuidedStepCard`
- `CheckpointUploadCard`
- `SystemHealthCard`
- `TimelineEventCard`
- `FriendCard`
- `LoanCard`
- `SavingsCard`
- `MascotCallout`
- `PrimaryCTA`
- `SecondaryCTA`

All components should have clean variants and states.

---

# 12. Motion and Interaction Requirements

Use motion subtly.

## Add motion for
- card entrance
- score updates
- guided repair step transitions
- upload processing
- modal / sheet presentation
- success confirmation
- bottom nav active state

## Avoid
- flashy animations
- bounce-heavy motion
- long transitions
- decorative motion that slows work

Use Framer Motion with restraint.

---

# 13. Accessibility Requirements

All screens must support:

- high text contrast
- large tap targets
- keyboard support on web
- readable type over frosted surfaces
- motion reduction compatibility
- icon + label, not color-only meaning
- accessible status and severity labels

---

# 14. Asset Handling Instructions

Use the provided logo and mascot assets immediately for mockup and development.

## Important production note
The current 128x128 app icon is not sufficient as the final master for production.

### Required follow-up assets
Create or request:
- 1024x1024 master app icon
- larger transparent mascot masters
- monochrome icon variant
- light and dark background logo variants
- simplified mini mascot badges

For now, use the existing files in development and mockups.

---

# 15. File and Route Structure Recommendation

Suggested route structure:

- `/`
- `/onboarding`
- `/dashboard`
- `/diagnose`
- `/diagnose/result/[id]`
- `/projects`
- `/projects/[id]`
- `/projects/[id]/guided`
- `/toolbox`
- `/toolbox/readiness/[id]`
- `/network`
- `/network/loans`
- `/systems`
- `/insights/risk`
- `/insights/capability`
- `/timeline`
- `/documents`
- `/notifications`
- `/settings`

Suggested UI folders:

- `components/ui`
- `components/brand`
- `components/dashboard`
- `components/diagnose`
- `components/projects`
- `components/toolbox`
- `components/network`
- `components/insights`
- `components/timeline`

---

# 16. Seed Data Requirements for Frontend

Create realistic seeded demo content for:

- one home
- one user
- multiple systems
- one active issue
- one guided repair project
- one tool network friend
- one active tool loan
- one capability score
- multiple risk entries
- several timeline items

This seeded data should make the app feel alive immediately.

---

# 17. Build Order

## Phase 1
Build:
- Splash
- Onboarding
- Dashboard
- Diagnose
- Diagnosis Result
- Projects list
- Guided Repair
- Toolbox

## Phase 2
Build:
- Repair Readiness
- Systems
- Risk Radar
- Capability Score
- Timeline
- Documents

## Phase 3
Build:
- Handy Friends
- Tool Loans
- Notifications
- Profile / Settings

---

# 18. Quality Standard

Before considering the frontend complete, verify:

- the UI feels premium on mobile
- the bottom nav feels custom and elevated
- mascot usage is intentional and not excessive
- the diagnosis result screen is crystal clear
- guided repair feels stateful and focused
- the dashboard has one obvious visual hierarchy
- glassmorphism is elegant, not overdone
- the brand colors feel cohesive with the supplied assets

---

# 19. Final Build Mandate

Build the HomeProjectIQ front end as if it is a premium App Store product, not an internal tool.

The output should feel:

- visually polished
- calm
- modern
- highly usable
- emotionally supportive
- deeply trustworthy

The app should look like the supplied visual direction, but cleaner, more disciplined, and more production-ready.
