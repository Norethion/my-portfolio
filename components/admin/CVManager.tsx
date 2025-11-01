"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExperiencesManager } from "./cv/ExperiencesManager";
import { EducationManager } from "./cv/EducationManager";
import { SkillsManager } from "./cv/SkillsManager";
import { LinkedInImportDialog } from "./cv/LinkedInImportDialog";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { Briefcase, GraduationCap, Code2, Linkedin } from "lucide-react";

export function CVManager() {
  const language = useLanguageStore((state) => state.language);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const content = {
    tr: {
      title: "CV Yönetimi",
      subtitle: "CV bilgilerinizi yönetin",
      importLinkedIn: "LinkedIn'den İçe Aktar",
      experiences: "Deneyimler",
      education: "Eğitim",
      skills: "Yetenekler",
    },
    en: {
      title: "CV Management",
      subtitle: "Manage your CV information",
      importLinkedIn: "Import from LinkedIn",
      experiences: "Experiences",
      education: "Education",
      skills: "Skills",
    },
  };

  const t = content[language];

  const handleImportSuccess = () => {
    // Trigger refresh by changing key
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{t.title}</h3>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
          <Button onClick={() => setImportDialogOpen(true)}>
            <Linkedin className="mr-2 h-4 w-4" />
            {t.importLinkedIn}
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="experiences" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="experiences">
            <Briefcase className="mr-2 h-4 w-4" />
            {t.experiences}
          </TabsTrigger>
          <TabsTrigger value="education">
            <GraduationCap className="mr-2 h-4 w-4" />
            {t.education}
          </TabsTrigger>
          <TabsTrigger value="skills">
            <Code2 className="mr-2 h-4 w-4" />
            {t.skills}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="experiences" className="mt-6">
          <ExperiencesManager key={`experiences-${refreshKey}`} />
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <EducationManager key={`education-${refreshKey}`} />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillsManager key={`skills-${refreshKey}`} />
        </TabsContent>
      </Tabs>

      <LinkedInImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
}

