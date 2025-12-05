"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { EducationDialog } from "./EducationDialog";
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
import { Plus, GripVertical, Edit, Trash2, GraduationCap, MapPin } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useAdminStore } from "@/stores/useAdminStore";

interface Education {
  id: number;
  school: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  grade?: string;
  activities?: string;
  location?: string;
  order: number;
}

function EducationCard({
  education,
  onEdit,
  onDelete,
}: {
  education: Education;
  onEdit: (edu: Education) => void;
  onDelete: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: education.id });

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
                  <GraduationCap className="h-4 w-4" />
                  {education.degree}
                  {education.field && ` in ${education.field}`}
                </h3>
              </div>
              <p className="text-sm font-medium mt-1">{education.school}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>
                  {education.startDate} - {education.endDate || "Ongoing"}
                </span>
                {education.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {education.location}
                  </span>
                )}
                {education.grade && <span>GPA: {education.grade}</span>}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(education)}
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(education.id)}
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

export function EducationManager() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
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
      addEducation: "Eğitim Ekle",
      noEducation: "Henüz eğitim eklenmemiş",
      deleteConfirm: "Bu eğitimi silmek istediğinize emin misiniz?",
      deleteSuccess: "Eğitim silindi",
      deleteError: "Eğitim silinemedi",
      reorderSuccess: "Sıralama güncellendi",
      reorderError: "Sıralama güncellenemedi",
      loading: "Yükleniyor...",
    },
    en: {
      addEducation: "Add Education",
      noEducation: "No education yet",
      deleteConfirm: "Are you sure you want to delete this education?",
      deleteSuccess: "Education deleted",
      deleteError: "Failed to delete education",
      reorderSuccess: "Order updated",
      reorderError: "Failed to update order",
      loading: "Loading...",
    },
  };

  const t = content[language];

  useEffect(() => {
    if (token) {
      fetchEducation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchEducation = async () => {
    try {
      if (!token) return;
      setLoading(true);
      const response = await fetch("/api/admin/cv/education", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEducation(data.data || []);
    } catch (error) {
      console.error("Error fetching education:", error);
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

    const oldIndex = education.findIndex((e) => e.id === active.id);
    const newIndex = education.findIndex((e) => e.id === over.id);

    const newEducation = arrayMove(education, oldIndex, newIndex);
    setEducation(newEducation);

    try {
      if (!token) throw new Error("Unauthorized");
      const response = await fetch("/api/admin/cv/education/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: newEducation.map((e, idx) => ({ id: e.id, order: idx })),
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
      await fetchEducation();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.deleteConfirm)) return;

    try {
      if (!token) throw new Error("Unauthorized");
      const response = await fetch(`/api/admin/cv/education/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      toast({ title: t.deleteSuccess });
      await fetchEducation();
    } catch (error) {
      console.error("Error deleting education:", error);
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

  if (education.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t.addEducation}
          </Button>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t.noEducation}
          </CardContent>
        </Card>

        <EducationDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingEducation(null);
          }}
          education={editingEducation}
          onSuccess={fetchEducation}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t.addEducation}
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={education.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          {education.map((edu) => (
            <EducationCard
              key={edu.id}
              education={edu}
              onEdit={(e) => {
                setEditingEducation(e);
                setDialogOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>

      <EducationDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingEducation(null);
        }}
        education={editingEducation}
        onSuccess={fetchEducation}
      />
    </div>
  );
}

