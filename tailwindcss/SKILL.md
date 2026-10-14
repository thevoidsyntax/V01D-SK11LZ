---
name: tailwindcss
version: "1.0.0"
description: "Tailwind CSS utility-first styling patterns, configuration, and responsive design."
when_to_use: "When using Tailwind CSS for styling, building design systems, or implementing responsive layouts."
priority: critical
phase: any
category: [frontend, styling]
tech_stack:
  frameworks: [react, vue, svelte, nextjs]
  tools: [tailwindcss]
scale: [all]
auto_invoke:
  enabled: true
  conditions:
    - has_file: ["tailwind.config.js", "tailwind.config.ts", "**/tailwind.css"]
      reason: "Tailwind CSS detected"
    - pattern: ["tailwind", "tw-", "className=", "class="]
      reason: "Tailwind CSS patterns detected"
capabilities:
  - utilities
  - responsive-design
  - dark-mode
  - components
author: TheVoidSyntax
---

# TAILWIND CSS v1.0 🎨

**Tailwind CSS utility-first styling patterns, configuration, and responsive design**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  COMMON UTILITIES                                         │
├─────────────────────────────────────────────────────────────┤
│  Layout:        flex, grid, block, hidden, absolute        │
│  Spacing:       p-4, m-2, gap-4, space-y-4              │
│  Sizing:        w-full, h-screen, min-w-0, max-w-lg     │
│  Typography:     text-lg, font-bold, leading-tight         │
│  Colors:        bg-blue-500, text-white, border-gray-300  │
│  Effects:       shadow-lg, rounded-lg, opacity-50          │
│  Responsive:     sm:flex, md:grid, lg:hidden             │
│  State:         hover:bg-blue, focus:ring, active:scale   │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,vue,svelte}',
  ],
  darkMode: 'class', // or 'media' for system preference
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
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
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
```

### Global Styles

```css
/* src/app.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors;
    @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  }

  .btn-primary {
    @apply btn bg-blue-600 text-white hover:bg-blue-700;
    @apply focus:ring-blue-500;
  }

  .btn-secondary {
    @apply btn bg-gray-200 text-gray-900 hover:bg-gray-300;
    @apply focus:ring-gray-500;
  }

  .input {
    @apply block w-full rounded-lg border-gray-300 px-3 py-2;
    @apply focus:border-blue-500 focus:ring-blue-500;
    @apply disabled:bg-gray-100 disabled:cursor-not-allowed;
  }

  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200;
    @apply overflow-hidden;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

## Layout Patterns

### Flexbox

```html
<!-- Center content -->
<div class="flex items-center justify-center">
  <div>Centered</div>
</div>

<!-- Space between -->
<div class="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- Stack vertically -->
<div class="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Flex wrap -->
<div class="flex flex-wrap gap-4">
  <div>Item</div>
  <div>Item</div>
</div>
```

### Grid

```html
<!-- Basic grid -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- Auto-fit grid -->
<div class="grid grid-cols-auto-fit minmax-250 gap-4">
  <div>Responsive columns</div>
</div>

<!-- With span -->
<div class="grid grid-cols-4 gap-4">
  <div class="col-span-2">Wide</div>
  <div>Normal</div>
  <div>Normal</div>
</div>
```

### Responsive Layout

```html
<!-- Mobile first breakpoints -->
<div class="
  block                <!-- Mobile: stack vertically -->
  md:flex            <!-- Tablet: row -->
  lg:grid           <!-- Desktop: grid -->
  xl:hidden         <!-- Large: hide -->
">
  Content
</div>

<!-- Stacked on mobile, side-by-side on desktop -->
<div class="flex flex-col md:flex-row">
  <div>Sidebar</div>
  <div>Content</div>
</div>
```

---

## Typography

### Text Styles

```html
<!-- Size scale -->
<p class="text-xs">Extra small</p>   <!-- 12px -->
<p class="text-sm">Small</p>          <!-- 14px -->
<p class="text-base">Base</p>         <!-- 16px -->
<p class="text-lg">Large</p>          <!-- 18px -->
<p class="text-xl">Extra large</p>     <!-- 20px -->
<p class="text-2xl">2XL</p>           <!-- 24px -->
<p class="text-4xl">4XL</p>          <!-- 32px -->

<!-- Font weight -->
<p class="font-thin">Thin</p>
<p class="font-normal">Normal</p>
<p class="font-medium">Medium</p>
<p class="font-semibold">Semibold</p>
<p class="font-bold">Bold</p>

<!-- Line height -->
<p class="leading-none">Tight</p>      <!-- 1.25 -->
<p class="leading-tight">Tight</p>     <!-- 1.25 -->
<p class="leading-normal">Normal</p>    <!-- 1.5 -->
<p class="leading-relaxed">Relaxed</p>  <!-- 1.625 -->
<p class="leading-loose">Loose</p>     <!-- 2 -->
```

### Prose (Typography Plugin)

```html
<!-- For content like blog posts -->
<article class="prose prose-lg max-w-none">
  <h1>Title</h1>
  <p>Paragraph with <a href="#">links</a></p>
  <ul>
    <li>List item</li>
  </ul>
  <blockquote>Quote</blockquote>
  <code>Inline code</code>
  <pre><code>Code block</code></pre>
</article>
```

---

## Colors & Dark Mode

### Color Reference

```html
<!-- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 -->
<div class="bg-red-500 text-white">Red</div>
<div class="bg-blue-500 text-white">Blue</div>
<div class="bg-green-500 text-white">Green</div>
<div class="bg-gray-500 text-white">Gray</div>

<!-- Opacity -->
<div class="bg-blue-500/50">50% opacity</div>
<div class="bg-blue-500/10">10% opacity</div>

<!-- Gradient -->
<div class="bg-gradient-to-r from-blue-500 to-purple-600">
  Gradient background
</div>

<!-- With arbitrary values -->
<div class="bg-[#1da1f2]">Custom color</div>
```

### Dark Mode

```html
<!-- Class-based dark mode -->
<div class="bg-white dark:bg-gray-900">
  <p class="text-gray-900 dark:text-white">Adapts to dark mode</p>
</div>

<!-- System preference (class="dark" on html) -->
<div class="bg-white [@media(prefers-color-scheme:dark)]:bg-gray-900">
  System preference
</div>
```

### Dynamic Colors

```typescript
// Dynamic color based on prop
const getColor = (variant: string) => {
  const colors = {
    primary: 'bg-blue-500 hover:bg-blue-600',
    secondary: 'bg-gray-500 hover:bg-gray-600',
    danger: 'bg-red-500 hover:bg-red-600',
  };
  return colors[variant] || colors.primary;
};

// Usage
<div class={getColor('primary')}>Button</div>
```

---

## Interactive States

### Hover, Focus, Active

```html
<!-- Hover -->
<button class="bg-blue-500 hover:bg-blue-600">
  Hover me
</button>

<!-- Focus -->
<input class="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />

<!-- Active -->
<button class="bg-blue-500 active:bg-blue-700">
  Press me
</button>

<!-- Group hover -->
<div class="group">
  <div class="group-hover:bg-blue-500">Hover parent</div>
</div>

<!-- Disabled -->
<button class="bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
  Disabled
</button>
```

### Transitions

```html
<!-- Smooth transitions -->
<button class="
  bg-blue-500
  transition-colors duration-200 ease-in-out
  hover:bg-blue-600
">
  Smooth transition
</button>

<!-- Transform -->
<div class="
  transition-transform duration-300
  hover:scale-105 hover:shadow-lg
">
  Scale on hover
</div>

<!-- Multiple properties -->
<div class="
  transition-all duration-300
  hover:bg-blue-500 hover:text-white hover:shadow-lg
">
  Multiple transitions
</div>
```

---

## Component Patterns

### Button

```html
<button class="
  inline-flex items-center justify-center
  px-4 py-2 rounded-lg font-medium
  bg-blue-600 text-white
  hover:bg-blue-700
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
">
  Button
</button>

<!-- Variants -->
<button class="btn-primary">Primary</button>
<button class="btn-secondary">Secondary</button>
<button class="btn-danger">Danger</button>
```

### Card

```html
<div class="
  bg-white rounded-xl shadow-sm border border-gray-200
  overflow-hidden
  hover:shadow-md transition-shadow duration-200
">
  <div class="p-6">
    <h3 class="text-lg font-semibold">Card Title</h3>
    <p class="text-gray-600 mt-2">Card content</p>
  </div>
  <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
    Footer
  </div>
</div>
```

### Input

```html
<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">
    Email
  </label>
  <input
    type="email"
    class="
      block w-full rounded-lg border-gray-300 px-3 py-2
      focus:border-blue-500 focus:ring-blue-500
      placeholder:text-gray-400
    "
    placeholder="you@example.com"
  />
</div>
```

---

## Spacing & Sizing

### Spacing Scale

```html
<!-- Common spacing -->
<div class="p-4">Padding 4 (16px)</div>
<div class="m-4">Margin 4</div>
<div class="gap-4">Gap 4</div>
<div class="space-x-4">Space between children horizontal</div>
<div class="space-y-4">Space between children vertical</div>

<!-- Arbitrary values -->
<div class="p-[17px]">Custom padding</div>
<div class="-m-[1px]">Negative margin</div>
```

### Responsive Sizing

```html
<!-- Width -->
<div class="w-full md:w-1/2 lg:w-1/3">Responsive width</div>
<div class="w-screen">Full viewport width</div>
<div class="w-min">Minimum width</div>
<div class="w-max">Maximum width</div>

<!-- Height -->
<div class="h-screen">Full viewport height</div>
<div class="h-auto">Auto height</div>
<div class="min-h-screen">Minimum viewport height</div>
```

---

## Animation

### Using CSS

```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
      },
    },
  },
};
```

```html
<!-- Apply animations -->
<div class="animate-fade-in">Fades in</div>
<div class="animate-slide-up">Slides up</div>

<!-- Infinite animation -->
<div class="animate-pulse">Loading...</div>
<div class="animate-spin">Spinning</div>
<div class="animate-bounce">Bouncing</div>
```

---

## Best Practices

### 1. Use Design Tokens

```javascript
// Instead of magic numbers
// ❌ Bad
<div class="mt-[calc(16px+8px)] px-4 py-[11px]">

// ✅ Good - define in config
module.exports = {
  theme: {
    extend: {
      spacing: { '4.5': '18px' },
      padding: { '4.5': '18px' },
    },
  },
};
```

### 2. Extract Components

```html
<!-- ❌ Repeated classes -->
<button class="px-4 py-2 rounded-lg bg-blue-600 text-white...">Save</button>
<button class="px-4 py-2 rounded-lg bg-blue-600 text-white...">Submit</button>

<!-- ✅ Component -->
<button class="btn-primary">Save</button>
<button class="btn-primary">Submit</button>
```

### 3. Mobile First

```html
<!-- ✅ Good - mobile first -->
<div class="block md:flex lg:grid">

<!-- ❌ Bad - desktop first -->
<div class="hidden lg:flex md:block">
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/react-pro` | React patterns |
| `/vue-pro` | Vue patterns |
| `/code-quality` | Code quality |

---

*Style fast without writing custom CSS!*
