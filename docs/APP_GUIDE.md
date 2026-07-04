# RNTS Template — App Usage Guide

Complete reference for assets, fonts, icons, translations, theming, API layer, and app workflow.

---

## Table of contents

1. [Quick start](#quick-start)
2. [App workflow](#app-workflow)
3. [Internationalization (i18n)](#internationalization-i18n)
4. [Fonts](#fonts)
5. [SVG icons](#svg-icons)
6. [Vector icons](#vector-icons)
7. [Theming & layout tokens](#theming--layout-tokens)
8. [Network & API layer](#network--api-layer)
9. [React Query](#react-query)
10. [Redux & persistence](#redux--persistence)
11. [Authentication](#authentication)
12. [Path aliases](#path-aliases)

---

## Quick start

```bash
bun install
bun run copy-fonts      # optional if TTF files already in src/assets/fonts/
bun run link-assets     # links fonts into iOS/Android (run after font changes)
bun run start:development
bun run android       # or bun run ios
```

**Mock login (dev):** `mahmoud@gmail.com` / `Password@123`

---

## App workflow

```
Onboarding → Login options → Sign in → Home hub → Modules
```

| Step | Screen | What happens |
|------|--------|--------------|
| 1 | Onboarding | Swiper intro, then Login options |
| 2 | Login | Mock API email login or Firebase providers |
| 3 | Home | Dashboard stats (React Query), module grid, quick actions |
| 4 | Modules | Feed, Todos, Chat, Wallet, Game, Gallery, Audio, Video |

Workflow copy is translated via `home.workflow.*` keys in `src/translation/en|ar/index.json`.

---

## Internationalization (i18n)

**Files**

| Path | Purpose |
|------|---------|
| `src/translation/en/index.json` | English strings (nested JSON) |
| `src/translation/ar/index.json` | Arabic strings |
| `src/translation/i18n.tsx` | i18next setup, RTL, language switch |

**Usage in components**

```tsx
import {useTranslation} from 'react-i18next';

const MyScreen = () => {
  const {t} = useTranslation();

  return (
    <>
      <TextView text={t('home.title')} />
      <TextView text={t('home.postsCount', {count: 12})} />
      <Button label={t('common.goBack')} />
    </>
  );
};
```

**Switch language**

- Settings → Switch language  
- Home → Change language  
- Arabic enables RTL via `I18nManager` + app restart (`changeLanguage` in `src/translation/i18n.tsx`)

**Adding a new string**

1. Add key to `src/translation/en/index.json`
2. Add Arabic translation to `src/translation/ar/index.json`
3. Use `t('your.key')` in the component

**Key sections:** `common`, `auth`, `home`, `settings`, `profile`, `feed`, `posts`, `chat`, `todos`, `wallet`, `game`, `gallery`, `media`, `loginOptions`, `drawer`, `errors`, `navigation`, `tabs`

---

## Fonts

**Bundled files**

```
src/assets/fonts/
  Inter/
    Inter-Regular.ttf
    Inter-SemiBold.ttf
    Inter-Bold.ttf
  Cairo/
    Cairo-Regular.ttf
    Cairo-SemiBold.ttf
    Cairo-Bold.ttf
```

| Language | Font | Used for |
|----------|------|----------|
| English (`en`) | Inter | All typography tokens |
| Arabic (`ar`) | Cairo | All typography tokens |

Fonts are applied automatically through theme tokens when `appSettings.lang` changes (`src/theme/fonts.ts` → `createThemeTokens`).

**After replacing font files**

```bash
bun run copy-fonts    # refresh from @expo-google-fonts (optional)
bun run link-assets   # register in native projects
# Rebuild iOS/Android
```

**Config files**

- `react-native.config.js` — asset paths for linking
- `src/assets/fonts/index.json` — font registry metadata
- `src/theme/fonts.ts` — language → font family mapping

---

## SVG icons

Each icon is a **standalone React Native SVG component** in its own file.

**Directory**

```
src/assets/icons/svg/
  types.ts                 # SvgIconProps
  resolveSvgIconProps.ts   # default size/color/stroke
  HomeIcon.tsx
  UserIcon.tsx
  SettingsIcon.tsx
  ... (one file per icon)
  index.ts                 # barrel exports + AppSvgIcons map
```

### Option A — Import a single icon directly

```tsx
import UserIcon from '@assets/icons/svg/UserIcon';
import {useThemeTokens} from '@theme/useThemeTokens';

const ProfileAvatar = () => {
  const tokens = useThemeTokens();

  return (
    <UserIcon size={32} color={tokens.colors.primary} strokeWidth={2} />
  );
};
```

### Option B — Use the name-based wrapper

```tsx
import AppSvgIcon from '@atoms/AppSvgIcon';

<AppSvgIcon name="user" size={24} color="#0F172A" />
```

### Available icons

`home`, `user`, `settings`, `chat`, `wallet`, `feed`, `todo`, `game`, `gallery`, `audio`, `video`, `search`, `back`, `menu`, `heart`, `send`, `logout`, `sun`, `moon`

### Adding a new SVG icon

1. Create `src/assets/icons/svg/MyIcon.tsx` (copy pattern from `UserIcon.tsx`)
2. Export it from `src/assets/icons/svg/index.ts`
3. Add to `AppSvgIcons` map in the same file
4. Update `src/assets/icons/index.json` registry

**Props (`SvgIconProps`)**

| Prop | Default | Description |
|------|---------|-------------|
| `size` | `24` | Width and height |
| `color` | `#0F172A` | Stroke/fill color |
| `strokeWidth` | `2` | Stroke width |

---

## Vector icons

For tab bars and module cards, the app also uses **react-native-vector-icons**:

```tsx
import Icon from '@atoms/Icon';

<Icon iconType="Ionicons" name="home-outline" size={24} color={color} />
```

Icon families are configured in `src/constants/vectorIcons.tsx`.

---

## Theming & layout tokens

**Hook**

```tsx
import {useThemedStyles} from '@theme/createThemedStyles';

const styles = useThemedStyles(tokens => ({
  container: {
    flex: tokens.layout.flex.fill,
    backgroundColor: tokens.colors.background,
    padding: tokens.spacing.lg,
    borderRadius: tokens.radius.md,
    ...tokens.shadows.sm,
  },
}));
```

**Token sources**

| Token | File |
|-------|------|
| Colors | `src/theme/tokens/colors.ts` |
| Spacing | `src/theme/tokens/spacing.ts` |
| Typography | `src/theme/tokens/typography.ts` |
| Shadows | `src/theme/tokens/shadows.ts` |
| Layout | `src/theme/tokens/layout.ts` |

**Dark / light mode:** Settings → Appearance (Light / Dark / System). Stored in Redux `appSettings.themeMode`.

---

## Network & API layer

**Config:** `src/config/apiConfig.tsx`

| Env var | Purpose |
|---------|---------|
| `API_BASE_URL` | REST API base URL |
| `API_USE_MOCKS` | Enable axios-mock-adapter |
| `MEDIA_API_BASE_URL` | Audio/video upload host |

**Structure**

```
src/config/network/
  client.ts          # Main Axios instance + auth header
  mediaClient.ts     # File upload client
  tokenStorage.ts    # JWT in MMKV
  setupMocks.ts      # Registers mock routes

src/api/
  server/            # DTO types (API response shapes)
  mappers/           # DTO → domain models
  clients/           # authClient, feedClient, dashboardClient
  mocks/             # Dev mock handlers
  query/             # React Query client, keys, hooks
```

**Adding an API endpoint**

1. DTO → `src/api/server/feature.dto.ts`
2. Mapper → `src/api/mappers/feature.mapper.ts`
3. Client → `src/api/clients/featureClient.ts`
4. Mock (optional) → `src/api/mocks/` + register in `setupMocks.ts`
5. Query key → `src/api/query/queryKeys.ts`
6. Hook → `src/api/query/hooks/useFeatureQuery.ts`

---

## React Query

Provider: `src/config/AppProviders.tsx` (wraps app in `App.tsx`).

```tsx
import {useDashboardQuery} from '@api/query/hooks/useDashboardQuery';
import {useFeedQuery} from '@api/query/hooks/useFeedQuery';

const {data, isFetching, refetch} = useDashboardQuery(!!user);
const feed = useFeedQuery('recent');
```

**Invalidate cache**

```tsx
import {queryClient} from '@api/query/queryClient';
import {queryKeys} from '@api/query/queryKeys';

queryClient.invalidateQueries({queryKey: queryKeys.feed('recent')});
```

---

## Redux & persistence

- Store: `src/redux/store.tsx` (redux-persist + MMKV)
- Slices: `auth`, `appSettings`, `posts`, `chat`, `todos`, `wallet`, `game`, etc.

```tsx
import {useAppSelector} from '@hooks/useAppSelector';
import {useAppDispatch} from '@hooks/useAppDispatch';

const user = useAppSelector(state => state.auth.user);
const dispatch = useAppDispatch();
```

---

## Authentication

| Method | Login type | Entry |
|--------|------------|-------|
| Mock API | `Normal` | Login → email/password |
| Firebase email | `FirebaseEmail` | Firebase auth stack |
| Google / Apple / Facebook | `Firebase*` | Firebase login method screen |

Token storage (mock API): `src/config/network/tokenStorage.ts`  
Logout clears Redux + React Query cache for `Normal` login.

---

## Path aliases

Configured in `babel.config.js` and `tsconfig.json`:

| Alias | Path |
|-------|------|
| `@assets` | `./src/assets` |
| `@atoms` | `./src/components/atoms` |
| `@config` | `./src/config` |
| `@api` | `./src/api` |
| `@translation` | `./src/translation` |
| `@theme` | `./src/theme` |
| `@screens` | `./src/screens` |
| `@redux` | `./src/redux` |
| `@Types` | `./src/types` |

---

## Related docs

- [README.md](../README.md) — project overview & setup
- [src/assets/fonts/index.json](../src/assets/fonts/index.json) — font file registry
- [src/assets/icons/index.json](../src/assets/icons/index.json) — icon registry

---

## Design System (in-app)

Open **Drawer → Design system** to browse **78 component showcases** plus a theme tokens screen.

| Layer | Examples |
|-------|----------|
| Theme | Colors, spacing, typography, shadows |
| Atoms | Button, Card, Typography, Icon, AppSvgIcon, OTPInput, … |
| Molecules | PostCard, password input, audio/video controls, … |
| Organisms | LoginForm, AudioPlayerView, VideoWithButtons, … |
| Templates | LoginTemplate, RecordAudioTemplate, … |

**Structure**

```
src/screens/designSystem/
  hub/index.tsx           # Category index
  registry.ts             # Route → component map
  shared/                 # ShowcaseSection, createShowcaseScreen
  atoms/                  # DSButton.tsx, DSTypography.tsx, …
  molecules/
  organisms/
  templates/
  theme/ThemeShowcase.tsx

src/navigation/DesignSystemNavigator/
```

**Adding a new component showcase**

1. Create `src/screens/designSystem/<layer>/DSMyComponent.tsx` using `createShowcaseScreen()`.
2. Add route to `src/types/designSystemNavigation.tsx`.
3. Register in `src/screens/designSystem/registry.ts`.
4. Screen auto-registers in `DesignSystemNavigator` via the registry loop.

