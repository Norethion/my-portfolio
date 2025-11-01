"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { cn } from "@/lib/utils";

/**
 * Navigation Bar Component
 * Displays site navigation and theme/language controls with iPhone dynamic island-style active indicator
 */
export function Navbar() {
  const language = useLanguageStore((state) => state.language);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: language === "tr" ? "Ana Sayfa" : "Home" },
    { href: "/projects", label: language === "tr" ? "Projeler" : "Projects" },
    { href: "/cv", label: "CV" },
    { href: "/contact", label: language === "tr" ? "İletişim" : "Contact" },
  ];

  return (
    <nav className="z-40 pt-4">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex justify-center">
        {/* Main navbar container - Dynamic Island style */}
        <div className="flex items-center gap-1 sm:gap-4 rounded-full border border-border bg-background/95 px-2 sm:px-4 py-2 shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-background">
          {/* Navigation Items */}
          <div className="flex items-center gap-0.5 sm:gap-1 relative">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group text-nowrap relative px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full z-10",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  
                  {/* Active indicator background - Smooth sliding animation with Framer Motion */}
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-full bg-primary/20 -z-10"
                      initial={false}
                      transition={{
                        layout: {
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          mass: 0.5,
                        },
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* Divider */}
          <div className="h-4 w-px sm:h-6 sm:w-px bg-border" />
          
          {/* Theme and Language Toggles */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </div>
      </div>
    </nav>
  );
}

