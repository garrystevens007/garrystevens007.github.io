# Role-Based Portfolio System - Overview & Architecture

## Vision

Transform the portfolio from a one-size-fits-all showcase into a **role-aware experience** where different users see tailored views optimized for their needs. Users pick a role on entry, access customized dashboards, and can switch roles anytime.

---

## System Architecture

```
Entry Point
    ↓
Role Picker Page (Glassmorphic UI)
    ├─→ HR Role
    ├─→ Technical User Role
    └─→ Manager/Director Role
        ↓
    [Sidebar with "Change Role" button]
        ↓
    User can switch roles anytime
```

---

## Role System Features

### **1. Role Picker Page** (Shared Entry Point)
- **URL**: `/roles` or root `/` (redirect if no role selected)
- **Heading**: "Who am I?"
- **Subheading**: "Pick your role"
- **3 Glassmorphic Cards**:
  - HR Icon (animated glassmorphism + interactive liquid effect)
  - Technical User Icon (animated glassmorphism + interactive liquid effect)
  - Manager/Director Icon (animated glassmorphism + interactive liquid effect)
- **Interactive Effects**:
  - Hover: Card glassmorphism animates/intensifies
  - Click: Smooth animated transition to role dashboard
  - Icon: Liquid-like morphing on interaction
- **Mobile**: Stack vertically, same glassmorphic design
- **Session Management**: Role stored in localStorage + React context
- **Navigation**: "Change Role" button in sidebar always visible

---

### **2. HR Role Dashboard** (`/dashboard/hr`)

**Purpose**: Employee-focused view for recruiters, HR teams, talent managers

**Main Sections**:

1. **Profile Card** (Top)
   - Avatar, name, title, location
   - "Download CV" button (generates PDF from `scripts/build_resume.py`)
   - Contact information (full visibility)

2. **Skills Browser**
   - Filterable by category (Languages, Frameworks, Databases, Tools)
   - Proficiency bars
   - Years of experience
   - Search functionality

3. **Experience Timeline**
   - Filterable by:
     - Company (Unit4, Samsung, etc.)
     - Duration (start/end date range)
     - Role type
   - Expandable achievements per role
   - Company location badges

4. **Achievements & Metrics**
   - Lines of code written: 30,000+
   - Bugs fixed: 156
   - Security vulnerabilities resolved: 8
   - Features shipped: 47
   - Code reviews conducted: 230

5. **Education**
   - Degree, university, dates
   - Cleanly formatted card

6. **Download Section**
   - "Download CV as PDF" (prominent button)
   - Export options (filtered views)

**Styling**: Professional, clean, recruitment-focused
**Colors**: Your pink theme + professional grays
**No Gamification**: Straight-forward, data-driven

---

### **3. Technical User Role Dashboard** (`/dashboard/technical`)

**Purpose**: Backend engineer showcase with API Playground + gamification

**Main Sections**:

1. **Achievement Dashboard** (Top)
   - Badges earned (visual achievement system)
     - 🔐 Security Hero (resolved 8+ vulnerabilities)
     - 🚀 Feature Shipped (50+ features deployed)
     - 🐛 Bug Squasher (150+ bugs fixed)
     - 📝 Code Reviewer (200+ reviews)
     - 🏆 System Reliability (99.8% uptime)
   - "Unlock more by exploring the API!"

2. **Leaderboard Stats** (Gamified)
   - Lines of Code: 30,000+ (visual bar)
   - Bugs Fixed: 156 (visual bar)
   - Security Fixes: 8 (visual badge)
   - Features Shipped: 47 (visual counter)
   - Test Coverage: 85% (visual meter)
   - Production Uptime: 99.8% (visual gauge)
   - Real-time Score: XYZ points (accumulates with API playground usage)

