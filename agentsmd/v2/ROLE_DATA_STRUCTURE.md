# Role Data Structure & Filtering

## Overview

This document defines the TypeScript types, data filtering functions, and role-based computed properties for the portfolio system. All data is sourced from `lib/data.ts` and filtered based on the selected role.

---

## Core Role Types

### UserRole Type

```typescript
// types/role.ts or lib/role-types.ts

export type UserRole = 'hr' | 'technical' | 'manager';

export interface RoleConfig {
  id: UserRole;
  name: string;
  description: string;
  icon: string;
  color: string;
  displayName: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  hr: {
    id: 'hr',
    name: 'HR',
    description: 'Recruitment-focused view of experience and skills',
    icon: '👤',
    color: 'pink',
    displayName: 'HR Dashboard',
  },
  technical: {
    id: 'technical',
    name: 'Technical User',
    description: 'Backend engineer showcase with API playground',
    icon: '💻',
    color: 'cyan',
    displayName: 'Technical Dashboard',
  },
  manager: {
    id: 'manager',
    name: 'Manager/Director',
    description: 'Executive-level metrics and performance data',
    icon: '📊',
    color: 'indigo',
    displayName: 'Manager Dashboard',
  },
};
```

---

## Data Structure Extensions

### Skill Type (Extended)

```typescript
// Existing type in lib/data.ts
interface Skill {
  name: string;
  category: string;
  proficiency: 1 | 2 | 3 | 4 | 5;
  yearsOfExperience: number;
  endorsed?: number;
}

// Extended for role-based display
interface SkillWithDifficulty extends Skill {
  difficulty?: 'easy' | 'medium' | 'hard'; // For Technical role (API playground)
  category: 'Languages' | 'Frameworks' | 'Databases' | 'Tools' | 'DevOps';
}
```

### Experience Type (Extended)

```typescript
interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string; // "2020-01"
  endDate: string | null; // "2023-06" or null for current
  description: string;
  achievements: string[];
  skills: string[];
  type: 'full-time' | 'contract' | 'internship' | 'freelance';
  
  // Extended fields for role-based views
  metrics?: {
    featuresShipped?: number;
    bugsfixed?: number;
    codeReviews?: number;
    securityFixes?: number;
  };
}
```

### Achievement/Badge Type (For Technical Role)

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number; // 0-100 for locked badges
  requirement: string;
  category: 'security' | 'delivery' | 'quality' | 'reliability';
}

// Achievement definitions
export const ACHIEVEMENTS: Record<string, Achievement> = {
  security_hero: {
    id: 'security_hero',
    name: 'Security Hero',
    description: 'Resolved 8+ vulnerabilities',
    icon: '🔐',
    unlocked: true,
    unlockedDate: '2023-06-15',
    requirement: '8+ security fixes',
    category: 'security',
  },
  feature_shipped: {
    id: 'feature_shipped',
    name: 'Feature Shipped',
    description: '50+ features deployed',
    icon: '🚀',
    unlocked: true,
    unlockedDate: '2023-08-20',
    requirement: '50+ features shipped',
    category: 'delivery',
  },
  bug_squasher: {
    id: 'bug_squasher',
    name: 'Bug Squasher',
    description: '150+ bugs fixed',
    icon: '🐛',
    unlocked: true,
    unlockedDate: '2023-09-10',
    requirement: '150+ bugs fixed',
    category: 'quality',
  },
  code_reviewer: {
    id: 'code_reviewer',
    name: 'Code Reviewer',
    description: '200+ code reviews',
    icon: '📝',
    unlocked: true,
    unlockedDate: '2023-07-05',
    requirement: '200+ code reviews',
    category: 'quality',
  },
  system_reliability: {
    id: 'system_reliability',
    name: 'System Reliability',
    description: '99.8%+ uptime',
    icon: '🏆',
    unlocked: true,
    unlockedDate: '2023-10-01',
    requirement: '99.8%+ uptime',
    category: 'reliability',
  },
};
```

### Metrics Type (For Manager Role)

```typescript
interface PortfolioMetrics {
  careerDuration: number; // years
  companiesWorked: number;
  featuresShipped: number;
  testCoverage: number; // percentage
  productionUptime: number; // percentage
  securityFixesResolved: number;
  codeReviewsConducted: number;
  bugsfixed: number;
  linesOfCodeWritten: number;
}

