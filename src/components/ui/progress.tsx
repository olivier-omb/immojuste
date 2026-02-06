"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "gradient";
  labelPosition?: "right" | "bottom" | "inside";
}

export function Progress({
  value,
  max = 100,
  className,
  showLabel = false,
  size = "md",
  variant = "default",
  labelPosition = "bottom",
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const variantClasses = {
    default: "bg-brand-primary",
    success: "bg-brand-secondary",
    warning: "bg-brand-accent",
    gradient: "bg-gradient-primary",
  };

  const Label = () => (
    <span className={cn(
      "text-sm font-medium",
      variant === "success" ? "text-brand-secondary" :
      variant === "warning" ? "text-amber-600" :
      "text-brand-primary"
    )}>
      {Math.round(percentage)}%
    </span>
  );

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "flex items-center gap-3",
        labelPosition === "bottom" && "flex-col items-stretch gap-1"
      )}>
        <div
          className={cn(
            "w-full bg-brand-gray-light/50 rounded-full overflow-hidden relative",
            sizeClasses[size]
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              variantClasses[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
          {showLabel && labelPosition === "inside" && size === "lg" && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        {showLabel && labelPosition === "right" && <Label />}
      </div>
      {showLabel && labelPosition === "bottom" && (
        <div className="flex justify-end mt-1">
          <Label />
        </div>
      )}
    </div>
  );
}

// Circular progress component
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  variant?: "default" | "success" | "warning";
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  className,
  showLabel = true,
  variant = "default",
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    default: "text-brand-primary",
    success: "text-brand-secondary",
    warning: "text-brand-accent",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-brand-gray-light/50"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={cn("transition-all duration-500 ease-out", colorClasses[variant])}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-lg font-bold", colorClasses[variant])}>
            {Math.round(percentage)}
          </span>
        </div>
      )}
    </div>
  );
}
