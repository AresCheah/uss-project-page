import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem("uss-theme");
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * The page follows the system theme until the reader picks one; the pick is
 * written to data-theme on <html>, which the CSS tokens key off.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => readStored() ?? systemTheme());

  useEffect(() => {
    const stored = readStored();
    if (stored) document.documentElement.dataset.theme = stored;
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((previous) => {
      const next: Theme = previous === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("uss-theme", next);
      } catch {
        // Storage can be unavailable (private mode); the toggle still works for this visit.
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
