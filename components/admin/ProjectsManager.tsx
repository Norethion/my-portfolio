"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/lib/utils/project-storage";

interface ProjectsManagerProps {
  className?: string;
}

interface CacheStatus {
  lastSync: number | null;
  duration: number;
  minutesUntilNext: number;
}

/**
 * ProjectsManager Component
 * Manages projects with drag-and-drop reordering, visibility toggles, and GitHub sync
 */
export function ProjectsManager({ className }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      showMessage("error", "Failed to load projects");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cache status
  const fetchCacheStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/projects/cache-status");
      if (response.ok) {
        const data = await response.json();
        setCacheStatus(data);
      }
    } catch (error) {
      console.error("Failed to fetch cache status", error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchCacheStatus();
    // Update cache status every minute
    const interval = setInterval(fetchCacheStatus, 60000);
    return () => clearInterval(interval);
  }, [fetchProjects, fetchCacheStatus]);

  const showMessage = (type: "success" | "error" | "info", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Sync with GitHub
  const handleSync = async (force: boolean = false) => {
    try {
      setSyncing(true);
      setMessage(null);
      const url = `/api/admin/projects/sync${force ? "?force=true" : ""}`;
      const response = await fetch(url, { method: "POST" });

      const data = await response.json();

      if (response.ok && data.success) {
        showMessage("success", data.message || "Sync completed successfully");
        await fetchProjects();
        await fetchCacheStatus();
      } else {
        showMessage(
          "error",
          data.message || "Sync failed. " + (data.nextSyncIn ? `Next sync in ${data.nextSyncIn} minutes.` : "")
        );
        await fetchCacheStatus(); // Update cache status even on failure
      }
    } catch (error) {
      showMessage("error", "Failed to sync projects");
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  // Toggle visibility
  const toggleVisibility = async (projectId: number) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_visible: !projects.find((p) => p.id === projectId)?.is_visible,
        }),
      });

      if (response.ok) {
        await fetchProjects();
        showMessage("success", "Visibility updated");
      } else {
        throw new Error("Failed to update visibility");
      }
    } catch (error) {
      showMessage("error", "Failed to update visibility");
      console.error(error);
    }
  };

  // Handle drag start
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newProjects = [...projects];
    const draggedItem = newProjects[draggedIndex];
    newProjects.splice(draggedIndex, 1);
    newProjects.splice(index, 0, draggedItem);

    // Update order_index values
    const updatedProjects = newProjects.map((p, i) => ({
      ...p,
      order_index: i,
    }));

    setProjects(updatedProjects);
    setDraggedIndex(index);
  };

  // Handle drop
  const handleDrop = async () => {
    if (draggedIndex === null) return;

    try {
      const response = await fetch("/api/admin/projects/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projects: projects.map((p) => ({
            id: p.id,
            order_index: p.order_index,
          })),
        }),
      });

      if (response.ok) {
        showMessage("success", "Order updated");
      } else {
        throw new Error("Failed to update order");
      }
    } catch (error) {
      showMessage("error", "Failed to save order");
      console.error(error);
      // Revert on error
      await fetchProjects();
    } finally {
      setDraggedIndex(null);
    }
  };

  // Memoized sorted projects
  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.order_index - b.order_index),
    [projects]
  );

  const canSync = cacheStatus
    ? cacheStatus.minutesUntilNext === 0
    : true;
  const syncBlocked = cacheStatus && cacheStatus.minutesUntilNext > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with sync controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg bg-card">
        <div>
          <h2 className="text-2xl font-bold">Projects Manager</h2>
          <p className="text-sm text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Cache Status */}
          {cacheStatus && (
            <div className="flex items-center gap-2 text-sm">
              {syncBlocked ? (
                <>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Next sync in {cacheStatus.minutesUntilNext}m
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">Sync available</span>
                </>
              )}
              {cacheStatus.lastSync && (
                <span className="text-xs text-muted-foreground">
                  Last: {new Date(cacheStatus.lastSync).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}

          {/* Sync Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => handleSync(false)}
              disabled={syncing || (syncBlocked && !canSync)}
              variant="outline"
              size="sm"
            >
              {syncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync
                </>
              )}
            </Button>

            {syncBlocked && (
              <Button
                onClick={() => handleSync(true)}
                disabled={syncing}
                variant="default"
                size="sm"
              >
                {syncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Force Sync
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={cn(
            "flex items-center gap-2 p-3 rounded-lg",
            message.type === "success" && "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400",
            message.type === "error" && "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400",
            message.type === "info" && "bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
          )}
        >
          {message.type === "success" && <CheckCircle2 className="h-4 w-4" />}
          {message.type === "error" && <XCircle className="h-4 w-4" />}
          {message.type === "info" && <AlertCircle className="h-4 w-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : sortedProjects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No projects found. Click "Sync" to fetch from GitHub.
        </div>
      ) : (
        <div className="space-y-2">
          {sortedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onToggleVisibility={toggleVisibility}
              isDragging={draggedIndex === index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: () => void;
  onToggleVisibility: (id: number) => void;
  isDragging: boolean;
}

/**
 * Compact ProjectCard component with drag-and-drop support
 */
const ProjectCard = React.memo(function ProjectCard({
  project,
  index,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleVisibility,
  isDragging,
}: ProjectCardProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={onDrop}
      onDragEnd={() => {}}
      className={cn(
        "group flex items-center gap-2 p-2 border rounded-lg bg-card transition-all",
        "hover:shadow-md cursor-move",
        isDragging && "opacity-50 scale-95"
      )}
    >
      {/* Drag Handle */}
      <div className="flex-shrink-0 text-muted-foreground hover:text-foreground">
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Project Info - Compact Layout */}
      <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto_auto] gap-2 items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">{project.name}</h3>
            {!project.is_visible && (
              <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                Hidden
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 truncate">
            {project.description}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {project.language && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                {project.language}
              </span>
            )}
            <span className="text-xs text-muted-foreground">? {project.stars}</span>
          </div>
        </div>

        {/* Visibility Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onToggleVisibility(project.id)}
          title={project.is_visible ? "Hide project" : "Show project"}
        >
          {project.is_visible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
});
