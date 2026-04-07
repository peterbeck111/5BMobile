# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Five Below mobile app demo (React Native / Expo) that showcases a map-based store inventory view. Users can see Five Below stores in Philadelphia on an interactive map and check current stock levels and incoming delivery dates for dumplings (item #100015000).

## Commands

```bash
npm start          # Start Expo dev server (scan QR with Expo Go)
npm run android    # Launch on Android emulator
npm run ios        # Launch on iOS simulator (macOS only)
npm run web        # Launch in browser
npx tsc --noEmit   # Type-check without emitting
npx expo export --platform web  # Verify production build
```

## Architecture

**Expo Router** file-based navigation lives in `app/`:

- `app/_layout.tsx` — Root layout, wraps everything in `WatchlistProvider`
- `app/(tabs)/_layout.tsx` — Bottom tab navigator (Home, Shop, Watchlist, Inventory)
- `app/(tabs)/index.tsx` — Home screen with Five Below branding, category grid, promo banner
- `app/(tabs)/shop.tsx` — Product browsing with category filter chips and a 2-column product grid
- `app/(tabs)/watchlist.tsx` — List of items the user is watching
- `app/(tabs)/inventory.tsx` — Map + list view of Philadelphia stores with stock and delivery info

**Business logic** lives in `src/`:

- `src/context/WatchlistContext.tsx` — React Context for watchlist state (add/remove/check). Consumed by ProductCard.
- `src/data/products.ts` — Mock product catalog (10 items with prices, categories, stock status). Uses `ui-avatars.com` placeholders.
- `src/data/stores.ts` — 7 Five Below store locations in Philadelphia (with lat/lng). Includes Haversine `getDistanceMiles()` and `findNearbyStores()` utility.
- `src/data/inventory.ts` — Mock API data: transfer records with delivery dates, expected quantities, and stock on hand per store.
- `src/components/` — Reusable UI: `Header`, `SearchBar`, `ProductCard`, `StoreDetailCard` (map bottom card), `StoreInventoryCard` (list view card).
- `src/constants/colors.ts` — Five Below brand color tokens (`#0050FF` primary).

## Demo Flow

1. Open Inventory tab → see Philadelphia Five Below stores on a map (or in list view)
2. Tap a store marker → bottom card shows stock on hand and incoming deliveries with dates
3. Toggle to "List" view → same data displayed as scrollable cards for all stores

The map uses `react-native-maps` (iOS/Android). On web, the list view is shown by default (no map support).

No backend is needed — all data is mocked from a sample API CSV response.

## Key Conventions

- All styling uses `StyleSheet.create` inline in each file (no external style library)
- Five Below brand blue is `#0050FF` — defined in `src/constants/colors.ts`
- Product images are placeholder URLs (ui-avatars.com) — replace with real assets for production
- The `images/` folder at root contains reference screenshots of the real Five Below app (not used in code)
