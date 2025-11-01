"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SkillDialog } from "./SkillDialog";
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
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, Edit, Trash2, Code, ArrowUpDown, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { Badge } from "@/components/ui/badge";
import { getTechColor } from "@/lib/utils/tech-colors";

interface Skill {
  id: number;
  name: string;
  category: string;
  level: string;
  order: number;
}

function SkillCard({
  skill,
  onEdit,
  onDelete,
  categoryText,
  levelText,
}: {
  skill: Skill;
  onEdit: (s: Skill) => void;
  onDelete: (id: number) => void;
  categoryText: string;
  levelText: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: skill.id,
    animateLayoutChanges: () => true,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const colors = getTechColor(skill.name);

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <Card className="h-full">
        <CardContent className="p-3 h-full flex flex-col">
          <div className="flex items-center gap-3 flex-1 min-h-[60px]">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing flex-shrink-0"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base flex items-center gap-2 break-words">
                <Code className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{skill.name}</span>
              </h3>
              <Badge
                className="text-xs flex-shrink-0"
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                  border: "none",
                }}
              >
                {categoryText}
              </Badge>
              <Badge variant="outline" className="text-xs flex-shrink-0">
                {levelText}
              </Badge>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(skill)}
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(skill.id)}
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

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();
  const language = useLanguageStore((state) => state.language);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const content = {
    tr: {
      addSkill: "Yetenek Ekle",
      noSkills: "Henüz yetenek eklenmemiş",
      deleteConfirm: "Bu yeteneği silmek istediğinize emin misiniz?",
      deleteSuccess: "Yetenek silindi",
      deleteError: "Yetenek silinemedi",
      reorderSuccess: "Sıralama güncellendi",
      reorderError: "Sıralama güncellenemedi",
      loading: "Yükleniyor...",
      autoSort: "Otomatik Sırala",
      filterByCategory: "Kategoriye Göre Filtrele",
      allCategories: "Tüm Kategoriler",
      sortSuccess: "Yetenekler kategoriye göre sıralandı",
      sortError: "Sıralama yapılamadı",
      noSkillsInCategory: "kategorisinde yetenek bulunamadı",
    },
    en: {
      addSkill: "Add Skill",
      noSkills: "No skills yet",
      deleteConfirm: "Are you sure you want to delete this skill?",
      deleteSuccess: "Skill deleted",
      deleteError: "Failed to delete skill",
      reorderSuccess: "Order updated",
      reorderError: "Failed to update order",
      loading: "Loading...",
      autoSort: "Auto Sort",
      filterByCategory: "Filter by Category",
      allCategories: "All Categories",
      sortSuccess: "Skills sorted by category",
      sortError: "Failed to sort skills",
      noSkillsInCategory: "No skills found in category",
    },
  };

  const categories = {
    Frontend: { tr: "Frontend", en: "Frontend" },
    Backend: { tr: "Backend", en: "Backend" },
    Mobile: { tr: "Mobil", en: "Mobile" },
    Desktop: { tr: "Masaüstü", en: "Desktop" },
    DevOps: { tr: "DevOps", en: "DevOps" },
    Database: { tr: "Veritabanı", en: "Database" },
    Tools: { tr: "Araçlar", en: "Tools" },
    Other: { tr: "Diğer", en: "Other" },
  };

  const levels = {
    Beginner: { tr: "Başlangıç", en: "Beginner" },
    Intermediate: { tr: "Orta", en: "Intermediate" },
    Advanced: { tr: "İleri", en: "Advanced" },
    Expert: { tr: "Uzman", en: "Expert" },
  };

  const t = content[language];

  useEffect(() => {
    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";
      const response = await fetch("/api/admin/cv/skills", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSkills(data.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
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

    // Filtrelenmiş liste üzerinde indeksleri bul
    const oldIndex = filteredSkills.findIndex((s) => s.id === active.id);
    const newIndex = filteredSkills.findIndex((s) => s.id === over.id);

    // Eğer filtreleme varsa, tüm listedeki gerçek pozisyonları bul
    if (selectedCategory !== "all") {
      // Filtrelenmiş listede taşıma yapıldıysa, tüm listedeki konumları hesapla
      const oldSkill = filteredSkills[oldIndex];
      const newSkill = filteredSkills[newIndex];

      // Tüm listedeki indeksleri bul
      const oldGlobalIndex = skills.findIndex((s) => s.id === oldSkill.id);
      const newGlobalIndex = skills.findIndex((s) => s.id === newSkill.id);

      const newSkills = arrayMove(skills, oldGlobalIndex, newGlobalIndex);
      setSkills(newSkills);

      try {
        const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";
        const response = await fetch("/api/admin/cv/skills/reorder", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: newSkills.map((s, idx) => ({ id: s.id, order: idx })),
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
        await fetchSkills();
      }
      return;
    }

    // Filtre yoksa normal akış
    const newSkills = arrayMove(skills, oldIndex, newIndex);
    setSkills(newSkills);

    try {
      const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";
      const response = await fetch("/api/admin/cv/skills/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: newSkills.map((s, idx) => ({ id: s.id, order: idx })),
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
      await fetchSkills();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.deleteConfirm)) return;

    try {
      const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";
      const response = await fetch(`/api/admin/cv/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      toast({ title: t.deleteSuccess });
      await fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast({
        title: t.deleteError,
        variant: "destructive",
      });
    }
  };

  const handleAutoSort = async () => {
    // Kategori sırası
    const categoryOrder = ["Frontend", "Backend", "Desktop", "DevOps", "Database", "Tools", "Other"];

    // Yetenekleri kategoriye göre grupla ve sırala
    const sortedSkills = [...skills].sort((a, b) => {
      const categoryA = categoryOrder.indexOf(a.category);
      const categoryB = categoryOrder.indexOf(b.category);

      // Eğer kategori bulunamazsa en sona koy
      if (categoryA === -1 && categoryB === -1) return a.name.localeCompare(b.name);
      if (categoryA === -1) return 1;
      if (categoryB === -1) return -1;

      // Önce kategoriye göre sırala
      if (categoryA !== categoryB) {
        return categoryA - categoryB;
      }

      // Aynı kategorideyse isme göre alfabetik sırala
      return a.name.localeCompare(b.name);
    });

    // Order değerlerini güncelle
    const updatedSkills = sortedSkills.map((skill, index) => ({
      ...skill,
      order: index,
    }));

    setSkills(updatedSkills);

    try {
      const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";
      const response = await fetch("/api/admin/cv/skills/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: updatedSkills.map((s, idx) => ({ id: s.id, order: idx })),
        }),
      });

      if (!response.ok) {
        throw new Error("Sort failed");
      }

      toast({ title: t.sortSuccess });
    } catch (error) {
      console.error("Error sorting skills:", error);
      toast({
        title: t.sortError,
        variant: "destructive",
      });
      await fetchSkills();
    }
  };

  // Filtrelenmiş yetenekleri hesapla
  const filteredSkills = selectedCategory === "all"
    ? skills
    : skills.filter(skill => skill.category === selectedCategory);

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t.loading}
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t.addSkill}
          </Button>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t.noSkills}
          </CardContent>
        </Card>

        <SkillDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingSkill(null);
          }}
          skill={editingSkill}
          onSuccess={fetchSkills}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t.filterByCategory} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allCategories}</SelectItem>
              {Object.entries(categories).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value[language]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCategory !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              {t.allCategories}
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleAutoSort}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {t.autoSort}
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t.addSkill}
          </Button>
        </div>
      </div>

      {filteredSkills.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {selectedCategory === "all"
              ? t.noSkills
              : `${categories[selectedCategory as keyof typeof categories]?.[language] || selectedCategory} ${t.noSkillsInCategory}`}
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredSkills.map((s) => s.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: '1fr' }}>
              {filteredSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onEdit={(s) => {
                    setEditingSkill(s);
                    setDialogOpen(true);
                  }}
                  onDelete={handleDelete}
                  categoryText={categories[skill.category as keyof typeof categories]?.[language] || skill.category}
                  levelText={levels[skill.level as keyof typeof levels]?.[language] || skill.level}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <SkillDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingSkill(null);
        }}
        skill={editingSkill}
        onSuccess={fetchSkills}
      />
    </div>
  );
}

