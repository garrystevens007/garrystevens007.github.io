type StatsBarProps = {
  totalRequests: number;
  mostPopularEndpoint: string;
  avgResponseTime: number;
  lastRequestTime: string;
};

// Named distinctly from components/dashboard/StatCard.tsx — same idea, but
// this section deliberately doesn't share styling with the rest of the
// dashboard (see agentsmd/DESIGN_SPECS.md).
function PlaygroundStatCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <span className="text-2xl">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="truncate text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export function StatsBar({ totalRequests, mostPopularEndpoint, avgResponseTime, lastRequestTime }: StatsBarProps) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <PlaygroundStatCard icon="📊" label="Total Requests" value={totalRequests} />
      <PlaygroundStatCard icon="🎯" label="Most Popular" value={mostPopularEndpoint} />
      <PlaygroundStatCard icon="⚡" label="Avg Response" value={`${avgResponseTime}ms`} />
      <PlaygroundStatCard icon="🕐" label="Last Request" value={lastRequestTime} />
    </div>
  );
}
