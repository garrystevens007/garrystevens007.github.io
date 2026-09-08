"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  calculateRequestPoints,
  secretEndpoints,
  type Difficulty,
  type Endpoint,
  type HttpMethod,
  type SecretEndpointId,
} from "@/lib/data";

// Gamification state for /dashboard/technical, per
// agentsmd/v2/TECHNICAL_DASHBOARD_SPECS.md.
//
// Deliberately session-scoped and in-memory: the spec's own "Real-Time Score"
// section says it "resets on page reload or role change", and a score that
// silently persists would make the tier badges meaningless on a second visit.

const COMBO_IDLE_TIMEOUT_MS = 5 * 60 * 1000;
const SPEEDRUN_WINDOW_MS = 10_000;
const SPEEDRUN_REQUIRED = 3;
const SECRET_EXPLORER_ENDPOINTS = 5;

export type Award = {
  id: number;
  points: number;
  base: number;
  comboMultiplier: number;
  comboBonus: number;
  errorBonus: number;
  difficulty: Difficulty;
  combo: number;
};

export type GameNotification = { id: number; text: string };

type RecordArgs = {
  endpointId: string;
  method: HttpMethod;
  difficulty: Difficulty;
  statusCode: number;
};

interface GameContextType {
  totalPoints: number;
  currentCombo: number;
  requestCount: number;
  triedEndpointIds: string[];
  unlockedSecrets: SecretEndpointId[];
  unlockedSecretEndpoints: Endpoint[];
  notifications: GameNotification[];
  lastAward: Award | null;
  sessionStartTime: number;
  recordRequest: (args: RecordArgs) => Award;
  dismissNotification: (id: number) => void;
  resetSession: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentCombo, setCurrentCombo] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [triedEndpointIds, setTriedEndpointIds] = useState<string[]>([]);
  const [methodsUsed, setMethodsUsed] = useState<HttpMethod[]>([]);
  const [unlockedSecrets, setUnlockedSecrets] = useState<SecretEndpointId[]>([]);
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [lastAward, setLastAward] = useState<Award | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState(() => Date.now());

  // Timestamps of recent requests, newest last — only used for the speedrun
  // trigger, so it's a ref rather than state (no render depends on it).
  const recentTimestamps = useRef<number[]>([]);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const awardId = useRef(0);

  const pushNotification = useCallback((text: string) => {
    awardId.current += 1;
    const id = awardId.current;
    setNotifications((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 6000);
  }, []);

  const dismissNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // "Resets if user switches tabs or after 5 minute idle" — the tab half.
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) setCurrentCombo(0);
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const recordRequest = useCallback(
    ({ endpointId, method, difficulty, statusCode }: RecordArgs): Award => {
      const now = Date.now();

      // Combo counts consecutive requests, so this request is combo N+1.
      const combo = currentCombo + 1;
      const breakdown = calculateRequestPoints({ difficulty, method, combo, statusCode });

      awardId.current += 1;
      const award: Award = {
        id: awardId.current,
        points: breakdown.total,
        base: breakdown.base,
        comboMultiplier: breakdown.comboMultiplier,
        comboBonus: breakdown.comboBonus,
        errorBonus: breakdown.errorBonus,
        difficulty,
        combo,
      };

      setCurrentCombo(combo);
      setTotalPoints((prev) => prev + breakdown.total);
      setRequestCount((prev) => prev + 1);
      setLastAward(award);

      // --- secret unlock triggers -------------------------------------------
      const nextTried = triedEndpointIds.includes(endpointId)
        ? triedEndpointIds
        : [...triedEndpointIds, endpointId];
      if (nextTried !== triedEndpointIds) setTriedEndpointIds(nextTried);

      const nextMethods = methodsUsed.includes(method) ? methodsUsed : [...methodsUsed, method];
      if (nextMethods !== methodsUsed) setMethodsUsed(nextMethods);

      recentTimestamps.current = [...recentTimestamps.current, now].slice(-SPEEDRUN_REQUIRED);
      const speedrunWindow =
        recentTimestamps.current.length === SPEEDRUN_REQUIRED &&
        now - recentTimestamps.current[0] < SPEEDRUN_WINDOW_MS;

      const newlyUnlocked: SecretEndpointId[] = [];
      if (!unlockedSecrets.includes("secret-achievement") && nextTried.length >= SECRET_EXPLORER_ENDPOINTS) {
        newlyUnlocked.push("secret-achievement");
      }
      if (
        !unlockedSecrets.includes("hacker-stats") &&
        nextMethods.includes("POST") &&
        nextMethods.includes("GET")
      ) {
        newlyUnlocked.push("hacker-stats");
      }
      if (!unlockedSecrets.includes("speedrun") && speedrunWindow) {
        newlyUnlocked.push("speedrun");
      }

      if (newlyUnlocked.length > 0) {
        setUnlockedSecrets((prev) => [...prev, ...newlyUnlocked]);
        newlyUnlocked.forEach((id) => {
          const def = secretEndpoints.find((s) => s.id === id);
          if (def) pushNotification(def.notification);
        });
      }

      // --- idle reset --------------------------------------------------------
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setCurrentCombo(0), COMBO_IDLE_TIMEOUT_MS);

      return award;
    },
    [currentCombo, methodsUsed, pushNotification, triedEndpointIds, unlockedSecrets]
  );

  const resetSession = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    recentTimestamps.current = [];
    setTotalPoints(0);
    setCurrentCombo(0);
    setRequestCount(0);
    setTriedEndpointIds([]);
    setMethodsUsed([]);
    setUnlockedSecrets([]);
    setLastAward(null);
    setNotifications([]);
    setSessionStartTime(Date.now());
  }, []);

  const unlockedSecretEndpoints = useMemo(
    () =>
      secretEndpoints
        .filter((secret) => unlockedSecrets.includes(secret.id))
        .map((secret) => secret.endpoint),
    [unlockedSecrets]
  );

  const value = useMemo<GameContextType>(
    () => ({
      totalPoints,
      currentCombo,
      requestCount,
      triedEndpointIds,
      unlockedSecrets,
      unlockedSecretEndpoints,
      notifications,
      lastAward,
      sessionStartTime,
      recordRequest,
      dismissNotification,
      resetSession,
    }),
    [
      totalPoints,
      currentCombo,
      requestCount,
      triedEndpointIds,
      unlockedSecrets,
      unlockedSecretEndpoints,
      notifications,
      lastAward,
      sessionStartTime,
      recordRequest,
      dismissNotification,
      resetSession,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
