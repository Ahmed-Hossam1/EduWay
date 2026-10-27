import { LessonPlayerSkeleton } from "@/features/learn/components/skeleton";
import { StudentViewModal } from "@/features/learn/components/StudentViewModal";

// While the student view loads: the modal opens right away with the player skeleton inside
export default function StudentViewLoading() {
    return (
        <StudentViewModal>
            <LessonPlayerSkeleton />
        </StudentViewModal>
    );
}
