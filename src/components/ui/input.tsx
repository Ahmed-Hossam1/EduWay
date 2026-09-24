import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import * as React from "react";

const containerVariants = cva(
  "flex w-full items-center gap-2 border bg-background outline-none transition-all duration-200",
  {
    variants: {
      variant: {
        outline:
          "border-border bg-background focus-within:border-primary focus-within:ring-primary/20",
        filled:
          "border-transparent bg-muted/70 hover:bg-muted focus-within:border-primary focus-within:bg-background focus-within:ring-primary/20",
        ghost:
          "border-transparent bg-transparent hover:bg-muted/50 focus-within:border-primary focus-within:bg-background focus-within:ring-primary/20",
      },
      Size: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-10 px-3.5 text-sm",
        lg: "h-12 px-4.5 text-base",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
      error: {
        true: "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
      },
      success: {
        true: "border-emerald-600 focus-within:border-emerald-600 focus-within:ring-emerald-600/20 dark:border-emerald-500 dark:focus-within:border-emerald-500 dark:focus-within:ring-emerald-500/20",
      },
      Disabled: {
        true: "opacity-50 cursor-not-allowed bg-muted/50 dark:bg-muted/30 select-none pointer-events-none",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "outline",
      Size: "md",
      rounded: "lg",
    },
  },
);

export interface InputProps
  extends
  React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof containerVariants> {
  id?: string;
  label?: string;
  helperText?: string;
  successText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isValidating?: boolean;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant,
      Size,
      rounded,
      error,
      success,
      Disabled,
      fullWidth,
      label,
      helperText,
      successText,
      errorText,
      leftIcon,
      rightIcon,
      isValidating,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const isError = !!error || !!errorText;
    const isSuccess = !isError && (!!success || !!successText);

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold text-muted-foreground uppercase tracking-wider select-none"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            containerVariants({
              variant,
              Size,
              rounded,
              fullWidth,
              Disabled,
              error: isError,
              success: isSuccess,
            }),
            className,
          )}
        >
          {leftIcon && (
            <div className="text-muted-foreground flex items-center justify-center shrink-0">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={Disabled || undefined}
            aria-busy={isValidating || undefined}
            className="w-full bg-transparent outline-none h-full border-none p-0 text-inherit placeholder:text-muted-foreground/60 disabled:cursor-not-allowed"
            {...props}
          />

          {isValidating ? (
            <LoaderCircle className="size-4 shrink-0 animate-spin text-muted-foreground" />
          ) : (
            rightIcon && (
              <div className="flex shrink-0 items-center justify-center text-muted-foreground">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {errorText && (
          <p className="text-xs text-destructive font-medium tracking-wide">
            {errorText}
          </p>
        )}

        {successText && !errorText && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium tracking-wide">
            {successText}
          </p>
        )}

        {helperText && !errorText && !successText && (
          <p className="text-xs text-muted-foreground font-medium tracking-wide">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;