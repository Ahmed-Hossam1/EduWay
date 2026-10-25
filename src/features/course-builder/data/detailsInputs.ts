import { Input } from "@/types";
import { CourseDetailsValues } from "../schemas/courseDetailsSchema";

// The text inputs of the Details tab → "Basic information" (type "textarea" = a big text box)
export const basicInfoInputs: Input<keyof CourseDetailsValues>[] = [
    {
        id: "course-title",
        name: "title",
        type: "text",
        label: "Title",
        placeholder: "e.g. React for Beginners",
    },
    {
        id: "course-short-description",
        name: "shortDescription",
        type: "text",
        label: "Short description",
        placeholder: "One sentence under the title, e.g. Build real apps with React",
    },
    {
        id: "course-description",
        name: "description",
        type: "textarea",
        label: "Description",
        placeholder: "What is the course about? Who is it for? What will students build?",
    },
];
