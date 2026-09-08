# Role System Implementation Guide

Step-by-step instructions for Claude/Copilot to implement the complete role-based portfolio system.

---

## Phase 1: Setup & TypeScript Types (2-3 hours)

### Step 1.1: Create Role Types File

**File**: `types/role.ts` or `lib/role-types.ts`

**Action**: Define all role-related TypeScript types:
- `UserRole` type
- `RoleConfig` interface
- `ROLE_CONFIGS` constant with all role metadata

**Check**:
- [ ] `UserRole` is typed as `'hr' | 'technical' | 'manager'`
- [ ] All 3 roles have entries in `ROLE_CONFIGS`
- [ ] Each role has: id, name, description, icon, color, displayName
- [ ] No TypeScript errors

### Step 1.2: Extend Data Types in lib/data.ts

**Action**: Add new fields to existing types:
- Add `metrics` field to `Experience` interface
- Add `difficulty` field to `Skill` (for gamification)
- Add new `Achievement` interface for badges
- Add new `PortfolioMetrics` interface

**Check**:
- [ ] All existing exports still work
- [ ] New fields are optional (won't break existing data)
- [ ] Types compile without errors
- [ ] Data in `lib/data.ts` matches new schema

### Step 1.3: Create Role Utility Functions File

**File**: `lib/role-utils.ts`

**Action**: Implement filtering and data transformation functions:
- `getDataForRole(role, data)` - Main filtering function
- `filterDataForHR()` - HR-specific filtering
- `filterDataForTechnical()` - Technical-specific filtering
- `filterDataForManager()` - Manager-specific filtering
- Helper functions: `getTopSkills()`, `groupSkillsByCategory()`, etc.

**Check**:
- [ ] All filter functions return correct data shape
- [ ] No data mutation (use `.map()`, not mutations)
- [ ] Functions are memoizable (pure functions)
- [ ] No TypeScript errors
- [ ] Helper functions have JSDoc comments

---

## Phase 2: Context & State Management (2 hours)

### Step 2.1: Create RoleContext

**File**: `context/RoleContext.tsx`

**Action**: Implement complete role context with:
- `RoleProvider` component
- `useRole()` custom hook
- localStorage integration
- All data accessor functions

**Check**:
- [ ] Context initializes from localStorage on mount
- [ ] `setSelectedRole()` updates localStorage and triggers redirect
- [ ] `changeRole()` navigates to `/roles`
- [ ] `getRoleData()` returns correctly filtered data
- [ ] All memoization is in place
- [ ] No console errors
- [ ] TypeScript types are correct

### Step 2.2: Add RoleProvider to Root Layout

**File**: `app/layout.tsx`

**Action**:
- Wrap root layout with `<RoleProvider>`
- Import and render `<Sidebar />`
- Update main content margin for sidebar

**Code Example**:
```typescript
import { RoleProvider } from '@/context/RoleContext';
import { Sidebar } from '@/components/Sidebar';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <RoleProvider>
          <Sidebar />
          <main className="ml-64">{children}</main>
        </RoleProvider>
      </body>
    </html>
  );
}
```

**Check**:
- [ ] App still loads without errors
- [ ] Sidebar renders correctly
- [ ] Context is accessible in all pages
- [ ] No hydration mismatch errors

---

## Phase 3: Sidebar Component (1-2 hours)

### Step 3.1: Create Sidebar Component

**File**: `components/Sidebar.tsx`

**Action**: Build sidebar with:
- Logo/branding section
- Navigation links for current role
- "Change Role" button
- Optional settings/logout buttons

**Features**:
- Display current role name in header
- Highlight active page link
- Responsive on mobile (toggle)
- Sticky positioning

**Check**:
- [ ] Sidebar renders without errors
- [ ] "Change Role" button navigates to `/roles`
- [ ] Navigation links work
- [ ] Active link highlighting works
- [ ] Mobile toggle works (if implemented)

### Step 3.2: Mobile Sidebar Integration (Optional)

**File**: `components/MobileNav.tsx`

**Action**: Create mobile header with:
- Menu toggle button
- Mobile sidebar overlay
- Close on link click

**Check**:
- [ ] Mobile header appears on small screens
- [ ] Toggle opens/closes sidebar
- [ ] Overlay closes sidebar on click

---

## Phase 4: Role Picker Page (2-3 hours)

### Step 4.1: Create Role Picker Page

**File**: `app/roles/page.tsx`

**Action**: Build role picker with:
- Glassmorphic card layout
- Three role cards (HR, Technical, Manager)
- Animated entrance
- Click to select role

**Features**:
- Cards stack vertically on mobile
- Hover effects with scale/glow
- Icon animations
- Smooth fade transition on selection

**Check**:
- [ ] Page renders without errors
- [ ] All three role cards display
- [ ] Cards are clickable
- [ ] Clicking card calls `setSelectedRole()`
- [ ] User is redirected after selection
- [ ] Animations work smoothly
- [ ] Mobile layout is responsive

### Step 4.2: Add Glassmorphic Styling

**Action**: Add CSS for glassmorphism effects:
- Backdrop blur
- Semi-transparent background
- Border styling
- Glow effects on hover

**Tailwind Classes**:
- `backdrop-blur-xl bg-white/10 border border-white/20`
- `hover:scale-105 hover:backdrop-blur-2xl hover:shadow-2xl`

**Check**:
- [ ] Glass effect is visible
- [ ] Hover states animate smoothly
- [ ] No performance lag
- [ ] Effects work on mobile

### Step 4.3: Add Animations

**Action**: Implement CSS keyframes for:
- Card entrance (fade-in from bottom with stagger)
- Icon animations (pulse or morph)
- Click transition (fade to dashboard)

**Check**:
- [ ] Cards enter with staggered delay (0.6s, 0.8s, 1.0s)
- [ ] `prefers-reduced-motion` is respected
- [ ] Animations are 60fps smooth

---

## Phase 5: Dashboard Pages (4-6 hours)

### Step 5.1: Create Root Dashboard Redirect

**File**: `app/dashboard/page.tsx`

**Action**: Implement redirect logic:
- Check if role is selected
- Redirect to `/dashboard/{role}`
- If no role, redirect to `/roles`

**Check**:
- [ ] Direct navigation to `/dashboard` redirects correctly
- [ ] No infinite redirects
- [ ] Works with browser back button

### Step 5.2: Implement HR Dashboard

**File**: `app/dashboard/hr/page.tsx`

**Action**: Build HR dashboard with:
- ProfileCard component
- SkillsBrowser with filters
- ExperienceTimeline with filters
- AchievementsMetrics cards
- EducationCard
- DownloadSection

**Steps**:
1. Get role data using `useRole()` hook
2. Render ProfileCard with contact info
3. Implement skills filter dropdown + search
4. Render experience timeline with company/duration/role filters
5. Display metrics cards (5 cards)
6. Show education section
7. Add CV download button (calls `scripts/build_resume.py`)

**Check**:
- [ ] All sections render correctly
- [ ] Data displays from `useRole().getSkillsForRole()`
- [ ] Filters work and re-render list
- [ ] Search functionality works
- [ ] Download button functions
- [ ] Mobile layout is responsive
- [ ] No TypeScript errors

### Step 5.3: Implement Technical Dashboard

**File**: `app/dashboard/technical/page.tsx`

**Action**: Build Technical dashboard with:
- AchievementDashboard (badge grid)
- LeaderboardStats (gamified metrics)
- APIPlaygroundEnhanced (with gamification)
- SkillsShowcase
- ProjectsHighlight

**Steps**:
1. Get role data and achievements
2. Render achievement badge grid
3. Display 6+ leaderboard stats with visualizations
4. Integrate existing APIPlayground component
5. Add gamification layer (points, combo, Easter eggs)
6. Render skills showcase (small cards)
7. Display project cards with tech stacks

**Check**:
- [ ] Achievement badges render correctly
- [ ] Leaderboard stats display with correct values
- [ ] API Playground works with gamification
- [ ] Points system calculates correctly
- [ ] Combo multiplier works
- [ ] Secret endpoints unlock
- [ ] Mobile layout is responsive

### Step 5.4: Implement Manager Dashboard

**File**: `app/dashboard/manager/page.tsx`

**Action**: Build Manager dashboard with:
- ExecutiveSummaryCards (8 KPI cards)
- KPIDashboard with charts (Delivery, Quality, Reliability, Security)
- CareerTimeline (vertical with metrics)
- TechnicalProficiencyMatrix (heatmap)
- ExperienceOverview (company cards)
- ExportSection (PDF, CSV, Summary)

**Steps**:
1. Get role data with metrics
2. Render 8 summary KPI cards
3. Create 4 Recharts (Bar, Line, Gauge charts)
4. Build career timeline with dot/line visualization
5. Create proficiency heatmap table
6. Display company cards with metrics
7. Add export buttons

**Libraries Needed**:
- `recharts` for charts
- `lucide-react` for icons

**Check**:
- [ ] All KPI cards display correct values
- [ ] Charts render without errors
- [ ] Career timeline displays all periods
- [ ] Proficiency matrix shows correct colors
- [ ] Export buttons work
- [ ] Mobile layout stacks correctly
- [ ] No data mutations occur

---

## Phase 6: Dashboard Styling & Responsive Design (2-3 hours)

### Step 6.1: Apply DESIGN_SPECS.md Styles

**Action**: Ensure all components use:
- Correct Tailwind color classes
- Consistent spacing (p-4, p-6, gap-4, gap-6)
- Proper typography scale
- Border and shadow styles
- Hover/active states

**Check**:
- [ ] Color palette matches DESIGN_SPECS.md
- [ ] All text sizes correct
- [ ] Spacing is consistent
- [ ] Buttons have hover and active states
- [ ] Cards have shadows and borders

### Step 6.2: Test Responsive Breakpoints

**Action**: Test each dashboard at:
- Desktop (> 1024px)
- Tablet (640px-1024px)
- Mobile (< 640px)

**Adjustments**:
- Use `md:` and `sm:` Tailwind prefixes
- Test grid column changes
- Verify padding/margin on small screens
- Check sidebar on mobile

**Check**:
- [ ] Desktop layout shows 2 columns for HR/Manager
- [ ] Tablet shows adjusted columns
- [ ] Mobile stacks vertically
- [ ] No horizontal scrolling on mobile
- [ ] Text is readable on all screen sizes

### Step 6.3: Dark Mode Considerations

**Optional**: Add dark mode support

**Action**: 
- Add `dark:` prefixes to color classes
- Test in dark mode
- Ensure contrast meets WCAG AA

**Check**:
- [ ] Text readable in dark mode
- [ ] Colors don't clash
- [ ] All components styled

---

## Phase 7: Integration & Testing (3-4 hours)

### Step 7.1: Integration Test

**Checklist**: Full user journey testing

- [ ] User lands on app → redirected to `/roles`
- [ ] User clicks HR card → redirected to `/dashboard/hr`
- [ ] User can view skills, experience, download CV
- [ ] User clicks "Change Role" → back to `/roles`
- [ ] User selects Technical → `/dashboard/technical`
- [ ] User can see achievements and API playground
- [ ] Gamification points update
- [ ] User selects Manager → `/dashboard/manager`
- [ ] User can view KPI charts
- [ ] Role persists on page refresh
- [ ] Invalid role in localStorage is cleared

### Step 7.2: Component Testing

**Checklist**: Individual component tests

- [ ] ProfileCard displays all info correctly
- [ ] SkillsBrowser filters work (category + search)
- [ ] ExperienceTimeline filters work
- [ ] Download CV button generates PDF
- [ ] Achievement badges unlock/lock correctly
- [ ] Leaderboard stats calculate correctly
- [ ] API Playground gamification works
- [ ] Charts render correctly (Recharts)
- [ ] Career timeline displays all periods
- [ ] Export buttons work

### Step 7.3: Accessibility Testing

**Checklist**: WCAG AA compliance

- [ ] Keyboard navigation works (Tab through all elements)
- [ ] Focus rings visible on all interactive elements
- [ ] Color contrast meets 4.5:1 (text on background)
- [ ] Form labels associated with inputs
- [ ] ARIA labels on icon buttons
- [ ] Screen reader announces all content
- [ ] Animations respect `prefers-reduced-motion`

### Step 7.4: Performance Testing

**Checklist**: Performance verification

- [ ] Page load time < 3s
- [ ] No layout shift (CLS)
- [ ] Animations at 60fps
- [ ] No console errors/warnings
- [ ] No memory leaks
- [ ] Debounced search input
- [ ] Lazy loading for images (if any)

### Step 7.5: Cross-Browser Testing

**Test on**:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari
- [ ] Chrome Mobile

**Check**:
- [ ] Layout correct on all browsers
- [ ] Animations smooth
- [ ] No CSS issues
- [ ] Colors render correctly

---

## Phase 8: Error Handling & Edge Cases (1-2 hours)

### Step 8.1: Handle Invalid Routes

**Action**: Add 404 handling

**File**: `app/[...notfound]/page.tsx`

```typescript
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>
      <Link href="/roles" className="px-6 py-2 bg-pink-600 text-white rounded-lg">
        Back to Role Picker
      </Link>
    </div>
  );
}
```

**Check**:
- [ ] Accessing invalid routes shows 404
- [ ] Link back to role picker works

### Step 8.2: Handle localStorage Errors

**Action**: Add try-catch in RoleContext

```typescript
try {
  const storedRole = localStorage.getItem('selectedRole');
  // ... rest of logic
} catch (error) {
  console.error('localStorage access failed:', error);
  setSelectedRoleState(null);
}
```

**Check**:
- [ ] App works if localStorage is unavailable
- [ ] No console errors
- [ ] User can still use app

### Step 8.3: Handle Data Loading States

**Action**: Add loading state to context and pages

**Check**:
- [ ] Loading spinner shows while context initializes
- [ ] No content flash
- [ ] Smooth transition when data loads

---

## Phase 9: Deployment & Final Checks (1 hour)

### Step 9.1: Build Verification

**Action**: Run build command

```bash
npm run build
```

**Check**:
- [ ] Build completes without errors
- [ ] No warnings related to our code
- [ ] Bundle size reasonable

### Step 9.2: Production Mode Testing

**Action**: Test production build locally

```bash
npm run build
npm run start
```

**Check**:
- [ ] App works in production mode
- [ ] No runtime errors
- [ ] Performance acceptable
- [ ] All features work

### Step 9.3: Environment Variables

**Check**:
- [ ] No hardcoded secrets
- [ ] Environment-specific configs work
- [ ] .env files in .gitignore

### Step 9.4: SEO Meta Tags (Optional)

**Action**: Add role-specific meta tags

```typescript
export const metadata: Metadata = {
  title: 'Portfolio - Role-Based',
  description: 'Interactive portfolio with HR, Technical, and Manager views',
  openGraph: {
    title: 'Garry Stevens - Backend Engineer Portfolio',
    description: 'Explore my backend engineering work through different perspectives',
  },
};
```

**Check**:
- [ ] Meta tags are set
- [ ] og:image is configured
- [ ] Twitter card tags present (optional)

---

## File Structure Summary

```
src/
├── types/
│   └── role.ts                          // Role types and config
├── context/
│   └── RoleContext.tsx                  // Role provider and hook
├── lib/
│   ├── role-utils.ts                    // Filtering and utility functions
│   ├── data.ts                          // (Updated with role fields)
│   └── role-types.ts                    // (Alternative: types location)
├── components/
│   ├── Sidebar.tsx                      // Main sidebar navigation
│   ├── MobileNav.tsx                    // (Optional) Mobile navigation
│   ├── HRDashboard/                     // HR-specific components
│   │   ├── ProfileCard.tsx
│   │   ├── SkillsBrowser.tsx
│   │   ├── ExperienceTimeline.tsx
│   │   ├── AchievementsMetrics.tsx
│   │   ├── EducationCard.tsx
│   │   └── DownloadSection.tsx
│   ├── TechnicalDashboard/              // Technical-specific components
│   │   ├── AchievementDashboard.tsx
│   │   ├── LeaderboardStats.tsx
│   │   ├── GameStatus.tsx
│   │   ├── ComboIndicator.tsx
│   │   ├── SkillsShowcase.tsx
│   │   └── ProjectsHighlight.tsx
│   ├── ManagerDashboard/                // Manager-specific components
│   │   ├── ExecutiveSummary.tsx
│   │   ├── KPIDashboard.tsx
│   │   ├── CareerTimeline.tsx
│   │   ├── TechnicalProficiencyMatrix.tsx
│   │   ├── ExperienceOverview.tsx
│   │   └── ExportSection.tsx
│   └── APIPlayground/                   // (Existing, reuse)
├── app/
│   ├── layout.tsx                       // (Updated with RoleProvider)
│   ├── page.tsx                         // Root redirect
│   ├── roles/
│   │   └── page.tsx                     // Role picker page
│   ├── dashboard/
│   │   ├── page.tsx                     // Dashboard redirect
│   │   ├── hr/
│   │   │   └── page.tsx                 // HR dashboard
│   │   ├── technical/
│   │   │   └── page.tsx                 // Technical dashboard
│   │   └── manager/
│   │       └── page.tsx                 // Manager dashboard
│   └── [...notfound]/
│       └── page.tsx                     // 404 page
└── styles/
    └── globals.css                      // Mobile sidebar styles
```

---

## Development Tips

1. **Start with types** - Define all TypeScript first to catch errors early
2. **Context before components** - Set up RoleContext before building dashboards
3. **Reuse existing components** - APIPlayground, Sidebar, etc. already built
4. **Test as you build** - Don't wait to test at the end
5. **Mobile first mindset** - Test responsive at each step
6. **Use memoization** - Prevent unnecessary re-renders with useMemo/useCallback
7. **Keep it modular** - Each dashboard in its own folder with sub-components
8. **Follow DESIGN_SPECS** - Use exact Tailwind classes for consistency

---

## Troubleshooting

### Issue: Context not working in components
- **Solution**: Ensure `RoleProvider` wraps the component tree in `app/layout.tsx`

### Issue: localStorage errors in SSR
- **Solution**: Check localStorage inside `useEffect`, not during render

### Issue: Charts not rendering
- **Solution**: Ensure Recharts is installed (`npm install recharts`)
- Check that chart data format matches Recharts expectations

### Issue: Sidebar hidden on mobile
- **Solution**: Use `hidden md:block` or implement mobile toggle

### Issue: Styling not applying
- **Solution**: Check Tailwind is configured correctly
- Verify class names match DESIGN_SPECS.md
- Run `npm run dev` to see live changes

### Issue: Performance lag with animations
- **Solution**: Use `will-change` CSS for animated elements
- Reduce animation duration or use CSS instead of JS
- Profile with Chrome DevTools Performance tab

---

## Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] All components tested
- [ ] No console warnings
- [ ] Responsive design verified
- [ ] Accessibility tested
- [ ] Performance acceptable
- [ ] SEO meta tags set
- [ ] Build completes successfully
- [ ] No runtime errors in production
- [ ] Ready for Vercel deployment
- [ ] Analytics/tracking configured (optional)
- [ ] Error logging configured (optional)

---

## Optional Enhancements

1. **Add animations library** - Framer Motion for complex animations
2. **Add state persistence** - Save filter preferences in localStorage
3. **Add export features** - More export formats (JSON, HTML)
4. **Add comparison view** - Compare data across roles
5. **Add settings page** - Theme, notifications, preferences
6. **Add share functionality** - Generate shareable links
7. **Add PWA support** - Offline functionality
8. **Add analytics** - Track user interactions
9. **Add dark mode toggle** - User preference
10. **Integrate with backend** - Real API instead of mock data

---

## Questions?

Refer to these related documents:
- **Overall role system concept**: ROLE_SYSTEM_OVERVIEW.md
- **Role picker page specs**: ROLE_PICKER_PAGE.md
- **HR dashboard details**: HR_DASHBOARD_SPECS.md
- **Technical dashboard details**: TECHNICAL_DASHBOARD_SPECS.md
- **Manager dashboard details**: MANAGER_DASHBOARD_SPECS.md
- **Navigation & routing**: ROLE_NAVIGATION.md
- **Data structure & types**: ROLE_DATA_STRUCTURE.md
- **Design system**: DESIGN_SPECS.md (from API Playground)
