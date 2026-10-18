"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Camera, ImagePlus, User, X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useController } from "react-hook-form";
import { OnboardingFormValues } from "../../schemas/onboardingSchema";
import { FieldError } from "../../components/FieldError";

interface ProfilePhotoUploadProps {
    className?: string;
}

export function ProfilePhotoUpload({ className }: ProfilePhotoUploadProps) {
    // field.value = the photo link ("" = no photo). Starts with the Google / GitHub photo if he has one.
    const { field, fieldState } = useController<OnboardingFormValues, "avatarUrl">({ name: "avatarUrl" });
    const photoUrl = field.value;

    return (
        <div className={cn("space-y-3", className)}>
            <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
                    Profile Photo
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Upload a friendly, professional photo for your instructor profile.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 rounded-2xl border border-border bg-card/60 p-5 transition-all hover:border-primary/30">
                {/* Avatar Display */}
                <div className="relative group shrink-0">
                    <Avatar className="size-24 rounded-full border-2 border-border/80 shadow-inner ring-4 ring-primary/5">
                        {photoUrl && <AvatarImage src={photoUrl} alt="Teacher profile photo" />}
                        <AvatarFallback className="bg-muted text-muted-foreground">
                            <User className="size-10 stroke-[1.5]" />
                        </AvatarFallback>
                    </Avatar>

                    <span
                        aria-hidden="true"
                        className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow ring-2 ring-background"
                    >
                        <Camera className="size-4" />
                    </span>
                </div>

                {/* Upload Controls & Guidelines */}
                <div className="flex flex-1 flex-col items-center sm:items-start text-center sm:text-left gap-2.5">
                    <div>
                        <h4 className="text-sm font-semibold text-foreground">Instructor Headshot</h4>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                            Clear portrait photo with good lighting. Students connect faster when they can see who is
                            teaching.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        {/* Cloudinary upload window: our button opens it, the image link goes to the form */}
                        <CldUploadWidget
                            uploadPreset="EduWay"
                            options={{
                                sources: ["local", "google_drive", "dropbox", "url"], // local = computer or phone
                                multiple: false,
                                maxFiles: 1,
                                clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                                maxFileSize: 5_000_000, // 5 MB (in bytes)
                                cropping: true,
                                croppingAspectRatio: 1, // a square photo (shown in a circle)
                                showSkipCropButton: false,
                                singleUploadAutoClose: true, // close the window when the upload is done
                            }}
                            onSuccess={(result) => {
                                // result.info is an object on success → save the image link in the form
                                if (result.info && typeof result.info !== "string") {
                                    field.onChange(result.info.secure_url);
                                }
                            }}
                        >
                            {({ open, isLoading }) => (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    rounded="lg"
                                    isLoading={isLoading}
                                    onClick={() => open()}
                                    className="gap-1.5 border-border hover:border-primary/50 hover:bg-accent/50 text-xs font-medium"
                                >
                                    <ImagePlus className="size-3.5" />
                                    {photoUrl ? "Change Image" : "Upload Image"}
                                </Button>
                            )}
                        </CldUploadWidget>

                        {photoUrl && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => field.onChange("")}
                                className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                            >
                                <X className="size-3.5" />
                                Remove
                            </Button>
                        )}
                    </div>

                    <p className="text-[11px] text-muted-foreground/75">Supported formats: JPG, PNG, WebP (Max 5MB)</p>

                    <FieldError message={fieldState.error?.message} />
                </div>
            </div>
        </div>
    );
}
