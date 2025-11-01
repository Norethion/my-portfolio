"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";
import { useThemeStore } from "@/stores/useThemeStore";

// Global flag to track if THREE.js is loaded
let globalThreeLoaded = false;

/**
 * Vanta.js Birds Background Component
 * Animated birds effect that responds to mouse movement
 */
export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vantaEffect = useRef<any>(null);
  const theme = useThemeStore((state) => state.theme);
  const [threeLoaded, setThreeLoaded] = useState(globalThreeLoaded);

  const initializeVanta = useCallback(async () => {
    // Wait for THREE.js to be available on window (loaded by Script tag)
    // @ts-expect-error - THREE.js is added globally by script tag
    if (typeof window === "undefined" || !window.THREE) {
      return false; // THREE.js not loaded yet
    }

    if (!vantaRef.current) return false;

    try {
      // Dynamic import to avoid SSR issues
      const vanta = await import("vanta/dist/vanta.birds.min");

      // Initialize Vanta.js birds effect
      vantaEffect.current = vanta.default({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: theme === "light" ? 0xfafafa : 0x0a0a0a,
        color1: 0x8b5cf6, // Purple
        color2: 0x3b82f6, // Blue
        birdSize: 1,
        wingSpan: 30.0,
        speedLimit: 5.0,
        separation: 20.0,
        alignment: 20.0,
        cohesion: 20.0,
        quantity: 5.0,
      });

      return true;
    } catch (error) {
      console.error("Failed to initialize Vanta.js:", error);
      return false;
    }
  }, [theme]);

  // Check if THREE.js is already loaded on mount
  useEffect(() => {
    // @ts-expect-error - THREE.js is added globally by script tag
    if (typeof window !== "undefined" && window.THREE) {
      globalThreeLoaded = true;
      setThreeLoaded(true);
    }
  }, []);

  // Initialize Vanta when THREE.js is loaded or theme changes
  useEffect(() => {
    if (!threeLoaded || !vantaRef.current) return;

    initializeVanta();

    // Cleanup on unmount
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, [theme, threeLoaded, initializeVanta]);

  return (
    <>
      {/* Load THREE.js from CDN - required by Vanta.js */}
      {!threeLoaded && (
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            // THREE.js is now available on window.THREE
            globalThreeLoaded = true;
            setThreeLoaded(true);
          }}
          onError={() => {
            console.error("Failed to load THREE.js from CDN");
          }}
        />
      )}
      <div
        ref={vantaRef}
        className="fixed inset-0 -z-10 h-full w-full"
      />
    </>
  );
}

