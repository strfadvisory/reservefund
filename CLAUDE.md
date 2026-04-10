# Design System

## Colors
- **Text Default Colour:** `#102C4A`
- **Link (`<a>`) Colour:** Always inherit from parent (no fixed link color)
- **Secondary Text Colour:** `#66717D`
- **Border Colour:** `#D7D7D7`
- **Form Outline:** `#D7D7D7`
- **Selected Field Border:** `#0E519B`

## Typography
- **Font Family:** Google Sans
- **Default Font Size:** 16px (applies across the entire app unless otherwise specified)
- **Corner Radius:** 7px

### Headings
- **H1:** 24px, Semibold
- **H2:** 20px, Semibold
- **H3:** 16px, Semibold

### Text Styles
- **Body:** 16px, Regular
- **Secondary:** 16px, Regular
- **Indicator:** 14px, Regular

## Assets
- **Images Path:** `public/images/`

## Components
- **Forms:** Always use shadcn/ui components for forms (Input, Button, Checkbox, Label, Form, Select, Textarea, etc.). Never build form controls from raw HTML elements. Install via `npx shadcn@latest add <component>` when needed.

## Master Page Layout
- **Reference:** `app/register/page.tsx` is the master/reference layout for all pages.
- When the user asks to use "master page layout" (or similar), mirror this structure:
  - Fixed left panel: `353px` width, `public/images/leftbg.png` background, `public/images/logo.png` positioned top-left (40px top, 40px left).
  - Right panel: `flex-1`, fills remaining width, vertically and horizontally centers an inner container (max width `643px`) while space allows, scrolls when content overflows.
  - Form content lives inside a bordered card (`1px solid #D7D7D7`, `7px` radius) with internal section dividers.

@AGENTS.md
