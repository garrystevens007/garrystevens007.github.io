# Role Picker Page - UI/UX Specification

## Page Overview

**URL**: `/roles` or `/` (depending on role selection status)  
**Purpose**: Allow users to select which persona they are viewing the portfolio as  
**Layout**: Full-screen, centered, with glassmorphic animated cards  
**Animations**: Smooth transitions, interactive liquid effects, hover states  

---

## Page Structure

```
┌─────────────────────────────────────────┐
│                                         │
│          ┌───────────────────┐          │
│          │   "Who am I?"     │          │
│          │                   │          │
│          │  Pick your role   │          │
│          └───────────────────┘          │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  │   HR     │  │Technical │  │ Manager/ │
│  │  Glass   │  │  Glass   │  │Director  │
│  │  Card 1  │  │  Card 2  │  │  Glass   │
│  │          │  │          │  │  Card 3  │
│  └──────────┘  └──────────┘  └──────────┘
│                                         │
│        [Glasmorphic Effects]           │
│                                         │
│  Footer: "Switch roles anytime"        │
│                                         │
└─────────────────────────────────────────┘
```

---

## Background & Layout

### **Background**
- **Base**: Gradient background (subtle movement)
- **Gradient**: Pink to purple gradient
  - Start: `from-pink-100 via-purple-50 to-blue-50`
  - Or: Custom gradient with slight animation
- **Alternative**: Animated gradient mesh (optional, more complex)

### **Container**
- Full viewport height: `h-screen`
- Centered content: `flex items-center justify-center`
- Padding on mobile: `px-4`
- Max content width: May vary by screen, cards responsive

---

## Title Section

### **"Who am I?" Heading**
```html
<h1>Who am I?</h1>
<p>Pick your role</p>
```

**Styling**:
- **H1**: 
  - `text-4xl md:text-5xl font-bold text-gray-900`
  - `mb-2`
  - Smooth fade-in animation on load

- **P (Subtitle)**:
  - `text-lg md:text-xl text-gray-600`
  - `mb-12`
  - Delayed fade-in (staggered)

**Animation**:
- Both fade in from opacity 0 → 1
- Duration: 0.6s
- Delay: 0.2s (H1), 0.4s (P)
- Easing: ease-out

---

## Role Cards (Glassmorphic)

### **Layout**
- **Desktop**: 3 columns, horizontal layout
  - `grid grid-cols-3 gap-8`
  - `max-w-6xl`
- **Tablet**: 2 columns or responsive
  - `md:grid-cols-2 md:gap-6`
- **Mobile**: 1 column, stack vertically
  - `sm:grid-cols-1 sm:gap-4 sm:px-4`

### **Individual Card Structure**

Each card has the same structure, repeated 3 times:

```html
<div class="role-card">
  <div class="card-icon">
    {animated icon}
  </div>
  <h2>Role Title</h2>
  <p>Role Description</p>
  <button>Select Role</button>
</div>
```

---

## Card Styling (Glassmorphism)

### **Base Styles**
```tailwind
class="
  relative
  p-8
  rounded-3xl
  backdrop-blur-xl
  bg-white/10
  border border-white/20
  shadow-2xl
  cursor-pointer
  transition-all duration-300
  hover:shadow-2xl
  group
"
```

### **Glassmorphic Effect**
- **Backdrop Blur**: `backdrop-blur-xl` (blur(20px))
- **Background**: Semi-transparent white `bg-white/10`
- **Border**: Light white border `border border-white/20`
- **Shadow**: Subtle shadow `shadow-xl`

### **Hover State** (All Interactive)
```css
/* On hover */
- scale: transform translateY(-12px) scale(1.05)
- backdrop blur: Increase to blur(25px)
- background: Change to bg-white/15
- border: Change to border-white/30
- shadow: Enhance to shadow-2xl
- glow: Add pink/purple glow effect
```

**Implementation**:
```tailwind
hover:scale-105
hover:backdrop-blur-2xl
hover:[background:rgba(255,255,255,0.15)]
hover:border-white/30
hover:shadow-2xl
hover:drop-shadow-lg
```

### **Active/Click State**
```css
/* On click/selection */
- scale: 1.02 (slight scale down)
- opacity: 1
- glow: Intensified pink glow
```

---

## Card Content

### **Icon** (Top of card)
- **Size**: 80px × 80px (md), 60px × 60px (sm)
- **Position**: Centered at top of card
- **Style**: Lucide-react icons or custom SVG
- **Animation**: 
  - Continuous subtle rotation/pulse
  - On hover: Enhanced animation (liquid morphing effect)

