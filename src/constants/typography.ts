/**
 * Typography and spacing constants
 * Single source of truth for font sizes, line heights, and spacing
 */

export const FONT_SIZES = {
  XS: '0.75rem',      // 12px
  SM: '0.875rem',     // 14px
  BASE: '1rem',       // 16px
  LG: '1.125rem',     // 18px
  XL: '1.25rem',      // 20px
  '2XL': '1.5rem',    // 24px
  '3XL': '1.875rem',  // 30px
  '4XL': '2.25rem',   // 36px
  '5XL': '3rem',      // 48px
  '6XL': '3.75rem',   // 60px
} as const;

export const LINE_HEIGHTS = {
  TIGHT: '1.25',
  NORMAL: '1.5',
  RELAXED: '1.75',
  LOOSE: '2',
} as const;

export const FONT_WEIGHTS = {
  LIGHT: '300',
  NORMAL: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
  EXTRABOLD: '800',
} as const;

export const SPACING = {
  XS: '0.25rem',   // 4px
  SM: '0.5rem',    // 8px
  MD: '1rem',      // 16px
  LG: '1.5rem',    // 24px
  XL: '2rem',      // 32px
  '2XL': '3rem',   // 48px
  '3XL': '4rem',   // 64px
  '4XL': '6rem',   // 96px
} as const;
