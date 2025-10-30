"use client";

import { Navbar } from "@/components/layout/Navbar";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  url: string;
  homepage: string;
  language: string;
  stars: number;
  topics: string[];
  updated_at: string;
  created_at: string;
}

/**
 * Projects Page Component
 * Displays portfolio projects fetched from GitHub API
 */
export default function ProjectsPage() {
  const language = useLanguageStore((state) => state.language);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const content = {
    tr: {
      title: "Projelerim",
      description: "Geliştirdiğim bazı projeleri keşfedin.",
      githubLink: "GitHub'da Görüntüle",
      liveDemo: "Canlı Demo",
      loading: "Projeler yükleniyor...",
      error: "Projeler yüklenirken bir hata oluştu.",
    },
    en: {
      title: "My Projects",
      description: "Explore some of the projects I've built.",
      githubLink: "View on GitHub",
      liveDemo: "Live Demo",
      loading: "Loading projects...",
      error: "An error occurred while loading projects.",
    },
  };

  const t = content[language];

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/github');
        
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        
        const data = await response.json();
        setRepos(data.repos || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching repositories:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [t.error]);

  // Format GitHub topics to display as technologies
  const getTechnologies = (repo: GitHubRepo) => {
    const techs = [];
    if (repo.language) techs.push(repo.language);
    if (repo.topics && repo.topics.length > 0) {
      techs.push(...repo.topics.slice(0, 3));
    }
    return techs;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{t.title}</h1>
            <p className="text-muted-foreground">{t.description}</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t.loading}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : repos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Henüz proje bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {repos.map((repo) => {
                const technologies = getTechnologies(repo);
                return (
                  <div
                    key={repo.id}
                    className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg"
                  >
                    <h3 className="mb-2 text-xl font-semibold">{repo.name}</h3>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {repo.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <a href={repo.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Github className="mr-2 h-4 w-4" />
                          {t.githubLink}
                        </Button>
                      </a>
                      {repo.homepage && (
                        <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
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

