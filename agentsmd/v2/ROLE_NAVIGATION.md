# Role Navigation & Routing Specifications

## Overview

This document defines the navigation structure, routing patterns, sidebar integration, and role-switching flow for the role-based portfolio system.

---

## Route Architecture

### URL Structure

```
/                           → Redirect to /roles (if no role selected)
/roles                      → Role picker page (glassmorphic cards)
/dashboard/hr               → HR dashboard
/dashboard/technical        → Technical user dashboard
/dashboard/manager          → Manager/Director dashboard
/dashboard                  → Redirect to role-specific dashboard (based on stored role)
```

### Route Handling in Next.js App Router

**File Structure**:
```
app/
├── page.tsx                    // Root: redirects to /roles or last selected role
├── roles/
│   └── page.tsx                // Role picker page
├── dashboard/
│   ├── page.tsx                // Redirect to role-specific dashboard
│   ├── hr/
│   │   └── page.tsx            // HR dashboard
│   ├── technical/
│   │   └── page.tsx            // Technical dashboard
│   └── manager/
│       └── page.tsx            // Manager dashboard
└── layout.tsx                  // Root layout with sidebar + role context
```

### Root Page Redirect Logic

```typescript
// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';

export default function Home() {
  const router = useRouter();
  const { selectedRole } = useRole();

  useEffect(() => {
    if (selectedRole) {
      // User has selected a role, redirect to their dashboard
      router.replace(`/dashboard/${selectedRole}`);
    } else {
      // No role selected, show role picker
      router.replace('/roles');
    }
  }, [selectedRole, router]);

  return null; // This page doesn't render, just redirects
}
```

### Dashboard Redirect Logic

```typescript
// app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';

export default function DashboardPage() {
  const router = useRouter();
  const { selectedRole } = useRole();

  useEffect(() => {
    if (selectedRole) {
      router.replace(`/dashboard/${selectedRole}`);
    } else {
      router.replace('/roles');
    }
  }, [selectedRole, router]);

  return null;
}
```

---

## Role Context & State Management

### RoleContext TypeScript Interface

```typescript
// context/RoleContext.tsx

export type UserRole = 'hr' | 'technical' | 'manager';

interface RoleContextType {
  selectedRole: UserRole | null;
  isLoading: boolean;
  setSelectedRole: (role: UserRole) => void;
  changeRole: () => void; // Navigate to role picker
  getRoleName: (role: UserRole) => string;
  getRoleDescription: (role: UserRole) => string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);
```

### RoleProvider Component

```typescript
// context/RoleContext.tsx

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'hr' | 'technical' | 'manager';

interface RoleContextType {
  selectedRole: UserRole | null;
  isLoading: boolean;
  setSelectedRole: (role: UserRole) => void;
  changeRole: () => void;
  getRoleName: (role: UserRole) => string;
  getRoleDescription: (role: UserRole) => string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_CONFIG: Record<UserRole, { name: string; description: string }> = {
  hr: {
    name: 'HR Dashboard',
    description: 'Recruitment-focused view of experience and skills',
  },
  technical: {
    name: 'Technical Dashboard',
    description: 'Backend engineer showcase with API playground',
  },
  manager: {
    name: 'Manager Dashboard',
    description: 'Executive-level metrics and performance data',
  },
};

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [selectedRole, setSelectedRoleState] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('selectedRole') as UserRole | null;
    if (storedRole && ['hr', 'technical', 'manager'].includes(storedRole)) {
      setSelectedRoleState(storedRole);
    }
    setIsLoading(false);
  }, []);

  // Update localStorage when role changes
  const setSelectedRole = (role: UserRole) => {
    setSelectedRoleState(role);
    localStorage.setItem('selectedRole', role);
    // Auto-redirect to dashboard
    router.push(`/dashboard/${role}`);
  };

  // Navigate to role picker to change role
  const changeRole = () => {
    router.push('/roles');
  };

  const getRoleName = (role: UserRole) => ROLE_CONFIG[role].name;
  const getRoleDescription = (role: UserRole) => ROLE_CONFIG[role].description;

  const value: RoleContextType = {
    selectedRole,
    isLoading,
    setSelectedRole,
    changeRole,
    getRoleName,
    getRoleDescription,
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

## Sidebar Navigation

### Sidebar Component Structure

```typescript
// components/Sidebar.tsx

'use client';

