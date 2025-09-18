import { useEffect, useLayoutEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";
const KEY = "theme";

const mql =
  typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : null;

function apply(theme: Theme) {
  const root = document.documentElement;
  const systemDark = mql?.matches ?? false;
  const wantDark = theme === "dark" || (theme === "system" && systemDark);
  root.classList.toggle("dark", wantDark);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(KEY);
    return saved === "light" || saved === "dark" ? saved : "system";
  });

  // применяем максимально рано
  useLayoutEffect(() => {
    apply(theme);
  }, [theme]);

  // синхронизируем localStorage
  useEffect(() => {
    if (theme === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, theme);
  }, [theme]);

  // если system — реагируем на смену темы ОС
  useEffect(() => {
    if (!mql || theme !== "system") return;
    const handler = () => apply("system");
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, [theme]);

  return {
    theme,
    isDark: theme === "dark" || (theme === "system" && (mql?.matches ?? false)),
    setTheme,
    // ТОЛЬКО ручной toggle: всегда записываем явный выбор
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };
}
