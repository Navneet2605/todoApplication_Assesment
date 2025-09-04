## TODO Application (Expo + React Native)

A modern, smooth, and offline-ready TODO app built with Expo. It seeds data from `jsonplaceholder.typicode.com/todos`, persists locally with AsyncStorage, and supports add/edit/delete, filters, sorting, and polished animations — all in a clean black-and-white theme.

### ✨ Features
- **Seed from API, then offline**: First run fetches todos and stores them locally; subsequent runs load from device storage.
- **Add / Edit / Delete**: Create tasks, update titles, and remove items; all changes are persisted.
- **Completion with animation**: Checkbox tick animates and card background transitions using Reanimated.
- **Timestamps**: `created_at` and `updated_at` tracked and displayed (date + HH:mm, device locale).
- **Filtering**: All / Active / Done segmented control.
- **User scope**: Select `userId` to view tasks for a specific user.
- **Sorting**: Segmented control for "Recent" (by updated/created) or "ID" (ascending).
- **Suggestions (Add Todo)**: Hardcoded chips to quickly prefill the title.
- **Grayscale UI**: Black/white/gray palette for a minimal look.
- **Performance optimized**: Memoized components, stable callbacks, and list tuning to avoid jank.

### 🛠️ Tech Stack
- **Framework**: Expo 53, React Native 0.79, React 19
- **Navigation**: `expo-router` (file-based routing)
- **State**: Redux Toolkit + React Redux
- **Persistence**: `@react-native-async-storage/async-storage`
- **Styling**: Tailwind via `nativewind`
- **Animation**: `react-native-reanimated`
- **Networking**: Fetch API (seed from `jsonplaceholder`)
- **Linting**: ESLint + TypeScript

### 📁 Project structure
```text
app/
  _layout.tsx                # Root layout for router
  (stack)/
    _layout.tsx              # Redux Provider + stack screens
    main.tsx                 # List, filtering, sorting, actions
    add-todo.tsx             # Add / Edit form with suggestions
  api/
    todosApi.tsx             # Read-only fetch from jsonplaceholder
  components/
    taskCard.tsx             # Task UI with animated checkbox (memoized)
    filerCard.tsx            # Segmented filters/sort, user selector, add CTA (memoized)
  store/
    index.tsx                # Configure store
    todoSlice.tsx            # State, reducers, thunks (load/seed/add/toggle/update/delete)
    todosStorage.ts          # AsyncStorage helpers
  global.css                 # Tailwind setup
```

### 🧠 Data model
```ts
interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  created_at?: string; // ISO
  updated_at?: string; // ISO
}
```
- Seeded todos get `created_at`/`updated_at` set to now.
- New todos use `Date.now()` as an id and are `unshift`ed to the top.

### 🔄 App flow
- **Initial load**: Load from AsyncStorage → if empty, fetch from API → enrich → persist → display.
- **Mutations**: Local reducers update state immediately, then persist entire list (`saveTodosToStorage`).
- **Filtering**: Client-side by `selectedUserId` and completion status.
- **Sorting**: "Recent" (desc by `updated_at`/`created_at`) or by numeric `id`.

### ⚡ Performance & UX
- **Component memoization**:
  - `TaskCard`: `React.memo` with custom comparator (ignores function identity; re-renders only on value changes).
  - `FilterCard`: `React.memo` with shallow comparator, receives `userIds` (not full todos) to reduce churn.
- **Stable callbacks**: `useCallback` for item handlers and list functions.
- **Derived data**: `useMemo` for `filteredTodos`, counts, `userIds`, `contentContainerStyle`.
- **List tuning**: `initialNumToRender`, `windowSize`, `removeClippedSubviews={false}` (prevents sticky header flicker), sticky header style.
- **Add Todo suggestions**: Sequence guard + input focus to ensure reliable updates on rapid taps.
- **Grayscale theme**: Replaced color accents with black/white/gray for consistency.

### 🧭 Key screens/components
- `main.tsx`:
  - Loads/stores todos, filters by status and `userId`, sorts by recent/id.
  - Renders `TaskCard` rows; header is a sticky `FilterCard`.
- `add-todo.tsx`:
  - Add/edit form, hardcoded suggestions; tapping a chip fills the title.
- `filerCard.tsx`:
  - Segmented controls for Filter (All/Active/Done) and Sort (Recent/ID), `userId` picker, Add CTA.
- `taskCard.tsx`:
  - Animated checkbox and subtle ripple; edit/delete actions; memoized rendering.

### 🚀 Getting started
1) Install dependencies
```bash
npm install
```

2) Start the Metro server
```bash
npx expo start
```

3) Run on your target
- iOS Simulator: press `i`
- Android Emulator: press `a`
- Web: press `w`
- Device: scan QR with Expo Go

### 🔧 Scripts
- `npm run start` – Start dev server
- `npm run ios` / `npm run android` / `npm run web` – Platform targets
- `npm run lint` – Lint

### 🔒 Permissions & privacy
- No PII is sent. The app fetches public sample data from `jsonplaceholder` only on seed.
- All user changes are stored locally on the device via AsyncStorage.

### 🧪 Notes & limitations
- API data is read-only (seed only). All mutations are local.
- `id` collisions are avoided by using `Date.now()` for new items.
- Sorting by Recent relies on timestamps assigned on seed/mutations.

### 🙌 Credits
- Sample data: `jsonplaceholder.typicode.com`
- Built with Expo + React Native