// In lib/data.ts
export const metrics: PortfolioMetrics = {
  careerDuration: 7,
  companiesWorked: 2,
  featuresShipped: 47,
  testCoverage: 90,
  productionUptime: 99.8,
  securityFixesResolved: 8,
  codeReviewsConducted: 230,
  bugsfixed: 156,
  linesOfCodeWritten: 30000,
};
```

---

## Role-Based Data Filtering Functions

### Filter by Role Helper

```typescript
// lib/role-utils.ts

import { UserRole } from '@/types/role';
import { Skill, Experience } from '@/lib/data';

/**
 * Get data subset appropriate for each role
 */
export function getDataForRole(role: UserRole, allData: AllPortfolioData) {
  switch (role) {
    case 'hr':
      return filterDataForHR(allData);
    case 'technical':
      return filterDataForTechnical(allData);
    case 'manager':
      return filterDataForManager(allData);
    default:
      return allData;
  }
}

// ========== HR ROLE ==========

/**
 * Filter data for HR/Recruitment view
 * Include: All skills, full experience, education, contact info
 * Exclude: Internal metrics, gamification
 */
function filterDataForHR(data: AllPortfolioData) {
  return {
    profile: data.profile,
    skills: data.skills, // All skills
    experience: data.experience, // Full experience with achievements
    education: data.education,
    contact: data.contact, // Full contact visibility
    metrics: {
      linesOfCodeWritten: data.metrics.linesOfCodeWritten,
      bugsfixed: data.metrics.bugsfixed,
      securityFixesResolved: data.metrics.securityFixesResolved,
      featuresShipped: data.metrics.featuresShipped,
      codeReviewsConducted: data.metrics.codeReviewsConducted,
    },
  };
}

// ========== TECHNICAL ROLE ==========

/**
 * Filter data for Technical/Engineer view
 * Include: All skills, achievements, gamification, API endpoints
 * Exclude: Management-level metrics (uptime, business KPIs)
 */
function filterDataForTechnical(data: AllPortfolioData) {
  return {
    profile: data.profile,
    skills: data.skills.map(skill => ({
      ...skill,
      // Add difficulty level for API playground
      difficulty: calculateDifficulty(skill),
    })),
    experience: data.experience,
    achievements: Object.values(ACHIEVEMENTS), // All badge data
    metrics: {
      linesOfCodeWritten: data.metrics.linesOfCodeWritten,
      bugsfixed: data.metrics.bugsfixed,
      securityFixesResolved: data.metrics.securityFixesResolved,
      featuresShipped: data.metrics.featuresShipped,
      codeReviewsConducted: data.metrics.codeReviewsConducted,
      testCoverage: data.metrics.testCoverage,
    },
    apiPlaygroundEndpoints: getAPIEndpoints(), // From existing API Playground data
  };
}

// ========== MANAGER ROLE ==========

/**
 * Filter data for Manager/Director view
 * Include: High-level metrics, KPIs, trends, visualizations
 * Exclude: Detailed skill lists (summaries only), granular contact info
 */
