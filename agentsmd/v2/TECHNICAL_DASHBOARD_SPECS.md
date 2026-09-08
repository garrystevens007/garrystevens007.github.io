# Technical User Dashboard Specifications (`/dashboard/technical`)

## Overview

**Purpose**: Backend engineer showcase designed to appeal to technical audiences, featuring interactive API Playground with gamification, achievement system, and skill demonstrations.

**Target Audience**: Backend engineers, DevOps engineers, technical leads, CTOs, co-founders evaluating technical depth

**Theme**: Modern, energetic, gamified with emphasis on metrics and interactivity

**Primary Color Scheme**: Pink primary (#ec4899) + neon teals/blues + tech accents + dark mode friendly

---

## Page Layout

### Main Container
```typescript
// Dark-friendly, modern tech aesthetic
<div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
  <Sidebar /> // Shared navigation with "Change Role" button
  
  <main className="ml-64 p-8">
    <RoleHeader /> // Shows current role: "Technical Dashboard"
    
    {/* Main content sections */}
    <AchievementDashboard />
    <LeaderboardStats />
    <APIPlaygroundEnhanced /> {/* Main focus */}
    <SkillsShowcase />
    <ProjectsHighlight />
  </main>
</div>
```

**Responsive Behavior**:
- Desktop (> 1024px): Single column, full-width content, multi-column cards
- Tablet (640px-1024px): Adjusted grid columns, responsive cards
- Mobile (< 640px): Stacked single column, full-width, reduced padding `p-4`

**Dark Mode**:
- Background: Gray-900 (`#111827`)
- Cards: Gray-800 (`#1f2937`) with border gray-700
- Text: White/gray-100
- Accents: Pink-500, neon cyan, tech blue

---

## Section 1: Achievement Dashboard

### Component Structure
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number; // 0-100 for locked badges
  requirement: string; // What's needed to unlock
}
```

### Layout

**Header**:
- Title: `text-3xl font-bold text-white mb-2`
- "Unlock more by exploring the API!" subtitle: `text-sm text-gray-400 italic`

**Badges Grid**: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4`

**Badge Card** (Unlocked):
```typescript
<div className="group relative bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 cursor-pointer hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300">
  {/* Glow effect on hover */}
  <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-pink-400 rounded-lg opacity-0 group-hover:opacity-30 blur transition" />
  
  {/* Content */}
  <div className="relative text-center">
    {/* Icon/Emoji */}
    <div className="text-4xl mb-2 animate-bounce">🔐</div>
    
    {/* Badge Name */}
    <h3 className="font-bold text-white mb-1">{badge.name}</h3>
    
    {/* Description */}
    <p className="text-xs text-pink-100 mb-2">{badge.description}</p>
    
    {/* Unlock Date */}
    {badge.unlockedDate && (
      <p className="text-xs text-pink-200 font-semibold">
        Unlocked: {formatDate(badge.unlockedDate)}
      </p>
    )}
    
    {/* Animated checkmark */}
    <div className="mt-2 text-2xl animate-pulse">✓</div>
  </div>
</div>
```

**Badge Card** (Locked):
```typescript
<div className="relative bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6 cursor-not-allowed opacity-60 hover:opacity-70 transition">
  {/* Content */}
  <div className="text-center">
    {/* Faded Icon */}
    <div className="text-4xl mb-2 grayscale opacity-50">🔓</div>
    
    {/* Badge Name */}
    <h3 className="font-bold text-gray-400 mb-1">{badge.name}</h3>
    
    {/* Progress Bar */}
    <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
      <div 
        className="bg-gradient-to-r from-pink-500 to-pink-400 h-2 rounded-full transition-all"
        style={{ width: `${badge.progress}%` }}
      />
    </div>
    
    {/* Requirement Text */}
    <p className="text-xs text-gray-400">{badge.requirement}</p>
    <p className="text-xs text-gray-500 mt-1">{badge.progress}% complete</p>
  </div>
</div>
```

### Available Badges

