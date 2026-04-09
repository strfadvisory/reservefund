/**
 * Design System Tokens
 * Central location for all design system values including colors, typography, spacing, and more
 */

export const designTokens = {
  colors: {
    text: {
      default: '#102C4A',
      secondary: '#66717D',
    },
    link: '#0E519B',
    border: '#B5BCC4',
    forms: {
      outline: '#B5BCC4',
      selectedBorder: '#0E519B',
    },
    // Light mode theme
    light: {
      background: '#FFFFFF',
      foreground: '#102C4A',
      card: '#FFFFFF',
      primary: '#0E519B',
      secondary: '#66717D',
      muted: '#B5BCC4',
      accent: '#0E519B',
      destructive: '#DC2626',
      border: '#B5BCC4',
      input: '#B5BCC4',
      ring: '#0E519B',
    },
    // Dark mode theme
    dark: {
      background: '#0F172A',
      foreground: '#FFFFFF',
      card: '#1E293B',
      primary: '#6B9FD4',
      secondary: '#94A3B8',
      muted: '#334155',
      accent: '#6B9FD4',
      destructive: '#EF4444',
      border: '#334155',
      input: '#334155',
      ring: '#6B9FD4',
    },
  },

  typography: {
    fontFamily: {
      sans: "'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    headings: {
      h1: {
        fontSize: '24px',
        fontWeight: 600, // Semibold
        lineHeight: '1.2',
      },
      h2: {
        fontSize: '20px',
        fontWeight: 600, // Semibold
        lineHeight: '1.3',
      },
      h3: {
        fontSize: '16px',
        fontWeight: 600, // Semibold
        lineHeight: '1.4',
      },
    },
    body: {
      default: {
        fontSize: '16px',
        fontWeight: 400, // Regular
        lineHeight: '1.5',
      },
      secondary: {
        fontSize: '16px',
        fontWeight: 400, // Regular
        lineHeight: '1.5',
      },
    },
    indicator: {
      fontSize: '14px',
      fontWeight: 400, // Regular
      lineHeight: '1.4',
    },
  },

  spacing: {
    cornerRadius: '7px',
    radiusSmall: 'calc(7px * 0.6)',
    radiusMedium: 'calc(7px * 0.8)',
    radiusLarge: '7px',
    radiusXL: 'calc(7px * 1.4)',
    radius2XL: 'calc(7px * 1.8)',
    radius3XL: 'calc(7px * 2.2)',
    radius4XL: 'calc(7px * 2.6)',
  },

  forms: {
    outlineColor: '#B5BCC4',
    focusColor: '#0E519B',
    focusRing: '2px',
  },
} as const;

/**
 * Tailwind CSS configuration object for design tokens
 * Can be imported and merged into tailwind.config.ts
 */
export const tailwindDesignTokens = {
  colors: {
    'text-default': designTokens.colors.text.default,
    'text-secondary': designTokens.colors.text.secondary,
    'link-color': designTokens.colors.link,
    'form-outline': designTokens.colors.forms.outline,
    'selected-border': designTokens.colors.forms.selectedBorder,
  },
  fontFamily: {
    sans: designTokens.typography.fontFamily.sans,
  },
  borderRadius: {
    sm: designTokens.spacing.radiusSmall,
    md: designTokens.spacing.radiusMedium,
    lg: designTokens.spacing.radiusLarge,
    xl: designTokens.spacing.radiusXL,
    '2xl': designTokens.spacing.radius2XL,
    '3xl': designTokens.spacing.radius3XL,
    '4xl': designTokens.spacing.radius4XL,
  },
} as const;

/**
 * CSS variable names for use in components
 * Useful for direct CSS-in-JS or style props
 */
export const cssVariables = {
  colors: {
    textDefault: 'var(--text-default)',
    textSecondary: 'var(--text-secondary)',
    linkColor: 'var(--link-color)',
    formOutline: 'var(--form-outline)',
    selectedBorder: 'var(--selected-border)',
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    border: 'var(--border)',
    background: 'var(--background)',
    foreground: 'var(--foreground)',
  },
  spacing: {
    radius: 'var(--radius)',
  },
} as const;

// Type exports for TypeScript usage
export type DesignTokens = typeof designTokens;
export type TailwindDesignTokens = typeof tailwindDesignTokens;
export type CSSVariables = typeof cssVariables;
