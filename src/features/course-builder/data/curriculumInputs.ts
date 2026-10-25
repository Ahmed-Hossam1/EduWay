import { Input } from "@/types";
import { LessonValues } from "../schemas/curriculumSchemas";

// The text inputs of the lesson dialog (the "free preview" checkbox is not a text input → in the dialog)
export const lessonInputs: Input<keyof LessonValues>[] = [
    {
        id: "lesson-title",
        name: "title",
        type: "text",
        label: "Lesson title",
        placeholder: "e.g. What is React?",
    },
    {
        id: "lesson-description",
        name: "description",
        type: "textarea",
        label: "Description",
        placeholder: "What does this lesson cover? (optional)",
    },
];
