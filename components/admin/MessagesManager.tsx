"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useAdminStore } from "@/stores/useAdminStore";
import { Trash2, MailOpen, RefreshCw, CheckSquare, Square, Mail } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export function MessagesManager() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { toast } = useToast();
    const language = useLanguageStore((state) => state.language);
    const token = useAdminStore((state) => state.token);

    const content = {
        tr: {
            title: "Mesaj Kutusu",
            subtitle: "İletişim formundan gelen mesajlar",
            noMessages: "Henüz mesaj yok.",
            refresh: "Yenile",
            delete: "Sil",
            markRead: "Okundu işaretle",
            markAllRead: "Tümünü Okundu İşaretle",
            deleteSelected: "Seçilenleri Sil",
            selectAll: "Tümünü Seç",
            deselectAll: "Seçimi Kaldır",
            from: "Kimden",
            date: "Tarih",
            subject: "Konu",
            selected: "seçildi",
        },
        en: {
            title: "Messages Inbox",
            subtitle: "Messages from contact form",
            noMessages: "No messages yet.",
            refresh: "Refresh",
            delete: "Delete",
            markRead: "Mark as read",
            markAllRead: "Mark All as Read",
            deleteSelected: "Delete Selected",
            selectAll: "Select All",
            deselectAll: "Deselect All",
            from: "From",
            date: "Date",
            subject: "Subject",
            selected: "selected",
        },
    };

    const t = content[language];

    useEffect(() => {
        if (token) {
            fetchMessages();
        }
    }, [token]);

    const fetchMessages = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch("/api/admin/messages", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setMessages(data.messages || []);
            setSelectedIds([]);
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast({
                title: "Error fetching messages",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (ids: number[]) => {
        if (ids.length === 0) return;
        if (!confirm("Are you sure?")) return;

        try {
            if (!token) throw new Error("Unauthorized");

            // Delete one by one for now as API might not support bulk
            // Ideally we should update API to support bulk delete
            for (const id of ids) {
                await fetch(`/api/admin/messages/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            setMessages(messages.filter((m) => !ids.includes(m.id)));
            setSelectedIds(selectedIds.filter(id => !ids.includes(id)));
            toast({ title: "Deleted successfully" });
        } catch (error) {
            console.error("Error deleting messages:", error);
            toast({ title: "Error deleting", variant: "destructive" });
        }
    };

    const handleMarkAsRead = async (ids: number[]) => {
        try {
            if (!token) throw new Error("Unauthorized");

            for (const id of ids) {
                await fetch(`/api/admin/messages/${id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            }

            setMessages(
                messages.map((m) => ids.includes(m.id) ? { ...m, isRead: true } : m)
            );
            toast({ title: language === "tr" ? "Okundu olarak işaretlendi" : "Marked as read" });
        } catch (error) {
            console.error("Error marking messages:", error);
        }
    };

    const toggleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === messages.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(messages.map(m => m.id));
        }
    };

    // Helper to fix the double timezone shift issue
    // The server seems to store UTC time that matches local time string, 
    // causing +3h shift when displayed in TRT. We subtract timezone offset.
    const formatMessageDate = (dateString: string) => {
        const date = new Date(dateString);
        // Correcting the time if it's consistently 3 hours ahead (due to UTC vs UTC+3 double apply)
        // If the date is 22:00 but reality was 19:00, we subtract 3 hours.
        // 3 hours = 3 * 60 * 60 * 1000 ms
        const correctedDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);
        return format(correctedDate, "dd/MM/yyyy HH:mm", { locale: tr });
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <CardTitle className="text-xl">{t.title}</CardTitle>
                        <CardDescription>{t.subtitle}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        {selectedIds.length > 0 && (
                            <>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(selectedIds)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t.deleteSelected} ({selectedIds.length})
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(selectedIds)}
                                >
                                    <MailOpen className="h-4 w-4 mr-2" />
                                    {t.markRead}
                                </Button>
                            </>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(messages.map(m => m.id))}
                        >
                            {t.markAllRead}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={fetchMessages} disabled={loading}>
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <button
                        onClick={toggleSelectAll}
                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                        {selectedIds.length === messages.length && messages.length > 0 ? (
                            <CheckSquare className="h-4 w-4" />
                        ) : (
                            <Square className="h-4 w-4" />
                        )}
                        {selectedIds.length === messages.length ? t.deselectAll : t.selectAll}
                    </button>
                    <span className="ml-2">
                        {selectedIds.length} {t.selected}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-lg border bg-card">
                                <Skeleton className="h-4 w-4 mt-1" />
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <Skeleton className="h-3 w-1/4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t.noMessages}</p>
                ) : (
                    <div className="space-y-2">
                        {messages.map((message) => {
                            const isSelected = selectedIds.includes(message.id);
                            return (
                                <div
                                    key={message.id}
                                    className={`
                                        group relative flex gap-4 p-4 rounded-lg border transition-all
                                        ${message.isRead ? "bg-card" : "bg-muted/30 border-primary/20"}
                                        ${isSelected ? "border-primary ring-1 ring-primary" : "hover:border-primary/50"}
                                    `}
                                >
                                    <div className="pt-1">
                                        <button onClick={() => toggleSelect(message.id)}>
                                            {isSelected ? (
                                                <CheckSquare className="h-4 w-4 text-primary" />
                                            ) : (
                                                <Square className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex-1 min-w-0 grid gap-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <h3 className={`font-semibold truncate ${!message.isRead && "text-primary"}`}>
                                                    {message.subject}
                                                </h3>
                                                {!message.isRead && (
                                                    <span className="flex h-2 w-2 rounded-full bg-primary shrink-0" />
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {formatMessageDate(message.createdAt)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="font-medium text-foreground">{message.name}</span>
                                            <span>&lt;{message.email}&gt;</span>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                            {message.message}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
