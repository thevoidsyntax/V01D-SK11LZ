---
name: ui-ux-pro-max-styling
description: UI styling with shadcn/ui (Radix primitives), Tailwind CSS, and Canvas for visual compositions.
when_to_use: Use when implementing UI components, setting up Tailwind, or creating visual designs with shadcn/ui.
version: 2.13.0
priority: medium
phase: any
author: TheVoidSyntax
source: github.com/nextlevelbuilder/ui-ux-pro-max-skill
---

# UI Styling Skill

Modern UI styling with shadcn/ui, Tailwind CSS, and Canvas.

## Tech Stack

### shadcn/ui
Accessible components built on Radix UI primitives, distributed via copy-paste.

```bash
# Initialize
npx shadcn@latest init

# Add components
npx shadcn@latest add button card dialog
```

### Tailwind CSS
Utility-first styling with build-time processing and zero runtime overhead.

```bash
# Install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Canvas
For museum-quality visual compositions and brand materials.

## Quick Setup

```bash
# shadcn/ui initialization
npx shadcn@latest init

# Add common components
npx shadcn@latest add button card dialog dropdown-menu input label badge
```

## Component Categories

| Category | Components |
|----------|-----------|
| **Forms** | Input, Label, Button, Select, Checkbox, Radio |
| **Layout** | Card, Dialog, Sheet, Accordion, Tabs |
| **Feedback** | Toast, Alert, Progress, Skeleton |
| **Navigation** | NavigationMenu, Breadcrumb, Pagination |
| **Data** | Table, Avatar, Badge, Chip |

## Tailwind Configuration

### Custom Theme

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
    },
  },
}
```

### Responsive Breakpoints

```js
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

## Dark Mode

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
}
```

```css
/* Dark mode with CSS variables */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

## Animation Utilities

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
}
```

## Best Practices

1. **Use CSS Variables** - Centralize design tokens
2. **Mobile First** - Start with mobile, add md/lg breakpoints
3. **Semantic Colors** - primary, secondary, muted, destructive
4. **Accessible** - Focus rings, contrast, ARIA labels
5. **Composable** - Small components, larger patterns

---

**Source:** nextlevelbuilder/ui-ux-pro-max-skill
