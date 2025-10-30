"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { FluidBackground } from "@/components/effects/FluidBackground";
import { Download, Code } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";

/**
 * Home Page Component
 * Main landing page with introduction and call-to-action buttons
 */
export default function Home() {
  const language = useLanguageStore((state) => state.language);

  const content = {
    tr: {
      greeting: "Merhaba, ben",
      name: "Ali Enes Aydemir",
      bio: "Modern web teknolojileri ile yüksek kaliteli, kullanıcı odaklı çözümler geliştiriyorum.",
      viewProjects: "Projelerimi Gör",
      downloadCV: "CV İndir",
    },
    en: {
      greeting: "Hello, I'm",
      name: "Ali Enes Aydemir",
      bio: "Building high-quality, user-focused solutions with modern web technologies.",
      viewProjects: "View My Projects",
      downloadCV: "Download CV",
    },
  };

  const t = content[language];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FluidBackground />
      <Navbar />
      <main className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {t.greeting}
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t.name}
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground sm:text-xl">
              {t.bio}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/projects">
                <Button size="lg" className="w-full sm:w-auto">
                  <Code className="mr-2 h-5 w-5" />
                  {t.viewProjects}
                </Button>
              </Link>
              <Link href="/cv">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Download className="mr-2 h-5 w-5" />
                  {t.downloadCV}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
