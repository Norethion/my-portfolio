"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminStore } from "@/stores/useAdminStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Admin Protection Component
 * Protects admin routes by checking authentication state
 */
export function AdminProtection({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You must be authenticated to access this page.</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

