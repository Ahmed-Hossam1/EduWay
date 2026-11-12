"use client";

import { ReactNode } from "react";
import { CldUploadWidget, type CldUploadWidgetProps, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

type UploadOptions = NonNullable<CldUploadWidgetProps["options"]>;

export type CloudinaryUploadProps = {
    signatureEndpoint: string;
    options?: UploadOptions;
    onSuccess?: (result: CloudinaryUploadWidgetResults) => void;
    onUploadSuccess?: (url: string, publicId: string) => void;
    children?: (props: { open: () => void; isLoading: boolean }) => ReactNode;
    isUploaded?: boolean;
    label?: string;
    changeLabel?: string;
};

export function CloudinaryUpload({
    signatureEndpoint,
    options,
    onSuccess,
    onUploadSuccess,
    children,
    isUploaded,
    label = "Upload Image",
    changeLabel = "Change Image",
}: CloudinaryUploadProps) {
    const uploadOptions: UploadOptions = {
        multiple: false,
        maxFiles: 1,
        singleUploadAutoClose: true,
        sources: ["local", "google_drive", "dropbox", "url"],
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxFileSize: 5_000_000,
        ...options,
    };

    return (
        <CldUploadWidget
            signatureEndpoint={signatureEndpoint}
            options={uploadOptions}
            onSuccess={(result) => {
                if (result.info && typeof result.info !== "string") {
                    onUploadSuccess?.(result.info.secure_url, result.info.public_id);
                }
                onSuccess?.(result);
            }}
        >
            {({ open, isLoading }) =>
                children ? (
                    children({ open, isLoading: Boolean(isLoading) })
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        rounded="lg"
                        isLoading={Boolean(isLoading)}
                        onClick={() => open()}
                        className="gap-1.5 border-border hover:border-primary/50 hover:bg-accent/50 text-xs font-medium"
                    >
                        <ImagePlus className="size-3.5" />
                        {isUploaded ? changeLabel : label}
                    </Button>
                )
            }
        </CldUploadWidget>
    );
}
