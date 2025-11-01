"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { AdminProtection } from "@/components/admin/AdminProtection";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/stores/useAdminStore";
import { LogOut, User, Code, FileText } from "lucide-react";

/**
 * Admin Dashboard Page Component
 * Main admin panel for managing portfolio content
 */
function AdminDashboardContent() {
  const router = useRouter();
  const logout = useAdminStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const tabs = [
    { id: "info", label: "Bilgilerim", icon: User, content: "Info management coming soon" },
    { id: "projects", label: "Projeler", icon: Code, content: "Projects management" },
    { id: "cv", label: "CV Bilgileri", icon: FileText, content: "CV data management coming soon" },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === "projects") {
      setActiveTab(activeTab === "projects" ? null : "projects");
    } else {
      setActiveTab(null);
      // TODO: Implement other tabs
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="mt-2 text-muted-foreground">
                Manage your portfolio content
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg cursor-pointer ${
                  activeTab === tab.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-secondary p-3">
                    <tab.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tab.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tab.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Projects Manager */}
          {activeTab === "projects" && (
            <div className="mt-8">
              <ProjectsManager />
            </div>
          )}
        </div>
      </main>
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