function filterDataForManager(data: AllPortfolioData) {
  return {
    profile: {
      name: data.profile.name,
      title: data.profile.title,
      summary: data.profile.summary,
      // Exclude: Full contact details for privacy
    },
    metrics: data.metrics, // All metrics
    experience: data.experience.map(exp => ({
      id: exp.id,
      company: exp.company,
      role: exp.role,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      metrics: exp.metrics, // Include metrics if available
      achievements: exp.achievements,
    })),
    skillsSummary: {
      topSkills: getTopSkills(data.skills, 15),
      skillsByCategory: groupSkillsByCategory(data.skills),
      averageProficiency: calculateAverageProficiency(data.skills),
    },
    careerAnalytics: {
      totalExperience: data.metrics.careerDuration,
      companiesWorked: data.metrics.companiesWorked,
      tenureByCompany: calculateTenureByCompany(data.experience),
      roleProgression: analyzeRoleProgression(data.experience),
    },
  };
}
```

### Filtering Utilities

```typescript
// lib/role-utils.ts (continued)

/**
 * Get top N skills by proficiency
 */
export function getTopSkills(skills: Skill[], limit: number = 10): Skill[] {
  return skills
    .sort((a, b) => {
      if (b.proficiency !== a.proficiency) {
        return b.proficiency - a.proficiency;
      }
      return b.yearsOfExperience - a.yearsOfExperience;
    })
    .slice(0, limit);
}

/**
 * Group skills by category
 */
export function groupSkillsByCategory(
  skills: Skill[]
): Record<string, Skill[]> {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
}

/**
 * Calculate average proficiency across all skills
 */
export function calculateAverageProficiency(skills: Skill[]): number {
  if (skills.length === 0) return 0;
  const sum = skills.reduce((acc, skill) => acc + skill.proficiency, 0);
  return parseFloat((sum / skills.length).toFixed(1));
}

/**
 * Calculate tenure by company
 */
export function calculateTenureByCompany(experience: Experience[]) {
  return experience.map(exp => ({
    company: exp.company,
    tenure: {
      startDate: exp.startDate,
      endDate: exp.endDate || 'Present',
      months: calculateMonthsDifference(exp.startDate, exp.endDate),
    },
  }));
}

/**
 * Analyze role progression over career
 */
export function analyzeRoleProgression(experience: Experience[]) {
  return experience.map((exp, idx) => ({
    position: idx + 1,
    company: exp.company,
    role: exp.role,
    startDate: exp.startDate,
    endDate: exp.endDate,
    seniority: inferSeniority(exp.role),
  }));
}

/**
 * Infer seniority level from role title
 */
function inferSeniority(role: string): 'junior' | 'mid' | 'senior' | 'lead' {
  const roleLower = role.toLowerCase();
  if (roleLower.includes('junior') || roleLower.includes('intern')) return 'junior';
  if (roleLower.includes('senior') || roleLower.includes('lead')) return 'senior';
  if (roleLower.includes('principal') || roleLower.includes('staff')) return 'lead';
  return 'mid';
}

/**
 * Calculate difficulty for skill (for API playground)
 */
function calculateDifficulty(skill: Skill): 'easy' | 'medium' | 'hard' {
  if (skill.proficiency <= 2) return 'easy';
  if (skill.proficiency <= 3) return 'medium';
  return 'hard';
}

/**
 * Calculate months between two dates
 */
function calculateMonthsDifference(startDate: string, endDate: string | null): number {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  
  return Math.max(0, months);
}
```

---

## Role Context Implementation

### Complete RoleContext with Data

```typescript
// context/RoleContext.tsx

'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole, ROLE_CONFIGS } from '@/types/role';
import { getDataForRole } from '@/lib/role-utils';
import * as portfolioData from '@/lib/data';

interface RoleContextType {
  selectedRole: UserRole | null;
  isLoading: boolean;
  
  // Role management
  setSelectedRole: (role: UserRole) => void;
  changeRole: () => void;
  getRoleName: (role: UserRole) => string;
  getRoleDescription: (role: UserRole) => string;
  
  // Role-specific data accessors
  getRoleData: () => any; // Returns filtered data for current role
  getSkillsForRole: () => Skill[];
  getExperienceForRole: () => Experience[];
  getMetricsForRole: () => Metrics;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [selectedRole, setSelectedRoleState] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('selectedRole') as UserRole | null;
    const validRoles: UserRole[] = ['hr', 'technical', 'manager'];
    
