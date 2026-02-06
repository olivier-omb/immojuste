"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            className={cn("peer sr-only", className)}
            {...props}
          />
          <div className="h-5 w-5 rounded border-2 border-brand-gray-light bg-white transition-all duration-200 peer-checked:border-brand-primary peer-checked:bg-brand-primary peer-focus:ring-2 peer-focus:ring-brand-primary peer-focus:ring-offset-2 group-hover:border-brand-gray">
            <Check className="h-full w-full text-white scale-0 peer-checked:scale-100 transition-transform duration-200" />
          </div>
        </div>
        {label && (
          <span className="text-sm text-brand-dark select-none">{label}</span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
