"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "search";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, leftIcon, rightIcon, variant = "default", ...props }, ref) => {
    const variants = {
      default: "border-brand-gray-light hover:border-brand-gray bg-white",
      filled: "border-transparent bg-brand-background hover:bg-brand-gray-light/50",
      search: "border-brand-gray-light bg-white rounded-full pl-12",
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-brand-dark mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200",
              "placeholder:text-brand-gray/70",
              "focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-brand-background",
              variants[variant],
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              error && "border-error focus:ring-error/20 focus:border-error",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-brand-gray">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// Search Input component
interface SearchInputProps extends Omit<InputProps, "variant" | "leftIcon"> {
  onSearch?: (value: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        variant="search"
        leftIcon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        className={cn("rounded-full", className)}
        {...props}
      />
    );
  }
);
SearchInput.displayName = "SearchInput";

export { Input, SearchInput };
