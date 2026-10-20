import { Metadata } from "next";
import { UserX } from "lucide-react";
import { NotFoundView } from "@/components/shared/NotFoundView";

export const metadata: Metadata = {
    title: "Instructor not found",
};

// instructor specific notFound Page
// /instructors/[id] called notFound() (no teacher with this id, or not approved)
export default function InstructorNotFound() {
    return (
        <NotFoundView
            icon={UserX}
            title="Instructor not found"
            description="This instructor doesn't exist or isn't teaching on EduWay right now. Meet our other instructors."
            actions={[
                { label: "Browse instructors", href: "/instructors" },
                { label: "Browse courses", href: "/courses" },
            ]}
        />
    );
}