| Icon | Name | Description | Requirement |
|------|------|-------------|-------------|
| 🔐 | Security Hero | Resolved 8+ vulnerabilities | 8+ security fixes |
| 🚀 | Feature Shipped | 50+ features deployed | 50+ features shipped |
| 🐛 | Bug Squasher | 150+ bugs fixed | 150+ bugs fixed |
| 📝 | Code Reviewer | 200+ code reviews | 200+ code reviews |
| 🏆 | System Reliability | 99.8%+ uptime | 99.8%+ uptime achieved |

### Interaction
- Hover on unlocked badge: Scale up, glow intensifies, show unlock date
- Hover on locked badge: Show requirement and progress
- Click badge: Show detailed modal (optional)

---

## Section 2: Leaderboard Stats (Gamified)

### Component Structure
```typescript
interface LeaderboardStat {
  id: string;
  label: string;
  value: number;
  icon: ReactNode;
  trend?: number; // % change
  unit: string;
  maxValue?: number; // For visualization (e.g., 100 for %)
  visualization: 'bar' | 'gauge' | 'counter' | 'meter';
}
```

### Layout

**Header**:
- Title: `text-2xl font-bold text-white mb-4`
- Subtitle: "Your real-time performance metrics" (text-gray-400)

**Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4`

### Stat Card Variations

**Type 1: Bar Chart (Lines of Code, Bugs Fixed)**
```typescript
<div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-pink-500 transition">
  {/* Header */}
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <span className="text-2xl">💻</span>
      <span className="text-sm font-semibold text-gray-300">{stat.label}</span>
    </div>
    {stat.trend && (
      <span className="text-xs font-bold text-green-400">
        ↑ {stat.trend}%
      </span>
    )}
  </div>
  
  {/* Value */}
  <p className="text-3xl font-bold text-white mb-3">{stat.value.toLocaleString()}</p>
  
  {/* Bar Visualization */}
  <div className="w-full bg-gray-700 rounded-full h-2">
    <div 
      className="bg-gradient-to-r from-pink-500 to-pink-400 h-2 rounded-full"
      style={{ width: `${calculatePercentage(stat.value, stat.maxValue)}%` }}
    />
  </div>
</div>
```

**Type 2: Gauge (Test Coverage, Uptime)**
```typescript
<div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-pink-500 transition">
  {/* Header */}
  <div className="flex items-center gap-2 mb-3">
    <span className="text-2xl">📊</span>
    <span className="text-sm font-semibold text-gray-300">{stat.label}</span>
  </div>
  
  {/* Circular Gauge (SVG) */}
  <svg viewBox="0 0 120 120" className="w-full mb-3">
    {/* Background circle */}
    <circle cx="60" cy="60" r="50" fill="none" stroke="#374151" strokeWidth="8" />
    
    {/* Progress circle */}
    <circle 
      cx="60" cy="60" r="50" fill="none" 
      stroke="url(#pinkGrad)" 
      strokeWidth="8"
      strokeDasharray={`${(stat.value / 100) * Math.PI * 100} ${Math.PI * 100}`}
      transform="rotate(-90 60 60)"
      strokeLinecap="round"
    />
    
    {/* Center value */}
    <text x="60" y="65" textAnchor="middle" fontSize="24" fontWeight="bold" fill="white">
      {stat.value}%
    </text>
  </svg>
  
  {/* Label below */}
  <p className="text-center text-xs text-gray-400">{stat.unit}</p>
</div>
```

**Type 3: Live Counter (Real-time Score)**
```typescript
<div className="bg-gradient-to-br from-pink-600 to-pink-700 border border-pink-500 rounded-lg p-4 hover:shadow-lg hover:shadow-pink-600/50 transition">
  {/* Header */}
  <div className="flex items-center gap-2 mb-3">
    <span className="text-2xl animate-spin">⚡</span>
    <span className="text-sm font-semibold text-white">Real-time Score</span>
  </div>
  
  {/* Big number with animation */}
  <p className="text-4xl font-bold text-white mb-1 animate-pulse">
    {scoreValue.toLocaleString()}
  </p>
  
  {/* Increment label */}
  <p className="text-xs text-pink-100">pts accumulated</p>
  
  {/* Progress to next tier */}
  <div className="mt-3 w-full bg-pink-500/30 rounded-full h-1.5">
    <div 
      className="bg-white h-1.5 rounded-full transition-all duration-500"
      style={{ width: `${getProgressToNextTier()}%` }}
    />
  </div>
