"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-brand-dark mb-2">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-lg border bg-white px-4 py-3 text-sm transition-all duration-200 resize-none",
            "placeholder:text-brand-gray",
            "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-brand-background",
            error
              ? "border-error focus:ring-error"
              : "border-brand-gray-light hover:border-brand-gray",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
