"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminStore } from "@/stores/useAdminStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Admin Protection Component
 * Protects admin routes by checking authentication state
 */
export function AdminProtection({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const language = useLanguageStore((state) => state.language);

  const content = {
    tr: {
      accessDenied: "Erişim Reddedildi",
      needAuth: "Bu sayfaya erişmek için kimlik doğrulaması gereklidir.",
      goHome: "Ana Sayfaya Dön",
    },
    en: {
      accessDenied: "Access Denied",
      needAuth: "You must be authenticated to access this page.",
      goHome: "Go Home",
    },
  };

  const t = content[language];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{t.accessDenied}</h1>
          <p className="text-muted-foreground">{t.needAuth}</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.goHome}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

