"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ExperienceDialog } from "./ExperienceDialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, Edit, Trash2, Building2, MapPin } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useAdminStore } from "@/stores/useAdminStore";
import { Badge } from "@/components/ui/badge";

interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  location?: string;
  employmentType?: string;
  order: number;
}

function ExperienceCard({
  experience,
  onEdit,
  onDelete,
  currentText,
  presentText,
  atText,
}: {
  experience: Experience;
  onEdit: (exp: Experience) => void;
  onDelete: (id: number) => void;
  currentText: string;
  presentText: string;
  atText: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: experience.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="mb-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {experience.position} {atText} {experience.company}
                </h3>
                {experience.current && (
                  <Badge variant="default" className="text-xs">
                    {currentText}
                  </Badge>
                )}
                {experience.employmentType && (
                  <Badge variant="outline" className="text-xs">
                    {experience.employmentType}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>
                  {experience.startDate} - {experience.current ? presentText : experience.endDate || "N/A"}
                </span>
                {experience.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {experience.location}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(experience)}
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(experience.id)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ExperiencesManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const language = useLanguageStore((state) => state.language);
  const token = useAdminStore((state) => state.token);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const content = {
    tr: {
      title: "Deneyimler",
      subtitle: "İş deneyimlerinizi yönetin",
      addExperience: "Deneyim Ekle",
      noExperiences: "Henüz deneyim eklenmemiş",
      deleteConfirm: "Bu deneyimi silmek istediğinize emin misiniz?",
      deleteSuccess: "Deneyim silindi",
      deleteError: "Deneyim silinemedi",
      reorderSuccess: "Sıralama güncellendi",
      reorderError: "Sıralama güncellenemedi",
      loading: "Yükleniyor...",
      current: "Şu An",
      present: "Şu An",
      at: "-",
    },
    en: {
      title: "Experiences",
      subtitle: "Manage your work experiences",
      addExperience: "Add Experience",
      noExperiences: "No experiences yet",
      deleteConfirm: "Are you sure you want to delete this experience?",
      deleteSuccess: "Experience deleted",
      deleteError: "Failed to delete experience",
      reorderSuccess: "Order updated",
      reorderError: "Failed to update order",
      loading: "Loading...",
      current: "Current",
      present: "Present",
      at: "at",
    },
  };

  const t = content[language];

  useEffect(() => {
    if (token) {
      fetchExperiences();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchExperiences = async () => {
    try {
      if (!token) return;
      setLoading(true);
      const response = await fetch("/api/admin/cv/experiences", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExperiences(data.data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast({
        title: "Fetch error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = experiences.findIndex((e) => e.id === active.id);
    const newIndex = experiences.findIndex((e) => e.id === over.id);

    const newExperiences = arrayMove(experiences, oldIndex, newIndex);
    setExperiences(newExperiences);

    try {
      if (!token) throw new Error("Unauthorized");
      const response = await fetch("/api/admin/cv/experiences/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: newExperiences.map((e, idx) => ({ id: e.id, order: idx })),
        }),
      });

      if (!response.ok) {
        throw new Error("Reorder failed");
      }

      toast({ title: t.reorderSuccess });
    } catch (error) {
      console.error("Error reordering:", error);
      toast({
        title: t.reorderError,
        variant: "destructive",
      });
      await fetchExperiences();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.deleteConfirm)) return;

    try {
      if (!token) throw new Error("Unauthorized");
      const response = await fetch(`/api/admin/cv/experiences/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      toast({ title: t.deleteSuccess });
      await fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: t.deleteError,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-2 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4 flex items-center gap-3">
              <Skeleton className="h-4 w-4" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t.addExperience}
          </Button>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t.noExperiences}
          </CardContent>
        </Card>

        <ExperienceDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingExperience(null);
          }}
          experience={editingExperience}
          onSuccess={fetchExperiences}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t.addExperience}
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={experiences.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          {experiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onEdit={(exp) => {
                setEditingExperience(exp);
                setDialogOpen(true);
              }}
              onDelete={handleDelete}
              currentText={t.current}
              presentText={t.present}
              atText={t.at}
            />
          ))}
        </SortableContext>
      </DndContext>

      <ExperienceDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingExperience(null);
        }}
        experience={editingExperience}
        onSuccess={fetchExperiences}
      />
    </div>
  );
}

