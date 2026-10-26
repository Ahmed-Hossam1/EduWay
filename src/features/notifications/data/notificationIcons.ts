import { BadgeCheck, BadgeX, BookPlus, LucideIcon, Megaphone, MessageCircle, Reply, Rocket, Star, UserPlus } from "lucide-react";
import { NotificationType } from "../types";

// The icon of each notification kind
export const notificationIcons: Record<NotificationType, LucideIcon> = {
    new_enrollment: UserPlus,
    application_approved: BadgeCheck,
    application_rejected: BadgeX,
    new_lesson: BookPlus,
    course_published: Rocket,
    new_review: Star,
    announcement: Megaphone,
    new_comment: MessageCircle,
    comment_reply: Reply,
};
