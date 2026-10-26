// How many reviews one page has ("Show more reviews" loads the next 10)
export const REVIEWS_PAGE_SIZE = 10;

// Replies are indented up to this level; deeper replies stay at this level with "@name"
export const MAX_REPLY_DEPTH = 3;

// The longest comment (the database checks it too)
export const MAX_REVIEW_LENGTH = 2000;

export const REVIEW_SORTS = ["newest", "oldest"] as const;
