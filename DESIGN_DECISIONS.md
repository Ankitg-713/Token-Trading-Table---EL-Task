# 🎨 Design Decisions

This document explains the key architectural and design decisions made during the development of the Axiom Pulse Clone.

---

## 1. Architecture: Atomic Design Pattern

### Decision
Used **Atomic Design** methodology to organize components into atoms, molecules, and organisms.

### Rationale
- **Reusability**: Atoms like `<Tooltip>`, `<Badge>`, `<Avatar>` are used across multiple components
- **Maintainability**: Changes to base components propagate consistently
- **Scalability**: Easy to add new features by composing existing components
- **Testing**: Smaller units are easier to test in isolation

### Structure
```
atoms/      → Basic UI primitives (Tooltip, Badge, Modal)
molecules/  → Combinations (TokenCard, ColumnHeader)
organisms/  → Complex sections (PulseTable, Header)
```

---

## 2. State Management: Redux + React Query Hybrid

### Decision
Combined **Redux Toolkit** for UI state and **React Query** for server/async state.

### Rationale

| State Type | Tool | Examples |
|------------|------|----------|
| UI State | Redux | Active tab, sort config, modal open/close |
| Server State | React Query | Token data, API responses |
| Real-time | Redux + RQ | Price updates with flash animations |

### Why Not Just One?
- **Redux alone**: Requires manual cache invalidation, no built-in refetching
- **React Query alone**: Not ideal for synchronous UI state
- **Hybrid**: Best of both worlds - RQ handles caching, Redux handles UI

### Implementation
```typescript
// Redux: UI state
const sortConfig = useAppSelector(state => state.ui.tabs.sortConfigs[category]);

// React Query: Token data with caching
const { data: tokens } = useQuery({
  queryKey: ['tokens', category],
  queryFn: () => fetchTokens(category),
});

// Combined: Price direction for flash animation
const priceDirection = usePriceDirection(tokenId); // Redux selector
```

---

## 3. Real-Time Updates: Mock WebSocket Pattern

### Decision
Implemented a **mock WebSocket service** that simulates real-time price updates.

### Rationale
- No external API dependency for development
- Controllable update frequency (1.5s intervals)
- Realistic price fluctuations (±2% random changes)
- Easy to replace with real WebSocket later

### Flow
```
mockWebSocket.ts
     │
     ▼ (setInterval 1500ms)
Updates 20-40% of tokens
     │
     ▼
dispatch(setPriceDirection())  → Redux (flash animation)
     │
     ▼
queryClient.setQueryData()     → React Query (price value)
```

### Flash Animation Logic
```typescript
// Green flash for price increase, red for decrease
priceDirection === 'up' ? 'animate-flash-green' : 'animate-flash-red'
```

---

## 4. Component Memoization Strategy

### Decision
Applied `React.memo()` to **all** components with `useCallback` for handlers.

### Rationale
- Real-time updates could cause excessive re-renders
- Token list can have 30+ items per column
- Price changes should only re-render affected cells

### Implementation
```typescript
// Every component wrapped with memo
export const TokenCard = memo(function TokenCard({ ... }) {
  // Handlers memoized with useCallback
  const handleClick = useCallback(() => onClick(token.id), [onClick, token.id]);
  
  return <div onClick={handleClick}>...</div>;
});
```

### Selective Updates
```typescript
// usePriceDirection hook subscribes to individual token's price direction
// Only the affected TokenCard re-renders, not the entire list
const priceDirection = usePriceDirection(token.id);
```

---

## 5. Responsive Design: CSS-First Approach

### Decision
Used **Tailwind CSS breakpoints** with a custom `useMediaQuery` hook for layout switching.

### Rationale
- CSS handles most responsive styling (font sizes, padding)
- JavaScript only needed for structural changes (3-column vs tabs)
- SSR-safe with mounted state check

### Breakpoints
```typescript
// Desktop: 3-column grid
// Mobile/Tablet: Tab navigation
const isDesktop = useIsDesktop(); // >= 1024px

return isDesktop ? <ThreeColumnLayout /> : <TabLayout />;
```

### SSR Safety
```typescript
// Prevents hydration mismatch
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return false; // Consistent initial render
```

---

## 6. Accessibility: Radix UI Primitives

