"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useController } from "react-hook-form";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseThumbnail } from "@/features/courses/components/CourseThumbnail";
import { CourseDetailsValues } from "../../schemas/courseDetailsSchema";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

// The course image: uploaded to Cloudinary (same preset as the profile photo), its link goes to the form
export function ThumbnailField() {
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
                    <CldUploadWidget
                        uploadPreset="EduWay"
                        options={{
                            sources: ["local", "url"],
                            multiple: false,
                            maxFiles: 1,
                            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                            maxFileSize: 5_000_000, // 5 MB
                            cropping: true,
                            croppingAspectRatio: 16 / 10, // the same shape as the course cards
                            showSkipCropButton: false,
                            singleUploadAutoClose: true,
                        }}
                        onSuccess={(result) => {
                            // result.info is an object on success → save the image link in the form
                            if (result.info && typeof result.info !== "string") {
                                field.onChange(result.info.secure_url);
                            }
                        }}
                    >
                        {({ open, isLoading }) => (
                            <Button type="button" variant="outline" isLoading={isLoading} onClick={() => open()}>
                                <ImagePlus />
                                {imageUrl ? "Change image" : "Upload image"}
                            </Button>
                        )}
                    </CldUploadWidget>

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
