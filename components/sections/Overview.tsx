import { Award, Briefcase, Code2, Layers } from "lucide-react";
import { ApiPlayground } from "@/components/api-playground/ApiPlayground";
import { StatCard } from "@/components/dashboard/StatCard";
import { SectionHeading } from "@/components/dashboard/SectionHeading";
import { SkillsChart } from "@/components/dashboard/SkillsChart";
import { TenureChart } from "@/components/dashboard/TenureChart";
import { stats } from "@/lib/data";

const iconMap = { Code2, Briefcase, Layers, Award };

export function Overview() {
  return (
    <section id="overview" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Dashboard"
        title="Overview"
        description="A quick snapshot of my experience, stack, and output."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            caption={stat.caption}
            color={stat.color}
            icon={iconMap[stat.icon]}
          />
        ))}
      </div>

      <div id="api-playground" className="scroll-mt-24 py-6">
        <ApiPlayground />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-card dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-white">Top Skills</h3>
          <p className="text-xs text-neutral-400">Self-rated proficiency</p>
          <SkillsChart />
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-card dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-white">Tenure per Role</h3>
          <p className="text-xs text-neutral-400">Years spent in each position</p>
          <TenureChart />
        </div>
      </div>
    </section>
  );
}