### Decision
Used **Radix UI** for all interactive components (Modal, Tooltip, Popover).

### Rationale
- WAI-ARIA compliant out of the box
- Keyboard navigation built-in
- Focus management handled automatically
- No accessibility testing burden

### Components Using Radix
- `Modal` → `@radix-ui/react-dialog`
- `Tooltip` → `@radix-ui/react-tooltip`
- `Popover` → `@radix-ui/react-popover`

### Custom Additions
```tsx
// ARIA labels on custom buttons
<button aria-label="Copy address" onClick={handleCopy}>
  <Copy size={12} />
</button>

// Semantic HTML structure
<header>...</header>
<main role="main">...</main>
<footer>...</footer>
```

---

## 7. Styling: Tailwind CSS with CSS Variables

### Decision
Used **Tailwind CSS 4** with custom CSS variables for theming.

### Rationale
- Utility-first enables rapid iteration
- CSS variables allow runtime theme changes
- Consistent design tokens across components
- Minimal CSS bundle with purging

### Theme Variables
```css
:root {
  --bg-primary: #0a0a0c;
  --bg-secondary: #111113;
  --text-primary: #ffffff;
  --text-muted: #71717a;
  --accent-blue: #3b82f6;
  --accent-green: #22c55e;
  --accent-red: #ef4444;
}
```

### Usage
```tsx
<div className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
```

---

## 8. Error Handling: Error Boundaries

### Decision
Implemented React **Error Boundaries** with retry functionality.

### Rationale
- Graceful degradation on component failures
- User-friendly error messages
- One-click retry without page refresh
- Isolated failures (one column failing doesn't break others)

### Implementation
```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <TokenColumn category="new-pairs" />
</ErrorBoundary>
```

---

## 9. Loading States: Multiple Strategies

### Decision
Implemented **three types** of loading states.

### Rationale
Different scenarios need different feedback:

| State | Use Case | Implementation |
|-------|----------|----------------|
| Skeleton | Initial load | Gray placeholders matching card shape |
| Shimmer | Data fetching | Animated gradient sweep |
| Progressive | List rendering | Staggered fade-in animation |

### Progressive Loading
```tsx
// Each card fades in with increasing delay
<TokenCard 
  style={{ animationDelay: `${index * 50}ms` }}
  className="animate-fade-in"
/>
```

---

## 10. Token Card: Pixel-Perfect Replication

### Decision
Matched Axiom's token card design **exactly** with measured spacing.

### Key Design Elements
- **72x72px avatar** with rounded corners
- **Contract address below avatar** (not in content area)
- **Pill-shaped risk badges** with color-coded icons
- **Auto-hiding scrollbar** (appears only while scrolling)
- **Market cap in green**, volume in white

### Badge Color Logic
```typescript
// Risk-based coloring
if (holderPct >= 40) return 'text-red-500';    // High risk
if (holderPct >= 20) return 'text-yellow-500'; // Medium risk
return 'text-green-500';                        // Low risk
```

---

## 11. Performance Targets

### Goals
- **<100ms** interaction response time
- **No layout shifts** during updates
- **Lighthouse ≥90** on all metrics

### Techniques
1. `React.memo()` on all components
2. `useMemo()` for sorted token lists
3. Cell-level updates via Redux selectors
4. CSS animations (GPU-accelerated)
5. Lazy loading for off-screen content

---

## 12. Future Improvements

If given more time, I would add:

1. **Virtual scrolling** for 1000+ tokens (react-window)
2. **WebSocket reconnection** with exponential backoff
3. **Optimistic updates** for user actions
4. **Unit tests** with React Testing Library
5. **E2E tests** with Playwright
6. **Dark/Light theme toggle**
7. **Internationalization** (i18n)

---

## Summary

| Decision | Reason |
|----------|--------|
| Atomic Design | Reusability & maintainability |
| Redux + React Query | Best tool for each state type |
| Mock WebSocket | Development without external deps |
| Component Memoization | Prevent unnecessary re-renders |
| Tailwind + CSS Vars | Rapid styling with theming |
| Radix UI | Accessibility out of the box |
| Error Boundaries | Graceful failure handling |
| Multiple Loading States | Better perceived performance |

---

*This document accompanies the Axiom Pulse Clone project for the EternaLabs Frontend Assessment.*

