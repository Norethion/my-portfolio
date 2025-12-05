"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useAdminStore } from "@/stores/useAdminStore";
import { Save, Lock, Github } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function SettingsManager() {
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [githubUsername, setGithubUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { toast } = useToast();
    const language = useLanguageStore((state) => state.language);
    const token = useAdminStore((state) => state.token);

    const content = {
        tr: {
            title: "Ayarlar",
            subtitle: "Yönetici ve sistem ayarlarını yapılandırın",
            github: "GitHub Kullanıcı Adı",
            password: "Yeni Şifre",
            confirmPassword: "Şifre Tekrar",
            save: "Kaydet",
            saved: "Ayarlar güncellendi",
            error: "Bir hata oluştu",
            passwordMismatch: "Şifreler eşleşmiyor",
            passwordHint: "Değiştirmek istemiyorsanız boş bırakın",
        },
        en: {
            title: "Settings",
            subtitle: "Configure admin and system settings",
            github: "GitHub Username",
            password: "New Password",
            confirmPassword: "Confirm Password",
            save: "Save",
            saved: "Settings updated",
            error: "An error occurred",
            passwordMismatch: "Passwords do not match",
            passwordHint: "Leave empty if you don't want to change",
        },
    };

    const t = content[language];

    useEffect(() => {
        if (token) {
            fetchSettings();
        }
    }, [token]);

    const fetchSettings = async () => {
        try {
            if (!token) return;
            const response = await fetch("/api/admin/settings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setGithubUsername(data.github_username || "");
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast({
                title: "Error fetching settings",
                variant: "destructive",
            });
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast({
                title: t.passwordMismatch,
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            if (!token) throw new Error("Unauthorized");

            const body: any = { github_username: githubUsername };
            if (password) {
                body.admin_password = password;
            }

            const response = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error("Update failed");
            }

            toast({
                title: t.saved,
            });

            // Clear password fields
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error updating settings:", error);
            toast({
                title: t.error,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex justify-end">
                        <Skeleton className="h-10 w-24" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            {t.github}
                        </label>
                        <Input
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                            placeholder="username"
                        />
                    </div>

                    <div className="border-t my-4 pt-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                {t.password}
                            </label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t.passwordHint}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                {t.confirmPassword}
                            </label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            {t.save}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
