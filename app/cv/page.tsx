"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";

/**
 * CV Page Component
 * Displays CV information and allows PDF download
 */
export default function CVPage() {
  const language = useLanguageStore((state) => state.language);

  const content = {
    tr: {
      title: "Özgeçmiş",
      subtitle: "Yazılım Geliştirici",
      experiences: "Deneyim",
      skills: "Yetenekler",
      education: "Eğitim",
      download: "CV İndir",
      print: "Yazdır",
      comingSoon: "CV içeriği yakında eklenecek",
    },
    en: {
      title: "Curriculum Vitae",
      subtitle: "Software Developer",
      experiences: "Experience",
      skills: "Skills",
      education: "Education",
      download: "Download CV",
      print: "Print",
      comingSoon: "CV content coming soon",
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">{t.title}</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {t.subtitle}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                {t.download}
              </Button>
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                {t.print}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-8">
            <p className="text-center text-muted-foreground">{t.comingSoon}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

