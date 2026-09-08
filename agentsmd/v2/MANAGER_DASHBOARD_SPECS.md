# Manager/Director Dashboard Specifications (`/dashboard/manager`)

## Overview

**Purpose**: Executive-level, data-driven dashboard designed for C-level executives, decision makers, hiring managers, and directors to evaluate candidate through quantifiable metrics and trend analysis.

**Target Audience**: CTOs, VPs of Engineering, Hiring Directors, Executives, Business decision makers

**Theme**: Professional, metrics-focused, data-centric with premium aesthetic

**Primary Color Scheme**: Pink primary (#ec4899) + professional grays + data visualization colors + muted accents

---

## Page Layout

### Main Container
```typescript
// Professional, clean, metrics-driven
<div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
  <Sidebar /> // Shared navigation with "Change Role" button
  
  <main className="ml-64 p-8">
    <RoleHeader /> // Shows current role: "Manager Dashboard"
    
    {/* Executive Summary */}
    <ExecutiveSummary />
    
    {/* KPI Dashboard */}
    <KPIDashboard />
    
    {/* Main Visualizations */}
    <div className="grid grid-cols-2 gap-6 mt-12">
      <DeliveryChart />
      <ReliabilityChart />
      <QualityChart />
      <SecurityChart />
    </div>
    
    {/* Career Analysis */}
    <CareerTimeline />
    <TechnicalProficiencyMatrix />
    <ExperienceOverview />
    
    {/* Export */}
    <ExportSection />
  </main>
</div>
```

**Responsive Behavior**:
- Desktop (> 1024px): 2-column grid for KPIs, full charts
- Tablet (640px-1024px): Stacked charts, single column KPIs
- Mobile (< 640px): Full-width everything, reduced padding `p-4`

---

## Section 1: Executive Summary Cards

### Component Structure
```typescript
interface ExecutiveSummary {
  careerDuration: number; // years
  companiesWorked: number;
  featuresShipped: number;
  testCoverage: number;
  productionUptime: number;
  securityFixesResolved: number;
  codeReviewsConducted: number;
  bugsfixed: number;
}
```

### Layout

**Header**:
- Title: `text-3xl font-bold text-gray-900 mb-1`
- Subtitle: "Key Performance Indicators at a glance" (text-gray-600)
- Date range: "As of [date]" (text-sm text-gray-500)

**Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`

**Summary Card** (8 cards):
```typescript
<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition hover:border-pink-300">
  {/* Top: Icon + Label */}
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
        {/* Icon */}
        <CalendarIcon className="w-6 h-6 text-pink-600" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </p>
      </div>
    </div>
  </div>
  
  {/* Value */}
  <p className="text-3xl font-bold text-gray-900 mb-2">
    {formatValue(value)}
  </p>
  
  {/* Context (years, companies, etc) */}
  <p className="text-sm text-gray-600">
    {contextLabel}
  </p>
  
  {/* Change indicator (optional) */}
  {trend && (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <p className="text-xs text-green-600 font-semibold">
        ↑ {trend}% vs last period
      </p>
    </div>
  )}
</div>
```

### Cards Content

| Icon | Label | Value | Context |
|------|-------|-------|---------|
| 📅 | Career Duration | 7+ years | Continuous growth |
| 🏢 | Companies Worked | 2 | Vetted organizations |
| 🚀 | Features Shipped | 50+ | Production ready |
| 📊 | Test Coverage | 90% | Quality standard |
| 🏆 | Production Uptime | 99.8% | Reliability focus |
| 🔐 | Security Fixes | 8 | Critical vulnerabilities |
| 👁️ | Code Reviews | 230 | Quality assurance |
| 🐛 | Bugs Fixed | 156 | Problem resolution |

### Mobile Adaptation
- Grid: `grid-cols-1 md:grid-cols-2` on smaller screens
- Card padding: `p-4` on mobile
- Icon: Smaller `w-10 h-10`

---

## Section 2: KPI Dashboard (With Charts)

### Component Structure
```typescript
interface KPIMetric {
  id: string;
  label: string;
  current: number;
  previousYear: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  chartType: 'line' | 'bar' | 'area';
  visualization?: ChartData[];
}
```

### Layout

**Grid**: `grid grid-cols-1 md:grid-cols-2 gap-6`

### KPI Card 1: Delivery Velocity

**Title**: "Features Delivered Per Year"

**Type**: Bar Chart (Recharts)

```typescript
<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-lg font-bold text-gray-900">Delivery Velocity</h3>
      <p className="text-sm text-gray-600">Features shipped per year</p>
    </div>
    <span className="text-3xl font-bold text-pink-600">47</span>
  </div>
  
  {/* Chart Container */}
  <div className="w-full h-64">
    <BarChart data={deliveryData} width={400} height={250}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis dataKey="year" stroke="#6b7280" />
      <YAxis stroke="#6b7280" />
      <Tooltip 
        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
      />
      <Legend />
      <Bar 
        dataKey="features" 
        fill="#ec4899" 
        name="Features Shipped"
        radius={[8, 8, 0, 0]}
      />
    </BarChart>
  </div>
  
  {/* Footer Stats */}
  <div className="mt-4 pt-4 border-t border-gray-200">
    <div className="flex justify-between">
      <span className="text-sm text-gray-600">Avg per year:</span>
      <span className="text-sm font-semibold text-gray-900">47 features</span>
    </div>
    <div className="flex justify-between mt-2">
      <span className="text-sm text-gray-600">Trend:</span>
      <span className="text-sm font-semibold text-green-600">↑ 15% growth</span>
    </div>
  </div>
</div>
```

### KPI Card 2: Quality Metrics

**Title**: "Test Coverage Trend"

**Type**: Line Chart (Recharts)

```typescript
<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-lg font-bold text-gray-900">Code Quality</h3>
      <p className="text-sm text-gray-600">Test coverage over time</p>
    </div>
    <span className="text-3xl font-bold text-blue-600">90%</span>
  </div>
  
  {/* Chart Container */}
  <div className="w-full h-64">
    <LineChart data={qualityData} width={400} height={250}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis dataKey="month" stroke="#6b7280" />
      <YAxis stroke="#6b7280" domain={[0, 100]} />
      <Tooltip 
        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
        formatter={(value) => `${value}%`}
      />
      <Legend />
      <Line 
        type="monotone" 
        dataKey="coverage" 
        stroke="#3b82f6" 
        strokeWidth={3}
        name="Test Coverage"
        dot={{ fill: '#3b82f6', r: 4 }}
        activeDot={{ r: 6 }}
      />
    </LineChart>
  </div>
  
  {/* Footer Stats */}
  <div className="mt-4 pt-4 border-t border-gray-200">
    <div className="flex justify-between">
      <span className="text-sm text-gray-600">Target:</span>
      <span className="text-sm font-semibold text-gray-900">95%</span>
    </div>
    <div className="flex justify-between mt-2">
      <span className="text-sm text-gray-600">Status:</span>
      <span className="text-sm font-semibold text-green-600">On track</span>
    </div>
  </div>
</div>
```

### KPI Card 3: Reliability

**Title**: "Production Uptime"

**Type**: Area Chart + Gauge (Recharts)

```typescript
<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-lg font-bold text-gray-900">System Reliability</h3>
      <p className="text-sm text-gray-600">Production uptime SLA</p>
    </div>
    <span className="text-3xl font-bold text-green-600">99.8%</span>
  </div>
  
  {/* Circular Progress Gauge */}
  <div className="flex justify-center mb-4">
    <svg viewBox="0 0 120 120" className="w-32 h-32">
      {/* Background circle */}
      <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
      
      {/* Progress circle */}
      <circle 
        cx="60" cy="60" r="50" fill="none" 
        stroke="#10b981" 
        strokeWidth="8"
        strokeDasharray={`${(99.8 / 100) * Math.PI * 100} ${Math.PI * 100}`}
        transform="rotate(-90 60 60)"
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s' }}
      />
      
      {/* Center text */}
      <text x="60" y="65" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1f2937">
        99.8%
      </text>
    </svg>
  </div>
  
  {/* Footer Stats */}
  <div className="mt-4 pt-4 border-t border-gray-200 text-center">
    <p className="text-sm text-gray-600 mb-2">Industry Standard: 99.9%</p>
    <p className="text-sm font-semibold text-green-600">✓ Exceeds target</p>
  </div>
</div>
```

### KPI Card 4: Security

**Title**: "Security Vulnerabilities Resolved"

**Type**: Bar Chart

```typescript
<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-lg font-bold text-gray-900">Security Posture</h3>
      <p className="text-sm text-gray-600">Critical vulnerabilities fixed</p>
    </div>
    <span className="text-3xl font-bold text-red-600">8</span>
  </div>
  
  {/* Chart */}
  <div className="w-full h-64">
    <BarChart data={securityData} width={400} height={250}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis dataKey="severity" stroke="#6b7280" />
      <YAxis stroke="#6b7280" />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#ef4444" name="Vulnerabilities" radius={[8, 8, 0, 0]} />
    </BarChart>
  </div>
  
  {/* Footer */}
  <div className="mt-4 pt-4 border-t border-gray-200">
    <p className="text-sm text-gray-600">All critical issues resolved ✓</p>
  </div>
</div>
```

---

## Section 3: Career Timeline (Data-Focused)

### Component Structure
```typescript
interface CareerPeriod {
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  duration: number; // months
  metrics: {
    featuresShipped?: number;
    bugsfixed?: number;
    codeReviews?: number;
  };
  keyAchievements: string[];
  skillsAcquired: string[];
}
```

### Layout

**Header**:
- Title: `text-2xl font-bold text-gray-900 mb-4`
- Subtitle: "Career progression and impact" (text-gray-600)

**Timeline Container**: Vertical layout with hover cards

```typescript
<div className="relative space-y-6">
  {/* Timeline line */}
  <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-600 to-pink-400" />
  
  {/* Timeline items */}
  {careerPeriods.map((period, idx) => (
    <div key={idx} className="relative pl-24">
      {/* Timeline dot */}
      <div className="absolute left-1 top-2 w-14 h-14 bg-white border-4 border-pink-600 rounded-full flex items-center justify-center">
        <span className="text-xl">🏢</span>
      </div>
      
      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition hover:border-pink-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{period.role}</h3>
            <p className="text-pink-600 font-semibold">{period.company}</p>
          </div>
          <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-full">
            {period.duration} months
          </span>
        </div>
        
        {/* Date range */}
        <p className="text-sm text-gray-600 mb-4">
          {formatDate(period.startDate)} - {period.endDate ? formatDate(period.endDate) : 'Present'}
        </p>
        
        {/* Key Metrics */}
        {period.metrics && (
          <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-200">
            {period.metrics.featuresShipped && (
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600">{period.metrics.featuresShipped}</p>
                <p className="text-xs text-gray-600">Features</p>
              </div>
            )}
            {period.metrics.bugsfixed && (
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600">{period.metrics.bugsfixed}</p>
                <p className="text-xs text-gray-600">Bugs Fixed</p>
              </div>
            )}
            {period.metrics.codeReviews && (
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600">{period.metrics.codeReviews}</p>
                <p className="text-xs text-gray-600">Reviews</p>
              </div>
            )}
          </div>
        )}
        
        {/* Achievements */}
        {period.keyAchievements.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">Key Achievements:</p>
            <ul className="space-y-1">
              {period.keyAchievements.map((achievement, aidx) => (
                <li key={aidx} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-pink-600">•</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Skills acquired */}
        {period.skillsAcquired.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {period.skillsAcquired.map((skill, sidx) => (
                <span 
                  key={sidx}
                  className="text-xs px-2 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  ))}
</div>
```

---

## Section 4: Technical Proficiency Matrix

### Component Structure
```typescript
interface SkillMatrix {
  category: string;
  skills: Array<{
    name: string;
    yearsOfExperience: number;
    proficiency: 1-5;
  }>;
}
```

### Layout

**Header**:
- Title: `text-2xl font-bold text-gray-900 mb-4`
- Subtitle: "Expertise depth across technology domains" (text-gray-600)

**Grid Heatmap** (Recharts or custom):

```typescript
<div className="bg-white border border-gray-200 rounded-lg p-6">
  {/* Legend */}
  <div className="mb-6 flex items-center gap-4 justify-center">
    <span className="text-xs font-semibold text-gray-600">Proficiency:</span>
    {[1, 2, 3, 4, 5].map(level => (
      <div key={level} className="flex items-center gap-2">
        <div 
          className="w-6 h-6 rounded" 
          style={{ backgroundColor: getProficiencyColor(level) }}
        />
        <span className="text-xs text-gray-600">{getProficiencyLabel(level)}</span>
      </div>
    ))}
  </div>
  
  {/* Heatmap Table */}
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left text-xs font-semibold text-gray-700 py-2 px-3">Technology</th>
          <th className="text-center text-xs font-semibold text-gray-700 py-2 px-3">Proficiency</th>
          <th className="text-center text-xs font-semibold text-gray-700 py-2 px-3">Years</th>
        </tr>
      </thead>
      <tbody>
        {skillMatrix.map((skill, idx) => (
          <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="text-sm text-gray-900 py-3 px-3">{skill.name}</td>
            
            {/* Proficiency visual */}
            <td className="text-center py-3 px-3">
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map(level => (
                  <div
                    key={level}
                    className="w-6 h-6 rounded-sm transition"
                    style={{
                      backgroundColor: level <= skill.proficiency 
                        ? getProficiencyColor(level)
                        : '#e5e7eb'
                    }}
                  />
                ))}
              </div>
            </td>
            
            {/* Years */}
            <td className="text-center text-sm font-semibold text-gray-900 py-3 px-3">
              {skill.yearsOfExperience}y
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
```

**Proficiency Color Scheme**:
- 1 (Beginner): `#fed7aa` (amber-200)
- 2 (Intermediate): `#fca5a5` (rose-200)
- 3 (Proficient): `#fca5a5` (rose-300)
- 4 (Expert): `#f87171` (red-400)
- 5 (Mastery): `#dc2626` (red-600)

---

## Section 5: Experience Overview

### Component Structure
```typescript
interface ExperienceMetrics {
  companyName: string;
  role: string;
  tenure: string;
  location: string;
  metrics: {
    featuresShipped: number;
    bugsfixed: number;
    codeReviews: number;
  };
}
```

### Layout

**Header**:
- Title: `text-2xl font-bold text-gray-900 mb-4`
- Subtitle: "Company-wise contributions" (text-gray-600)

**Grid**: `grid grid-cols-1 md:grid-cols-2 gap-4`

**Company Card**:
```typescript
<div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
  {/* Header */}
  <div className="flex items-start justify-between mb-4">
    <div>
      <h3 className="text-lg font-bold text-gray-900">{exp.companyName}</h3>
      <p className="text-pink-600 font-semibold text-sm">{exp.role}</p>
    </div>
    <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
      {exp.tenure}
    </span>
  </div>
  
  {/* Location */}
  <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
    📍 {exp.location}
  </p>
  
  {/* Metrics Grid */}
  <div className="grid grid-cols-3 gap-3">
    <div className="text-center p-3 bg-pink-50 rounded-lg">
      <p className="text-2xl font-bold text-pink-600">{exp.metrics.featuresShipped}</p>
      <p className="text-xs text-gray-600">Features</p>
    </div>
    <div className="text-center p-3 bg-blue-50 rounded-lg">
      <p className="text-2xl font-bold text-blue-600">{exp.metrics.bugsfixed}</p>
      <p className="text-xs text-gray-600">Bugs Fixed</p>
    </div>
    <div className="text-center p-3 bg-green-50 rounded-lg">
      <p className="text-2xl font-bold text-green-600">{exp.metrics.codeReviews}</p>
      <p className="text-xs text-gray-600">Reviews</p>
    </div>
  </div>
</div>
```

---

## Section 6: Export & Download

### Component Structure

**Header**:
- Title: `text-2xl font-bold text-gray-900 mb-4`
- Subtitle: "Export dashboard insights and data" (text-gray-600)

**Export Options Grid**: `grid grid-cols-1 md:grid-cols-3 gap-6`

### Option 1: Export Dashboard as PDF

```typescript
<div className="bg-white border border-gray-200 rounded-lg p-6">
  <div className="flex items-center gap-3 mb-4">
    <FileText className="w-8 h-8 text-pink-600" />
    <div>
      <h3 className="font-bold text-gray-900">Dashboard PDF</h3>
      <p className="text-sm text-gray-600">Full dashboard with charts</p>
    </div>
  </div>
  
  <button className="w-full px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition">
    📥 Export to PDF
  </button>
  
  <p className="text-xs text-gray-600 mt-2">
    Includes: KPIs, charts, career timeline, metrics (2-3 pages)
  </p>
</div>
```

### Option 2: Export Data as CSV

```typescript
<div className="bg-white border border-gray-200 rounded-lg p-6">
  <div className="flex items-center gap-3 mb-4">
    <Sheet className="w-8 h-8 text-blue-600" />
    <div>
      <h3 className="font-bold text-gray-900">Data Export (CSV)</h3>
      <p className="text-sm text-gray-600">Raw metrics and experience</p>
    </div>
  </div>
  
  <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
    📊 Export to CSV
  </button>
  
  <p className="text-xs text-gray-600 mt-2">
    Includes: Skills, experience, metrics, achievements
  </p>
</div>
```

### Option 3: Generate Executive Summary

```typescript
<div className="bg-white border border-gray-200 rounded-lg p-6">
  <div className="flex items-center gap-3 mb-4">
    <Award className="w-8 h-8 text-green-600" />
    <div>
      <h3 className="font-bold text-gray-900">Executive Summary</h3>
      <p className="text-sm text-gray-600">1-page professional brief</p>
    </div>
  </div>
  
  <button className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
    📄 Generate Summary
  </button>
  
  <p className="text-xs text-gray-600 mt-2">
    Key achievements, metrics, and recommendations (1 page)
  </p>
</div>
```

---

## Styling & Design System

### Color Palette
- **Background**: White (#ffffff) to Gray-50 (#f9fafb)
- **Cards**: White (#ffffff)
- **Borders**: Gray-200 (#e5e7eb)
- **Primary Text**: Gray-900 (#1f2937)
- **Secondary Text**: Gray-600 (#4b5563)
- **Tertiary Text**: Gray-500 (#6b7280)
- **Accent**: Pink-600 (#ec4899)
- **Chart Colors**:
  - Primary: Pink-600 (#ec4899)
  - Secondary: Blue-600 (#2563eb)
  - Tertiary: Green-600 (#16a34a)
  - Alert: Red-600 (#dc2626)

### Typography (Professional)
- **Headers**: Bold gray-900, `text-2xl` or `text-3xl`
- **Card Titles**: `text-lg font-bold text-gray-900`
- **Labels**: `text-xs font-semibold text-gray-700 uppercase`
- **Body Text**: `text-sm text-gray-700`
- **Meta Text**: `text-xs text-gray-600`
- **Values**: `text-2xl or text-3xl font-bold text-gray-900`

### Components
- **Cards**: `bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg`
- **Buttons**: Primary (pink-600), Secondary (gray-200), Ghost (pink text)
- **Charts**: Recharts with custom styling
- **Gauges**: SVG circles with stroke-dasharray

### Spacing
- **Section gaps**: `space-y-8` or `mb-8`
- **Card padding**: `p-6`
- **Grid gaps**: `gap-6` or `gap-4`
- **Element gaps**: `gap-3` or `gap-2`

### Shadows
- **Default**: `shadow-sm`
- **Hover**: `hover:shadow-lg transition`
- **Charts**: No shadow, clean white bg

### Animations
- **Hover lift**: `hover:shadow-lg hover:-translate-y-1 transition`
- **Transitions**: `transition-all duration-300`
- **No heavy animations** (keep professional)

---

## Data Visualization (Recharts)

### Chart Styling Defaults
```typescript
const chartConfig = {
  margin: { top: 5, right: 30, left: 0, bottom: 5 },
  stroke: '#e5e7eb',
  textColor: '#6b7280',
  cartesianGrid: { strokeDasharray: '3 3', stroke: '#e5e7eb' },
  tooltip: { 
    contentStyle: { backgroundColor: '#fff', border: '1px solid #e5e7eb' },
    cursor: { fill: 'rgba(236, 72, 153, 0.1)' }
  },
};
```

### Colors by Category
- **Delivery**: Pink-600
- **Quality**: Blue-600
- **Reliability**: Green-600
- **Security**: Red-600

---

## Testing Checklist

- [ ] KPI cards display correct values and trends
- [ ] Charts render correctly (Recharts integration)
- [ ] Career timeline displays all periods with metrics
- [ ] Skills proficiency matrix shows correct colors
- [ ] Heatmap cells update based on proficiency level
- [ ] Experience overview shows all companies
- [ ] Export PDF button generates valid PDF
- [ ] Export CSV button generates correct CSV format
- [ ] All numbers format correctly (thousands separator)
- [ ] Dates format consistently
- [ ] Mobile layout stacks correctly
- [ ] Hover states work on all interactive elements
- [ ] Color contrast meets WCAG AA
- [ ] Responsive grid adjusts at breakpoints
- [ ] Charts responsive on smaller screens
- [ ] No console errors

---

## Future Enhancements

1. **Comparison**: Compare metrics across time periods
2. **Benchmarking**: Compare against industry standards
3. **Predictions**: AI-powered trend forecasting
4. **Drill-down**: Click on chart to see detailed breakdown
5. **Annotations**: Add notes/annotations to timeline
6. **Custom Reports**: User-defined report generation
7. **Share**: Generate shareable dashboard snapshot link
8. **Integrations**: Connect to GitHub, Jira for live metrics
