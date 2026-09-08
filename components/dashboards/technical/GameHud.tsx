"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useGame, type Award } from "@/context/GameContext";
import {
  COMBO_BONUS_EVERY,
  COMBO_BONUS_POINTS,
  COMBO_MULTIPLIER_CAP,
  nextTierForPoints,
  tierForPoints,
} from "@/lib/data";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function GameStatusBar() {
  const { totalPoints, currentCombo, sessionStartTime, requestCount } = useGame();
  const [elapsed, setElapsed] = useState(0);

  // Ticks the session clock. setState lives inside the interval callback, not
  // in the effect body, so this isn't the setState-in-effect pattern.
  useEffect(() => {
    const update = () => setElapsed(Date.now() - sessionStartTime);
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [sessionStartTime]);

  const tier = tierForPoints(totalPoints);

  return (
    <div className="mb-4 rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 p-4 text-white">
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-pink-100">
            Total Points
          </p>
          <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
          <p className="mt-1 text-xs text-pink-200">
            {tier.emoji} {tier.name}
          </p>
        </div>

        <div className="border-l border-r border-pink-500 text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-pink-100">Combo</p>
          <p className="text-2xl font-bold">
            {Math.min(currentCombo, COMBO_MULTIPLIER_CAP) || 1}x
          </p>
          <p className="mt-1 text-xs text-pink-200">
            {currentCombo > 1 ? `${currentCombo} in a row` : "multiplier idle"}
          </p>
        </div>

        <div className="text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-pink-100">
            Session
          </p>
          <p className="text-2xl font-bold tabular-nums">{formatElapsed(elapsed)}</p>
          <p className="mt-1 text-xs text-pink-200">
            {requestCount} {requestCount === 1 ? "request" : "requests"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PointsAward({ award }: { award: Award }) {
  const { totalPoints } = useGame();
  const tier = tierForPoints(totalPoints);
  const nextTier = nextTierForPoints(totalPoints);
  const tierSpan = tier.maxPoints === Infinity ? 1 : tier.maxPoints - tier.minPoints + 1;
  const progress =
    tier.maxPoints === Infinity
      ? 100
      : Math.min(100, Math.round(((totalPoints - tier.minPoints) / tierSpan) * 100));

  return (
    <div
      key={award.id}
      className="animate-pop-in rounded-lg border border-pink-300 bg-gradient-to-r from-pink-100 to-pink-50 p-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            ⭐
          </span>
          <span className="font-semibold text-gray-900">
            +{award.points} points for a {award.difficulty} request
          </span>
        </span>
        {award.comboBonus > 0 && (
          <span className="text-sm font-bold text-pink-700">+{award.comboBonus}pt combo bonus! 🔥</span>
        )}
      </div>

      <p className="mt-1 text-xs text-gray-600">
        {award.base} base × {award.comboMultiplier}x combo
        {award.comboBonus > 0 && ` + ${award.comboBonus} streak bonus`}
        {award.errorBonus > 0 && ` + ${award.errorBonus} for handling an error response`}
      </p>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-pink-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-600">
        {tier.emoji} {tier.name}
        {nextTier && ` — ${nextTier.minPoints - totalPoints} pts to ${nextTier.name}`}
      </p>
    </div>
  );
}

export function ComboIndicator() {
  const { currentCombo } = useGame();
  if (currentCombo <= 1) return null;

  const toBonus = COMBO_BONUS_EVERY - (currentCombo % COMBO_BONUS_EVERY || COMBO_BONUS_EVERY);
  const multiplier = Math.min(currentCombo, COMBO_MULTIPLIER_CAP);

  return (
    <div className="rounded-lg border-2 border-yellow-300 bg-gradient-to-br from-orange-500 to-red-600 p-4 text-white">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">
          🔥
        </span>
        <h3 className="text-lg font-bold">COMBO ACTIVE!</h3>
      </div>

      <p className="mb-3 text-sm">
        You&apos;ve made <strong>{currentCombo}</strong> requests in a row.
      </p>

      <p className="rounded-lg bg-orange-600 p-2 text-center text-xs font-semibold">
        {multiplier}x MULTIPLIER ON NEXT REQUEST
        {currentCombo > COMBO_MULTIPLIER_CAP && ` (capped at ${COMBO_MULTIPLIER_CAP}x)`}
      </p>

      <p className="mt-2 text-xs text-orange-100">
        {toBonus === COMBO_BONUS_EVERY
          ? `Streak bonus just paid out (+${COMBO_BONUS_POINTS}pts).`
          : `${toBonus} more for a +${COMBO_BONUS_POINTS}pt bonus.`}{" "}
        Combo resets if you switch tabs or idle for 5 minutes.
      </p>
    </div>
  );
}

export function GameNotifications() {
  const { notifications, dismissNotification } = useGame();
  if (notifications.length === 0) return null;

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {notifications.map((n) => n.text).join(". ")}
      </div>
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="pointer-events-auto flex animate-slide-in-up items-center gap-3 rounded-lg border-2 border-purple-400 bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 text-sm font-semibold text-white shadow-xl"
          >
            {notification.text}
            <button
              type="button"
              onClick={() => dismissNotification(notification.id)}
              className="rounded p-0.5 text-purple-200 hover:bg-purple-500 hover:text-white"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
