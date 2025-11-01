"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ProjectDialog } from "./ProjectDialog";
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
import {
  Plus,
  GripVertical,
  Github,
  ExternalLink,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  RefreshCw,
  Settings,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { CacheSettingsDialog } from "./CacheSettingsDialog";
import { getTechColor } from "@/lib/utils/tech-colors";

interface Project {
  id: number;
  githubId?: number;
  name: string;
  description?: string;
  url: string;
  homepage?: string;
  language?: string;
  stars?: number;
  topics?: string[];
  order: number;
  isVisible: boolean;
  isManual: boolean;
}

interface SyncSettings {
  cacheDuration: number;
  lastSync: string;
}

function ProjectCard({
  project,
  onToggleVisibility,
  onEdit,
  onDelete,
}: {
  project: Project;
  onToggleVisibility: (id: number) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: project.id,
    animateLayoutChanges: () => true,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <Card className="h-full">
        <CardContent className="p-3 h-full flex flex-col">
          <div className="flex items-center gap-3 flex-1 min-h-[60px]">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing flex-shrink-0"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Project Info */}
            <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
              <h3 className="font-semibold text-base flex items-center gap-2">
                {project.name}
                {project.isManual && (
                  <Badge variant="outline" className="text-xs">Manual</Badge>
                )}
              </h3>

              {/* Links */}
              <div className="flex items-center gap-2">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  title="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
                {project.homepage && (
                  <a
                    href={project.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                    title="Live Demo"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Topics / Language */}
              {((project.topics && project.topics.length > 0) || project.language) && (
                <div className="flex flex-wrap gap-1">
                  {project.language && (() => {
                    const colors = getTechColor(project.language);
                    return (
                      <Badge
                        className="text-xs px-2 py-0 flex-shrink-0"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          border: "none",
                        }}
                      >
                        {project.language}
                      </Badge>
                    );
                  })()}
                  {project.topics?.slice(0, 3).map((topic) => {
                    const colors = getTechColor(topic);
                    return (
                      <Badge
                        key={topic}
                        className="text-xs px-2 py-0 flex-shrink-0"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          border: "none",
                        }}
                      >
                        {topic}
                      </Badge>
                    );
                  })}
                  {project.topics && project.topics.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0 flex-shrink-0">
                      +{project.topics.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onToggleVisibility(project.id)}
                title={project.isVisible ? "Hide" : "Show"}
              >
                {project.isVisible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(project)}
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </Button>
              {project.isManual && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDelete(project.id)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSettings, setSyncSettings] = useState<SyncSettings | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "visible" | "hidden">("visible");
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
      title: "Proje Yönetimi",
      subtitle: "Projelerinizi düzenleyin ve GitHub'dan senkronize edin",
      sync: "GitHub Sync",
      settings: "Ayarlar",
      addProject: "Yeni Proje Ekle",
      lastSync: "Son Sync",
      noProjects: "Henüz proje eklenmemiş",
      syncSuccess: "GitHub projeleri başarıyla senkronize edildi",
      syncError: "Sync başarısız oldu",
      toggleSuccess: "Görünürlük güncellendi",
      toggleError: "Görünürlük güncellenemedi",
      deleteSuccess: "Proje silindi",
      deleteError: "Proje silinemedi",
      reorderSuccess: "Sıralama güncellendi",
      reorderError: "Sıralama güncellenemedi",
      deleteConfirm: "Bu projeyi silmek istediğinize emin misiniz?",
      filterByVisibility: "Görünürlüğe Göre Filtrele",
      allProjects: "Tüm Projeler",
      visibleProjects: "Görünür Projeler",
      hiddenProjects: "Gizli Projeler",
      noVisibleProjects: "Görünür proje bulunamadı",
      noHiddenProjects: "Gizli proje bulunamadı",
    },
    en: {
      title: "Project Management",
      subtitle: "Manage your projects and sync from GitHub",
      sync: "Sync GitHub",
      settings: "Settings",
      addProject: "Add New Project",
      lastSync: "Last Sync",
      noProjects: "No projects yet",
      syncSuccess: "GitHub projects synced successfully",
      syncError: "Sync failed",
      toggleSuccess: "Visibility updated",
      toggleError: "Failed to update visibility",
      deleteSuccess: "Project deleted",
      deleteError: "Failed to delete project",
      reorderSuccess: "Order updated",
      reorderError: "Failed to update order",
      deleteConfirm: "Are you sure you want to delete this project?",
      filterByVisibility: "Filter by Visibility",
      allProjects: "All Projects",
      visibleProjects: "Visible Projects",
      hiddenProjects: "Hidden Projects",
      noVisibleProjects: "No visible projects found",
      noHiddenProjects: "No hidden projects found",
    },
  };

  const t = content[language];

  useEffect(() => {
    fetchProjects();
    fetchSyncSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/projects");
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Fetch error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSyncSettings = async () => {
    try {
      const response = await fetch("/api/admin/projects/settings");
      const data = await response.json();
      setSyncSettings(data);
    } catch (error) {
      console.error("Error fetching sync settings:", error);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";
      const response = await fetch("/api/admin/projects/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Sync failed");
      }

      toast({
        title: t.syncSuccess,
      });

      await fetchProjects();
      await fetchSyncSettings();
    } catch (error) {
      console.error("Error syncing:", error);
      toast({
        title: t.syncError,
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Filtrelenmiş liste üzerinde indeksleri bul
    const filteredList = 
      visibilityFilter === "all"
        ? projects
        : visibilityFilter === "visible"
        ? projects.filter((p) => p.isVisible)
        : projects.filter((p) => !p.isVisible);

    const oldFilteredIndex = filteredList.findIndex((p) => p.id === active.id);
    const newFilteredIndex = filteredList.findIndex((p) => p.id === over.id);

    // Eğer filtreleme varsa, tüm listedeki gerçek pozisyonları bul
    if (visibilityFilter !== "all") {
      const oldProject = filteredList[oldFilteredIndex];
      const newProject = filteredList[newFilteredIndex];
      
      const oldGlobalIndex = projects.findIndex((p) => p.id === oldProject.id);
      const newGlobalIndex = projects.findIndex((p) => p.id === newProject.id);
      
      const newProjects = arrayMove(projects, oldGlobalIndex, newGlobalIndex);
      
      setProjects(newProjects);
      
      try {
        const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";
        const response = await fetch("/api/admin/projects/reorder", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: newProjects.map((p, idx) => ({ id: p.id, order: idx })),
          }),
        });

        if (!response.ok) {
          throw new Error("Reorder failed");
        }

        toast({
          title: t.reorderSuccess,
        });
      } catch (error) {
        console.error("Error reordering:", error);
        toast({
          title: t.reorderError,
          variant: "destructive",
        });
        await fetchProjects();
      }
      return;
    }

    // Filtre yoksa normal akış
    const newProjects = arrayMove(projects, oldFilteredIndex, newFilteredIndex);

    // Optimistic update
    setProjects(newProjects);

    try {
      const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";
      const response = await fetch("/api/admin/projects/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: newProjects.map((p, idx) => ({ id: p.id, order: idx })),
        }),
      });

      if (!response.ok) {
        throw new Error("Reorder failed");
      }

      toast({
        title: t.reorderSuccess,
      });
    } catch (error) {
      console.error("Error reordering:", error);
      toast({
        title: t.reorderError,
        variant: "destructive",
      });
      // Revert on error
      await fetchProjects();
    }
  };

  const handleToggleVisibility = async (id: number) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    try {
      const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";
      const response = await fetch(`/api/admin/projects/${id}/visibility`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVisible: !project.isVisible }),
      });

      if (!response.ok) {
        throw new Error("Toggle failed");
      }

      toast({
        title: t.toggleSuccess,
      });

      await fetchProjects();
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast({
        title: t.toggleError,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.deleteConfirm)) return;

    try {
      const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      toast({
        title: t.deleteSuccess,
      });

      await fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: t.deleteError,
        variant: "destructive",
      });
    }
  };


  const formatLastSync = (dateString: string) => {
    if (!dateString) return t.lastSync + ": Never";
    const date = new Date(dateString);
    return t.lastSync + ": " + date.toLocaleString();
  };

  // Filtrelenmiş projeleri hesapla
  const filteredProjects = 
    visibilityFilter === "all"
      ? projects
      : visibilityFilter === "visible"
      ? projects.filter((p) => p.isVisible)
      : projects.filter((p) => !p.isVisible);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>{t.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t.subtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettingsDialogOpen(true)}
                title={t.settings}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={handleSync}
                disabled={syncing}
                className="flex-1 sm:flex-initial"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">{t.sync}</span>
              </Button>
              <Button onClick={() => setDialogOpen(true)} className="flex-1 sm:flex-initial">
                <Plus className="h-4 w-4 mr-2" />
                {t.addProject}
              </Button>
            </div>
          </div>
          {syncSettings && (
            <p className="text-xs text-muted-foreground">
              {formatLastSync(syncSettings.lastSync)}
            </p>
          )}
        </CardHeader>
      </Card>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading...
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t.noProjects}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <Select value={visibilityFilter} onValueChange={(value: "all" | "visible" | "hidden") => setVisibilityFilter(value)}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder={t.filterByVisibility} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allProjects}</SelectItem>
                  <SelectItem value="visible">{t.visibleProjects}</SelectItem>
                  <SelectItem value="hidden">{t.hiddenProjects}</SelectItem>
                </SelectContent>
              </Select>

              {visibilityFilter !== "all" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVisibilityFilter("all")}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  {t.allProjects}
                </Button>
              )}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {visibilityFilter === "visible"
                  ? t.noVisibleProjects
                  : visibilityFilter === "hidden"
                  ? t.noHiddenProjects
                  : t.noProjects}
              </CardContent>
            </Card>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredProjects.map((p) => p.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: '1fr' }}>
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onToggleVisibility={handleToggleVisibility}
                      onEdit={(p) => {
                        setEditingProject(p);
                        setDialogOpen(true);
                      }}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </>
      )}

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingProject(null);
        }}
        project={editingProject}
        onSuccess={fetchProjects}
      />

      <CacheSettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        currentDuration={syncSettings?.cacheDuration || 3600000}
        onSuccess={fetchSyncSettings}
      />
    </div>
  );
}

