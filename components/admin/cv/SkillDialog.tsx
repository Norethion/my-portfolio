"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguageStore } from "@/stores/useLanguageStore";

interface Skill {
  id?: number;
  name: string;
  category: string;
  level: string;
}

interface SkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill?: Skill | null;
  onSuccess: () => void;
}

export function SkillDialog({
  open,
  onOpenChange,
  skill,
  onSuccess,
}: SkillDialogProps) {
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: "",
    category: "",
    level: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const language = useLanguageStore((state) => state.language);

  const content = {
    tr: {
      title: skill ? "Yetenek Düzenle" : "Yeni Yetenek Ekle",
      subtitle: skill ? "Yetenek bilgilerini güncelleyin" : "Yeni bir yetenek ekleyin",
      name: "Yetenek Adı",
      category: "Kategori",
      level: "Seviye",
      save: "Kaydet",
      cancel: "İptal",
      success: skill ? "Yetenek güncellendi" : "Yetenek eklendi",
      error: "Bir hata oluştu",
      required: "Bu alan zorunludur",
      selectCategory: "Kategori seçin",
      selectLevel: "Seviye seçin",
    },
    en: {
      title: skill ? "Edit Skill" : "Add New Skill",
      subtitle: skill ? "Update skill information" : "Add a new skill",
      name: "Skill Name",
      category: "Category",
      level: "Level",
      save: "Save",
      cancel: "Cancel",
      success: skill ? "Skill updated" : "Skill added",
      error: "An error occurred",
      required: "This field is required",
      selectCategory: "Select category",
      selectLevel: "Select level",
    },
  };

  const t = content[language];

  const categories = {
    "Frontend": { tr: "Frontend", en: "Frontend" },
    "Backend": { tr: "Backend", en: "Backend" },
    "Mobile": { tr: "Mobil", en: "Mobile" },
    "Desktop": { tr: "Masaüstü", en: "Desktop" },
    "DevOps": { tr: "DevOps", en: "DevOps" },
    "Database": { tr: "Veritabanı", en: "Database" },
    "Tools": { tr: "Araçlar", en: "Tools" },
    "Other": { tr: "Diğer", en: "Other" },
  };

  const levels = {
    "Beginner": { tr: "Başlangıç", en: "Beginner" },
    "Intermediate": { tr: "Orta", en: "Intermediate" },
    "Advanced": { tr: "İleri", en: "Advanced" },
    "Expert": { tr: "Uzman", en: "Expert" },
  };

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || "",
        category: skill.category || "",
        level: skill.level || "",
      });
    } else {
      setFormData({
        name: "",
        category: "",
        level: "",
      });
    }
  }, [skill, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.level) {
      toast({
        title: t.required,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";

      if (skill?.id) {
        // Update existing skill
        const response = await fetch(`/api/admin/cv/skills/${skill.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to update skill");
        }
      } else {
        // Create new skill
        const response = await fetch("/api/admin/cv/skills", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to create skill");
        }
      }

      toast({
        title: t.success,
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error saving skill:", error);
      toast({
        title: t.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.subtitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.name}</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.category}</label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categories).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.level}</label>
            <Select
              value={formData.level}
              onValueChange={(value) => setFormData({ ...formData, level: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.selectLevel} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(levels).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {t.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

