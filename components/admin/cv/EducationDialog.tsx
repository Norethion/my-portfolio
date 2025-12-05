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
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useAdminStore } from "@/stores/useAdminStore";

interface Education {
  id?: number;
  school: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  grade?: string;
  activities?: string;
  location?: string;
}

interface EducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  education?: Education | null;
  onSuccess: () => void;
}

export function EducationDialog({
  open,
  onOpenChange,
  education,
  onSuccess,
}: EducationDialogProps) {
  const [formData, setFormData] = useState<Partial<Education>>({
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    description: "",
    grade: "",
    activities: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const language = useLanguageStore((state) => state.language);
  const token = useAdminStore((state) => state.token);

  const content = {
    tr: {
      title: education ? "Eğitim Düzenle" : "Yeni Eğitim Ekle",
      subtitle: education
        ? "Eğitim bilgilerini güncelleyin"
        : "Yeni bir eğitim ekleyin",
      school: "Okul/Üniversite",
      degree: "Derece",
      field: "Alan",
      startDate: "Başlangıç Tarihi",
      endDate: "Bitiş Tarihi",
      grade: "Not Ortalaması",
      description: "Açıklama",
      activities: "Aktiviteler",
      location: "Konum",
      save: "Kaydet",
      cancel: "İptal",
      success: education ? "Eğitim güncellendi" : "Eğitim eklendi",
      error: "Bir hata oluştu",
      required: "Bu alan zorunludur",
      placeholderDegree: "örn: Lisans",
      placeholderField: "örn: Bilgisayar Mühendisliği",
      placeholderStartDate: "örn: 2018",
      placeholderEndDate: "örn: 2022",
      placeholderGrade: "örn: 3.5/4.0 veya 85/100",
      placeholderLocation: "örn: İstanbul, Türkiye",
      placeholderActivities: "Kulüpler, topluluklar, başarılar...",
      placeholderDescription: "Ek detaylar...",
    },
    en: {
      title: education ? "Edit Education" : "Add New Education",
      subtitle: education
        ? "Update education information"
        : "Add a new education",
      school: "School/University",
      degree: "Degree",
      field: "Field of Study",
      startDate: "Start Date",
      endDate: "End Date",
      grade: "Grade/GPA",
      description: "Description",
      activities: "Activities",
      location: "Location",
      save: "Save",
      cancel: "Cancel",
      success: education ? "Education updated" : "Education added",
      error: "An error occurred",
      required: "This field is required",
      placeholderDegree: "e.g., Bachelor's Degree",
      placeholderField: "e.g., Computer Science",
      placeholderStartDate: "e.g., 2018",
      placeholderEndDate: "e.g., 2022",
      placeholderGrade: "e.g., 3.5/4.0 or 85/100",
      placeholderLocation: "e.g., Istanbul, Turkey",
      placeholderActivities: "Clubs, societies, achievements...",
      placeholderDescription: "Additional details...",
    },
  };

  const t = content[language];

  useEffect(() => {
    if (education) {
      setFormData({
        school: education.school || "",
        degree: education.degree || "",
        field: education.field || "",
        startDate: education.startDate || "",
        endDate: education.endDate || "",
        description: education.description || "",
        grade: education.grade || "",
        activities: education.activities || "",
        location: education.location || "",
      });
    } else {
      setFormData({
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
        grade: "",
        activities: "",
        location: "",
      });
    }
  }, [education, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.school || !formData.degree || !formData.startDate) {
      toast({
        title: t.required,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (!token) throw new Error("Unauthorized");

      if (education?.id) {
        // Update existing education
        const response = await fetch(`/api/admin/cv/education/${education.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to update education");
        }
      } else {
        // Create new education
        const response = await fetch("/api/admin/cv/education", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to create education");
        }
      }

      toast({
        title: t.success,
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error saving education:", error);
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
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.school}</label>
            <Input
              value={formData.school}
              onChange={(e) =>
                setFormData({ ...formData, school: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.degree}</label>
              <Input
                value={formData.degree}
                onChange={(e) =>
                  setFormData({ ...formData, degree: e.target.value })
                }
                placeholder={t.placeholderDegree}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.field}</label>
              <Input
                value={formData.field}
                onChange={(e) =>
                  setFormData({ ...formData, field: e.target.value })
                }
                placeholder={t.placeholderField}
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
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.grade}</label>
              <Input
                value={formData.grade}
                onChange={(e) =>
                  setFormData({ ...formData, grade: e.target.value })
                }
                placeholder={t.placeholderGrade}
              />
            </div>

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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.activities}</label>
            <Textarea
              value={formData.activities}
              onChange={(e) =>
                setFormData({ ...formData, activities: e.target.value })
              }
              rows={3}
              placeholder={t.placeholderActivities}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.description}</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
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

