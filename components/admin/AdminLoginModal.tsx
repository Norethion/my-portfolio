"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/stores/useAdminStore";

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Admin Login Modal Component
 * Hidden admin access via Ctrl+Alt+A keyboard shortcut
 * Displays password prompt for admin authentication
 */
export function AdminLoginModal({ open, onOpenChange }: AdminLoginModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useAdminStore((state) => state.login);

  const handleLogin = () => {
    const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || "123456";
    
    if (password === adminKey) {
      login();
      setError("");
      setPassword("");
      onOpenChange(false);
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
          <DialogDescription>
            Enter the admin password to access the admin panel.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter password"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          <Button onClick={handleLogin}>Login</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

