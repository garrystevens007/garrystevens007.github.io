# Design Specifications & Tailwind Integration

## Color System

Using your existing portfolio color scheme with API-specific additions.

### Primary Colors
- **Pink (Primary Accent)**: `#ec4899` → `pink-600`
- **Pink (Hover)**: `#be185d` → `pink-800`
- **Pink (Background)**: `#fce7f3` → `pink-100`

### Method-Specific Colors
- **GET (Teal)**: `#10b981` → `emerald-500`
- **POST/PUT (Blue)**: `#3b82f6` → `blue-500`
- **DELETE (Red)**: `#ef4444` → `red-500`
- **PATCH/OPTIONS (Yellow)**: `#f59e0b` → `amber-500`

### Neutral Colors
- **Background**: `#ffffff` → `white`
- **Surface**: `#f9fafb` → `gray-50`
- **Border**: `#e5e7eb` → `gray-200`
- **Text Primary**: `#1f2937` → `gray-900`
- **Text Secondary**: `#6b7280` → `gray-500`
- **Text Tertiary**: `#9ca3af` → `gray-400`

### Status Colors
- **Success (200, 201)**: `#10b981` → `emerald-500`
- **Warning (400, 429)**: `#f59e0b` → `amber-500`
- **Error (404, 500)**: `#ef4444` → `red-500`
- **Info (Other)**: `#3b82f6` → `blue-500`

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;
```

### Type Scale
- **Display (Titles)**: `text-3xl` (30px) - Bold (700)
- **Heading 1**: `text-2xl` (24px) - Bold (700)
- **Heading 2**: `text-xl` (20px) - Semibold (600)
- **Heading 3**: `text-lg` (18px) - Semibold (600)
- **Body (Regular)**: `text-base` (16px) - Regular (400)
- **Body (Small)**: `text-sm` (14px) - Regular (400)
- **Caption**: `text-xs` (12px) - Regular (400)
- **Monospace (Code)**: `font-mono text-sm` - For URLs, JSON, terminal

### Line Heights
- Headings: `leading-tight` (1.25)
- Body: `leading-relaxed` (1.625)
- Code/Mono: `leading-snug` (1.375)

---

## Spacing System

Uses Tailwind's 4px base unit (16px = 1 unit).

### Padding & Margins
- `p-1` / `m-1`: 4px
- `p-2` / `m-2`: 8px
- `p-3` / `m-3`: 12px
- `p-4` / `m-4`: 16px
- `p-6` / `m-6`: 24px
- `p-8` / `m-8`: 32px

### Gap (Between Elements)
- `gap-1`: 4px
- `gap-2`: 8px
- `gap-3`: 12px
- `gap-4`: 16px
- `gap-6`: 24px

### Common Spacing Patterns
- Container padding: `p-6` or `p-8`
- Card padding: `p-4` or `p-6`
- Button padding: `px-4 py-2` (16x8px)
- Section spacing: `space-y-6` or `space-y-8`

---

## Border & Radius

### Border Radius
- Buttons & small elements: `rounded` (4px)
- Cards & sections: `rounded-lg` (8px)
- Large containers: `rounded-xl` (12px)
- Circles: `rounded-full` (50%)

### Borders
- Default: `border border-gray-200`
- On hover: `border-pink-300` or `border-blue-400`
- On focus: `border-pink-500` or `focus:ring-2 focus:ring-pink-500`
- Dividers: `border-t border-gray-200`

---

## Shadows

### Elevation Levels
- **None**: No shadow
- **Subtle**: `shadow-sm` (0 1px 2px rgba(0,0,0,0.05))
- **Raised**: `shadow` (0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06))
- **Floating**: `shadow-md` (0 4px 6px rgba(0,0,0,0.1))
- **Elevated**: `shadow-lg` (0 10px 15px rgba(0,0,0,0.1))

### Common Usage
- Cards: `shadow-sm` (default) or `shadow` (on hover)
- Modals/Overlays: `shadow-xl`
- Buttons (active): `active:shadow-none active:scale-95`
- Request Builder: `shadow-sm` with `border border-gray-200`

---

## Buttons

### Button Styles

#### Primary (CTA)
```tailwind
bg-pink-600 text-white font-semibold rounded-lg px-6 py-3
hover:bg-pink-700
active:scale-95 active:shadow-none
disabled:bg-gray-400 disabled:cursor-not-allowed
focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
transition-all
```

#### Secondary
```tailwind
bg-gray-200 text-gray-900 font-semibold rounded-lg px-6 py-3
hover:bg-gray-300
active:scale-95
focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
transition-all
```

#### Ghost (Link-like)
```tailwind
text-pink-600 font-semibold
hover:text-pink-700 hover:bg-pink-50
focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
transition
```

#### Method Buttons (GET, POST, etc)
```tailwind
px-4 py-2 rounded font-semibold transition
selected: bg-pink-600 text-white shadow-md
unselected: bg-gray-200 text-gray-700 hover:bg-gray-300
```

#### Icon Buttons
```tailwind
p-2 rounded hover:bg-gray-100 transition
text-gray-700 hover:text-gray-900
```

### Button States
- **Default**: Base styles above
- **Hover**: Darker background, slight lift
- **Active/Pressed**: Scale 95%, reduce shadow
- **Disabled**: Gray background, not-allowed cursor
- **Focus**: Ring-2 with offset
- **Loading**: Show spinner, disable interaction

---

## Form Elements

### Input Fields
```tailwind
w-full px-4 py-2
border border-gray-300 rounded-lg
bg-white text-gray-900
placeholder:text-gray-500
focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
transition
```

### Textarea
```tailwind
w-full p-3 font-mono text-sm
border border-gray-300 rounded-lg
bg-gray-900 text-gray-100
placeholder:text-gray-600
focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
resize-none
transition
```

### Select / Dropdown
```tailwind
appearance-none px-4 py-2
border border-gray-300 rounded-lg
bg-white text-gray-900
cursor-pointer
focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
pr-8 /* space for dropdown arrow */
```

### Checkbox / Radio
```tailwind
w-4 h-4 rounded
border border-gray-300
checked:bg-pink-600 checked:border-pink-600
focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
cursor-pointer
```

### Label
```tailwind
block text-sm font-semibold text-gray-700 mb-2
```

---

## Cards & Containers

### Endpoint Card (List Item)
```tailwind
p-4 rounded-lg border-2 cursor-pointer
transition-all duration-200

