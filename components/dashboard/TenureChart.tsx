"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { tenureByRole } from "@/lib/data";

export function TenureChart() {
  return (
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={tenureByRole} margin={{ top: 4, right: 16, bottom: 4, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-neutral-200 dark:text-neutral-700" />
          <XAxis dataKey="company" tick={{ fontSize: 11, fill: "currentColor" }} className="text-neutral-400" />
          <YAxis tick={{ fontSize: 11, fill: "currentColor" }} className="text-neutral-400" />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(1)} years`, "Tenure"]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", boxShadow: "0 4px 20px 0 rgba(0,0,0,.14)" }}
          />
          <Bar dataKey="years" fill="#1a73e8" radius={[6, 6, 0, 0]} barSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
