"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "aptiv-theme";

type ThemeContextValue = {
  theme: Theme;
  /** True once the client has read the real theme (avoids SSR icon flicker). */
  mounted: boolean;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  mounted: false,
  setTheme: () => {},
  toggle: () => {},
});

/**
 * Theme provider with no external dependency. The initial `.dark` class is set
 * by an inline script in the document head (see app/layout.tsx) so there is no
 * flash of the wrong theme. This provider just mirrors that state into React and
 * persists explicit user choices to localStorage.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
    setMounted(true);

    // Follow the OS preference live, but only while the user has not made an
    // explicit choice in this app.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      document.documentElement.classList.toggle("dark", e.matches);
      setThemeState(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode / storage disabled — theme still applies for this session.
    }
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "light" : "dark"
    );
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, mounted, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
