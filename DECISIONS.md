# DECISIONS.md — HomeProjectIQ

Every major judgment call documented.

## Why Supabase over Firebase

- **Row Level Security (RLS)**: Supabase enforces access control at the database level, not just in application code. Users can only access their own rows — no Firebase security rules abstraction.
- **PostgreSQL**: Full relational database with JSONB, triggers, functions, and proper migrations. No document-model limitations.
- **Auth built-in**: Email/password, OAuth, magic links — all with cookie-based session management for SSR.
- **No vendor lock-in**: Business logic lives in SQL and TypeScript, not platform-specific SDK methods.

## Why Zustand over Context for client state

- **Performance**: Zustand only re-renders components that subscribe to changed slices. Context re-renders the entire subtree.
- **No Provider hell**: No wrapping components in providers. Just import the hook and use it.
- **DevTools**: Zustand integrates with Redux DevTools for state inspection.
- **Simplicity**: Fewer lines of code than Context + useReducer for equivalent functionality.

## Why React Query over SWR

- **Mutation API**: React Query's `useMutation` with `onSuccess` invalidation is more ergonomic than SWR's `mutate`.
- **Query invalidation**: Cascade invalidation via `queryClient.invalidateQueries` is built-in and predictable.
- **DevTools**: React Query DevTools provide real-time cache inspection, query state visualization.
- **Retry & error handling**: More granular control over retry logic and error boundaries.

## Why project-data.ts over a CMS

- **Data stability**: The 12 categories and their diagnosis data are stable — they don't change frequently.
- **Ships with the app**: No external dependency at runtime. The app works offline once loaded.
- **Type safety**: Full TypeScript types on all data. CMS content would need runtime validation.
- **MVP speed**: No CMS setup, no API calls, no content sync. Data is available at build time and runtime.

## Why bottom sheet modals

- **Native feel**: Bottom sheets match iOS/Android interaction patterns. Primary audience uses phones.
- **Thumb reachability**: Action buttons stay within thumb zone, unlike centered desktop modals.
- **Progressive enhancement**: Renders as centered dialog on desktop, bottom sheet on mobile via responsive breakpoint.

## Monetization phasing rationale

All 8 feature flags default to `false`. The product launches as a completely free, premium experience.

- **Trust-first approach**: Users need to trust the product's advice before we introduce any monetization.
- **Affiliate links (first to enable)**: Zero UX impact — buy buttons already exist, affiliate just adds tracking params.
- **Featured pros (second)**: Clearly marked "Sponsored" so users understand it's paid placement.
- **Category sponsors (third)**: Smallest visual footprint — just a line of text.
- **Business subscriptions (later)**: Only relevant once we have pro contractors wanting to appear in results.

## Other decisions

- **480px max-width**: Mobile-first design constraint. Most users are on their phone at a hardware store or standing in front of the problem.
- **Instrument Serif + Geist**: "Field Notes" aesthetic — warm, knowledgeable, precise. Serif headings give authority, sans-serif body gives readability.
- **XP/leveling system**: Gamification drives repeat usage. The 5-level system (Rookie → Master) gives clear progression without overwhelming.
- **Cents for all currency**: All monetary values stored as integers (cents) to avoid floating-point precision issues.
- **No Docker requirement for dev**: Supabase CLI handles local development. Falls back to remote Supabase project via `.env.local` if Docker isn't available.
