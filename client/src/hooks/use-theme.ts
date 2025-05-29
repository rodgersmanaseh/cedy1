import { useContext } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function useTheme() {
  const context = useContext(ThemeProvider);
  if (!context) {
    // Fallback implementation if used outside provider
    const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    
    const toggleTheme = () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    };

    return { theme, toggleTheme };
  }
  return context;
}