    if (storedRole && validRoles.includes(storedRole)) {
      setSelectedRoleState(storedRole);
    }
    setIsLoading(false);
  }, []);

  // Update localStorage when role changes
  const setSelectedRole = (role: UserRole) => {
    setSelectedRoleState(role);
    localStorage.setItem('selectedRole', role);
    router.push(`/dashboard/${role}`);
  };

  // Navigate to role picker
  const changeRole = () => {
    router.push('/roles');
  };

  // Role name/description helpers
  const getRoleName = (role: UserRole) => ROLE_CONFIGS[role].displayName;
  const getRoleDescription = (role: UserRole) => ROLE_CONFIGS[role].description;

  // Get filtered data for current role (memoized)
  const getRoleData = useMemo(() => {
    return () => {
      if (!selectedRole) return null;
      return getDataForRole(selectedRole, {
        profile: portfolioData.profile,
        skills: portfolioData.skills,
        experience: portfolioData.experience,
        education: portfolioData.education,
        contact: portfolioData.contact,
        metrics: portfolioData.metrics,
      });
    };
  }, [selectedRole]);

  // Convenience accessors
  const getSkillsForRole = useMemo(() => {
    return () => {
      const data = getRoleData();
      return data?.skills || [];
    };
  }, [getRoleData]);

  const getExperienceForRole = useMemo(() => {
    return () => {
      const data = getRoleData();
      return data?.experience || [];
    };
  }, [getRoleData]);

  const getMetricsForRole = useMemo(() => {
    return () => {
      const data = getRoleData();
      return data?.metrics || {};
    };
  }, [getRoleData]);

  const value: RoleContextType = {
    selectedRole,
    isLoading,
    setSelectedRole,
    changeRole,
    getRoleName,
    getRoleDescription,
    getRoleData,
    getSkillsForRole,
    getExperienceForRole,
    getMetricsForRole,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
}
```

---

## Usage Examples

### In HR Dashboard Component

```typescript
// app/dashboard/hr/page.tsx

'use client';

import { useRole } from '@/context/RoleContext';

export default function HRDashboard() {
  const { getSkillsForRole, getExperienceForRole, getMetricsForRole } = useRole();

  const skills = getSkillsForRole();
  const experience = getExperienceForRole();
  const metrics = getMetricsForRole();

  return (
    <div>
      <h1>HR Dashboard</h1>
      
      {/* Skills Browser */}
      <SkillsBrowser skills={skills} />
      
      {/* Experience Timeline */}
      <ExperienceTimeline experience={experience} />
      
      {/* Metrics */}
      <AchievementsMetrics metrics={metrics} />
    </div>
  );
}
```

### In Technical Dashboard Component

```typescript
// app/dashboard/technical/page.tsx

'use client';

import { useRole } from '@/context/RoleContext';

export default function TechnicalDashboard() {
  const { getRoleData, getSkillsForRole } = useRole();

  const roleData = getRoleData();
  const skills = getSkillsForRole(); // Includes difficulty levels
  const achievements = roleData?.achievements || [];

  return (
    <div>
      <h1>Technical Dashboard</h1>
      
      {/* Achievement Dashboard */}
      <AchievementDashboard achievements={achievements} />
      
      {/* Leaderboard Stats */}
      <LeaderboardStats metrics={roleData?.metrics} />
      
      {/* API Playground (gamified) */}
      <APIPlaygroundGamified 
        endpoints={roleData?.apiPlaygroundEndpoints}
        skills={skills}
      />
    </div>
  );
}
```

### In Manager Dashboard Component

```typescript
// app/dashboard/manager/page.tsx

'use client';

import { useRole } from '@/context/RoleContext';