</div>
```

### Stats Content

| Icon | Label | Value | Visualization | Max | Unit |
|------|-------|-------|---|---|---|
| 💻 | Lines of Code | 30,000+ | Bar | 50000 | loc |
| 🐛 | Bugs Fixed | 156 | Bar | 200 | bugs |
| 🔐 | Security Fixes | 8 | Badge | 10 | fixes |
| 🚀 | Features Shipped | 47 | Counter | 100 | features |
| 📈 | Test Coverage | 85 | Gauge | 100 | % |
| 🏆 | Production Uptime | 99.8 | Gauge | 100 | % |
| ⚡ | Real-time Score | (dynamic) | Counter | - | pts |

### Mobile Adaptation
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-6` → responsive
- SVG gauges: Simplified on mobile
- Reduced padding: `p-3` on small screens

---

## Section 3: Enhanced API Playground (With Gamification)

### Component Structure
*Extends the standard API Playground with gamification layers*

```typescript
interface GameState {
  totalPoints: number;
  currentCombo: number;
  comboMultiplier: number;
  recentAchievements: Achievement[];
  sessionStartTime: number;
}
```

### Main Container

**Layout**: Keep existing 2-column design from API Playground but add gamification UI

```typescript
<div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6">
  {/* Left Column: Endpoint List + Gamification */}
  <div>
    <GameStatus /> {/* New: Shows points, combo, multiplier */}
    <EndpointList />
    <PresetsSection />
  </div>
  
  {/* Right Column: Request Builder + Leaderboard */}
  <div>
    <RequestBuilder />
    <ComboIndicator /> {/* New: Shows active combos */}
    <ResponseDisplay />
    <SessionLeaderboard /> {/* New: Top earners this session */}
  </div>
</div>
```

### Subsection 3.1: Game Status Bar

**Position**: Top of left column, above endpoint list

**Component**:
```typescript
<div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-lg p-4 mb-4 text-white">
  {/* Three stat columns */}
  <div className="grid grid-cols-3 gap-4">
    {/* Total Points */}
    <div className="text-center">
      <p className="text-xs font-semibold text-pink-100 mb-1">TOTAL POINTS</p>
      <p className="text-2xl font-bold">{gameState.totalPoints}</p>
      <p className="text-xs text-pink-200 mt-1">
        {calculateTierName(gameState.totalPoints)}
      </p>
    </div>
    
    {/* Current Combo */}
    <div className="text-center border-l border-r border-pink-500">
      <p className="text-xs font-semibold text-pink-100 mb-1">COMBO</p>
      <p className="text-2xl font-bold animate-bounce">
        {gameState.currentCombo}x
      </p>
      <p className="text-xs text-pink-200 mt-1">multiplier active</p>
    </div>
    
    {/* Session Time */}
    <div className="text-center">
      <p className="text-xs font-semibold text-pink-100 mb-1">SESSION TIME</p>
      <p className="text-2xl font-bold">{formatSessionTime()}</p>
      <p className="text-xs text-pink-200 mt-1">keep going!</p>
    </div>
  </div>
</div>
```

### Subsection 3.2: Endpoint Difficulty Levels

**Modification to EndpointList**: Add difficulty badge to each endpoint

```typescript
<div className="flex items-center justify-between">
  <div>
    {/* Existing endpoint info */}
  </div>
  <span className="px-2 py-1 text-xs font-bold rounded-full"
    style={getDifficultyStyle(endpoint.difficulty)}>
    {endpoint.difficulty.toUpperCase()}
  </span>
</div>
```

**Difficulty Badges**:
- Easy: `bg-green-100 text-green-800`
- Medium: `bg-yellow-100 text-yellow-800`
- Hard: `bg-red-100 text-red-800`

