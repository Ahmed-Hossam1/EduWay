// The shared rules of every comment list (reviews + questions)

// How many top level comments one page has ("Show more" loads the next 10)
export const COMMENTS_PAGE_SIZE = 10;

// Replies are indented up to this level; deeper replies stay at this level with "@name"
export const MAX_REPLY_DEPTH = 3;

// The longest comment (the database checks it too)
export const MAX_COMMENT_LENGTH = 2000;

export const COMMENT_SORTS = ["newest", "oldest"] as const;
