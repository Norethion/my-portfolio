"use client";

import { useEffect, useState } from "react";
import { AdminLoginModal } from "./AdminLoginModal";

/**
 * Admin Access Handler Component
 * Listens for Ctrl+Alt+A keyboard shortcut to open admin login modal
 * This is the hidden admin access method
 */
export function AdminAccessHandler() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Alt+A keyboard shortcut
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <AdminLoginModal open={open} onOpenChange={setOpen} />;
}

