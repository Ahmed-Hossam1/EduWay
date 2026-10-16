import { use } from "react"
import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { EnrolledCourse } from "../types"
import { MyCourseCard } from "./MyCourseCard"

type MyCoursesGridProps = {
    myCoursesPromise: Promise<EnrolledCourse[]>
}

// Streamed with <Suspense>: use() waits for the promise
export function MyCoursesGrid({ myCoursesPromise }: MyCoursesGridProps) {
    const myCourses = use(myCoursesPromise)

    if (myCourses.length === 0) {
        return (
            <Empty className="border border-dashed py-16">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <GraduationCap />
                    </EmptyMedia>
                    <EmptyTitle>You haven&apos;t enrolled in any course yet</EmptyTitle>
                    <EmptyDescription>Enroll in a free course or buy one, and it will show up here.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button rounded="full" asChild>
                      <Link href="/courses">
                          Browse courses
                      </Link>
                    </Button>
                </EmptyContent>
            </Empty>
        )
    }

    return (
        <>
            <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{myCourses.length}</span>{" "}
                {myCourses.length === 1 ? "course" : "courses"}
            </p>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {myCourses.map((enrolledCourse) => (
                    <MyCourseCard key={enrolledCourse.course.id} enrolledCourse={enrolledCourse} />
                ))}
            </div>
        </>
    )
}
