"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { AdminProtection } from "@/components/admin/AdminProtection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoEditor } from "@/components/admin/PersonalInfoEditor";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { CVManager } from "@/components/admin/CVManager";
import { MessagesManager } from "@/components/admin/MessagesManager";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { StatsCards } from "@/components/admin/StatsCards";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useAdminStore } from "@/stores/useAdminStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { LogOut, User, Code, FileText, Mail, Settings } from "lucide-react";

/**
 * Admin Dashboard Page Component
 * Main admin panel for managing portfolio content
 */
function AdminDashboardContent() {
  const router = useRouter();
  // Move hooks to top level of component
  const logout = useAdminStore((state) => state.logout);
  const token = useAdminStore((state) => state.token);
  const language = useLanguageStore((state) => state.language);
  const { toast } = useToast();
  // const logout, token, language are already declared

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const content = {
    tr: {
      title: "Admin Paneli",
      subtitle: "Portföy içeriğinizi yönetin",
      logout: "Çıkış Yap",
      tabs: [
        {
          id: "info",
          label: "Bilgilerim",
          icon: User,
          content: "Kişisel bilgilerinizi yönetin"
        },
        {
          id: "projects",
          label: "Projeler",
          icon: Code,
          content: "Projelerinizi yönetin"
        },
        {
          id: "cv",
          label: "CV Bilgileri",
          icon: FileText,
          content: "CV bilgilerinizi yönetin"
        },
      ],
    },
    en: {
      title: "Admin Dashboard",
      subtitle: "Manage your portfolio content",
      logout: "Logout",
      tabs: [
        {
          id: "info",
          label: "Information",
          icon: User,
          content: "Manage your personal information"
        },
        {
          id: "projects",
          label: "Projects",
          icon: Code,
          content: "Manage your projects"
        },
        {
          id: "cv",
          label: "CV Data",
          icon: FileText,
          content: "Manage your CV information"
        },
      ],
    },
  };



  useEffect(() => {
    if (token) {
      checkUnreadMessages();
    }
  }, [token]);

  const checkUnreadMessages = async () => {
    try {
      if (!token) return;

      const response = await fetch("/api/admin/messages/stats", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.count > 0) {
          toast({
            title: language === "tr" ? "Yeni Mesajlar" : "New Messages",
            description: language === "tr"
              ? `${data.count} yeni mesajınız var.`
              : `You have ${data.count} new messages.`,
          });
        }
      }
    } catch (error) {
      console.error("Error checking messages:", error);
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">{t.title}</h1>
              <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t.logout}
            </Button>
          </div>

          <StatsCards />
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="info">
                <User className="mr-2 h-4 w-4" />
                {language === "tr" ? "Bilgilerim" : "Information"}
              </TabsTrigger>
              <TabsTrigger value="projects">
                <Code className="mr-2 h-4 w-4" />
                {language === "tr" ? "Projeler" : "Projects"}
              </TabsTrigger>
              <TabsTrigger value="cv">
                <FileText className="mr-2 h-4 w-4" />
                {language === "tr" ? "CV Bilgileri" : "CV Data"}
              </TabsTrigger>
              <TabsTrigger value="messages">
                <Mail className="mr-2 h-4 w-4" />
                {language === "tr" ? "Mesajlar" : "Messages"}
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" />
                {language === "tr" ? "Ayarlar" : "Settings"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <PersonalInfoEditor />
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <ProjectsManager />
            </TabsContent>

            <TabsContent value="cv" className="mt-6">
              <CVManager />
            </TabsContent>

            <TabsContent value="messages" className="mt-6">
              <MessagesManager />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <SettingsManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminProtection>
      <AdminDashboardContent />
    </AdminProtection>
  );
}

