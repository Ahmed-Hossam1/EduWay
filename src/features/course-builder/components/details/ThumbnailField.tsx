"use client";

import { useController } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CloudinaryUpload } from "@/components/shared/CloudinaryUpload";
import { CourseThumbnail } from "@/features/courses/components/CourseThumbnail";
import { CourseDetailsValues } from "../../schemas/courseDetailsSchema";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { getCourseThumbnailPublicId } from "../../utils";

type ThumbnailFieldProps = {
    courseId: string;
};

// The course image: uploaded to Cloudinary via signed endpoint, its link goes to the form
export function ThumbnailField({ courseId }: ThumbnailFieldProps) {
    const { field, fieldState } = useController<CourseDetailsValues, "thumbnailUrl">({ name: "thumbnailUrl" });
    const imageUrl = field.value;

    return (
        <Field>
            <FieldLabel>Course image</FieldLabel>
            <FieldDescription>The image on the course card and the course page. A wide image looks best (16:10).</FieldDescription>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* the preview (a gray box with an icon when there is no image yet) */}
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-dashed border-border bg-muted sm:w-64">
                    <CourseThumbnail src={imageUrl || null} alt="Course image" sizes="256px" iconClassName="size-8" />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <CloudinaryUpload
                        signatureEndpoint="/api/cloudinary/sign-course-upload"
                        options={{
                            publicId: getCourseThumbnailPublicId(courseId),
                            sources: ["local", "url"],
                            cropping: true,
                            croppingAspectRatio: 16 / 10,
                        }}
                        isUploaded={Boolean(imageUrl)}
                        label="Upload image"
                        changeLabel="Change image"
                        onUploadSuccess={(url) => field.onChange(url)}
                    />

                    {imageUrl && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => field.onChange("")}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <X />
                            Remove
                        </Button>
                    )}
                </div>
            </div>

            <FieldError errors={[fieldState.error]} />
        </Field>
    );
}
