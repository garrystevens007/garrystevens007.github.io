import { profile } from "@/lib/data";

// Shown for the frame or two that / and /dashboard spend resolving which
// dashboard to send the visitor to. Deliberately not a spinner-on-white:
// it matches the role picker's gradient so the handoff reads as one screen
// settling rather than two pages flashing past.
export function RedirectSplash({ message = "Loading your dashboard…" }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50 px-4">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-from to-primary-to text-lg font-bold text-white shadow-primary">
          GS
        </div>
        <p className="text-sm font-semibold text-gray-900">{profile.name}</p>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
        <div className="mx-auto mt-4 h-1 w-32 overflow-hidden rounded-full bg-white/70">
          <div className="h-full w-1/3 animate-progress rounded-full bg-gradient-to-r from-primary-from to-primary-to" />
        </div>
      </div>
    </div>
  );
}
