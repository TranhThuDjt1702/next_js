"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Set `mounted` to true when the component has mounted on the client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering the toggle until the client has mounted
  if (!mounted) return null;

  const isLightMode = theme === "light"; // Check if the current theme is light

  const toggleTheme = () => {
    setTheme(isLightMode ? "dark" : "light"); // Toggle between dark and light themes
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {isLightMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