**Icons**:
1. **HR**: `Users` or `Briefcase` icon
   - Color: Professional blue `text-blue-600`
   - Animation: Subtle pulse + scale
   
2. **Technical**: `Code` or `Terminal` icon
   - Color: Tech cyan/teal `text-cyan-500`
   - Animation: Liquid morph effect on hover
   
3. **Manager**: `BarChart3` or `TrendingUp` icon
   - Color: Professional indigo `text-indigo-600`
   - Animation: Subtle pulse + rotate

### **Icon Animation Details**

**Liquid Morphing Effect** (Technical card):
```css
@keyframes liquidMorph {
  0% { transform: scaleX(1) scaleY(1); }
  25% { transform: scaleX(1.1) scaleY(0.9); }
  50% { transform: scaleX(0.9) scaleY(1.1); }
  75% { transform: scaleX(1.1) scaleY(0.9); }
  100% { transform: scaleX(1) scaleY(1); }
}
```

**Continuous Pulse** (HR & Manager):
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

**On Hover - Intensified Animations**:
All icons on hover get enhanced versions of their base animations.

---

## Card Titles & Descriptions

### **Title** (Role name)
```html
<h2>Role Name</h2>
```

**Styling**:
- Font size: `text-xl md:text-2xl font-bold`
- Color: `text-gray-900`
- Margin: `mt-6 mb-2`
- Text align: `text-center`

**Titles**:
1. "HR"
2. "Technical User"
3. "Manager / Director"

### **Description** (What you'll see)
```html
<p>Brief description of what this role shows</p>
```

**Styling**:
- Font size: `text-sm md:text-base text-gray-700`
- Color: `text-gray-600`
- Margin: `mb-6`
- Text align: `text-center`
- Line height: `leading-relaxed`

**Descriptions**:
1. **HR**: "Experience, skills, and contact info optimized for recruiting"
2. **Technical**: "API playground with gamification and backend achievements"
3. **Manager**: "Data-driven KPIs, metrics, and career timeline"

### **Button** (Select this role)
```html
<button>Select Role</button>
```

**Styling**:
```tailwind
class="
  w-full
  mt-6
  px-6
  py-3
  bg-gradient-to-r
  from-pink-600
  to-pink-700
  hover:from-pink-700
  hover:to-pink-800
  text-white
  font-semibold
  rounded-lg
  transition-all
  duration-300
  active:scale-95
  focus:outline-none
  focus:ring-2
  focus:ring-pink-500
  focus:ring-offset-2
"
>
  Select Role
</button>
```

**Button States**:
- **Default**: Gradient pink, white text
- **Hover**: Darker gradient, slight lift
- **Active**: Scale 95%, instant feedback
- **Focus**: Ring outline for keyboard users

---

## Card Entry Animation

### **Staggered Fade-In**
- **Card 1 (HR)**: 
  - Delay: 0.6s
  - Duration: 0.5s
  - Animation: fadeInUp (slide up from bottom + fade in)

- **Card 2 (Technical)**: 
  - Delay: 0.8s
  - Duration: 0.5s
  - Animation: fadeInUp

- **Card 3 (Manager)**: 
  - Delay: 1.0s
  - Duration: 0.5s
  - Animation: fadeInUp

**CSS Animation**:
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.role-card {
  animation: fadeInUp 0.5s ease-out forwards;
}

.role-card:nth-child(1) { animation-delay: 0.6s; }
.role-card:nth-child(2) { animation-delay: 0.8s; }
.role-card:nth-child(3) { animation-delay: 1.0s; }
```

---

## Click & Navigation Animation

### **On Click**:
1. **Card Expansion**:
   - Card scales to 1.05
   - Icon brightens
   - Text fades slightly

2. **Full Screen Transition**:
   - Fade to next page
   - Duration: 0.6s
   - Easing: ease-in-out

3. **Redirect**:
   - Navigate to `/dashboard/{role}`
   - Show role dashboard with fade-in

**Implementation**:
```typescript
const handleSelectRole = (role: UserRole) => {
  // Save to localStorage and context
  setSelectedRole(role);
  
  // Trigger animation class
  setAnimating(true);
  
  // Navigate after animation
  setTimeout(() => {
    router.push(`/dashboard/${role}`);
  }, 600);
};
```

---

## Footer/Info Section

### **Tagline**
```html
<footer>
  <p>Switch roles anytime using the sidebar</p>
