"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/Navbar";
import { Building2, MapPin, GraduationCap, Printer } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { getTechColor } from "@/lib/utils/tech-colors";

interface CVExperience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  location?: string;
  employmentType?: string;
}

interface CVEducation {
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
}

interface CVSkill {
  id: number;
  name: string;
  category: string;
  level: string;
}

interface LanguageItem {
  name?: string;
  level?: string;
}

interface PersonalInfo {
  name?: string;
  jobTitle?: string;
  bioTr?: string;
  bioEn?: string;
  email?: string;
  phone?: string;
  location?: string;
  languages?: string;
  avatar?: string;
  [key: string]: unknown;
}

interface CVData {
  experiences?: CVExperience[];
  education?: CVEducation[];
  skills?: CVSkill[];
  personalInfo?: PersonalInfo | null;
}

/**
 * CV Page Component
 * Displays CV information in a professional two-column layout
 */
export default function CVPage() {
  const language = useLanguageStore((state) => state.language);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);

  const content = {
    tr: {
      title: "Özgeçmiş",
      present: "Şimdi",
      gpa: "GPA",
      loading: "Yükleniyor...",
      noData: "Henüz CV bilgisi eklenmemiş",
      print: "Yazdır",
      contact: "İletişim",
      skills: "Yetenekler",
      experiences: "İş Deneyimi",
      education: "Eğitim",
      frontend: "Frontend",
      backend: "Backend",
      mobile: "Mobil",
      desktop: "Masaüstü",
      devops: "DevOps",
      database: "Veritabanı",
      tools: "Araçlar",
      other: "Diğer",
      languages: "Diller",
      beginner: "Başlangıç",
      intermediate: "Orta",
      advanced: "İleri",
      expert: "Uzman",
    },
    en: {
      title: "Curriculum Vitae",
      present: "Present",
      gpa: "GPA",
      loading: "Loading...",
      noData: "No CV data available yet",
      print: "Print",
      contact: "Contact",
      skills: "Skills",
      experiences: "Work Experience",
      education: "Education",
      frontend: "Frontend",
      backend: "Backend",
      mobile: "Mobile",
      desktop: "Desktop",
      devops: "DevOps",
      database: "Database",
      tools: "Tools",
      other: "Other",
      languages: "Languages",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      expert: "Expert",
    },
  };

  const t = content[language];

  useEffect(() => {
    fetchCVData();
  }, []);

  const fetchCVData = async () => {
    try {
      const response = await fetch("/api/cv");
      const data = await response.json();
      setCvData(data);
    } catch (error) {
      console.error("Error fetching CV data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-8 pb-16">
          <div className="cv-container max-w-[210mm] mx-auto bg-white shadow-lg p-8">
            <div className="mb-6 pb-4 border-b-2 border-gray-100">
              <div className="flex gap-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
              <div className="mt-8 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
              <div>
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!cvData || (!cvData.experiences?.length && !cvData.education?.length && !cvData.skills?.length)) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-8 pb-16">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">{t.title}</h1>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-8">
              <p className="text-center text-muted-foreground">{t.noData}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const personalInfo = cvData.personalInfo || {};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-2 sm:px-4 pt-8 pb-16">
        {/* Title and Print Button */}
        <div className="mb-6 max-w-[210mm] mx-auto no-print-title flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h1 className="text-xl sm:text-2xl font-bold">{t.title}</h1>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors no-print-button text-sm sm:text-base"
          >
            <Printer className="h-4 w-4" />
            <span>{t.print}</span>
          </button>
        </div>

        {/* CV Content - Professional Two-Column Layout */}
        <div
          className="cv-container max-w-[210mm] mx-auto bg-white shadow-lg p-4 sm:p-8 text-black"
        >
          {/* Header Section */}
          <div className="mb-6 pb-4 border-b-2 border-gray-800">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {personalInfo.avatar && (
                <Image
                  src={personalInfo.avatar}
                  alt={personalInfo.name || "Profile"}
                  width={96}
                  height={96}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-800"
                />
              )}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">{personalInfo.name || ""}</h1>
                {personalInfo.jobTitle && (
                  <p className="text-base sm:text-lg text-gray-700">{personalInfo.jobTitle}</p>
                )}
              </div>
            </div>
            {/* Bio Section - First Page (after header) */}
            {(() => {
              // Get bio based on current language
              const bioText = language === "tr"
                ? (personalInfo.bioTr || "")
                : (personalInfo.bioEn || "");

              if (!bioText) return null;

              return (
                <div className="mt-4">
                  <h2 className="text-lg font-bold mb-3 uppercase border-b-2 border-gray-800 pb-1">
                    {language === "tr" ? "Hakkımda" : "About Me"}
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {bioText}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Languages Section */}
          {personalInfo.languages && (() => {
            try {
              const languages = typeof personalInfo.languages === 'string'
                ? JSON.parse(personalInfo.languages) as (LanguageItem | string)[]
                : personalInfo.languages as (LanguageItem | string)[];
              if (Array.isArray(languages) && languages.length > 0) {
                return (
                  <div className="mb-6 pb-4 border-b-2 border-gray-800">
                    <h2 className="text-lg font-bold mb-3 uppercase border-b-2 border-gray-800 pb-1">
                      {t.languages}
                    </h2>
                    <div className="space-y-2">
                      {languages.map((lang, idx: number) => {
                        const langName = typeof lang === 'string' ? lang : lang.name || '';
                        const langLevel = typeof lang === 'string' ? '' : lang.level || '';
                        return (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-800">
                              {langName}
                            </span>
                            <span className="text-xs text-gray-600">
                              {langLevel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            } catch (e) {
              console.error("Error parsing languages:", e);
            }
            return null;
          })()}

          {/* Skills - Compact */}
          {cvData.skills && cvData.skills.length > 0 && (
            <div className="no-print-skills">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold uppercase border-b-2 border-gray-800 pb-1 flex-1">
                  {t.skills}
                </h2>
                <div className="text-xs text-gray-600 flex items-center gap-1.5 ml-4 flex-wrap">
                  <span className="flex items-center gap-0.5">
                    <div className="h-2 w-2 rounded-full bg-gray-600 border border-gray-600" />
                    <span>= {t.beginner}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <div className="h-2 w-2 rounded-full bg-gray-600" />
                    <div className="h-2 w-2 rounded-full bg-gray-600" />
                    <span>= {t.intermediate}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <div className="h-2 w-2 rounded-full bg-gray-600" />
                    <div className="h-2 w-2 rounded-full bg-gray-600" />
                    <div className="h-2 w-2 rounded-full bg-gray-600" />
                    <span>= {t.advanced}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <div className="h-2 w-2 rounded-full bg-gray-600" />
                    <div className="h-2 w-2 rounded-full bg-gray-600" />
                    <div className="h-2 w-2 rounded-full bg-gray-600" />
                    <div className="h-2 w-2 rounded-full bg-gray-600" />
                    <span>= {t.expert}</span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["Frontend", "Backend", "Mobile", "Desktop", "DevOps", "Database", "Tools", "Other"].map((category) => {
                  const categorySkills = cvData.skills?.filter((s) => s.category === category) || [];
                  if (categorySkills.length === 0) return null;

                  const categoryLabels: Record<string, string> = {
                    Frontend: t.frontend,
                    Backend: t.backend,
                    Mobile: t.mobile,
                    Desktop: t.desktop,
                    DevOps: t.devops,
                    Database: t.database,
                    Tools: t.tools,
                    Other: t.other,
                  };

                  return (
                    <div key={category} className={`mb-3 ${category === "Other" ? "md:col-span-2" : ""}`}>
                      <h3 className="font-semibold text-xs mb-1 text-gray-700">
                        {categoryLabels[category] || category}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {categorySkills.map((skill) => {
                          const colors = getTechColor(skill.name);

                          // Map skill level to number of stars
                          const getStarCount = (level: string) => {
                            switch (level) {
                              case "Beginner":
                                return 1;
                              case "Intermediate":
                                return 2;
                              case "Advanced":
                                return 3;
                              case "Expert":
                                return 4;
                              default:
                                return 0;
                            }
                          };

                          const starCount = getStarCount(skill.level);
                          const maxStars = 4;

                          return (
                            <div key={skill.id} className="flex flex-col gap-0.5">
                              <span
                                className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-300"
                                style={{
                                  backgroundColor: colors.bg,
                                  color: colors.text,
                                  borderColor: colors.text,
                                }}
                              >
                                {skill.name}
                              </span>
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: starCount }).map((_, index) => (
                                  <div
                                    key={index}
                                    className="h-2 w-2 rounded-full transition-all border"
                                    style={{
                                      backgroundColor: colors.bg,
                                      borderColor: colors.text,
                                    }}
                                  />
                                ))}
                                {Array.from({ length: maxStars - starCount }).map((_, index) => (
                                  <div
                                    key={`empty-${index}`}
                                    className="h-2 w-2 rounded-full border border-gray-400 bg-transparent"
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Work Experience - Separate Page */}
          {cvData.experiences && cvData.experiences.length > 0 && (
            <div className="page-break-before">
              <h2 className="text-lg font-bold mb-3 uppercase border-b-2 border-gray-800 pb-1 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {t.experiences}
              </h2>
              <div className="space-y-4">
                {cvData.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <h3 className="font-bold text-sm sm:text-base">{exp.position}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <p className="font-semibold text-xs sm:text-sm text-gray-700">{exp.company}</p>
                          {exp.employmentType && (
                            <span className="text-xs text-gray-600">
                              • {exp.employmentType}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-left sm:text-right text-xs sm:text-sm text-gray-600 flex-shrink-0">
                        <div>{exp.startDate} - {exp.current ? t.present : exp.endDate || ""}</div>
                        {exp.location && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cvData.education && cvData.education.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-3 uppercase border-b-2 border-gray-800 pb-1 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {t.education}
              </h2>
              <div className="space-y-4">
                {cvData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <h3 className="font-bold text-sm sm:text-base">
                          {edu.degree}
                          {edu.field && ` - ${edu.field}`}
                        </h3>
                        <p className="font-semibold text-xs sm:text-sm text-gray-700 mt-0.5">{edu.school}</p>
                      </div>
                      <div className="text-left sm:text-right text-xs sm:text-sm text-gray-600 flex-shrink-0">
                        <div>{edu.startDate} - {edu.endDate || t.present}</div>
                        {edu.location && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            <span>{edu.location}</span>
                          </div>
                        )}
                        {edu.grade && (
                          <div className="mt-0.5">{t.gpa}: {edu.grade}</div>
                        )}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-wrap">
                        {edu.description}
                      </p>
                    )}
                    {edu.activities && (
                      <p className="text-sm text-gray-600 mt-1.5 italic">
                        {edu.activities}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
