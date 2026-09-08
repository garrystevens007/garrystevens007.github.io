"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { createLocalStorageStore, useLocalStorageStore } from "@/lib/local-storage-store";
import {
  getRoleDescription,
  getRoleName,
  isUserRole,
  ROLE_CONFIG,
  type RoleConfig,
  type UserRole,
} from "@/lib/roles";

const ROLE_STORAGE_KEY = "selectedRole";

// ROLE_NAVIGATION.md reads localStorage inside a mount effect. That exact
// pattern already bit this project twice (ThemeToggle, then ApiPlayground):
// it's a setState-in-effect that React 19's lint rule flags, and it's a real
// hydration hazard — the first client pass renders "no role", then a second
// pass suddenly renders a dashboard. useSyncExternalStore is React's actual
// answer for reading external/persisted state, so the role reuses the same
// store helper the playground history does.
const roleStore = createLocalStorageStore<UserRole | null>(ROLE_STORAGE_KEY, null);

// Standard "have we hydrated yet" signal, expressed as an external store so it
// costs no effect and no extra render pass of its own.
const noopSubscribe = () => () => {};

interface RoleContextType {
  selectedRole: UserRole | null;
  /** False until the client has read localStorage — gate redirects on this. */
  isLoading: boolean;
  config: RoleConfig | null;
  /** Persists the role. Does NOT navigate (see note below). */
  setSelectedRole: (role: UserRole) => void;
  /** Persists the role and navigates to its dashboard. */
  selectRoleAndGo: (role: UserRole) => void;
  /** Navigate back to the role picker. */
  changeRole: () => void;
  getRoleName: (role: UserRole) => string;
  getRoleDescription: (role: UserRole) => string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [storedRole, setStoredRole] = useLocalStorageStore(roleStore);
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  // Anything else in storage (a stale role name, hand-edited junk) is treated
  // as "no role" rather than trusted — ROLE_NAVIGATION.md's "Invalid Role
  // Handling", enforced on read so it can't be bypassed.
  const selectedRole = isUserRole(storedRole) ? storedRole : null;

  const setSelectedRole = useCallback(
    (role: UserRole) => {
      setStoredRole(role);
    },
    [setStoredRole]
  );

  // ROLE_NAVIGATION.md has setSelectedRole() navigate as a side effect, while
  // ROLE_PICKER_PAGE.md's handler calls it AND does its own router.push after
  // a 600ms exit animation — together that's a double navigation that cuts the
  // animation short. Split into a pure setter plus an explicit navigating
  // variant so both callers get what they actually want.
  const selectRoleAndGo = useCallback(
    (role: UserRole) => {
      setStoredRole(role);
      router.push(ROLE_CONFIG[role].href);
    },
    [router, setStoredRole]
  );

  const changeRole = useCallback(() => {
    router.push("/roles");
  }, [router]);

  const value = useMemo<RoleContextType>(
    () => ({
      selectedRole,
      isLoading: !hydrated,
      config: selectedRole ? ROLE_CONFIG[selectedRole] : null,
      setSelectedRole,
      selectRoleAndGo,
      changeRole,
      getRoleName,
      getRoleDescription,
    }),
    [selectedRole, hydrated, setSelectedRole, selectRoleAndGo, changeRole]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within RoleProvider");
  }
  return context;
}
