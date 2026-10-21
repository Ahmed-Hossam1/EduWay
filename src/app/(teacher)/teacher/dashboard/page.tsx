import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Overview",
    robots: { index: false },
};

// TODO (next step): the Overview cards (earnings, students, courses...)
export default function TeacherDashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Overview</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your stats and latest activity will show here.</p>
        </div>
    );
}
