"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, Code, Mail } from "lucide-react";
import { useAdminStore } from "@/stores/useAdminStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
    unreadMessages: number;
    activeProjects: number;
    totalVisitors: number;
    todayVisitors: number;
}

export function StatsCards() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const token = useAdminStore((state) => state.token);
    const language = useLanguageStore((state) => state.language);

    const t = {
        tr: {
            todayVisitors: "Bugünkü Ziyaretçiler",
            todayDesc: "Bugün gelen tekil ziyaretçi",
            totalVisitors: "Toplam Ziyaretçi",
            totalDesc: "Tüm zamanların tekil ziyareti",
            activeProjects: "Aktif Projeler",
            activeDesc: "Görüntülenen projeler",
            unreadMessages: "Okunmamış Mesajlar",
            unreadDesc: "Cevap bekleyen mesajlar",
        },
        en: {
            todayVisitors: "Today's Visitors",
            todayDesc: "Unique visits today",
            totalVisitors: "Total Visitors",
            totalDesc: "All time unique visits",
            activeProjects: "Active Projects",
            activeDesc: "Currently visible projects",
            unreadMessages: "Unread Messages",
            unreadDesc: "Inbox awaiting reply",
        },
    };

    const content = t[language as keyof typeof t] || t.en;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/admin/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchStats();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const cards = [
        {
            title: content.todayVisitors,
            value: stats.todayVisitors,
            icon: Users,
            description: content.todayDesc,
        },
        {
            title: content.totalVisitors,
            value: stats.totalVisitors,
            icon: Eye,
            description: content.totalDesc,
        },
        {
            title: content.activeProjects,
            value: stats.activeProjects,
            icon: Code,
            description: content.activeDesc,
        },
        {
            title: content.unreadMessages,
            value: stats.unreadMessages,
            icon: Mail,
            description: content.unreadDesc,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {card.title}
                        </CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {card.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
