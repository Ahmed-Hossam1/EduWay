
export const COURSE_LANGUAGES = ["English", "Arabic", "French", "Spanish", "German"] as const;

// one Stripe payment = one currency → only USD for now
export const COURSE_CURRENCIES = ["USD"] as const;

// the limits (the details schema and the form inputs use the same numbers)
export const MAX_TAGS = 10;
export const MAX_LIST_ITEMS = 10; // "what you'll learn" and "requirements"
export const MAX_PREREQUISITES = 5;

// Stripe can't charge less than $0.50
export const MIN_PAID_PRICE = 0.5;
export const MAX_PRICE = 999.99;

// Lesson videos on Cloudinary: every lesson video is "eduway/lessons/<lesson id>" (Replace writes over it)
export const LESSON_VIDEO_FOLDER = "eduway/lessons";
export const LESSON_VIDEO_FORMATS = ["mp4", "mov", "webm", "mkv"];
export const MAX_VIDEO_SIZE = 100_000_000; // 100 MB (the Cloudinary free plan limit)
