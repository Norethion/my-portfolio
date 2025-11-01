"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface Experience {
  id?: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  location?: string;
  employmentType?: string;
}

interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: Experience | null;
  onSuccess: () => void;
}

export function ExperienceDialog({
  open,
  onOpenChange,
  experience,
  onSuccess,
}: ExperienceDialogProps) {
  const [formData, setFormData] = useState<Partial<Experience>>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    location: "",
    employmentType: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const language = useLanguageStore((state) => state.language);

  const content = {
    tr: {
      title: experience ? "Deneyim Düzenle" : "Yeni Deneyim Ekle",
      subtitle: experience
        ? "Deneyim bilgilerini güncelleyin"
        : "Yeni bir deneyim ekleyin",
      company: "Şirket Adı",
      position: "Pozisyon",
      startDate: "Başlangıç Tarihi",
      endDate: "Bitiş Tarihi",
      current: "Devam ediyor",
      description: "Açıklama",
      location: "Konum",
      employmentType: "Çalışma Tipi",
      save: "Kaydet",
      cancel: "İptal",
      success: experience ? "Deneyim güncellendi" : "Deneyim eklendi",
      error: "Bir hata oluştu",
      required: "Bu alan zorunludur",
      placeholderStartDate: "örn: 01/2020",
      placeholderEndDate: "örn: 12/2022",
      placeholderLocation: "örn: İstanbul, Türkiye",
      selectType: "Tip seçin",
      fullTime: "Tam Zamanlı",
      partTime: "Yarı Zamanlı",
      contract: "Sözleşmeli",
      internship: "Stajyer",
      temporary: "Geçici",
      volunteer: "Gönüllü",
      placeholderDescription: "Başarılarınız ve sorumluluklarınız...",
    },
    en: {
      title: experience ? "Edit Experience" : "Add New Experience",
      subtitle: experience
        ? "Update experience information"
        : "Add a new experience",
      company: "Company Name",
      position: "Position",
      startDate: "Start Date",
      endDate: "End Date",
      current: "Current",
      description: "Description",
      location: "Location",
      employmentType: "Employment Type",
      save: "Save",
      cancel: "Cancel",
      success: experience ? "Experience updated" : "Experience added",
      error: "An error occurred",
      required: "This field is required",
      placeholderStartDate: "e.g., January 2020",
      placeholderEndDate: "e.g., December 2022",
      placeholderLocation: "e.g., Istanbul, Turkey",
      selectType: "Select type",
      fullTime: "Full-time",
      partTime: "Part-time",
      contract: "Contract",
      internship: "Internship",
      temporary: "Temporary",
      volunteer: "Volunteer",
      placeholderDescription: "Your achievements and responsibilities...",
    },
  };

  const t = content[language];

  const employmentTypes = {
    "Full-time": { tr: "Tam Zamanlı", en: "Full-time" },
    "Part-time": { tr: "Yarı Zamanlı", en: "Part-time" },
    "Contract": { tr: "Sözleşmeli", en: "Contract" },
    "Internship": { tr: "Stajyer", en: "Internship" },
    "Temporary": { tr: "Geçici", en: "Temporary" },
    "Volunteer": { tr: "Gönüllü", en: "Volunteer" },
  };

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company || "",
        position: experience.position || "",
        startDate: experience.startDate || "",
        endDate: experience.endDate || "",
        current: experience.current || false,
        description: experience.description || "",
        location: experience.location || "",
        employmentType: experience.employmentType || "",
      });
    } else {
      setFormData({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        location: "",
        employmentType: "",
      });
    }
  }, [experience, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company || !formData.position || !formData.startDate) {
      toast({
        title: t.required,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";

      if (experience?.id) {
        // Update existing experience
        const response = await fetch(
          `/api/admin/cv/experiences/${experience.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update experience");
        }
      } else {
        // Create new experience
        const response = await fetch("/api/admin/cv/experiences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to create experience");
        }
      }

      toast({
        title: t.success,
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error saving experience:", error);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.subtitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.company}</label>
              <Input
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.position}</label>
              <Input
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.startDate}</label>
              <Input
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                placeholder={t.placeholderStartDate}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.endDate}</label>
              <Input
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                placeholder={t.placeholderEndDate}
                disabled={formData.current}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="current"
              checked={formData.current}
              onChange={(e) =>
                setFormData({ ...formData, current: e.target.checked })
              }
              className="h-4 w-4"
            />
            <label htmlFor="current" className="text-sm font-medium">
              {t.current}
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.location}</label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder={t.placeholderLocation}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.employmentType}</label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) =>
                  setFormData({ ...formData, employmentType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.selectType} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(employmentTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.description}</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={5}
              placeholder={t.placeholderDescription}
            />
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

