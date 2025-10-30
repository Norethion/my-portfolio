"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * Navigation Bar Component
 * Displays site navigation and theme/language controls with iPhone dynamic island-style active indicator
 */
export function Navbar() {
  const language = useLanguageStore((state) => state.language);
  const pathname = usePathname();
  const [isChangingRoute, setIsChangingRoute] = useState(false);

  useEffect(() => {
    setIsChangingRoute(false);
  }, [pathname]);

  const handleNavClick = () => {
    setIsChangingRoute(true);
  };

  const navItems = [
    { href: "/", label: language === "tr" ? "Ana Sayfa" : "Home" },
    { href: "/projects", label: language === "tr" ? "Projeler" : "Projects" },
    { href: "/cv", label: "CV" },
    { href: "/contact", label: language === "tr" ? "İletişim" : "Contact" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 z-50 -translate-x-1/2 transform">
      <div className="relative">
        {/* Main navbar container - Dynamic Island style */}
        <div className="flex items-center gap-4 rounded-full border border-border bg-background/95 px-4 py-2 shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-background">
          {/* Navigation Items */}
          <div className="flex items-center gap-1 relative">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "group relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full z-10",
                    "hover:scale-105 active:scale-95",
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
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* Divider */}
          <div className="h-6 w-px bg-border" />
          
          {/* Theme and Language Toggles */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