3. **API Playground** (Enhanced)
   - All endpoints from standard playground
   - **Added Gamification**:
     - Difficulty levels shown per endpoint (Easy, Medium, Hard)
     - Points earned per successful request (varies by difficulty)
     - Combo detection: Try multiple endpoints in sequence → bonus points
     - Easter Eggs: Special endpoints unlock after certain combos
       - `/api/fun/secret-achievement` (unlocks after hitting 5 endpoints)
       - `/api/metrics/hacker-stats` (unlocks after POST + GET combo)
       - `/api/fun/speedrun` (unlocks after hitting 3 endpoints in <10s)
   - **Request Scoring**:
     - GET request: +10 points
     - POST/PUT request: +25 points
     - DELETE request: +50 points
     - Error scenario handled: +5 bonus points
     - Combo bonus: +100 for 3+ requests in session

4. **Skills Showcase**
   - All technical skills with proficiency bars
   - Expertise areas highlighted
   - Framework mastery indicators

5. **Projects Highlight**
   - Technical projects with tech stack badges
   - Impact metrics for each
   - GitHub-like display

**Styling**: Dark mode friendly, tech-forward, energetic
**Colors**: Your pink + tech blues/teals, neon accents for badges
**Gamification Heavy**: Badges, points, unlocks, combos

---

### **4. Manager/Director Role Dashboard** (`/dashboard/manager`)

**Purpose**: Data-oriented view for leadership, decision makers, executives

**Main Sections**:

1. **Executive Summary Cards** (Top)
   - Career Duration: 7+ years
   - Companies Led/Worked: 2
   - Features Shipped: 50+
   - Test Coverage: 90%
   - Production Uptime: 99.8%
   - Security Vulnerabilities Resolved: 8
   - Code Reviews Conducted: 230
   - Bugs Fixed: 156

2. **Key Performance Indicators (KPIs)**
   - **Delivery**: Features shipped per year (chart)
   - **Quality**: Test coverage trend (line chart)
   - **Reliability**: Production uptime (gauge)
   - **Security**: Vulnerabilities resolved (bar chart)

3. **Career Timeline** (Data-Focused)
   - Interactive timeline showing:
     - Companies (Unit4, Samsung)
     - Tenure at each
     - Key achievements per period
     - Skills growth over time
   - Tooltip showing detailed metrics for each period

4. **Team Impact Metrics**
   - Engineers mentored/supported: (can be added)
   - Features shipped: 50+
   - Code reviews: 230
   - Security improvements: 8 major fixes
   - System reliability improvements: 99.8% uptime

5. **Technical Proficiency Matrix**
   - Skills grouped by category
   - Proficiency heatmap (years of experience)
   - Expertise depth visualization

6. **Experience Overview**
   - Company-wise breakdown
   - Role progression
   - Tenure visualization
   - Location distribution

7. **Download/Export**
   - Export dashboard as PDF
   - Export data as CSV
   - Generate executive summary

**Styling**: Professional, data-driven, executive dashboard aesthetic
**Colors**: Your pink theme + professional grays + data visualization colors
**Visualizations**: Charts, graphs, heatmaps (using Recharts)
**No Gamification**: Pure metrics and KPIs

---

## Data Flow & Reuse

### **Data Sources**:
1. **`lib/data.ts`** - Portfolio data (skills, experience, endpoints)
2. **`content/` folder** - Existing JSON with full data
3. **Role-specific computed data** - Filtered views based on role

### **Data Filtering Strategy**:
- All roles pull from same source data
- React context determines what to show
- HR: All data, professional formatting
- Technical: All data + gamification layer
- Manager: All data + metrics + visualizations

---

## Navigation & UX Flow

### **Sidebar Navigation** (All Roles)
```
Portfolio Logo
├─ Dashboard (role-specific)
├─ [Back to Role Picker or "Change Role"]
├─ (other nav items)
└─ Contact/Links
```

### **Role Selection Flow**
1. User lands on `/roles`
2. Sees "Who am I?" with 3 glassmorphic cards
3. Clicks card → Animated transition
4. Lands on role-specific dashboard
5. Role saved in localStorage + Context
6. Any time user can click "Change Role" → back to role picker
7. On return visit within session, skip role picker and show last selected role