**Points per Endpoint**:
- Easy: +10 points
- Medium: +25 points
- Hard: +50 points

### Subsection 3.3: Points Display in Response

**After response displays**, show in response header:

```typescript
<div className="bg-gradient-to-r from-pink-100 to-pink-50 border border-pink-300 rounded-lg p-3 mb-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="text-xl">⭐</span>
      <span className="font-semibold text-gray-900">
        +{pointsEarned} points for {difficulty} request
      </span>
    </div>
    
    {/* Combo bonus (if active) */}
    {gameState.currentCombo > 1 && (
      <span className="text-sm font-bold text-pink-700">
        {getComboBonus()}pt bonus! 🔥
      </span>
    )}
  </div>
  
  {/* Progress bar to next tier */}
  <div className="w-full bg-pink-200 rounded-full h-2 mt-2">
    <div 
      className="bg-gradient-to-r from-pink-600 to-pink-500 h-2 rounded-full transition-all"
      style={{ width: `${getTierProgress()}%` }}
    />
  </div>
</div>
```

### Subsection 3.4: Combo Indicator

**Position**: Right column, below ResponseDisplay

**Component**:
```typescript
{gameState.currentCombo > 1 && (
  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-4 text-white border-2 border-yellow-300 animate-pulse">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-2xl animate-bounce">🔥</span>
      <h3 className="font-bold text-lg">COMBO ACTIVE!</h3>
    </div>
    
    <p className="text-sm mb-3">
      You've made <strong>{gameState.currentCombo}</strong> requests in a row!
    </p>
    
    <div className="bg-orange-600 rounded-lg p-2 text-xs font-semibold text-center">
      {gameState.currentCombo}x MULTIPLIER ON NEXT REQUEST
    </div>
    
    <p className="text-xs text-orange-100 mt-2">
      Make 3 more to unlock a bonus! (+100pts)
    </p>
  </div>
)}
```

### Subsection 3.5: Easter Eggs & Secret Endpoints

**Automatic Unlocking**:

1. **After 5 Endpoints Tried**:
   - Unlock `/api/fun/secret-achievement`
   - Show notification: "🎉 Secret endpoint unlocked!"

2. **After POST + GET Combo**:
   - Unlock `/api/metrics/hacker-stats`
   - Show notification: "⚡ Hacker Stats endpoint unlocked!"

3. **After 3 Endpoints in < 10 seconds**:
   - Unlock `/api/fun/speedrun`
   - Show notification: "🚀 Speedrun endpoint unlocked!"

**Secret Endpoint Display** (in EndpointList):
```typescript
{secretEndpoint && (
  <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 border-2 border-purple-400 mb-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-2xl">✨</span>
      <h3 className="font-bold text-white">Secret Unlocked!</h3>
    </div>
    <p className="text-sm text-purple-100 mb-3">{secretEndpoint.description}</p>
    <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition">
      Try {secretEndpoint.path}
    </button>
  </div>
)}
```

### Subsection 3.6: Scoring Formula

```typescript
function calculatePoints(endpoint: Endpoint, currentCombo: number): number {
  let basePoints = 0;
  
  // Base points by difficulty
  switch(endpoint.difficulty) {
    case 'easy': basePoints = 10; break;
    case 'medium': basePoints = 25; break;
    case 'hard': basePoints = 50; break;
  }
  
  // HTTP method multipliers
  const methodMultipliers = {
    'GET': 1.0,
    'POST': 1.5,
    'PUT': 1.5,
    'DELETE': 2.0,
  };
  basePoints *= methodMultipliers[endpoint.method] || 1.0;
  
  // Combo multiplier (only if combo > 1)
  const comboBonus = currentCombo > 1 ? currentCombo * 50 : 0;
  
  // Success vs error
  const totalPoints = Math.floor(basePoints * currentCombo) + comboBonus;
  
  return totalPoints;
}

function getComboBonus(): number {
  // Every 3rd consecutive request gets +100 bonus
  if (currentCombo % 3 === 0 && currentCombo > 0) {
    return 100;
  }
  return 0;
}
```

