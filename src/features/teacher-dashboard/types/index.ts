// The data of each Overview card

// What get_teacher_overview_stats() returns (database function, called with supabase.rpc)
export interface OverviewStats {
    totalCourses: number;
    publishedCourses: number;
    draftCourses: number;
    enrollmentsThisWeek: number; // the last 7 days
    studentsLast30Days: number;
    studentsPrevious30Days: number; // the 30 days before (to compare)
}

// What get_teacher_earnings_overview() returns (database function, called with supabase.rpc)
export interface EarningsOverview {
    months: { month: string; value: number }[]; // the last 6 months, oldest first: { month: "2026-10", value: 64.98 }
    totalRevenue: number;
    revenueChange: number; // % this month vs last month (can be negative)
    completionRate: number; // % of the enrollments that finished the course
}

// One row of getTeacherTopCourses()
export interface TopCourse {
    id: string;
    title: string;
    slug: string;
    thumbnail_url: string | null;
    students_count: number;
    price: number;
    currency: string;
    status: "published";
}

// One row of getTeacherRecentSales() (order_items has no id: order_id + course_id)
export interface RecentSale {
    order_id: string;
    course_id: string;
    price: number;
    order: {
        id: string;
        status: "paid";
        paid_at: string;
        buyer: { first_name: string | null; last_name: string | null } | null;
    };
    course: { id: string; title: string; thumbnail_url: string | null; instructor_id: string };
}

// One row of getTeacherNewStudents() (enrollments has no id: user_id + course_id)
export interface NewStudent {
    user_id: string;
    course_id: string;
    enrolled_at: string;
    student: { first_name: string | null; last_name: string | null; avatar_url: string | null } | null;
    course: { id: string; title: string; instructor_id: string };
}
