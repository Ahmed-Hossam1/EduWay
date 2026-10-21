// The data of each Overview card (built in server/ from the database)

export interface OverviewStats {
    earningsThisMonth: number;
    earningsByWeek: number[]; // the small bars
    newStudents: number;
    studentsTrend: number[]; // the small line
    publishedCourses: number;
    draftCourses: number;
    totalStudents: number; // all the students of all his courses (the profile card)
    enrollmentsThisWeek: number;
    enrollmentsTrend: number[];
}

export interface EarningsOverview {
    months: { label: string; value: number }[]; // the chart (last 6 months)
    completionRate: number; // %
    completionChange: number; // % vs last month (can be negative)
    totalRevenue: number;
    revenueChange: number; // %
}

export interface TopCourse {
    title: string;
    slug: string;
    thumbnailUrl: string;
    students: number;
    earnings: number;
}

export interface RecentSale {
    id: string;
    studentName: string;
    courseTitle: string;
    amount: number; // negative = refund (no refunds in the database yet)
}

export interface NewStudent {
    id: string;
    name: string;
    initials: string;
    courseTitle: string;
    timeAgo: string;
}

export interface OverviewInsight {
    text: string;
    trend: "up" | "down";
}
