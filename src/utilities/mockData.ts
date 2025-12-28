/**
 * Mock data generator for token discovery table
 * Generates realistic token data for development and testing
 */

import type { Token, TokenCategory } from '@/types';

// Sample token names and symbols
const TOKEN_DATA = [
  { name: 'Anime', symbol: 'ANIME', emoji: '🎌' },
  { name: 'Gmail', symbol: 'GMAIL', emoji: '📧' },
  { name: 'CLAUS', symbol: 'CLAUS', emoji: '🎅' },
  { name: '$100', symbol: '$100', emoji: '💵' },
  { name: 'X Money', symbol: 'XMONEY', emoji: '💰' },
  { name: 'SOL Christmas', symbol: 'SOLXMAS', emoji: '🎄' },
  { name: 'Emma AI', symbol: 'EMMA', emoji: '🤖' },
  { name: 'PUMPv2', symbol: 'PUMP', emoji: '💊' },
  { name: 'Neurosama', symbol: 'NEURO', emoji: '🧠' },
  { name: 'Pepe 2.0', symbol: 'PEPE2', emoji: '🐸' },
  { name: 'Wojak', symbol: 'WOJAK', emoji: '😢' },
  { name: 'Chad', symbol: 'CHAD', emoji: '💪' },
  { name: 'Moon', symbol: 'MOON', emoji: '🌙' },
  { name: 'Rocket', symbol: 'ROCKET', emoji: '🚀' },
  { name: 'Diamond', symbol: 'DMD', emoji: '💎' },
  { name: 'Fire', symbol: 'FIRE', emoji: '🔥' },
  { name: 'Ice', symbol: 'ICE', emoji: '❄️' },
  { name: 'Thunder', symbol: 'THDR', emoji: '⚡' },
  { name: 'Star', symbol: 'STAR', emoji: '⭐' },
  { name: 'Crown', symbol: 'CROWN', emoji: '👑' },
];

// Generate random address
function generateAddress(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate random number within range
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Generate random integer within range
function randomIntInRange(min: number, max: number): number {
  return Math.floor(randomInRange(min, max));
}

// Generate avatar URL (using placeholder)
function generateAvatarUrl(seed: string): string {
  // Using a deterministic color based on seed
  const colors = ['3b82f6', 'ef4444', '22c55e', 'f59e0b', 'ec4899', 'a855f7', '06b6d4', 'f97316'];
  const colorIndex = seed.charCodeAt(0) % colors.length;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=${colors[colorIndex]}&color=fff&size=64&bold=true`;
}

/**
 * Generate a single mock token
 */
export function generateMockToken(category: TokenCategory, index: number): Token {
  const tokenInfo = TOKEN_DATA[index % TOKEN_DATA.length];
  const now = Date.now();
  
  // Age varies by category
  let ageInSeconds: number;
  switch (category) {
    case 'new-pairs':
      ageInSeconds = randomIntInRange(0, 300); // 0-5 minutes
      break;
    case 'final-stretch':
      ageInSeconds = randomIntInRange(300, 3600); // 5-60 minutes
      break;
    case 'migrated':
      ageInSeconds = randomIntInRange(3600, 86400); // 1-24 hours
      break;
  }

  // Market cap varies by category
  let marketCap: number;
  switch (category) {
    case 'new-pairs':
      marketCap = randomInRange(1000, 100000);
      break;
    case 'final-stretch':
      marketCap = randomInRange(50000, 500000);
      break;
    case 'migrated':
      marketCap = randomInRange(100000, 2000000);
      break;
  }

  const volume = marketCap * randomInRange(0.1, 0.5);
  const price = marketCap / randomInRange(1000000, 100000000);
  const priceChange = randomInRange(-0.5, 1.5);
  const holders = randomIntInRange(10, 500);
  const transactions = randomIntInRange(50, 5000);
  const liquidity = marketCap * randomInRange(0.05, 0.2);

  const id = `${category}-${index}-${Date.now()}`;

  return {
    id,
    address: generateAddress(),
    name: `${tokenInfo.name}${index > TOKEN_DATA.length ? ` ${Math.floor(index / TOKEN_DATA.length)}` : ''}`,
    symbol: tokenInfo.symbol,
    imageUrl: generateAvatarUrl(tokenInfo.name),
    ageInSeconds,
    category,
    metrics: {
      marketCap,
      volume,
      price,
      priceChange,
      holders,
      transactions,
      liquidity,
      feePercentage: randomInRange(0.01, 0.05),
    },
    socialMetrics: {
      likes: randomIntInRange(0, 50),
      dislikes: randomIntInRange(0, 10),
      comments: randomIntInRange(0, 30),
      isBookmarked: Math.random() > 0.8,
    },
    riskMetrics: {
      topHolderPercentage: randomInRange(0.03, 0.75),
      devHoldingPercentage: randomInRange(0, 0.25),
      sniperPercentage: randomInRange(0, 0.5),
      bundlePercentage: randomInRange(0, 0.5),
      riskScore: randomIntInRange(0, 100),
    },
    socialLinks: {
      twitter: Math.random() > 0.5 ? 'https://twitter.com/example' : undefined,
      telegram: Math.random() > 0.5 ? 'https://t.me/example' : undefined,
      website: Math.random() > 0.7 ? 'https://example.com' : undefined,
    },
    createdAt: now - ageInSeconds * 1000,
    updatedAt: now,
  };
}

/**
 * Generate mock tokens for a category
 */
export function generateMockTokens(category: TokenCategory, count: number = 10): Token[] {
  return Array.from({ length: count }, (_, i) => generateMockToken(category, i));
}

/**
 * Generate all mock data for all categories
 */
export function generateAllMockData(countPerCategory: number = 10): Record<TokenCategory, Token[]> {
  return {
    'new-pairs': generateMockTokens('new-pairs', countPerCategory),
    'final-stretch': generateMockTokens('final-stretch', countPerCategory),
    'migrated': generateMockTokens('migrated', countPerCategory),
  };
}

/**
 * Simulate a price update for a token
 */
export function simulatePriceUpdate(token: Token): Token {
  const changePercent = randomInRange(-0.1, 0.1); // ±10%
  const newPrice = token.metrics.price * (1 + changePercent);
  const newMarketCap = token.metrics.marketCap * (1 + changePercent);
  const newVolume = token.metrics.volume * (1 + randomInRange(-0.05, 0.15));

  return {
    ...token,
    metrics: {
      ...token.metrics,
      price: newPrice,
      marketCap: newMarketCap,
      volume: newVolume,
      priceChange: token.metrics.priceChange + changePercent,
    },
    ageInSeconds: token.ageInSeconds + 1,
    updatedAt: Date.now(),
  };
}

/**
 * Batch simulate price updates for multiple tokens
 */
export function batchSimulatePriceUpdates(tokens: Token[]): Token[] {
  return tokens.map(token => {
    // Only update ~30% of tokens each cycle
    if (Math.random() > 0.3) {
      return { ...token, ageInSeconds: token.ageInSeconds + 1 };
    }
    return simulatePriceUpdate(token);
  });
}


