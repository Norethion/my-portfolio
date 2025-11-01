"use client";

import { useEffect, useState } from "react";
import { AdminLoginModal } from "./AdminLoginModal";

/**
 * Admin Access Handler Component
 * Listens for Ctrl+K keyboard shortcut to open admin login modal
 * This is the hidden admin access method
 */
export function AdminAccessHandler() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let tapCount = 0;
    let tapTimer: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K keyboard shortcut (desktop)
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Mobile: Double tap on navbar to open admin modal
      // Reset tap count after 300ms if no second tap
      clearTimeout(tapTimer);
      tapCount++;
      
      tapTimer = setTimeout(() => {
        tapCount = 0;
      }, 300);

      if (tapCount === 2) {
        // Check if tap is on navbar area (top 100px of screen)
        const touch = e.changedTouches[0];
        if (touch && touch.clientY < 100) {
          e.preventDefault();
          setOpen(true);
          tapCount = 0;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("touchend", handleTouchEnd, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("touchend", handleTouchEnd, true);
      clearTimeout(tapTimer);
    };
  }, []);

  return <AdminLoginModal open={open} onOpenChange={setOpen} />;
}