import { useRole } from '@/context/RoleContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Settings, LogOut } from 'lucide-react';

export function Sidebar() {
  const { selectedRole, getRoleName, changeRole } = useRole();
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo & Branding */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Portfolio</h1>
        <p className="text-xs text-gray-600 mt-1">
          {selectedRole ? getRoleName(selectedRole as any) : 'Select Role'}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {selectedRole && (
          <>
            <NavLink
              href={`/dashboard/${selectedRole}`}
              label="Dashboard"
              isActive={pathname === `/dashboard/${selectedRole}`}
              icon="📊"
            />

            {selectedRole === 'hr' && (
              <>
                <NavLink href="#" label="Experience" icon="💼" />
                <NavLink href="#" label="Skills" icon="🔧" />
              </>
            )}

            {selectedRole === 'technical' && (
              <>
                <NavLink href="#" label="Achievements" icon="🏆" />
                <NavLink href="#" label="API Playground" icon="🔌" />
              </>
            )}

            {selectedRole === 'manager' && (
              <>
                <NavLink href="#" label="Analytics" icon="📈" />
                <NavLink href="#" label="Career Timeline" icon="📅" />
              </>
            )}
          </>
        )}
      </nav>

      {/* Footer: Change Role Button */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={changeRole}
          className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          Change Role
        </button>

        {/* Optional: Settings & Logout */}
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition flex items-center justify-center gap-1">
            <Settings className="w-4 h-4" />
            <span className="text-xs">Settings</span>
          </button>
          <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition flex items-center justify-center gap-1">
            <LogOut className="w-4 h-4" />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  icon?: string;
  isActive?: boolean;
}

function NavLink({ href, label, icon, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg transition ${
        isActive
          ? 'bg-pink-100 text-pink-700 font-semibold border-l-4 border-pink-600'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
    </Link>
  );
}
```

---

## Layout Integration

### Root Layout with Sidebar & RoleProvider

```typescript
// app/layout.tsx

import type { Metadata } from 'next';
import { RoleProvider } from '@/context/RoleContext';
import { Sidebar } from '@/components/Sidebar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portfolio - Role-Based',
  description: 'Interactive portfolio showcasing backend engineering expertise',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RoleProvider>
          <Sidebar />
          <main className="ml-64 min-h-screen bg-white">
            {children}
          </main>
        </RoleProvider>
      </body>
    </html>
  );
}
```

### Mobile-Responsive Layout

For mobile (< 640px), sidebar should collapse/hide:

```css
/* app/globals.css */

@media (max-width: 640px) {
  aside.sidebar {
    position: fixed;
    left: -100%;
    transition: left 0.3s ease;
    width: 80%;
    height: 100vh;
    z-index: 1000;
  }

  aside.sidebar.open {
    left: 0;
  }

  main {
    margin-left: 0;
  }
}
```

---

## Role Selection Flow

### Step-by-Step User Journey

1. **User Lands on App**
   - Root page `/` checks `selectedRole` in Context
   - If no role: Redirect to `/roles`
   - If role exists: Redirect to `/dashboard/{role}`

2. **User at Role Picker** (`/roles`)
   - Sees 3 glassmorphic cards (HR, Technical, Manager)
   - Clicks on a card
   - `setSelectedRole(role)` is called
   - Role saved to localStorage
   - User auto-redirected to `/dashboard/{role}`

3. **User at Dashboard**
   - Sidebar shows current role in header
   - "Change Role" button visible in sidebar footer
   - User can continue using dashboard or click "Change Role"

4. **User Clicks Change Role**
   - `changeRole()` navigates to `/roles`
   - Role picker appears again
   - User can select same or different role

### Navigation Context Flow

```
┌─────────────┐
│   App Loads │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ Check selectedRole   │
│ in localStorage      │
└──────┬───────────────┘
       │
   ┌───┴───┐
   │       │
NO │       │ YES
   │       │
   ▼       ▼
┌────┐  ┌────────────────┐
│    │  │ Redirect to    │
│/   │  │ /dashboard/    │
│    │  │ {role}         │
└─┬──┘  └────────────────┘
  │
  ▼
┌──────────────┐
│   /roles     │
│  (Picker)    │
└───┬──────────┘
    │
    │ User selects role
    │
    ▼
┌──────────────────┐
│ setSelectedRole()│
│ Save to localStorage
│ Redirect to
│ /dashboard/{role}
└──────┬───────────┘
       │
       ▼