/* Unselected */
bg-white border-gray-200 hover:border-pink-300 hover:shadow-sm

/* Selected */
bg-pink-50 border-pink-500 shadow-md
```

### Response Card / Section
```tailwind
bg-white border border-gray-200 rounded-lg p-4 shadow-sm
hover:shadow transition
```

### Stat Card
```tailwind
bg-white rounded-lg p-4 shadow-sm border border-gray-200
hover:shadow-md transition

/* Icon + Label + Value layout */
flex items-start gap-3
```

### Header / Section Title
```tailwind
text-2xl font-bold text-gray-900 mb-4
border-b border-gray-200 pb-3
```

---

## Status & Badge Elements

### Method Badge
```tailwind
px-2 py-1 text-xs font-bold rounded border

/* GET */
bg-emerald-100 text-emerald-800 border-emerald-300

/* POST/PUT */
bg-blue-100 text-blue-800 border-blue-300

/* DELETE */
bg-red-100 text-red-800 border-red-300
```

### Status Badge (Response)
```tailwind
inline-block px-3 py-2 rounded border-2 font-semibold

/* 200, 201 */
bg-emerald-100 border-emerald-300 text-emerald-800

/* 400, 429 */
bg-amber-100 border-amber-300 text-amber-800

/* 404, 500 */
bg-red-100 border-red-300 text-red-800
```

### Tag / Chip
```tailwind
inline-block px-3 py-1 text-xs rounded-full
bg-pink-100 text-pink-700 font-semibold
```

---

## Animations & Transitions

### Default Transition
```tailwind
transition transition-colors duration-200
```

### Hover Effects
```javascript
// Subtle lift
hover:shadow-md hover:-translate-y-1 transition

// Color shift
hover:bg-gray-100 hover:text-gray-900 transition

// Border change
hover:border-pink-500 transition
```

### Loading Animation
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Tailwind: animate-spin */
```

### Progress Bar
```css
@keyframes progress {
  0% { width: 0%; }
  50% { width: 80%; }
  100% { width: 100%; }
}

.animate-progress {
  animation: progress 2s ease-in-out;
}
```

