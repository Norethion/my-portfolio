"use client";

import { useEffect } from "react";

export function VisitorTracker() {
    useEffect(() => {
        // Check if we already tracked this session
        const sessionKey = "visitor_tracked_" + new Date().toISOString().split("T")[0];
        if (sessionStorage.getItem(sessionKey)) {
            return;
        }

        const trackVisitor = async () => {
            try {
                await fetch("/api/analytics/track", { method: "POST" });
                sessionStorage.setItem(sessionKey, "true");
            } catch (error) {
                console.error("Failed to track visitor:", error);
            }
        };

        trackVisitor();
    }, []);

    return null;
}
