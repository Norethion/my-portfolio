"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { FileInput } from "@/components/ui/file-input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";

interface PersonalInfo {
  id: number | null;
  name: string;
  jobTitle: string;
  bioTr: string; // Turkish bio
  bioEn: string; // English bio
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
  location: string;
  avatar: string;
}

export function PersonalInfoEditor() {
  const [data, setData] = useState<PersonalInfo>({
    id: null,
    name: "",
    jobTitle: "",
    bioTr: "",
    bioEn: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
    location: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const language = useLanguageStore((state) => state.language);

  const content = {
    tr: {
      title: "Kişisel Bilgilerim",
      subtitle: "Ana sayfada görünecek bilgileri düzenleyin",
      name: "İsim",
      jobTitle: "Meslek Unvanı",
      bioTr: "Biyografi (Türkçe)",
      bioEn: "Biyografi (İngilizce)",
      email: "E-posta",
      phone: "Telefon",
      github: "GitHub",
      linkedin: "LinkedIn",
      twitter: "Twitter",
      instagram: "Instagram",
      facebook: "Facebook",
      location: "Konum",
      avatarUrl: "Profil Resmi",
      save: "Kaydet",
      saved: "Bilgiler başarıyla güncellendi",
      error: "Bilgiler güncellenirken bir hata oluştu",
    },
    en: {
      title: "Personal Information",
      subtitle: "Edit the information displayed on the homepage",
      name: "Name",
      jobTitle: "Job Title",
      bioTr: "Biography (Turkish)",
      bioEn: "Biography (English)",
      email: "Email",
      phone: "Phone",
      github: "GitHub",
      linkedin: "LinkedIn",
      twitter: "Twitter",
      instagram: "Instagram",
      facebook: "Facebook",
      location: "Location",
      avatarUrl: "Profile Picture",
      save: "Save",
      saved: "Information updated successfully",
      error: "An error occurred while updating information",
    },
  };

  const t = content[language];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Use admin endpoint to get fresh data without cache
      const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";
      const response = await fetch("/api/admin/personal-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch personal info");
      }
      
      const info = await response.json();
      
      // Convert null values to empty strings for controlled inputs
      setData({
        id: info.id || null,
        name: info.name || "",
        jobTitle: info.jobTitle || "",
        bioTr: info.bioTr || "",
        bioEn: info.bioEn || "",
        email: info.email || "",
        phone: info.phone || "",
        github: info.github || "",
        linkedin: info.linkedin || "",
        twitter: info.twitter || "",
        instagram: info.instagram || "",
        facebook: info.facebook || "",
        location: info.location || "",
        avatar: info.avatar || "",
      });
    } catch (error) {
      console.error("Error fetching personal info:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";
      const response = await fetch("/api/admin/personal-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      toast({
        title: t.saved,
      });
      await fetchData();
    } catch (error) {
      console.error("Error updating personal info:", error);
      toast({
        title: t.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.name}</label>
            <Input
              value={data.name ?? ""}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.jobTitle}</label>
            <Input
              value={data.jobTitle ?? ""}
              onChange={(e) => setData({ ...data, jobTitle: e.target.value })}
              placeholder={language === "tr" ? "örn: Yazılım Geliştirici" : "Software Developer"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.bioTr}</label>
            <Textarea
              value={data.bioTr ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 2000) {
                  setData({ ...data, bioTr: value });
                }
              }}
              rows={3}
              maxLength={2000}
              placeholder={language === "tr" ? "Türkçe biyografinizi yazın..." : "Write your Turkish biography..."}
            />
            <p className="text-xs text-muted-foreground">
              {(data.bioTr ?? "").length}/2000 {language === "tr" ? "karakter" : "characters"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.bioEn}</label>
            <Textarea
              value={data.bioEn ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 2000) {
                  setData({ ...data, bioEn: value });
                }
              }}
              rows={3}
              maxLength={2000}
              placeholder={language === "tr" ? "İngilizce biyografinizi yazın..." : "Write your English biography..."}
            />
            <p className="text-xs text-muted-foreground">
              {(data.bioEn ?? "").length}/2000 {language === "tr" ? "karakter" : "characters"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.email}</label>
              <Input
                type="email"
                value={data.email ?? ""}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="example@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.phone}</label>
              <PhoneInput
                value={data.phone ?? ""}
                onChange={(value) => setData({ ...data, phone: value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.github}</label>
            <Input
              value={data.github ?? ""}
              onChange={(e) => setData({ ...data, github: e.target.value })}
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.linkedin}</label>
            <Input
              value={data.linkedin ?? ""}
              onChange={(e) => setData({ ...data, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.twitter}</label>
            <Input
              value={data.twitter ?? ""}
              onChange={(e) => setData({ ...data, twitter: e.target.value })}
              placeholder="https://twitter.com/yourusername"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.instagram}</label>
            <Input
              value={data.instagram ?? ""}
              onChange={(e) => setData({ ...data, instagram: e.target.value })}
              placeholder="https://instagram.com/yourusername"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.facebook}</label>
            <Input
              value={data.facebook ?? ""}
              onChange={(e) => setData({ ...data, facebook: e.target.value })}
              placeholder="https://facebook.com/yourusername"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.location}</label>
            <Input
              value={data.location ?? ""}
              onChange={(e) => setData({ ...data, location: e.target.value })}
              placeholder="Ankara, Turkey"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.avatarUrl}</label>
            <FileInput
              value={data.avatar}
              onChange={(base64) => setData({ ...data, avatar: base64 })}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              maxSize={2}
            />
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

