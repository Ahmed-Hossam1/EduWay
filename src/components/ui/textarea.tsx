import { cn } from "@/lib/utils";
import * as React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      errorText,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const isError = !!errorText;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-bold text-muted-foreground uppercase tracking-wider select-none"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "flex w-full rounded-lg border border-border bg-background p-3 outline-none transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
            isError && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
            disabled &&
              "cursor-not-allowed bg-muted/50 dark:bg-muted/30 opacity-50 select-none pointer-events-none",
            className
          )}
        >
          <textarea
            id={textareaId}
            ref={ref}
            disabled={disabled}
            className="min-h-[110px] w-full resize-y bg-transparent text-sm text-inherit outline-none placeholder:text-muted-foreground/60 disabled:cursor-not-allowed"
            {...props}
          />
        </div>

        {errorText && (
          <p className="text-xs font-medium tracking-wide text-destructive">
            {errorText}
          </p>
        )}

        {helperText && !errorText && (
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
