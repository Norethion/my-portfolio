"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/stores/useLanguageStore";

/**
 * Language Toggle Component
 * Switches between TR and EN languages
 */
export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === "tr" ? "en" : "tr");
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      aria-label="Toggle language"
    >
      <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
      <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium">{language.toUpperCase()}</span>
    </Button>
  );
}

