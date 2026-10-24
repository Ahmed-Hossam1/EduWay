import { use } from "react";
import { CircleCheck } from "lucide-react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "./DashboardCard";
import { EarningsOverview } from "../../types";
import { formatMoney } from "@/lib/format";
import { formatMonth, toPoints } from "../../utils/chart";
import { ChangePill } from "./ChangePill";

type EarningsChartProps = {
    earningsPromise: Promise<EarningsOverview>;
};

const CHART_WIDTH = 600;
const CHART_HEIGHT = 140;

// Earnings of the last 6 months: an area chart + 2 small numbers
export function EarningsChart({ earningsPromise }: EarningsChartProps) {
    const earnings = use(earningsPromise); // waits inside the <Suspense> of TeacherOverview
    const points = toPoints(
        earnings.months.map((month) => month.value),
        CHART_WIDTH,
        CHART_HEIGHT,
    );

    return (
        <DashboardCard className="sm:col-span-2 xl:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-bold">
                    Earnings
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <CircleCheck className="size-3" />
                        On track
                    </span>
                </CardTitle>
                <CardDescription>Last 6 months</CardDescription>
            </CardHeader>

            <CardContent>
                {/* the 2 small numbers */}
                <div className="flex flex-wrap gap-3">
                    <div className="rounded-xl border border-border px-3 py-2">
                        <p className="text-[11px] text-muted-foreground">Completion</p>
                        <p className="flex items-center gap-1.5 text-sm font-bold">
                            {earnings.completionRate}%
                        </p>
                    </div>
                    <div className="rounded-xl border border-border px-3 py-2">
                        <p className="text-[11px] text-muted-foreground">Total revenue</p>
                        <p className="flex items-center gap-1.5 text-sm font-bold">
                            {formatMoney(earnings.totalRevenue, "USD", 0)} <ChangePill value={earnings.revenueChange} />
                        </p>
                    </div>
                </div>

                {/* the chart: a filled area under a line */}
                <svg
                    viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                    className="mt-4 h-36 w-full overflow-visible"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="earnings-area" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polygon points={`0,${CHART_HEIGHT} ${points} ${CHART_WIDTH},${CHART_HEIGHT}`} fill="url(#earnings-area)" />
                    <polyline points={points} fill="none" className="stroke-primary" strokeWidth="3" strokeLinejoin="round" />
                </svg>

                {/* month names under the chart */}
                <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                    {earnings.months.map((month) => (
                        <span key={month.month}>{formatMonth(month.month)}</span>
                    ))}
                </div>
            </CardContent>
        </DashboardCard>
    );
}
