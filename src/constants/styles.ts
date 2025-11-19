/**
 * Global style constants
 * Single source of truth for transitions, borders, colors, etc.
 */

export const TRANSITIONS = {
  DEFAULT: 'all 0.2s ease',
  FAST: 'all 0.1s ease',
  SLOW: 'all 0.3s ease',
  TRANSFORM: 'transform 0.2s ease',
  OPACITY: 'opacity 0.2s ease',
  BORDER: 'border-color 0.2s ease',
} as const;

export const BORDERS = {
  DEFAULT: '1px solid var(--ifm-color-primary)',
  LIGHT: '1px solid rgba(59, 130, 246, 0.2)',
  HOVER: '1px solid var(--ifm-color-primary)',
  CARD: '1px solid hsl(var(--border))',
} as const;

export const BORDER_RADIUS = {
  SM: '0.375rem',
  MD: '0.5rem',
  LG: '0.75rem',
  XL: '1rem',
} as const;

export const SHADOWS = {
  SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  MD: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  LG: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  XL: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const;

export const HOVER_TRANSFORMS = {
  SCALE_SMALL: 'scale(1.01)',
  SCALE_MEDIUM: 'scale(1.02)',
  SCALE_LARGE: 'scale(1.05)',
  LIFT: 'translateY(-2px)',
} as const;

export const GRADIENTS = {
  PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  BLUE: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  PURPLE: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
} as const;

export const TEXT_SHADOW = {
  SUBTLE: '0 2px 10px rgba(0, 0, 0, 0.3)',
  STRONG: '0 2px 20px rgba(0, 0, 0, 0.5)',
} as const;