### **Mobile Experience**
- Role picker cards stack vertically
- Glassmorphism effects work on touch (respond to tap)
- Dashboards adapt to mobile width
- "Change Role" button prominent and accessible
- All interactive elements touch-friendly

---

## Technical Implementation Strategy

### **State Management**
```typescript
type UserRole = 'hr' | 'technical' | 'manager';

// Context
interface RoleContextType {
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole) => void;
  changeRole: () => void; // Navigate to role picker
}
```

### **Routing**
```
/roles                    // Role picker
/dashboard/hr             // HR dashboard
/dashboard/technical      // Technical dashboard
/dashboard/manager        // Manager dashboard
/dashboard                // Redirect based on selected role
```

### **Local Storage**
```
localStorage.setItem('selectedRole', 'technical');
```

### **Persistence**
- On page load, check localStorage for saved role
- If role exists, redirect to `/dashboard/{role}`
- If not, show role picker at `/roles`
- User can always click "Change Role" to pick again

---

## Animation & Transitions

### **Role Picker Page**
- **Card Entry**: Staggered fade-in from bottom (0.3s delay per card)
- **Card Hover**: 
  - Glassmorphism effect intensifies
  - Card lifts slightly (transform: translateY(-10px))
  - Backdrop blur increases
- **Icon Animation**:
  - Subtle liquid morphing effect on interaction
  - Smooth scale/rotation on hover
- **Click Transition**:
  - Card expands/scales up
  - Fade to selected role dashboard
  - Duration: 0.6s smooth transition

### **Dashboard Transitions**
- Role selector → Role dashboard: Smooth fade-in (0.3s)
- Dashboard content: Staggered content reveal
- Badges/achievements: Pop-in with spring animation

---

## Color Palette

### **All Roles Use**:
- **Primary**: Your pink `#ec4899` (pink-600)
- **Backgrounds**: `#ffffff` (white) or `#f9fafb` (gray-50)
- **Text**: `#1f2937` (gray-900)
- **Borders**: `#e5e7eb` (gray-200)

### **Role-Specific Accents**:
- **HR**: Professional blues & greens
- **Technical**: Neon teals, blues, tech colors
- **Manager**: Data visualization colors (mixed palette)

### **Glassmorphism Role Picker**:
- Background: `rgba(255, 255, 255, 0.1)`
- Backdrop blur: `blur(10px)`
- Border: `1px solid rgba(255, 255, 255, 0.2)`
- Glow on hover: Pink glow effect

---

## Accessibility

- All role cards keyboard-navigable (Tab)
- Focus rings on cards and buttons
- Alt text for all icons
- ARIA labels for role descriptions
- Color contrast meets WCAG AA
- Animations respect `prefers-reduced-motion`

---

## Files to Create

1. **ROLE_PICKER_PAGE.md** - Role picker UI specs with glassmorphism
2. **HR_DASHBOARD_SPECS.md** - HR-focused dashboard detailed specs
3. **TECHNICAL_DASHBOARD_SPECS.md** - Technical user with gamification specs
4. **MANAGER_DASHBOARD_SPECS.md** - Manager/Director data dashboard specs
5. **ROLE_NAVIGATION.md** - Sidebar, routing, context management
6. **ROLE_DATA_STRUCTURE.md** - Data types, filtering, context setup
7. **ROLE_IMPLEMENTATION_GUIDE.md** - Step-by-step build instructions
8. **GAMIFICATION_SYSTEM.md** - Badge system, points, combos, Easter eggs

---

## Summary Table

| Aspect | HR | Technical | Manager |
|--------|----|-----------|---------| 
| **Purpose** | Recruitment focus | Engineer showcase | Executive dashboard |
| **Main Feature** | Skills/Experience browser | API Playground | Data KPIs |
| **Gamification** | None | Heavy (badges, points) | None |
| **Download** | CV PDF | Export stats | Dashboard PDF |
| **Visualizations** | Lists/timelines | Leaderboard | Charts/heatmaps |
| **Primary Color** | Pink + professional | Pink + neon tech | Pink + data colors |
| **Target Audience** | HR/Recruiters | Backend engineers | C-level/managers |

