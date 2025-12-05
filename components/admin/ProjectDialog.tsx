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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useAdminStore } from "@/stores/useAdminStore";

interface Project {
  id?: number;
  githubId?: number;
  name: string;
  description?: string;
  url: string;
  homepage?: string;
  language?: string;
  stars?: number;
  topics?: string[];
  isVisible?: boolean;
  isManual?: boolean;
}

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  onSuccess: () => void;
}

export function ProjectDialog({
  open,
  onOpenChange,
  project,
  onSuccess,
}: ProjectDialogProps) {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: "",
    description: "",
    url: "",
    homepage: "",
    language: "",
    topics: [],
  });
  const [topicInput, setTopicInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const language = useLanguageStore((state) => state.language);
  const token = useAdminStore((state) => state.token);

  const content = {
    tr: {
      title: project ? "Proje Düzenle" : "Yeni Proje Ekle",
      subtitle: project
        ? "Proje bilgilerini güncelleyin"
        : "Yeni bir proje ekleyin",
      name: "Proje Adı",
      descriptionLabel: "Açıklama",
      url: "GitHub URL",
      homepage: "Canlı URL",
      language: "Ana Dil",
      topics: "Teknoloji Etiketleri",
      addTopic: "Etiket Ekle",
      save: "Kaydet",
      cancel: "İptal",
      success: project ? "Proje güncellendi" : "Proje eklendi",
      error: "Bir hata oluştu",
      required: "Bu alan zorunludur",
    },
    en: {
      title: project ? "Edit Project" : "Add New Project",
      subtitle: project ? "Update project information" : "Add a new project",
      name: "Project Name",
      descriptionLabel: "Description",
      url: "GitHub URL",
      homepage: "Live URL",
      language: "Language",
      topics: "Tech Tags",
      addTopic: "Add Tag",
      save: "Save",
      cancel: "Cancel",
      success: project ? "Project updated" : "Project added",
      error: "An error occurred",
      required: "This field is required",
    },
  };

  const t = content[language];

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        url: project.url || "",
        homepage: project.homepage || "",
        language: project.language || "",
        topics: project.topics || [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        url: "",
        homepage: "",
        language: "",
        topics: [],
      });
    }
    setTopicInput("");
  }, [project, open]);

  const handleAddTopic = () => {
    if (topicInput.trim() && !formData.topics?.includes(topicInput.trim())) {
      setFormData({
        ...formData,
        topics: [...(formData.topics || []), topicInput.trim()],
      });
      setTopicInput("");
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setFormData({
      ...formData,
      topics: formData.topics?.filter((t) => t !== topic) || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.url) {
      toast({
        title: t.required,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (!token) throw new Error("Unauthorized");

      if (project?.id) {
        // Update existing project
        const response = await fetch(`/api/admin/projects/${project.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to update project");
        }
      } else {
        // Create new project
        const response = await fetch("/api/admin/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to create project");
        }
      }

      toast({
        title: t.success,
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error saving project:", error);
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
            <label className="text-sm font-medium">{t.name}</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.descriptionLabel}</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.url}</label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.homepage}</label>
              <Input
                value={formData.homepage}
                onChange={(e) =>
                  setFormData({ ...formData, homepage: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.language}</label>
            <Input
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.topics}</label>
            <div className="flex gap-2">
              <Input
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
                placeholder="React, TypeScript..."
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTopic}
                disabled={!topicInput.trim()}
              >
                {t.addTopic}
              </Button>
            </div>
            {formData.topics && formData.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="gap-1">
                    {topic}
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(topic)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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

