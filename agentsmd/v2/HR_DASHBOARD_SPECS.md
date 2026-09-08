# HR Dashboard Specifications (`/dashboard/hr`)

## Overview

**Purpose**: Recruitment-focused dashboard designed for HR professionals, recruiters, and talent managers to quickly evaluate candidate qualifications, experience, and skills.

**Target Audience**: HR teams, talent acquisition managers, recruiters, hiring managers

**Theme**: Professional, clean, data-driven with emphasis on searchability and filtering

**Primary Color Scheme**: Pink primary (#ec4899) + professional grays + accent blues/greens

---

## Page Layout

### Main Container
```typescript
// Desktop: Single column layout optimized for scanning
<div className="min-h-screen bg-white">
  <Sidebar /> // Shared navigation with "Change Role" button
  
  <main className="ml-64 p-8">
    <RoleHeader /> // Shows current role: "HR Dashboard"
    
    {/* Main content sections */}
    <ProfileCard />
    <SkillsBrowser />
    <ExperienceTimeline />
    <AchievementsMetrics />
    <EducationCard />
    <DownloadSection />
  </main>
</div>
```

**Responsive Behavior**:
- Desktop (> 1024px): Single column, full width panels
- Tablet (640px-1024px): Adjust padding, card spacing reduced
- Mobile (< 640px): Full-width cards, vertical stack, reduced padding `p-4`

---

## Section 1: Profile Card (Top Section)

### Component Structure
```typescript
interface ProfileCardProps {
  avatar: string; // URL to avatar image
  name: string; // Full name
  title: string; // Current job title
  location: string; // City, country
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
  };
}
```

### Visual Layout
**Container**: `bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl p-8 shadow-md border border-pink-100`

**Grid Layout**: `grid grid-cols-[120px_1fr_200px] gap-8 items-start`

**Columns**:
1. **Left** (120px): Avatar image with `rounded-lg w-24 h-24 object-cover border-4 border-pink-600`
2. **Center** (Flexible):
   - Name: `text-3xl font-bold text-gray-900`
   - Title: `text-lg font-semibold text-pink-600 mt-1`
   - Location: `text-sm text-gray-600 mt-2 flex items-center gap-1`
     * Include location icon from lucide-react (MapPin)
3. **Right** (200px):
   - Buttons stacked vertically: `flex flex-col gap-3`
   - "Download CV" button: Primary style (pink background, white text)
   - "View Full Profile" link: Ghost style (pink text)

### Contact Information Section
**Below main grid**: `mt-6 pt-6 border-t border-pink-100`

**Grid**: `grid grid-cols-2 md:grid-cols-4 gap-4`

**Contact Cards** (4 items):
```typescript
[
  { icon: Mail, label: "Email", value: "email@example.com", href: "mailto:" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", href: "tel:" },
  { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/...", href: "https://linkedin.com/in/" },
  { icon: Github, label: "GitHub", value: "github.com/...", href: "https://github.com/" }
]
```

Each contact card:
- `bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition`
- Icon: `text-pink-600 w-5 h-5`
- Label: `text-xs text-gray-600 font-semibold uppercase`
- Value: `text-sm text-gray-900 font-semibold truncate hover:underline cursor-pointer`
- Clickable (links to email, tel, LinkedIn, GitHub)

### Mobile Adaptation (< 640px)
- Grid becomes: `grid-cols-1`
- Avatar: Centered
- Contact grid: `grid-cols-1 or 2 columns`
- Buttons: Full width `w-full`

---

## Section 2: Skills Browser

### Component Structure
```typescript
interface SkillsBrowserProps {
  skills: Skill[];
  categories: string[]; // Languages, Frameworks, Databases, Tools, etc.
}

interface Skill {
  name: string;
  category: string;
  proficiency: 1 | 2 | 3 | 4 | 5; // 1=Beginner to 5=Expert
  yearsOfExperience: number;
  endorsed?: number;
}
```

### Layout

**Header**: 
- Title: `text-2xl font-bold text-gray-900 mb-4`
- Description: `text-gray-600 text-sm mb-6`

**Filter Bar** (Horizontal):
```typescript
<div className="flex gap-2 mb-6 overflow-x-auto pb-2">
  <button className="px-4 py-2 rounded-full bg-pink-600 text-white font-semibold">
    All Skills
  </button>
  {categories.map(cat => (
    <button key={cat} className="px-4 py-2 rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200">
      {cat}
    </button>
  ))}
</div>
```

Styling:
- Active filter: `bg-pink-600 text-white`
- Inactive filter: `bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200`
- Whitespace: `white-space-nowrap`

**Search Input**:
```html
<input 
  type="text" 
  placeholder="Search skills..." 
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
/>
```

### Skills Grid

**Grid Layout**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

**Skill Card**:
```typescript
<div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
  {/* Header Row */}
  <div className="flex items-start justify-between mb-3">
    <div>
      <h3 className="font-semibold text-gray-900">{skill.name}</h3>
      <p className="text-xs text-gray-600 mt-1">{skill.category}</p>
    </div>
    <span className="text-xs font-bold px-2 py-1 rounded-full bg-pink-100 text-pink-700">
      {skill.yearsOfExperience}y
    </span>
  </div>

  {/* Proficiency Bar */}
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1">
      <span className="text-xs text-gray-600">Proficiency</span>
      <span className="text-xs font-semibold text-gray-900">
        {proficiencyLabel[skill.proficiency]}
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full transition-all"
        style={{ width: `${(skill.proficiency / 5) * 100}%` }}
      />
    </div>
  </div>

  {/* Endorsements (optional) */}
  {skill.endorsed && (
    <div className="text-xs text-gray-600">
      👍 {skill.endorsed} endorsements
    </div>
  )}
</div>
```

**Proficiency Label Mapping**:
- 1: "Beginner"
- 2: "Intermediate"
- 3: "Proficient"
- 4: "Expert"
- 5: "Mastery"

### Empty State
If no skills in category:
```html
<div className="bg-gray-50 rounded-lg p-8 text-center">
  <p className="text-gray-600">No skills found in this category</p>
</div>
```

### Sorting Options (Optional Enhancement)
- Sort by: Proficiency (descending), Years of Experience (descending), Alphabetical
- Dropdown: `appearance-none px-3 py-2 border border-gray-300 rounded-lg`

---

## Section 3: Experience Timeline

### Component Structure
```typescript
interface ExperienceTimelineProps {
  experience: Experience[];
}

interface Experience {
  company: string;
  role: string;
  location: string;
  startDate: string; // "2020-01"
  endDate: string | null; // "2023-06" or null for current
  description: string;
  achievements: string[];
  skills: string[];
  type: 'full-time' | 'contract' | 'internship' | 'freelance';
}
```

### Filter & Sort Bar

**Filters** (Horizontal layout):

```typescript
<div className="flex gap-4 mb-6 flex-wrap">
  {/* Company Filter */}
  <div className="flex-1 min-w-[200px]">
    <label className="block text-xs font-semibold text-gray-700 mb-2">Company</label>
    <select className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-lg">
      <option>All Companies</option>
      {/* Company options */}
    </select>
  </div>

  {/* Duration Filter */}
  <div className="flex-1 min-w-[200px]">
    <label className="block text-xs font-semibold text-gray-700 mb-2">Duration</label>
    <select className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-lg">
      <option>All Years</option>
      <option>< 1 Year</option>
      <option>1-2 Years</option>
      <option>2-5 Years</option>
      <option>> 5 Years</option>
    </select>
  </div>

  {/* Role Type Filter */}
  <div className="flex-1 min-w-[200px]">
    <label className="block text-xs font-semibold text-gray-700 mb-2">Type</label>
    <select className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-lg">
      <option>All Types</option>
      <option>Full-Time</option>
      <option>Contract</option>
      <option>Internship</option>
      <option>Freelance</option>
    </select>
  </div>
</div>
```

### Timeline Items

**Timeline Container**: `space-y-4`

**Each Experience Item**:
```typescript
<div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
  {/* Left Badge (Timeline Connector) */}
  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-600 to-pink-400" />

  {/* Content */}
  <div className="pl-6 p-4">
    {/* Header Row */}
    <div className="flex items-start justify-between mb-2">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{experience.role}</h3>
        <p className="text-sm text-pink-600 font-semibold">{experience.company}</p>
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
        {experience.type.replace('-', ' ').toUpperCase()}
      </span>
    </div>

    {/* Meta Information */}
    <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
      <span className="flex items-center gap-1">
        📍 {experience.location}
      </span>
      <span className="flex items-center gap-1">
        📅 {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
      </span>
      <span className="text-gray-500 font-semibold">
        ({calculateDuration(experience.startDate, experience.endDate)})
      </span>
    </div>

    {/* Description */}
    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
      {experience.description}
    </p>

    {/* Achievements (Collapsible) */}
    <details className="group">
      <summary className="cursor-pointer text-sm font-semibold text-pink-600 hover:text-pink-700">
        ► Key Achievements ({experience.achievements.length})
      </summary>
      <ul className="mt-3 space-y-2 ml-4 border-l-2 border-pink-200 pl-3">
        {experience.achievements.map((achievement, idx) => (
          <li key={idx} className="text-sm text-gray-700 flex gap-2">
            <span className="text-pink-600 font-bold">•</span>
            {achievement}
          </li>
        ))}
      </ul>
    </details>

    {/* Skills Used */}
    {experience.skills.length > 0 && (
      <div className="mt-3">
        <p className="text-xs text-gray-600 font-semibold mb-2">Skills Used:</p>
        <div className="flex flex-wrap gap-2">
          {experience.skills.map((skill, idx) => (
            <span 
              key={idx}
              className="px-2 py-1 text-xs rounded-full bg-pink-50 text-pink-700 border border-pink-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
</div>
```

**Mobile Adaptation**:
- Remove "flex items-start justify-between" → stack vertically
- Badges: `w-full text-left py-2` instead of inline

### Empty State
```html
<div className="bg-gray-50 rounded-lg p-8 text-center">
  <p className="text-gray-600">No experience matches these filters</p>
</div>
```

---

## Section 4: Achievements & Metrics

### Component Structure
```typescript
interface MetricsData {
  linesOfCodeWritten: number;
  bugsfixed: number;
  securityVulnerabilitiesResolved: number;
  featuresShipped: number;
  codeReviewsConducted: number;
}
```

### Layout

**Header**: 
- Title: `text-2xl font-bold text-gray-900 mb-6`
- Subtitle: "Quantified impact and contributions" (gray-600)

**Grid**: `grid grid-cols-1 md:grid-cols-5 gap-4`

**Metric Card** (5 cards):
```typescript
<div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition text-center">
  {/* Icon */}
  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
    {/* Icon from lucide-react */}
    <CodeIcon className="w-6 h-6 text-pink-600" />
  </div>

  {/* Value */}
  <p className="text-3xl font-bold text-gray-900 mb-1">
    {metric.value.toLocaleString()}
  </p>

  {/* Label */}
  <p className="text-sm text-gray-600 font-semibold">
    {metric.label}
  </p>

  {/* Change indicator (optional) */}
  {metric.change && (
    <p className="text-xs text-green-600 font-semibold mt-2">
      ↑ {metric.change}% from last year
    </p>
  )}
</div>
```

**Metrics Content**:
| Icon | Label | Value | Description |
|------|-------|-------|-------------|
| 💻 Code | Lines of Code | 30,000+ | Total production code written |
| 🐛 Bug | Bugs Fixed | 156 | Critical and minor issues resolved |
| 🔐 Security | Vulnerabilities Resolved | 8 | Security fixes and hardening |
| 🚀 Rocket | Features Shipped | 47 | Completed and deployed features |
| 👁️ Review | Code Reviews | 230 | Code quality assurance |

**Mobile Adaptation**:
- Grid: `grid-cols-2 md:grid-cols-5` (2 columns on small screens)
- Padding: `p-4` (reduced on mobile)

---

## Section 5: Education Card

### Component Structure
```typescript
interface Education {
  degree: string; // "Bachelor of Science"
  field: string; // "Computer Science"
  university: string;
  location: string;
  graduationDate: string; // "2018-06"
  gpa?: number;
  honors?: string; // "Cum Laude"
  coursework?: string[]; // Key courses
}
```

### Card Layout

**Container**: `bg-white border border-gray-200 rounded-lg p-6 shadow-sm`

**Grid**: `grid grid-cols-[80px_1fr_120px] gap-6 items-center`

**Columns**:
1. **Icon** (80px):
   - `w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center`
   - Icon: `BookOpen` from lucide-react, `w-8 h-8 text-blue-600`

2. **Content** (Flexible):
   - Degree + Field: `text-xl font-bold text-gray-900`
   - University: `text-lg text-blue-600 font-semibold mt-1`
   - Location & Date: `text-sm text-gray-600 mt-2`
   - Honors (if exists): `text-sm text-green-700 font-semibold mt-1 flex items-center gap-1`
     * Include: 🎓 Icon + text

3. **GPA** (120px, right-aligned):
   - If GPA exists: `text-right`
   - `text-2xl font-bold text-gray-900`
   - Label: `text-xs text-gray-600 font-semibold`

### Optional Coursework Section
**Below main card** (collapsible):
```html
<details className="mt-4 ml-6">
  <summary className="text-sm font-semibold text-blue-600 cursor-pointer">
    📚 Key Coursework
  </summary>
  <div className="mt-3 flex flex-wrap gap-2">
    {/* Course tags */}
    <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">
      Data Structures
    </span>
  </div>
</details>
```

### Mobile Adaptation
- Grid: `grid-cols-1`
- Icon: `w-12 h-12` (smaller)
- GPA: Inline after university, not in separate column

---

## Section 6: Download Section

### Component Structure
```typescript
interface DownloadOptions {
  fullCV: boolean;
  filteredBySkill?: string;
  filteredByCompany?: string;
  filteredByRole?: string;
}
```

### Layout

**Header**:
- Title: `text-2xl font-bold text-gray-900 mb-4`
- Description: "Export your profile in various formats" (text-gray-600)

**Main Download Button**:
```typescript
<button className="w-full px-6 py-4 bg-gradient-to-r from-pink-600 to-pink-700 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2">
  <Download className="w-5 h-5" />
  Download Full CV (PDF)
</button>
```

**Additional Options** (Below main button):
```typescript
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
  {/* Option 1: By Skill */}
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <h4 className="font-semibold text-gray-900 mb-3">Filter by Skill</h4>
    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm">
      <option>Select a skill...</option>
      {/* Skills */}
    </select>
    <button className="w-full px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200">
      Download
    </button>
  </div>

  {/* Option 2: By Company */}
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <h4 className="font-semibold text-gray-900 mb-3">Filter by Company</h4>
    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm">
      <option>Select a company...</option>
      {/* Companies */}
    </select>
    <button className="w-full px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200">
      Download
    </button>
  </div>

  {/* Option 3: By Role Type */}
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <h4 className="font-semibold text-gray-900 mb-3">Filter by Role Type</h4>
    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm">
      <option>Select a type...</option>
      <option>Full-Time</option>
      <option>Contract</option>
      <option>Internship</option>
      <option>Freelance</option>
    </select>
    <button className="w-full px-4 py-2 bg-amber-100 text-amber-700 font-semibold rounded-lg hover:bg-amber-200">
      Download
    </button>
  </div>
</div>
```

### Export Formats
- **Primary**: PDF (using scripts/build_resume.py)
- **Future**: JSON, plaintext, formatted HTML

---

## Styling & Design System

### Colors (From DESIGN_SPECS.md)
- **Primary**: Pink-600 (#ec4899)
- **Hover**: Pink-700 (#be185d)
- **Background**: White (#ffffff)
- **Surface**: Gray-50 (#f9fafb)
- **Border**: Gray-200 (#e5e7eb)
- **Text Primary**: Gray-900 (#1f2937)
- **Text Secondary**: Gray-600 (#4b5563)
- **Accent Blues**: Blue-600, Blue-100, Blue-50 (for secondary elements)
- **Success/Status**: Green-600, Green-100

### Typography
- Section Headers: `text-2xl font-bold text-gray-900`
- Card Titles: `text-lg font-semibold text-gray-900`
- Labels: `text-xs font-semibold text-gray-700 uppercase`
- Body Text: `text-sm text-gray-700`
- Meta Text: `text-xs text-gray-600`

### Spacing
- Section gaps: `space-y-8` or `mb-8`
- Card padding: `p-4` or `p-6`
- Grid gaps: `gap-4` or `gap-6`

### Shadows & Borders
- Default cards: `border border-gray-200 shadow-sm`
- Hover cards: `hover:shadow-md transition`
- Top section: `border border-pink-100 shadow-md`

### Animations
- Hover lift: `hover:shadow-md hover:-translate-y-0.5 transition`
- Filter changes: Smooth fade (0.2s)
- Expand/collapse: Smooth (0.3s)

---

## Interactions & Behavior

### Filter Interactions
1. User clicks filter button (company/duration/role/skill)
2. Timeline items fade out (0.2s) → filter applied → fade in
3. No items: Show empty state
4. Multiple filters: AND logic (not OR)

### Skill Proficiency
- On hover: Show tooltip with years of experience + endorsements
- Hover color: Background shifts to `bg-pink-50`

### Download Button
1. User clicks "Download CV"
2. Button shows loading state: `bg-opacity-75 cursor-not-allowed`
3. Backend calls `scripts/build_resume.py` with filter params
4. PDF generated and downloaded
5. Success toast: "CV downloaded successfully" (bottom right, 3s auto-dismiss)

### Mobile Considerations
- All dropdowns: Native `<select>` (better mobile UX)
- Filter bar: Horizontal scroll if needed (don't stack vertically)
- Metrics: 2 columns on small screens, full row on desktop
- Cards: Full width with reduced padding

---

## Accessibility

### WCAG AA Compliance
- All form inputs: Proper `<label>` elements with `for` attribute
- Buttons: Clear focus rings (`focus:ring-2 focus:ring-pink-500 focus:ring-offset-2`)
- Color: Never rely solely on color (always include text labels/icons)
- Contrast:
  - Gray-900 on white: 16.5:1 ✓ (AAA)
  - Pink-600 on white: 5.1:1 ✓ (AA)
  - Gray-600 on white: 6.9:1 ✓ (AA)

### Keyboard Navigation
- Tab through all filters, buttons, and dropdowns
- Enter to activate buttons
- Arrow keys in dropdowns (native behavior)

### Screen Readers
- All icons: Wrapped in `<span role="img" aria-label="...">` or similar
- Form labels: Associated with inputs via `htmlFor`
- Section headers: `<h2>` tags for hierarchy
- Empty states: Announced to screen readers

### Reduced Motion
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

## Component Integration

### Dependencies (From lib/data.ts)
- Portfolio data (skills, experience, education)
- Contact information
- Achievement metrics
- Available companies and roles

### External Libraries
- **Lucide React**: Icons (Mail, Phone, Download, MapPin, Code, etc.)
- **Date formatting**: `date-fns` or similar

### Data Flow
```typescript
// From Context/Props:
useRole() → "hr"
usePortfolioData() → { skills, experience, education, contact, metrics }

// Local state:
const [filteredExperience, setFilteredExperience] = useState([])
const [skillFilter, setSkillFilter] = useState('all')
const [companyFilter, setCompanyFilter] = useState('all')
```

---

## Testing Checklist

- [ ] Profile card displays correctly with all contact info
- [ ] Avatar image loads and displays at 80px × 80px
- [ ] Skills filter works (by category and search)
- [ ] Proficiency bars calculate correctly (0-100%)
- [ ] Experience timeline filters by company/duration/role
- [ ] Achievement details expand/collapse smoothly
- [ ] Metrics display with proper formatting (commas for thousands)
- [ ] Education card shows degree, university, and GPA correctly
- [ ] Download button triggers CV PDF generation
- [ ] Filtered downloads (by skill/company) work correctly
- [ ] Mobile layout stacks correctly (< 640px)
- [ ] Tablet layout adjusts properly (640px-1024px)
- [ ] All buttons have focus rings and hover states
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works (Tab through all elements)
- [ ] Screen reader announces all content properly
- [ ] Animations respect `prefers-reduced-motion`

---

## Future Enhancements

1. **Export Formats**: JSON, plaintext markdown, HTML
2. **Print View**: Optimized CSS for printing
3. **Share Link**: Generate shareable CV link
4. **Timeline Chart**: Visual timeline of career progression
5. **Skill Endorsements**: Integration with LinkedIn API (future)
6. **Performance Metrics**: Add graphs for skill growth over time