</footer>
```

**Styling**:
- Font size: `text-xs md:text-sm text-gray-500`
- Position: Absolute bottom, centered
- Margin: `mb-6`
- Opacity: `0.7`

**Animation**:
- Fade in after cards
- Delay: 1.4s
- Duration: 0.4s

---

## Responsive Design

### **Desktop** (> 1024px)
- Grid: 3 columns
- Card width: Flexible within grid
- Gap: 32px (gap-8)
- Padding: 0px (centered with max-width)
- Icon size: 80px
- Font sizes: Full size

### **Tablet** (768px - 1024px)
- Grid: 2 columns
- Gap: 24px (gap-6)
- Padding: 16px (px-4)
- Icon size: 70px
- Font sizes: Slightly smaller

### **Mobile** (< 768px)
- Grid: 1 column
- Gap: 16px (gap-4)
- Padding: 16px (px-4)
- Card padding: 24px (p-6)
- Icon size: 60px
- Font sizes: `text-lg`, `text-base`, `text-sm`
- Button: Full width with margin

---

## Accessibility Features

### **Keyboard Navigation**
- Tab through cards
- Enter to select
- Focus ring visible on all cards

### **Focus Styles**
```tailwind
focus:outline-none
focus:ring-2
focus:ring-pink-500
focus:ring-offset-2
```

### **ARIA Labels**
```html
<div
  role="button"
  tabindex="0"
  aria-label="Select HR role"
  aria-description="Experience, skills, and contact info optimized for recruiting"
>
```

### **Color Contrast**
- Text on glassmorphic background: Good contrast
- Button text on pink: WCAG AAA compliant
- All text readable

### **Motion Preferences**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Customization Points

### **Colors**
- **Background Gradient**: `from-pink-100 via-purple-50 to-blue-50`
- **Card Background**: `bg-white/10` (adjust opacity)
- **Button Gradient**: `from-pink-600 to-pink-700`
- **Icon Colors**: Per role (blue, cyan, indigo)

### **Backdrop Blur**
- Default: `backdrop-blur-xl` (20px)
- Hover: `backdrop-blur-2xl` (25px)
- Adjust for performance if needed

### **Card Styling**
- Border radius: `rounded-3xl` (24px)
- Shadow: `shadow-xl` → `shadow-2xl` on hover
- Scale on hover: 1.05 (adjust to 1.03 or 1.07)

### **Animation Timing**
- Card entry delay: 0.6s, 0.8s, 1.0s (adjustable)
- Card entry duration: 0.5s (adjustable)
- Transition duration: 0.3s (adjustable)

---

## Code Template

```typescript
// components/RolePicker.tsx

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Users, Code, BarChart3 } from 'lucide-react';

type UserRole = 'hr' | 'technical' | 'manager';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const roles: RoleOption[] = [
  {
    id: 'hr',
    title: 'HR',
    description: 'Experience, skills, and contact info optimized for recruiting',
    icon: <Users className="w-20 h-20" />,
    color: 'text-blue-600',
  },
  {
    id: 'technical',
    title: 'Technical User',
    description: 'API playground with gamification and backend achievements',
    icon: <Code className="w-20 h-20" />,
    color: 'text-cyan-500',
  },
  {
    id: 'manager',
    title: 'Manager / Director',
    description: 'Data-driven KPIs, metrics, and career timeline',
    icon: <BarChart3 className="w-20 h-20" />,
    color: 'text-indigo-600',
  },
];

export function RolePicker() {
  const router = useRouter();
  const [animating, setAnimating] = useState(false);

  const handleSelectRole = (role: UserRole) => {
    setAnimating(true);
    
    // Save to localStorage
    localStorage.setItem('selectedRole', role);
    
    // Navigate after animation
    setTimeout(() => {
      router.push(`/dashboard/${role}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Who am I?
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Pick your role
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {roles.map((role, index) => (
            <div
              key={role.id}
              className="role-card animate-fade-in-up p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl cursor-pointer transition-all duration-300 hover:backdrop-blur-2xl hover:bg-white/15 hover:border-white/30 hover:shadow-2xl hover:-translate-y-3 group"
              style={{ animationDelay: `${0.6 + index * 0.2}s` }}
              onClick={() => handleSelectRole(role.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSelectRole(role.id);
              }}
              aria-label={`Select ${role.title} role`}
              aria-description={role.description}
            >
              {/* Icon */}
              <div className={`flex justify-center mb-6 ${role.color}`}>
                {role.icon}
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-2">
                {role.title}
              </h2>

              {/* Description */}
              <p className="text-sm md:text-base text-gray-600 text-center mb-6 leading-relaxed">
                {role.description}
              </p>

              {/* Button */}
              <button
                className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold rounded-lg transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                onClick={() => handleSelectRole(role.id)}
              >
                Select Role
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '1.4s' }}>
          <p className="text-xs md:text-sm text-gray-500">
            Switch roles anytime using the sidebar
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## CSS Animations

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

