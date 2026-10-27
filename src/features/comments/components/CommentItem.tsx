"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFullName } from "@/lib/format";
import { cn, timeAgo } from "@/lib/utils";
import { MAX_REPLY_DEPTH } from "../constants";
import { CommentActions, CommentNode } from "../types";
import { hasComment } from "../utils";
import { CommentItemMenu } from "./CommentItemMenu";
import { CommentTextForm } from "./CommentTextForm";

type CommentItemProps<T extends CommentNode> = {
    node: T;
    root?: T; // the top comment of this thread (a review / a question) → its rules go to every reply
    actions: CommentActions;
    canReply: boolean; // the list (reviews) or the thread (questions) decides
    topName: string; // "review" / "question" → the words of the ... menu on the top comment
    depth?: number; // 1 = the top comment, 2 = a reply, 3 = a reply to a reply...
    mentionName?: string; // deeper than MAX_REPLY_DEPTH → "@Sara" before the text (who it answers)
    focusedId?: string | null; // the comment of a notification link (#review-<id>) → highlighted + its thread open
    // the extra parts of each kind (all optional):
    renderUnderName?: (node: T, depth: number) => ReactNode; // the stars of a review, "Best answer"...
    renderActions?: (node: T, depth: number, root: T) => ReactNode; // "Mark as best answer"...
    renderEditForm?: (node: T, depth: number, close: () => void) => ReactNode; // a review edits its stars too
};

/**
 * One comment + the replies under it — used by the reviews AND the questions.
 * RECURSIVE: every reply is a <CommentItem> too, and it shows its own replies the same way.
 *
 *   level 1 (review / question) → its replies are hidden until "View 3 replies"
 *   level 2, 3                  → replies shown, indented with a line on the left
 *   deeper than level 3         → not indented anymore (stays at level 3) + "@name" of the person it answers
 */
export function CommentItem<T extends CommentNode>({
    node,
    root,
    actions,
    canReply,
    topName,
    depth = 1,
    mentionName,
    focusedId = null,
    renderUnderName,
    renderActions,
    renderEditForm,
}: CommentItemProps<T>) {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [toggledReplies, setToggledReplies] = useState<boolean | null>(null); // null = the user didn't click yet

    const isTop = depth === 1;
    // the replies are open: the user clicked "View replies", or the notification's comment is inside them
    const showReplies = toggledReplies ?? hasComment(node.replies, focusedId);
    const isFocused = node.id === focusedId;
    const thread = root ?? node; // the top comment of this thread
    const authorName = getFullName(node.author?.first_name, node.author?.last_name, "EduWay user");
    const isLastLevel = depth >= MAX_REPLY_DEPTH;
    const repliesShown = !isTop || showReplies; // only the top comment hides its replies
    const closeEdit = () => setIsEditing(false);

    // the replies: the same component, one level deeper (the extra parts go down too)
    const replies = (node.replies as T[]).map((reply) => (
        <CommentItem
            key={reply.id}
            node={reply}
            root={thread}
            actions={actions}
            canReply={canReply}
            topName={topName}
            depth={isLastLevel ? depth : depth + 1}
            mentionName={isLastLevel ? authorName : undefined}
            focusedId={focusedId}
            renderUnderName={renderUnderName}
            renderActions={renderActions}
            renderEditForm={renderEditForm}
        />
    ));

    // a review edits its stars too → its own form; everything else → the text form
    const editForm = renderEditForm?.(node, depth, closeEdit) ?? (
        <CommentTextForm
            defaultBody={node.body ?? ""}
            submitLabel="Save"
            isPending={actions.isUpdatePending}
            onCancel={closeEdit}
            onSubmit={(body) => actions.update(node.id, body, closeEdit)}
        />
    );

    return (
        <>
            {/* id → a notification link scrolls here (#review-<id>, #question-<id>) */}
            <article
                id={`${topName}-${node.id}`}
                className={cn(
                    "flex scroll-mt-24 gap-3 rounded-xl",
                    isFocused && "-m-2 bg-primary/5 p-2 ring-2 ring-primary/30",
                )}
            >
                <Avatar size={isTop ? "lg" : "default"} className="mt-0.5">
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
                            <CommentItemMenu
                                name={isTop ? topName : "reply"}
                                onEdit={() => setIsEditing(true)}
                                onDelete={(onDone) => actions.remove(node.id, onDone)}
                                isDeleting={actions.isDeletePending}
                            />
                        )}
                    </div>

                    {!node.isDeleted && !isEditing && renderUnderName?.(node, depth)}

                    {/* the text: deleted / editing / normal */}
                    {node.isDeleted && (
                        <p className="mt-1 text-sm italic text-muted-foreground">This comment was deleted</p>
                    )}

                    {isEditing && <div className="mt-2">{editForm}</div>}

                    {!node.isDeleted && !isEditing && node.body && (
                        <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-foreground">
                            {mentionName && <span className="font-medium text-primary">@{mentionName} </span>}
                            {node.body}
                        </p>
                    )}

                    {/* Reply + the extra buttons + View replies */}
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                        {!node.isDeleted && !isEditing && canReply && (
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

                        {!node.isDeleted && !isEditing && renderActions?.(node, depth, thread)}

                        {isTop && node.replies.length > 0 && (
                            <Button
                                variant="ghost"
                                size="xs"
                                className="text-primary"
                                onClick={() => setToggledReplies(!showReplies)}
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
                            <CommentTextForm
                                submitLabel="Reply"
                                isPending={actions.isReplyPending}
                                onCancel={() => setIsReplying(false)}
                                onSubmit={(body) =>
                                    actions.reply(node.id, body, () => {
                                        setIsReplying(false);
                                        setToggledReplies(true); // show the new reply
                                    })
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
