/**
 * Application-wide constants
 */

// Token categories
export const TOKEN_CATEGORIES = ['new-pairs', 'final-stretch', 'migrated'] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  'new-pairs': 'New Pairs',
  'final-stretch': 'Final Stretch',
  'migrated': 'Migrated',
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'age', label: 'Age' },
  { value: 'marketCap', label: 'Market Cap' },
  { value: 'volume', label: 'Volume' },
  { value: 'price', label: 'Price' },
  { value: 'priceChange', label: 'Price Change' },
  { value: 'holders', label: 'Holders' },
  { value: 'transactions', label: 'Transactions' },
  { value: 'liquidity', label: 'Liquidity' },
] as const;

// Presets configuration
export const PRESETS = {
  P1: {
    label: 'P1',
    minMarketCap: 0,
    maxMarketCap: 100000,
    minHolders: 0,
  },
  P2: {
    label: 'P2',
    minMarketCap: 100000,
    maxMarketCap: 1000000,
    minHolders: 50,
  },
  P3: {
    label: 'P3',
    minMarketCap: 1000000,
    maxMarketCap: Infinity,
    minHolders: 200,
  },
} as const;

// WebSocket configuration
export const WEBSOCKET_CONFIG = {
  RECONNECT_INTERVAL: 3000,
  PRICE_UPDATE_INTERVAL: 1500,
  MAX_RECONNECT_ATTEMPTS: 5,
} as const;

// UI configuration
export const UI_CONFIG = {
  TOKENS_PER_PAGE: 20,
  SKELETON_COUNT: 5,
  PROGRESSIVE_LOAD_DELAY: 100,
  PRICE_FLASH_DURATION: 500,
  DEBOUNCE_DELAY: 300,
} as const;

// Risk level thresholds
export const RISK_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60,
  HIGH: 80,
} as const;

// Badge variants mapping
export const BADGE_VARIANTS = {
  success: 'bg-green-500/15 text-green-400 border-green-500/20',
  danger: 'bg-red-500/15 text-red-400 border-red-500/20',
  warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  neutral: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
  pink: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
} as const;

// Animation variants
export const ANIMATION_VARIANTS = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  scaleIn: 'animate-scale-in',
  shimmer: 'animate-shimmer',
  pulseGreen: 'animate-pulse-green',
  pulseRed: 'animate-pulse-red',
} as const;

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Z-index layers
export const Z_INDEX = {
  base: 0,
  dropdown: 50,
  sticky: 60,
  modal: 100,
  tooltip: 150,
  toast: 200,
} as const;


