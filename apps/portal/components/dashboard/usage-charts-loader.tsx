"use client";

import dynamic from "next/dynamic";
import type { DailyAggregate } from "../../app/(dashboard)/dashboard/usage/page";

const UsageCharts = dynamic(() => import("./usage-charts"), { ssr: false });

interface Props {
  data: DailyAggregate[];
  revSharePct: number;
  ratePerEvent: number;
}

export default function UsageChartsLoader({ data, revSharePct, ratePerEvent }: Props) {
  return <UsageCharts data={data} revSharePct={revSharePct} ratePerEvent={ratePerEvent} />;
}
