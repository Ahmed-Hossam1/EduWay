"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { RatingStars } from "@/components/shared/RatingStars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFullName } from "@/lib/format";
import { timeAgo } from "@/lib/utils";
import { MAX_REPLY_DEPTH } from "../constants";
import { useReplyToReview } from "../hooks/useReplyToReview";
import { useUpdateReview } from "../hooks/useUpdateReview";
import { ReviewNode } from "../types";
import { ReplyForm } from "./ReplyForm";
import { ReviewForm } from "./ReviewForm";
import { ReviewItemMenu } from "./ReviewItemMenu";

type ReviewItemProps = {
    node: ReviewNode;
    courseId: string;
    isLoggedIn: boolean; // a guest sees "Reply" as a link to the login page
    depth?: number; // 1 = a review, 2 = a reply, 3 = a reply to a reply...
    mentionName?: string; // deeper than MAX_REPLY_DEPTH → "@Sara" before the text (who it answers)
};

/**
 * One comment + the replies under it.
 * RECURSIVE: every reply is a <ReviewItem> too, and it shows its own replies the same way.
 *
 *   level 1 (review)      → its replies are hidden until "View 3 replies"
 *   level 2, 3            → replies shown, indented with a line on the left
 *   deeper than level 3   → not indented anymore (stays at level 3) + "@name" of the person it answers
 */
export function ReviewItem({ node, courseId, isLoggedIn, depth = 1, mentionName }: ReviewItemProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const { mutate: replyToReview, isPending: isReplyPending } = useReplyToReview();
    const { mutate: updateReview, isPending: isUpdatePending } = useUpdateReview();

    const isReview = depth === 1;
    const authorName = getFullName(node.author?.first_name, node.author?.last_name, "EduWay user");
    const isLastLevel = depth >= MAX_REPLY_DEPTH;
    const repliesShown = !isReview || showReplies; // only the review hides its replies

    const replies = node.replies.map((reply) => (
        <ReviewItem
            key={reply.id}
            node={reply}
            courseId={courseId}
            isLoggedIn={isLoggedIn}
            depth={isLastLevel ? depth : depth + 1}
            mentionName={isLastLevel ? authorName : undefined}
        />
    ));

    return (
        <>
            <article className="flex gap-3">
                <Avatar size={isReview ? "lg" : "default"} className="mt-0.5">
                    {node.author?.avatar_url && <AvatarImage src={node.author.avatar_url} alt={authorName} />}
                    <AvatarFallback>{node.isDeleted ? "?" : authorName[0]}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                    {/* name, Instructor, time, ... menu */}
                    <div className="flex items-start justify-between gap-2">
                        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                            {!node.isDeleted && <span className="font-semibold text-foreground">{authorName}</span>}
                            {!node.isDeleted && node.isInstructor && <Badge variant="success">Instructor</Badge>}
                            <span className="text-xs text-muted-foreground">
                                {timeAgo(node.created_at)}
                                {node.isEdited && " · edited"}
                            </span>
                        </p>

                        {node.isMine && !node.isDeleted && !isEditing && (
                            <ReviewItemMenu
                                courseId={courseId}
                                reviewId={node.id}
                                isReview={isReview}
                                onEdit={() => setIsEditing(true)}
                            />
                        )}
                    </div>

                    {node.rating && !node.isDeleted && !isEditing && (
                        <RatingStars rating={node.rating} className="mt-1" />
                    )}

                    {/* the text: deleted / editing / normal */}
                    {node.isDeleted && (
                        <p className="mt-1 text-sm italic text-muted-foreground">This comment was deleted</p>
                    )}

                    {isEditing && isReview && (
                        <div className="mt-2">
                            <ReviewForm
                                defaultValues={{ rating: node.rating ?? 0, body: node.body ?? "" }}
                                submitLabel="Save"
                                isPending={isUpdatePending}
                                onCancel={() => setIsEditing(false)}
                                onSubmit={(values) =>
                                    updateReview(
                                        { courseId, reviewId: node.id, values },
                                        { onSuccess: () => setIsEditing(false) },
                                    )
                                }
                            />
                        </div>
                    )}

                    {isEditing && !isReview && (
                        <div className="mt-2">
                            <ReplyForm
                                defaultBody={node.body ?? ""}
                                submitLabel="Save"
                                isPending={isUpdatePending}
                                onCancel={() => setIsEditing(false)}
                                onSubmit={(values) =>
                                    updateReview(
                                        { courseId, reviewId: node.id, values },
                                        { onSuccess: () => setIsEditing(false) },
                                    )
                                }
                            />
                        </div>
                    )}

                    {!node.isDeleted && !isEditing && node.body && (
                        <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-foreground">
                            {mentionName && <span className="font-medium text-primary">@{mentionName} </span>}
                            {node.body}
                        </p>
                    )}

                    {/* Reply + View replies */}
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                        {!node.isDeleted && !isEditing && isLoggedIn && (
                            <Button
                                variant="ghost"
                                size="xs"
                                className="text-muted-foreground"
                                onClick={() => setIsReplying(true)}
                            >
                                <MessageCircle />
                                Reply
                            </Button>
                        )}
                        {!node.isDeleted && !isEditing && !isLoggedIn && (
                            <Button variant="ghost" size="xs" className="text-muted-foreground" asChild>
                                <Link href="/auth/login">
                                    <MessageCircle />
                                    Log in to reply
                                </Link>
                            </Button>
                        )}

                        {isReview && node.replies.length > 0 && (
                            <Button
                                variant="ghost"
                                size="xs"
                                className="text-primary"
                                onClick={() => setShowReplies(!showReplies)}
                            >
                                {showReplies ? <ChevronUp /> : <ChevronDown />}
                                {showReplies
                                    ? "Hide replies"
                                    : `View ${node.repliesCount} ${node.repliesCount === 1 ? "reply" : "replies"}`}
                            </Button>
                        )}
                    </div>

                    {isReplying && (
                        <div className="mt-2">
                            <ReplyForm
                                submitLabel="Reply"
                                isPending={isReplyPending}
                                onCancel={() => setIsReplying(false)}
                                onSubmit={(values) =>
                                    replyToReview(
                                        { courseId, parentId: node.id, values },
                                        {
                                            onSuccess: () => {
                                                setIsReplying(false);
                                                setShowReplies(true); // show the new reply
                                            },
                                        },
                                    )
                                }
                            />
                        </div>
                    )}

                    {/* the replies, indented under this comment (levels 1 → 2 → 3) */}
                    {!isLastLevel && repliesShown && replies.length > 0 && (
                        <div className="mt-4 space-y-4 border-l-2 border-border pl-4">{replies}</div>
                    )}
                </div>
            </article>

            {/* level 3 and deeper: the replies come AFTER this comment, at the same level (no more indent) */}
            {isLastLevel && replies}
        </>
    );
}
