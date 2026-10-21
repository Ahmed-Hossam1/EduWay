import { Skeleton } from "@/components/ui/skeleton";

// While a dashboard page loads: the sidebar + navbar stay, only the content shows skeletons
export default function TeacherDashboardLoading() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-7 w-40" />
                <Skeleton className="mt-2 h-4 w-64" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                    <Skeleton key={item} className="h-24 rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Skeleton className="h-64 rounded-xl lg:col-span-2" />
                <Skeleton className="h-64 rounded-xl" />
            </div>
        </div>
    );
}
