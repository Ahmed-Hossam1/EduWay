"use client";

import { useState } from "react";
import { useController } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseDetailsValues } from "../../schemas/courseDetailsSchema";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { MAX_TAGS } from "../../constants";

// Tags like "React", "Hooks" (a new tag is created by the database when the course is saved)
export function TagsField() {
    const { field, fieldState } = useController<CourseDetailsValues, "tags">({ name: "tags" });
    const tags = field.value;

    // the text of the "type a tag" input (not part of the form)
    const [newTag, setNewTag] = useState("");

    const addTag = () => {
        const tag = newTag.trim();
        // the same tag twice ("React" / "react") counts once
        const alreadyAdded = tags.some((item) => item.toLowerCase() === tag.toLowerCase());

        if (tag && !alreadyAdded && tags.length < MAX_TAGS) {
            field.onChange([...tags, tag]);
        }
        setNewTag("");
    };

    const removeTag = (tagToRemove: string) => {
        field.onChange(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <Field>
            <FieldLabel>Tags</FieldLabel>
            <FieldDescription>{`Up to ${MAX_TAGS} tags. They help students find your course.`}</FieldDescription>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Badge key={tag} variant="accent" className="gap-1.5 rounded-lg px-3 py-1 text-xs">
                            {tag}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                rounded="full"
                                aria-label={`Remove ${tag}`}
                                onClick={() => removeTag(tag)}
                                className="size-4 hover:bg-transparent hover:text-destructive"
                            >
                                <X className="size-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <Input
                    value={newTag}
                    onChange={(event) => setNewTag(event.target.value)}
                    onKeyDown={(event) => {
                        // Enter adds the tag (and doesn't submit the form)
                        if (event.key === "Enter") {
                            event.preventDefault();
                            addTag();
                        }
                    }}
                    placeholder="Type a tag and press Enter"
                    aria-label="New tag"
                    maxLength={30}
                    disabled={tags.length >= MAX_TAGS}
                    fullWidth
                />
                <Button type="button" variant="outline" onClick={addTag} disabled={!newTag.trim() || tags.length >= MAX_TAGS}>
                    <Plus />
                    Add
                </Button>
            </div>

            <FieldError errors={[fieldState.error]} />
        </Field>
    );
}