### Pulse (Loading Indicator)
```tailwind
animate-pulse /* Tailwind built-in */
```

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}
```

### Slide In
```css
@keyframes slideInUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-in-up {
  animation: slideInUp 0.3s ease-out;
}
```

---

## Dark Mode (Optional Future Enhancement)

If dark mode is added, use Tailwind's `dark:` prefix:

```tailwind
bg-white dark:bg-gray-900
text-gray-900 dark:text-white
border-gray-200 dark:border-gray-700
```

---

## Responsive Behavior

### Breakpoints
- Mobile: < 640px (no specific prefix)
- Tablet: 640px-1024px (`md:`)
- Desktop: > 1024px (`lg:`)

### Layout Adjustments
```tailwind
/* Desktop: 2-column grid */
grid grid-cols-2 gap-6

/* Tablet: Stack vertically, single column */
md:grid-cols-1 md:gap-4

/* Mobile: Stack, reduce padding */
sm:p-3 sm:gap-2
```

### Font Size Adjustments
```tailwind
/* Desktop heading */
text-3xl

/* Tablet heading */
md:text-2xl

/* Mobile heading */
sm:text-xl
```

### Container Queries (if using Tailwind 3.2+)
```tailwind
@container (min-width: 400px) {
  .endpoint-item { display: grid; }
}
```

---

## Syntax Highlighting for JSON

### Color Classes (Inline)
```javascript
// Key
<span className="text-blue-600 font-semibold">"key"</span>

// String value
<span className="text-green-600">"value"</span>

// Number value
<span className="text-orange-600">42</span>

// Boolean
<span className="text-purple-600">true</span>

// Null
<span className="text-gray-500">null</span>

// Punctuation
<span className="text-gray-700">:</span>
```

### Example JSON Display
```jsx
<pre className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
  <code>
    <span className="text-green-400">{`{`}</span>
    {'\n  '}
    <span className="text-blue-400">"status"</span>
    <span className="text-gray-500">{`:`}</span> 
    <span className="text-green-400">"success"</span>
    <span className="text-gray-500">{`,`}</span>
    {'\n  '}
    <span className="text-blue-400">"data"</span>
    <span className="text-gray-500">{`:`}</span> {...}
    {'\n'}
    <span className="text-green-400">{`}`}</span>
  </code>
</pre>
```

---

## Z-Index Scale

```tailwind
z-0    /* Default stacking */
z-10   /* Dropdowns, tooltips */
z-20   /* Modals, overlays */
z-30   /* Alerts, toasts */
z-40   /* Max: Critical overlays */
```

---

## Print Styles (Optional)

```css
@media print {
  .no-print { display: none; }
  
  .api-playground {
    background: white;
    color: black;
    border: 1px solid #ccc;
  }
  
  button { border: 1px solid #999; }
}
```

---

## Accessibility Contrast Checklist

| Element | Foreground | Background | Contrast | WCAG |
|---------|-----------|-----------|----------|------|
| Body Text | `#1f2937` (gray-900) | `#ffffff` (white) | 16.5:1 | AAA ✓ |
| Secondary Text | `#6b7280` (gray-500) | `#ffffff` (white) | 6.9:1 | AA ✓ |
| Pink Button | `#ffffff` (white) | `#ec4899` (pink-600) | 5.1:1 | AA ✓ |
| Border | `#e5e7eb` (gray-200) | `#ffffff` (white) | 2.3:1 | - |
| GET Badge | `#10b981` (emerald) | `#f0fdf4` (emerald-50) | 7.2:1 | AAA ✓ |

---

## Focus Styles (Keyboard Navigation)

All interactive elements must have clear focus indicators:

```tailwind
focus:outline-none
focus:ring-2 
focus:ring-pink-500 
focus:ring-offset-2
```

Example:
```jsx
<button
  className="px-4 py-2 rounded bg-pink-600 text-white
    focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
    transition"
>
  Click me
</button>
```

---

## Loading & Skeleton States

### Skeleton Loader
```tailwind
bg-gray-200 animate-pulse rounded
/* Use for cards, lists while loading */
```

### Text Skeleton
```tailwind
h-4 bg-gray-200 rounded animate-pulse
```

### Example:
```jsx
<div className="space-y-3">
  <div className="h-6 bg-gray-200 rounded animate-pulse" />
  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
</div>
```

---

## Utility Classes Reference

### Common Patterns
```tailwind
/* Centered container */
mx-auto max-w-4xl

/* Flex center */
flex items-center justify-center

/* Text truncate */
truncate
/* Or with ellipsis */
overflow-hidden text-ellipsis whitespace-nowrap

/* Hidden until breakpoint */
hidden md:block

/* Aspect ratio */
aspect-video /* 16:9 */
aspect-square

/* Overflow */
overflow-auto max-h-96
overflow-x-auto

/* Divider */
border-t border-gray-200
```

