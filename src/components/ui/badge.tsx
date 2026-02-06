"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-white",
        secondary: "bg-brand-dark text-white",
        outline: "border-2 border-brand-dark text-brand-dark bg-transparent",
        success: "bg-brand-secondary/15 text-brand-secondary",
        warning: "bg-brand-accent/15 text-amber-700",
        error: "bg-brand-primary/15 text-brand-primary",
        info: "bg-info/15 text-info",
        muted: "bg-brand-gray-light text-brand-gray",
        // Match grades
        grade_a: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        grade_b: "bg-sky-100 text-sky-700 border border-sky-200",
        grade_c: "bg-amber-100 text-amber-700 border border-amber-200",
        // New premium variants
        premium: "bg-gradient-primary text-white shadow-sm",
        highlight: "bg-brand-accent text-brand-dark",
        new: "bg-brand-primary text-white animate-pulse-soft",
      },
      size: {
        default: "text-xs px-3 py-1",
        sm: "text-[10px] px-2 py-0.5",
        lg: "text-sm px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );
}

// New: Tag component for property features
interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "selected" | "removable";
  onRemove?: () => void;
}

function Tag({ className, variant = "default", children, onRemove, ...props }: TagProps) {
  const variants = {
    default: "bg-brand-background text-brand-dark hover:bg-brand-gray-light",
    selected: "bg-brand-primary text-white",
    removable: "bg-brand-primary/10 text-brand-primary pr-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
      {variant === "removable" && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 w-5 h-5 rounded-full bg-brand-primary/20 hover:bg-brand-primary/30 flex items-center justify-center transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

export { Badge, badgeVariants, Tag };
