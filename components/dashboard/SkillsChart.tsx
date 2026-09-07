"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { topSkills } from "@/lib/data";

export function SkillsChart() {
  return (
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={topSkills} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-neutral-200 dark:text-neutral-700" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "currentColor" }} className="text-neutral-400" />
          <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12, fill: "currentColor" }} className="text-neutral-400" />
          <Tooltip
            cursor={{ fill: "rgba(233, 30, 99, 0.08)" }}
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", boxShadow: "0 4px 20px 0 rgba(0,0,0,.14)" }}
          />
          <Bar dataKey="level" fill="#e91e63" radius={[0, 6, 6, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
