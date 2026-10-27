import { CommentNode } from "@/features/comments/types";

/**
 * One row of the questions table: a question (parent_id null) or an answer / reply (parent_id set).
 *   lesson_id null → a question about the course, before buying → the course page
 *   lesson_id set  → a question about a lesson → /learn (buyers + the teacher only)
 */
export interface Question {
    id: string;
    course_id: string;
    lesson_id: string | null;
    user_id: string;
    parent_id: string | null;
    body: string | null;
    is_best_answer: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

// One question / answer in the list = a comment + "best answer"
export interface QuestionNode extends CommentNode {
    isBestAnswer: boolean;
    replies: QuestionNode[];
    // on a question only (the top level):
    hasBestAnswer?: boolean;
    answeredByInstructor?: boolean;
    canReply?: boolean; // the teacher + the buyers, the asker in his own question
    canMarkBest?: boolean; // the asker or the teacher
}

// What get_course_questions() returns: one page of questions
export interface CourseQuestionsPage {
    canAsk: boolean; // course page → logged in | lesson → enrolled or the teacher
    questions: QuestionNode[];
    hasMore: boolean;
}