### Subsection 3.7: Request Scoring Display

**Modify ResponseDisplay** to show:

```
Status: ✅ OK (200)
Points Earned: ⭐ +50
Combo Multiplier: 🔥 2x
Total This Session: +100 points
Tier Progress: [=======>  ] 75%
Next Tier: Professional (at 500pts)
```

---

## Section 4: Skills Showcase

### Component Structure
```typescript
interface SkillWithCategory {
  name: string;
  category: string;
  proficiency: 1-5;
  yearsOfExperience: number;
  projects?: number; // # of projects using this skill
}
```

### Layout

**Header**:
- Title: `text-2xl font-bold text-white mb-4`
- Subtitle: "Mastery across the stack" (text-gray-400)

**Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3`

**Skill Card**:
```typescript
<div className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-pink-500 transition group">
  {/* Skill Name & Proficiency */}
  <div className="flex items-center justify-between mb-2">
    <h3 className="font-semibold text-white text-sm group-hover:text-pink-400 transition">
      {skill.name}
    </h3>
    {/* Proficiency stars */}
    <div className="text-yellow-400">
      {'⭐'.repeat(skill.proficiency)}{'☆'.repeat(5 - skill.proficiency)}
    </div>
  </div>
  
  {/* Category & Experience */}
  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
    <span className="bg-gray-700 px-2 py-1 rounded">{skill.category}</span>
    <span>{skill.yearsOfExperience}y exp</span>
  </div>
  
  {/* Projects using this skill (optional) */}
  {skill.projects && (
    <p className="text-xs text-gray-500">
      Used in {skill.projects} projects
    </p>
  )}
</div>
```

---

## Section 5: Projects Highlight

### Component Structure
```typescript
interface ProjectShowcase {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  impact: string;
  github?: string;
  live?: string;
}
```

### Layout

**Header**:
- Title: `text-2xl font-bold text-white mb-4`
- Subtitle: "Featured technical projects" (text-gray-400)

**Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

**Project Card**:
```typescript
<div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-pink-500 hover:shadow-xl hover:shadow-pink-600/20 transition group">
  {/* Header */}
  <div className="flex items-start justify-between mb-3">
    <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition">
      {project.name}
    </h3>
    <span className="text-xl">🔗</span>
  </div>
  
  {/* Description */}
  <p className="text-sm text-gray-400 mb-3">
    {project.description}
  </p>
  
  {/* Tech Stack Badges */}
  <div className="flex flex-wrap gap-2 mb-3">
    {project.techStack.map((tech, idx) => (
      <span 
        key={idx}
        className="text-xs px-2 py-1 rounded-full bg-pink-900/30 text-pink-300 border border-pink-500/30"
      >
        {tech}
      </span>
    ))}
  </div>
  
  {/* Impact */}
  <p className="text-xs text-gray-500 mb-3 italic">
    💡 {project.impact}
  </p>
  
  {/* Links */}
  <div className="flex gap-2">
    {project.github && (
      <a 
        href={project.github}
        className="flex-1 px-3 py-2 text-xs font-semibold bg-gray-700 hover:bg-gray-600 rounded text-center transition"
      >
        GitHub
      </a>
    )}
    {project.live && (
      <a 
        href={project.live}
        className="flex-1 px-3 py-2 text-xs font-semibold bg-pink-600 hover:bg-pink-700 rounded text-white text-center transition"
      >
        Live Demo
      </a>
    )}
  </div>