export default function ManagerDashboard() {
  const { getRoleData } = useRole();

  const roleData = getRoleData();
  const { metrics, experience, skillsSummary, careerAnalytics } = roleData || {};

  return (
    <div>
      <h1>Manager Dashboard</h1>
      
      {/* Executive Summary */}
      <ExecutiveSummary metrics={metrics} />
      
      {/* KPI Dashboard */}
      <KPIDashboard metrics={metrics} />
      
      {/* Career Timeline */}
      <CareerTimeline experience={experience} />
      
      {/* Skills Summary */}
      <SkillsSummary skillsSummary={skillsSummary} />
      
      {/* Career Analytics */}
      <CareerAnalytics careerAnalytics={careerAnalytics} />
    </div>
  );
}
```

---

## Testing Data Structure

### Sample Data Setup

```typescript
// lib/data.ts (additions)

export const portfolioData = {
  profile: {
    name: 'Garry Stevens',
    title: 'Backend Engineer',
    email: 'stevens.garrys@gmail.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Experienced backend engineer with 7+ years of experience...',
  },

  skills: [
    {
      name: 'TypeScript',
      category: 'Languages',
      proficiency: 5,
      yearsOfExperience: 4,
    },
    {
      name: 'Node.js',
      category: 'Frameworks',
      proficiency: 5,
      yearsOfExperience: 5,
    },
    {
      name: 'PostgreSQL',
      category: 'Databases',
      proficiency: 4,
      yearsOfExperience: 6,
    },
    // ... more skills
  ],

  experience: [
    {
      id: 'exp1',
      company: 'Unit4',
      role: 'Senior Backend Engineer',
      location: 'Amsterdam, Netherlands',
      startDate: '2021-03',
      endDate: null,
      description: '...',
      achievements: ['...'],
      skills: ['TypeScript', 'Node.js', 'PostgreSQL'],
      type: 'full-time',
      metrics: {
        featuresShipped: 35,
        bugsfixed: 89,
        codeReviews: 120,
      },
    },
    // ... more experience
  ],

  metrics: {
    careerDuration: 7,
    companiesWorked: 2,
    featuresShipped: 47,
    testCoverage: 90,
    productionUptime: 99.8,
    securityFixesResolved: 8,
    codeReviewsConducted: 230,
    bugsfixed: 156,
    linesOfCodeWritten: 30000,
  },
};
```

---

## TypeScript Type Exports

```typescript
// types/index.ts or lib/data.ts

export type UserRole = 'hr' | 'technical' | 'manager';

export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

export interface Skill {
  name: string;
  category: string;
  proficiency: 1 | 2 | 3 | 4 | 5;
  yearsOfExperience: number;
  endorsed?: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  achievements: string[];
  skills: string[];
  type: 'full-time' | 'contract' | 'internship' | 'freelance';
  metrics?: {
    featuresShipped?: number;
    bugsfixed?: number;
    codeReviews?: number;
    securityFixes?: number;
  };
}

export interface Metrics {
  careerDuration: number;
  companiesWorked: number;
  featuresShipped: number;
  testCoverage: number;
  productionUptime: number;
  securityFixesResolved: number;
  codeReviewsConducted: number;
  bugsfixed: number;
  linesOfCodeWritten: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  requirement: string;
  category: 'security' | 'delivery' | 'quality' | 'reliability';
}
```

---

## Testing Checklist

- [ ] RoleContext initializes with no role selected
- [ ] RoleContext loads role from localStorage on mount
- [ ] setSelectedRole updates localStorage
- [ ] setSelectedRole triggers navigation
- [ ] changeRole navigates to /roles
- [ ] getRoleData returns different data for each role
- [ ] HR data includes full contact info
- [ ] Technical data includes achievements and API endpoints
- [ ] Manager data excludes detailed contact info
- [ ] getSkillsForRole returns skills in correct order
- [ ] getExperienceForRole returns experience with metrics
- [ ] getMetricsForRole returns all metrics
- [ ] Data filtering doesn't mutate original data
- [ ] Memoization prevents unnecessary recalculations
- [ ] All TypeScript types compile without errors
- [ ] useRole hook works in components
- [ ] Invalid roles are cleared from localStorage
