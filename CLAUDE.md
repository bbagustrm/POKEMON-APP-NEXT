# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
```

No test or lint scripts are configured. The project uses **bun** as its package manager (see `bun.lock`).

## Architecture

A Pokédex web app built with **Next.js 16 App Router**, **React 19**, and **Redux Toolkit**. Data comes from the [PokeAPI](https://pokeapi.co).

### Routing (Next.js App Router)

| Route | File | Strategy |
|---|---|---|
| `/` | `src/app/page.tsx` | Server Component — SSR-fetches the first page of Pokémon, passes to `HomeClient` |
| `/collection` | `src/app/collection/page.tsx` | Client Component — reads from Redux store |

`layout.tsx` sets up metadata (OG, title template), fonts (Pixelify Sans + Press Start 2P), and wraps children in `<Providers>` (Redux `Provider`). Every page uses the `Navbar` component.

### Data flow

1. **Initial load**: `page.tsx` (server) calls `fetchPokemonList` + `fetchPokemonDetail` for the first page, passes results as `initialPokemons` to `<HomeClient>`.
2. **Client-side pagination**: `usePokemonList` hook manages page state — calls `loadPage(page)` which fetches the list then all details in parallel.
3. **Detail drawer**: Clicking a card opens `PokemonDrawer` → `usePokemonDetail` hook fetches species + evolution chain from PokeAPI.
4. **Collection**: `collectionSlice` (Redux Toolkit) stores `CaughtPokemon[]`, synced to `localStorage` under the key `pokemon_collection`. Catch/Release dispatch actions that write to both Redux and localStorage.

### Store (Redux)

- `src/store/index.ts` — configures the store with `collectionReducer`
- `src/store/slices/collectionSlice.ts` — `catchPokemon` (deduped by id), `releasePokemon` (by id)
- `src/store/hooks.ts` — typed `useAppDispatch` and `useAppSelector`

### Services layer (`src/services/pokeApi.ts`)

Axios client (`baseURL` from `NEXT_PUBLIC_POKEAPI_BASE_URL` env var). Exports:
- `fetchPokemonList(offset, limit)` — paginated list
- `fetchPokemonDetail(nameOrId)` — full Pokémon data
- `fetchPokemonSpecies(nameOrId)` — flavor text, genus, habitat, evolution chain URL
- `fetchEvolutionChain(url)` / `flattenEvolutionChain(chain)` — evolution tree → flat `EvolutionStep[]`
- `getPokemonSpriteUrl(id, sprites)` — animated GIF for Gen 1–5 (id ≤ 649), falls back to official artwork
- `extractPokemonIdFromUrl(url)`, `formatName(name)` — utilities

### Component organization

| Directory | Purpose |
|---|---|
| `src/components/ui/` | shadcn base components (card, badge, button, input, dialog, sonner) |
| `src/components/pokemon/` | PokemonCard, PokemonGrid (with skeleton), Pagination, PokemonDrawer, PokemonTypeBadge |
| `src/components/home/` | HomeClient — orchestrates list + catch flow |
| `src/components/catch/` | CatchModal — animated catch sequence (throwing → shaking → success/failed → naming) |
| `src/components/collection/` | CollectionCard, EmptyCollection, ReleaseDialog |
| `src/components/layout/` | Navbar — desktop top bar, mobile top bar + bottom nav |
| `src/components/icons/` | PokeballIcon |

### Sprite / animation strategy

Cards show a static official artwork by default. On hover, the static sprite fades out and an animated GIF (Gen 1–5 only) fades in. GIFs use `unoptimized` to bypass Next.js image optimization. `PokemonDrawer` always shows the animated GIF when available.

### Styling

- **Tailwind CSS v4** with `@tailwindcss/postcss` plugin
- **shadcn/ui** (radix-nova style, `components.json`), with `baseColor: neutral` and CSS variables enabled
- Custom CSS variables in `globals.css`: `--color-pokered`, `--color-pokeyellow`, `--color-pokenavy`, `--color-pokebg`
- `typeColors.ts` maps all 18 Pokémon types to bg/text/border color triples via `getTypeColor()`
- Custom keyframe animations (`@keyframes`) for catch sequence, confetti, drawer transitions — defined in `globals.css` and used as Tailwind arbitrary animations

### Key constants (`src/constants/index.ts`)

- `POKEAPI_BASE_URL` — defaults to `https://pokeapi.co/api/v2`, overridable via `NEXT_PUBLIC_POKEAPI_BASE_URL`
- `POKEMON_LIST_LIMIT` — 20 (SSR), client hook overrides to 16
- `LOCAL_STORAGE_KEY` — `"pokemon_collection"`

## Notable patterns

- **Hydration safety**: `isCaught` checks and badge counts are deferred with `useState(false)` + `useEffect` to avoid SSR/client mismatches (Redux state only exists client-side).
- **Stop propagation**: Action buttons inside cards use `onClick={(e) => e.stopPropagation()}` to prevent triggering the card's drawer.
- **`CaughtPokemon` extends `Pokemon`** with `nickname` and `caughtAt`. However `CatchModal.handleSave()` explicitly sets fields like `stats: []`, `abilities: []`, etc. because the store uses the full `Pokemon` interface — old entries without those fields would cause undefined access in the drawer.
- **Next.js 16**: The AGENTS.md warns about breaking changes in this version; before writing Next.js-specific code, consult the docs in `node_modules/next/dist/docs/`.
