import { cn } from "@/lib/utils";

interface ErrorMessageProps {
    message?: string;
    className?: string;
}

export function ErrorMessage({
    message,
    className,
}: ErrorMessageProps) {
    if (!message) return null;

    return (
        <div
            className={cn(
                "w-full rounded-md border border-red-500 px-3 py-2 text-sm text-red-500",
                className
            )}
        >
            {message}
        </div>
    );
}