</div>
```

---

## Styling & Design System

### Color Palette (Dark Mode Optimized)
- **Background**: Gray-900 (#111827)
- **Card Background**: Gray-800 (#1f2937)
- **Border**: Gray-700 (#374151)
- **Primary Accent**: Pink-600 (#ec4899)
- **Glow/Hover**: Pink-500 (#ec4899, with opacity)
- **Tech Accents**: Cyan-400, Blue-400, Purple-600
- **Success**: Green-400
- **Warning**: Yellow-400
- **Error**: Red-500

### Typography (Darker variant)
- **Headers**: Bold white text with pink hover
- **Body Text**: Gray-300 on gray-800
- **Secondary Text**: Gray-400
- **Meta Text**: Gray-500
- **Code/Monospace**: Gray-100 on gray-900 background

### Animations & Effects
- **Glow Effects**: `shadow-lg shadow-pink-600/50` on hover
- **Pulse**: `animate-pulse` for active combo/points
- **Bounce**: `animate-bounce` for badges and notifications
- **Transitions**: `transition-all duration-300` for smooth movements
- **Gradients**: `bg-gradient-to-r from-pink-600 to-pink-700` for emphasis

### Responsive Breakpoints
- Desktop: Full multi-column layouts, 2-column grid for API
- Tablet: Adjusted columns, stacked sections
- Mobile: Single column, stacked stats, simplified API layout

---

## Gamification Details

### Tier System

```typescript
const TIERS = [
  { name: 'Rookie', minPoints: 0, maxPoints: 199, emoji: '🌱' },
  { name: 'Developer', minPoints: 200, maxPoints: 499, emoji: '👨‍💻' },
  { name: 'Professional', minPoints: 500, maxPoints: 999, emoji: '⭐' },
  { name: 'Expert', minPoints: 1000, maxPoints: 1999, emoji: '🏆' },
  { name: 'Architect', minPoints: 2000, maxPoints: 4999, emoji: '👑' },
  { name: 'Legend', minPoints: 5000, maxPoints: Infinity, emoji: '🌟' },
];
```

### Combo System

- Combo increments with each consecutive request
- Resets if user switches tabs or after 5 minute idle
- Multiplies points earned
- Every 3rd request awards +100 bonus points
- Visual feedback: Fire emoji, animation, counter

### Real-Time Score

- Points accumulate as user makes API calls
- Displayed at top of page with live ticker animation
- Shows current tier and progress to next
- Session-based (resets on page reload or role change)

### Achievement Tracking

- Badges unlock automatically based on metrics
- Progress bars show locked badge completion
- All data sourced from `lib/data.ts`
- New badge notifications appear with animation

---

## Testing Checklist

- [ ] Game status bar displays points, combo, time correctly
- [ ] Endpoint difficulty badges show correct colors
- [ ] Points calculate correctly for each method (GET/POST/PUT/DELETE)
- [ ] Combo multiplier activates after 2nd consecutive request
- [ ] Combo resets on tab switch or 5min idle
- [ ] Bonus points (+100) trigger on every 3rd request
- [ ] Secret endpoints unlock after correct triggers
- [ ] Achievement badges display locked/unlocked states
- [ ] Progress bars animate smoothly
- [ ] Real-time score updates with animation
- [ ] Leaderboard stats calculate correctly
- [ ] Skills showcase displays all categories
- [ ] Projects display tech stacks and links correctly
- [ ] Mobile layout stacks correctly
- [ ] Dark mode colors meet WCAG AA contrast
- [ ] All animations respect `prefers-reduced-motion`
- [ ] No performance lag with animations running
- [ ] Local storage saves game state (optional)

---

## Integration Notes

### State Management
- Use React Context for `GameState`
- Track: totalPoints, currentCombo, achievements, tier
- Persist to localStorage (optional, for session continuity)

### Data Sources
- Achievement metrics: `lib/data.ts`
- Endpoint info: `apiPlaygroundEndpoints` array
- Skill data: `skills` array with difficulty mapping
- Project data: `projects` array

### Future Enhancements
1. Leaderboard: Global/weekly rankings
2. Achievements: More badge varieties
3. Speedrun mode: Race against time
4. Teams: Collaborative requests with shared points
5. Share: Shareable score/achievement cards
6. Sound effects: Notification sounds (toggle in settings)
7. Dark/Light theme toggle

---

## Dark Mode Verification

All colors tested for:
- ✓ Text on background contrast > 7:1 (AAA)
- ✓ Glow effects visible on dark backgrounds
- ✓ Badges readable and distinct
- ✓ Animations smooth at 60fps
- ✓ No harsh flashing or strobing effects
