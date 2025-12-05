"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { Navbar } from "@/components/layout/Navbar";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { ExternalLink, Github, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getTechColor } from "@/lib/utils/tech-colors";

interface Project {
  id: number;
  name: string;
  description?: string;
  url: string;
  homepage?: string;
  language?: string;
  stars?: number;
  topics?: string[];
  order: number;
}

/**
 * Projects Page Component
 * Displays portfolio projects from database
 */
export default function ProjectsPage() {
  const language = useLanguageStore((state) => state.language);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());

  const content = {
    tr: {
      title: "Projelerim",
      description: "Geliştirdiğim bazı projeleri keşfedin.",
      githubLink: "GitHub'da Görüntüle",
      liveDemo: "Canlı Demo",
      loading: "Projeler yükleniyor...",
      error: "Projeler yüklenirken bir hata oluştu.",
      noProjects: "Henüz proje bulunmamaktadır.",
      readMore: "Daha fazla göster",
      readLess: "Daha az göster",
    },
    en: {
      title: "My Projects",
      description: "Explore some of the projects I've built.",
      githubLink: "View on GitHub",
      liveDemo: "Live Demo",
      loading: "Loading projects...",
      error: "An error occurred while loading projects.",
      noProjects: "No projects available yet.",
      readMore: "Read more",
      readLess: "Read less",
    },
  };

  const t = content[language];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data.projects || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [t.error]);

  // Format topics to display as technologies
  const getTechnologies = (project: Project) => {
    const techs = [];
    if (project.language) techs.push(project.language);
    if (project.topics && project.topics.length > 0) {
      techs.push(...project.topics.slice(0, 3));
    }
    return techs;
  };

  // Toggle project description expansion
  const toggleExpand = (projectId: number) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  // Check if description needs truncation (rough estimate: more than ~150 characters)
  const needsTruncation = (description?: string) => {
    return description && description.length > 150;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-2 sm:px-4 pt-8 pb-16">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold">{t.title}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">{t.description}</p>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-6 h-[280px] flex flex-col">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="space-y-2 mb-4 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t.noProjects}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const technologies = getTechnologies(project);
                const isExpanded = expandedProjects.has(project.id);
                const shouldShowToggle = needsTruncation(project.description);
                const description = project.description || "";

                return (
                  <div
                    key={project.id}
                    className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg flex flex-col"
                  >
                    <h3 className="mb-2 text-xl font-semibold">{project.name}</h3>
                    <div className="mb-4 flex-1">
                      <p className={`text-sm text-muted-foreground ${!isExpanded && shouldShowToggle ? 'line-clamp-2' : ''}`}>
                        {description}
                      </p>
                      {shouldShowToggle && (
                        <button
                          onClick={() => toggleExpand(project.id)}
                          className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3 w-3" />
                              {t.readLess}
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3" />
                              {t.readMore}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => {
                        const colors = getTechColor(tech);
                        return (
                          <span
                            key={tech}
                            className="rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                            }}
                          >
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Github className="mr-2 h-4 w-4" />
                          {t.githubLink}
                        </Button>
                      </a>
                      {project.homepage && (
                        <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t.liveDemo}
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