┌────────────────┐
│ /dashboard/    │
│ {role}         │
│ (Dashboard)    │
└────────────────┘
```

---

## Mobile Navigation

### Mobile Sidebar Toggle

```typescript
// components/MobileNav.tsx

'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRole } from '@/context/RoleContext';

export function MobileNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedRole, getRoleName } = useRole();

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        <h1 className="font-bold text-gray-900">
          {selectedRole ? getRoleName(selectedRole as any) : 'Portfolio'}
        </h1>

        <div className="w-6" /> {/* Spacer for alignment */}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar content same as desktop */}
      </aside>
    </>
  );
}
```

---

## Route Protection (Optional)

### Middleware for Role Validation

```typescript
// middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if user is trying to access dashboard without role
  if (pathname.startsWith('/dashboard') && pathname !== '/dashboard') {
    // This check happens client-side via Context, but could be enforced server-side
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## Session Persistence

### localStorage Schema

```typescript
// Storage key: 'selectedRole'
// Value: 'hr' | 'technical' | 'manager'

// Example:
localStorage.setItem('selectedRole', 'technical');
const role = localStorage.getItem('selectedRole'); // Returns 'technical'
```

### Session Lifetime

- **Storage**: localStorage (persists across browser sessions)
- **Expiration**: Never expires (user must manually change role)
- **On Clear**: If localStorage is cleared, user redirected to role picker

### Optional: Session Timeout

```typescript
// If implementing session timeout:
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

useEffect(() => {
  let timeoutId: NodeJS.Timeout;

  const resetTimeout = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      // Session expired
      localStorage.removeItem('selectedRole');
      router.push('/roles');
    }, SESSION_TIMEOUT_MS);
  };

  // Reset timeout on user activity
  window.addEventListener('mousemove', resetTimeout);
  window.addEventListener('keypress', resetTimeout);

  resetTimeout(); // Initial timeout

  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('mousemove', resetTimeout);
    window.removeEventListener('keypress', resetTimeout);
  };
}, [router]);
```

---

## Error Handling

### Invalid Role Handling

```typescript
// In RoleProvider useEffect
useEffect(() => {
  const storedRole = localStorage.getItem('selectedRole');
  
  // Validate stored role
  const validRoles: UserRole[] = ['hr', 'technical', 'manager'];
  
  if (storedRole && validRoles.includes(storedRole as UserRole)) {
    setSelectedRoleState(storedRole as UserRole);
  } else {
    // Invalid or missing role, clear storage
    localStorage.removeItem('selectedRole');
    setSelectedRoleState(null);
  }
  
  setIsLoading(false);
}, []);
```

### 404 Handling for Invalid Routes

```typescript
// app/[...notfound]/page.tsx

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>
      <Link
        href="/roles"
        className="px-6 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700"
      >
        Back to Role Picker
      </Link>
    </div>
  );
}
```

---

## Testing Checklist

- [ ] Root page redirects to `/roles` when no role selected
- [ ] Root page redirects to `/dashboard/{role}` when role exists
- [ ] Role picker page loads at `/roles`
- [ ] Clicking role card saves to localStorage
- [ ] Clicking role card redirects to dashboard
- [ ] Sidebar displays correct role name
- [ ] "Change Role" button navigates to `/roles`
- [ ] Sidebar navigation links highlight active page
- [ ] Mobile sidebar opens/closes on toggle
- [ ] Mobile sidebar closes when link clicked
- [ ] Invalid role in localStorage is cleared
- [ ] Role persists across page refresh
- [ ] Role persists across browser restart
- [ ] Accessing `/dashboard` without role redirects to picker
- [ ] All navigation links work correctly
- [ ] No console errors on route changes
- [ ] Mobile responsive at all breakpoints

---

## Summary Table

| Route | Purpose | When Shown | Navigation |
|-------|---------|-----------|-----------|
| `/` | Root | Initial load | Redirect based on role |
| `/roles` | Role Picker | No role selected | Click role card to select |
| `/dashboard/hr` | HR Dashboard | HR role selected | From sidebar or role picker |
| `/dashboard/technical` | Technical Dashboard | Technical role selected | From sidebar or role picker |
| `/dashboard/manager` | Manager Dashboard | Manager role selected | From sidebar or role picker |
| `/dashboard` | Dashboard Redirect | Direct navigation | Redirect to role-specific |
