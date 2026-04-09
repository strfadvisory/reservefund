# Design System Implementation

This document explains how to use the design system throughout your application.

## Overview

Your app now has a complete design system with:
- **Colors**: Primary, secondary, text, borders, forms
- **Typography**: Google Sans font family with defined heading and body styles
- **Spacing**: 7px corner radius as default
- **Light & Dark Modes**: Full support for both themes

## Color Palette

### Light Mode (Default)
- **Text Default**: `#102C4A` - Primary text color
- **Text Secondary**: `#66717D` - Secondary/muted text
- **Link Color**: `#0E519B` - All hyperlinks
- **Border Color**: `#B5BCC4` - Borders and outlines
- **Form Outline**: `#B5BCC4` - Form field borders
- **Selected Field Border**: `#0E519B` - Form focus state
- **Background**: `#FFFFFF` - Page background
- **Primary**: `#0E519B` - Main brand color

### Dark Mode
- Automatically applies when `.dark` class is added to `<html>`
- Maintains contrast and readability

## Typography

### Headings
- **H1**: 24px, Semibold
- **H2**: 20px, Semibold
- **H3**: 16px, Semibold

### Body Text
- **Body**: 16px, Regular
- **Secondary**: 16px, Regular (for secondary text)
- **Indicator**: 14px, Regular (for smaller, helper text)

### Font Family
- Google Sans (fallback to system fonts)

## Usage

### In JSX/TSX Components

#### Using CSS Classes (Tailwind)
```tsx
// Text colors
<p className="text-text-default">Default text</p>
<p className="text-text-secondary">Secondary text</p>
<a href="#" className="text-link-color">Link</a>

// Headings (automatically styled)
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>

// Form inputs (automatically styled)
<input type="text" placeholder="Enter text" />
<textarea></textarea>

// Borders
<div className="border border-border rounded-lg p-4">
  Content
</div>

// Focus states
<input 
  type="text" 
  className="border border-form-outline focus:border-selected-border"
/>

// Utility classes for text
<span className="text-indicator">Helper text</span>
<span className="text-secondary-type">Secondary text</span>
```

#### Using Design Tokens
```tsx
import { designTokens, cssVariables } from '@/lib/designTokens';

// Using the token object
const buttonStyle = {
  backgroundColor: designTokens.colors.light.primary,
  color: designTokens.colors.light.primary,
  borderRadius: designTokens.spacing.cornerRadius,
  fontFamily: designTokens.typography.fontFamily.sans,
};

// Using CSS variables (recommended for dynamic styles)
const boxStyle = {
  borderColor: cssVariables.colors.border,
  color: cssVariables.colors.textDefault,
};
```

#### Using CSS Custom Properties
```css
/* In your CSS files */
.custom-component {
  color: var(--text-default);
  border: 1px solid var(--form-outline);
  border-radius: var(--radius);
}

.custom-component:focus {
  border-color: var(--selected-border);
}
```

### Dark Mode
Dark mode is activated by adding the `dark` class to the `<html>` element:

```tsx
// In your layout or theme toggle component
document.documentElement.classList.toggle('dark');
```

All colors automatically update when the dark class is applied.

## CSS Variables

All design tokens are available as CSS custom properties:

```css
--text-default          /* Primary text color */
--text-secondary        /* Secondary text color */
--link-color           /* Link color */
--form-outline         /* Form border color */
--selected-border      /* Form focus border color */
--background           /* Page background */
--foreground           /* Main text color */
--primary              /* Primary brand color */
--secondary            /* Secondary color */
--border               /* Border color */
--radius               /* Corner radius (7px) */
```

## Tailwind Context

The design system is fully integrated with Tailwind CSS v4:

```tsx
// Responsive utilities work as expected
<div className="text-text-default md:text-lg">
  Responsive text
</div>

// All Tailwind utilities use the design system colors
<button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
  Button
</button>

// Spacing with design system radius
<div className="rounded-lg border border-border p-4">
  Card
</div>
```

## Configuration Files

### globals.css
- Located at: `/app/globals.css`
- Contains all CSS custom properties and base styles
- Imports Tailwind and tailwind-css animations

### Design Tokens
- Located at: `/lib/designTokens.ts`
- TypeScript definitions for all design tokens
- Can be imported and used in components

## Best Practices

1. **Always use design tokens** instead of hardcoding colors
2. **Use Tailwind classes** for common styling (colors, spacing, borders)
3. **Use CSS variables** for dynamic or custom styles
4. **Maintain consistency** by referencing this guide when adding new components
5. **Test dark mode** by toggling the `dark` class on the HTML element

## File Structure
```
app/
  globals.css           # Main design system CSS
lib/
  designTokens.ts       # TypeScript token definitions
DESIGN_SYSTEM.md        # This file
```

## Extending the Design System

To add new colors or update existing ones:

1. Update `/app/globals.css` (both `:root` and `.dark` sections)
2. Update `/lib/designTokens.ts` with the new values
3. Update this documentation

## Support

For questions about the design system or implementation, refer to the design tokens file or globals.css for the current values.
