import { InstructorsPage } from "@/features/instructors/InstructorsPage";
import { instructorsQuerySchema } from "@/features/instructors/schemas/instructorsQuerySchema";
import { getInstructors } from "@/features/instructors/server/getInstructors";
import { parseSearchParams } from "@/lib/utils";

export const metadata = {
    title: "Instructors",
    description: "Meet the EduWay instructors — industry experts in web development, data science, design and more.",
};

type Params = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Instructors({ searchParams }: Params) {
    const params = await searchParams;

    // Validate: a broken URL (?sort=abc) falls back to the defaults instead of crashing
    const query = parseSearchParams(instructorsQuerySchema, params);

    // No await => the hero shows right away and the cards are streamed
    const instructorsPromise = getInstructors(query);

    return <InstructorsPage instructorsPromise={instructorsPromise} filtersKey={JSON.stringify(query)} />;
}
