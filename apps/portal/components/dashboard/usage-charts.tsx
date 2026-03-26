"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useMemo } from "react";
import type { DailyAggregate } from "../../app/(dashboard)/dashboard/usage/page";

interface UsageChartsProps {
  data: DailyAggregate[];
  revSharePct: number;
  ratePerEvent: number;
}

const BRAND_ORANGE = "#CC2902";
const NEUTRAL_GRAY = "#A5A5A5";
const REV_GREEN = "#22c55e";
const GRID_COLOR = "#2a2a2a";
const AXIS_COLOR = "#767676";

function ChartTooltip({ active, payload, label, unit, prefix }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  unit?: string;
  prefix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-md">
      <p className="text-caption font-medium text-neutral-900 mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-body-sm">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-neutral-600">{entry.name}:</span>
          <span className="font-medium text-neutral-900 tabular-nums">
            {prefix ?? ""}{entry.value.toLocaleString()}{unit ?? ""}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function UsageCharts({ data, revSharePct, ratePerEvent }: UsageChartsProps) {
  const revenueData = useMemo(() => {
    let cumulative = 0;
    return data.map((d) => {
      const dailyGross = d.billable * ratePerEvent;
      const dailyShare = dailyGross * (revSharePct / 100);
      cumulative += dailyShare;
      return {
        label: d.label,
        dailyGross: parseFloat(dailyGross.toFixed(2)),
        dailyShare: parseFloat(dailyShare.toFixed(2)),
        cumulative: parseFloat(cumulative.toFixed(2)),
      };
    });
  }, [data, revSharePct, ratePerEvent]);

  if (data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="dark-card rounded-2xl border border-neutral-800/60 p-5">
        <h3 className="text-heading-4 text-white mb-5">Requests Over Time</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid vertical={false} stroke={GRID_COLOR} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                axisLine={{ stroke: GRID_COLOR }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, color: AXIS_COLOR, paddingTop: 8 }}
              />
              <Bar
                dataKey="billable"
                name="Delivered"
                stackId="requests"
                fill={BRAND_ORANGE}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="errors"
                name="Failed"
                stackId="requests"
                fill={NEUTRAL_GRAY}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dark-card rounded-2xl border border-neutral-800/60 p-5">
        <h3 className="text-heading-4 text-white mb-5">Average Latency (ms)</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid vertical={false} stroke={GRID_COLOR} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                axisLine={{ stroke: GRID_COLOR }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={36}
                unit="ms"
              />
              <Tooltip content={<ChartTooltip unit="ms" />} />
              <Line
                type="monotone"
                dataKey="avgLatency"
                name="Avg Latency"
                stroke={BRAND_ORANGE}
                strokeWidth={2}
                dot={{ r: 3, fill: BRAND_ORANGE, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: BRAND_ORANGE, strokeWidth: 2, stroke: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {revSharePct > 0 && (
        <div className="dark-card rounded-2xl border border-neutral-800/60 p-5 lg:col-span-2">
          <h3 className="text-heading-4 text-white mb-5">Revenue Share Earnings</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={REV_GREEN} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={REV_GREEN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={GRID_COLOR} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  axisLine={{ stroke: GRID_COLOR }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={46}
                  tickFormatter={(v: number) => `$${v.toFixed(2)}`}
                />
                <Tooltip content={<ChartTooltip prefix="$" />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, color: AXIS_COLOR, paddingTop: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  name="Cumulative Earnings"
                  stroke={REV_GREEN}
                  strokeWidth={2}
                  fill="url(#greenGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: REV_GREEN, strokeWidth: 2, stroke: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="dailyShare"
                  name="Daily Share"
                  stroke={NEUTRAL_GRAY}
                  strokeWidth={1.5}
                  fill="transparent"
                  strokeDasharray="4 4"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
