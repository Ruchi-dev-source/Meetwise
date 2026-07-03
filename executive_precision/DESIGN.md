---
name: Executive Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#46494b'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e6163'
  on-tertiary-container: '#dadcde'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-gap: 16px
---

## Brand & Style
The design system is engineered for high-performance enterprise teams, blending the utility of a developer tool with the polished elegance of a premium consultancy. The brand personality is authoritative yet approachable—functioning as an "intelligent silent partner" in meeting management.

The aesthetic follows a **Modern Corporate** direction, synthesizing the structured efficiency of Linear with the collaborative softness of Notion. It utilizes a refined **Glassmorphism** approach for overlays and sidebars to maintain context, paired with high-contrast functional areas to ensure data density remains legible. The emotional response should be one of "controlled clarity"—reducing the cognitive load of complex schedules through generous whitespace and purposeful motion.

## Colors
The palette is anchored by a sophisticated **Indigo Primary**, chosen for its associations with intelligence and reliability. 

- **Light Mode:** Uses a "Crisp Gallery" approach. The primary background is white (#FFFFFF), while secondary surfaces use a very subtle cool slate (#F8FAFC) to create soft structural containment.
- **Dark Mode:** Moves away from pure black to a "Deep Obsidian" (#0B0E14). This reduces eye strain and allows for better depth perception when using glassmorphic blurs.
- **Accents:** Semantic colors (Success, Warning, Error) are desaturated to maintain the professional tone, ensuring they inform the user without shouting.

## Typography
This design system utilizes a dual-font strategy to balance technical precision with readability. 

**Geist** is reserved for headlines, labels, and data points. Its monospaced-influenced proportions lend a sense of "built-in" accuracy and modern engineering. **Inter** is used for all body copy and long-form text, providing maximum legibility across all display types. 

Hierarchy is established through weight and purposeful tracking; uppercase labels with slight letter spacing are used for secondary metadata to distinguish it from actionable primary text.

## Layout & Spacing
The layout relies on a **4px baseline grid** for micro-spacing and a **12-column fluid grid** for macro-layout. 

- **App Workspace:** Uses a "pinned-sidebar" model with a flexible content area. The sidebar remains fixed at 240px, while the main stage expands.
- **Marketing Site:** Utilizes a fixed-width central container (1440px) with generous vertical section padding (80px to 120px) to allow the brand visuals to breathe.
- **Responsive Behavior:** On tablet, the sidebar collapses into a hamburger menu or narrow icon-rail. On mobile, all grid columns stack vertically with a standard 16px side margin.

## Elevation & Depth
Depth is created through a combination of **Tonal Layering** and **Glassmorphism**. 

1.  **Level 0 (Base):** The main canvas background.
2.  **Level 1 (Cards):** Slightly raised with a 1px border (#E2E8F0 in light, #30363D in dark) and a very soft, high-diffusion shadow (0px 4px 20px rgba(0,0,0,0.05)).
3.  **Level 2 (Overlays/Modals):** Glassmorphic surfaces with a 20px backdrop blur and 80% opacity. This keeps the user grounded in their previous context.
4.  **Level 3 (Popovers/Tooltips):** Highest elevation, utilizing a more pronounced shadow to indicate temporary interaction.

## Shapes
The shape language is "Soft-Technical." Primary containers and cards use a **16px (rounded-lg)** radius to evoke a modern, friendly SaaS feel. Smaller interactive elements like buttons and input fields use an **8px (standard)** radius to maintain a sense of structural integrity. 

Iconography should follow a consistent 2px stroke weight with slightly rounded joins to match the UI's geometry.

## Components
- **Buttons:** Primary buttons use the deep indigo background with white text. Secondary buttons use a ghost style (transparent background, 1px border). All buttons have a subtle 2px vertical offset shadow to appear "pressable."
- **Cards:** Defined by a 16px corner radius. In the dashboard, cards should have no fill (just a 1px border) to keep the UI light, unless they are "active" or "featured."
- **Input Fields:** Use a subtle background fill (#F1F5F9 in light mode) rather than just a border. On focus, the border transitions to the primary indigo with a 3px soft glow.
- **Chips/Badges:** Use a "capsule" (pill) shape with low-saturation backgrounds (e.g., light blue for "Scheduled," light amber for "In Progress").
- **Meeting Timeline:** A specialized component using a vertical stem with "nodes" representing agenda items, utilizing the primary indigo for the active state and neutral slates for upcoming items.
- **Glass Sidebar:** 240px width, utilizing `backdrop-filter: blur(10px)` to allow the main background gradients or content to peek through, creating a sense of luxury and depth.