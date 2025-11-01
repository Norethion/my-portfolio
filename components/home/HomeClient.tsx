"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { VantaBackground } from "@/components/effects/VantaBackground";
import { Code } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";

interface HomeClientProps {
  name?: string;
}

/**
 * Home Client Component
 * Client-side interactive parts of the home page
 */
export function HomeClient({ name }: HomeClientProps) {
  const language = useLanguageStore((state) => state.language);

  const content = {
    tr: {
      greeting: "Merhaba, ben",
      viewProjects: "Projelerimi Gör",
    },
    en: {
      greeting: "Hello, I'm",
      viewProjects: "View My Projects",
    },
  };

  const t = content[language];
  
  // Use prop data or fallback to defaults
  const displayName = name || (language === "tr" ? "İsimsiz" : "Anonymous");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <VantaBackground />
      <Navbar />
      <main className="relative z-10 flex h-[calc(100vh-6rem)] items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {t.greeting}
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {displayName}
              </span>
            </h1>
            <div className="flex justify-center">
              <Link href="/projects">
                <Button size="lg">
                  <Code className="mr-2 h-5 w-5" />
                  {t.viewProjects}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

