// The kinds of notifications (the same list as the CHECK rule in the database)
export type NotificationType =
    | "new_enrollment"
    | "application_approved"
    | "application_rejected"
    | "new_lesson"
    | "course_published"
    | "new_review"
    | "announcement"
    | "new_comment" // someone commented on the teacher's course
    | "comment_reply"; // someone replied to your comment

// One notification in the bell
export interface NotificationItem {
    id: string;
    type: NotificationType;
    title: string; // "Sara enrolled in Advanced React"
    link: string | null; // where a click goes
    readAt: string | null; // null = unread
    createdAt: string;
}

// What the bell needs: the latest notifications + how many are unread
export interface MyNotifications {
    items: NotificationItem[];
    unreadCount: number;
}
