"use client";

import { useEffect, useRef, useCallback } from "react";

const STORAGE_PREFIX = "immojuste_onboarding_";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useOnboardingDraft<T extends Record<string, any>>(
  role: string,
  formData: T,
  setFormData: (data: T) => void
) {
  const storageKey = `${STORAGE_PREFIX}${role}`;
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const initialized = useRef(false);

  // Restore from localStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as T;
        setFormData(parsed);
      }
    } catch {
      // Ignore parse errors
    }
  }, [storageKey, setFormData]);

  // Save to localStorage on change (debounced 500ms)
  useEffect(() => {
    if (!initialized.current) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(formData));
      } catch {
        // Ignore storage errors
      }
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [formData, storageKey]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  }, [storageKey]);

  return { clearDraft };
}
