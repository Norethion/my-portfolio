/**
 * LinkedIn JSON Export Parser
 * Parses LinkedIn data export JSON and CSV into CV format
 */

interface LinkedInPosition {
  companyName?: string;
  title?: string;
  location?: string;
  dateStarted?: {
    year?: number;
    month?: number;
  };
  dateLeft?: {
    year?: number;
    month?: number;
  };
  description?: string;
  employmentType?: string;
}

interface LinkedInEducation {
  schoolName?: string;
  degree?: string;
  fieldOfStudy?: string;
  dateStarted?: {
    year?: number;
  };
  dateEnded?: {
    year?: number;
  };
  grade?: string;
  activities?: string;
  description?: string;
}

interface LinkedInSkill {
  name?: string;
}

interface LinkedInProfile {
  Email?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface LinkedInExport {
  Profile?: {
    Profile?: LinkedInProfile;
  };
  Positions?: {
    "Position"?: LinkedInPosition | LinkedInPosition[];
  };
  Education?: {
    "Education"?: LinkedInEducation | LinkedInEducation[];
  };
  Skills?: {
    "Skill"?: LinkedInSkill | LinkedInSkill[];
  };
}

export interface ParsedCVData {
  experiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    location?: string;
    employmentType?: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    grade?: string;
    activities?: string;
    location?: string;
  }>;
  skills: Array<{
    name: string;
    category: string;
    level: string;
  }>;
}

/**
 * Parse LinkedIn export JSON
 */
export function parseLinkedInJSON(jsonData: LinkedInExport): ParsedCVData {
  const data: LinkedInExport = jsonData;

  const result: ParsedCVData = {
    experiences: [],
    education: [],
    skills: [],
  };

  // Parse Positions (Experiences)
  if (data.Positions?.Position) {
    const positions = Array.isArray(data.Positions.Position)
      ? data.Positions.Position
      : [data.Positions.Position];

    result.experiences = positions
      .filter((p) => p.companyName && p.title)
      .map((pos) => {
        const startDate = pos.dateStarted
          ? formatDate(pos.dateStarted.year, pos.dateStarted.month)
          : "Unknown";
        const endDate = pos.dateLeft
          ? formatDate(pos.dateLeft.year, pos.dateLeft.month)
          : undefined;
        const current = !pos.dateLeft;

        return {
          company: pos.companyName || "",
          position: pos.title || "",
          startDate,
          endDate,
          current,
          description: pos.description,
          location: pos.location,
          employmentType: mapEmploymentType(pos.employmentType),
        };
      });
  }

  // Parse Education
  if (data.Education?.Education) {
    const educations = Array.isArray(data.Education.Education)
      ? data.Education.Education
      : [data.Education.Education];

    result.education = educations
      .filter((e) => e.schoolName && e.degree)
      .map((edu) => {
        const startDate = edu.dateStarted
          ? formatDate(edu.dateStarted.year)
          : "Unknown";
        const endDate = edu.dateEnded
          ? formatDate(edu.dateEnded.year)
          : undefined;

        return {
          school: edu.schoolName || "",
          degree: edu.degree || "",
          field: edu.fieldOfStudy,
          startDate,
          endDate,
          description: edu.description,
          grade: edu.grade,
          activities: edu.activities,
        };
      });
  }

  // Parse Skills
  if (data.Skills?.Skill) {
    const skills = Array.isArray(data.Skills.Skill)
      ? data.Skills.Skill
      : [data.Skills.Skill];

    result.skills = skills.filter((s) => s.name).map((skill) => {
      const { category, level } = categorizeSkill(skill.name || "");
      return {
        name: skill.name || "",
        category,
        level,
      };
    });
  }

  return result;
}

/**
 * Format date from LinkedIn data
 */
function formatDate(year?: number, month?: number): string {
  if (!year) return "Unknown";
  if (month) {
    const monthName = getMonthName(month);
    return `${monthName} ${year}`;
  }
  return year.toString();
}

/**
 * Get month name from number
 */
function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1] || "Unknown";
}

/**
 * Parse CSV date format (e.g., "Dec 2024" -> "12/2024")
 */
function parseCSVDate(dateStr?: string): string {
  if (!dateStr || dateStr.trim() === "") return "Unknown";

  // LinkedIn CSV format: "Dec 2024" or "December 2024"
  const monthMap: Record<string, string> = {
    "jan": "01", "january": "01",
    "feb": "02", "february": "02",
    "mar": "03", "march": "03",
    "apr": "04", "april": "04",
    "may": "05",
    "jun": "06", "june": "06",
    "jul": "07", "july": "07",
    "aug": "08", "august": "08",
    "sep": "09", "september": "09",
    "oct": "10", "october": "10",
    "nov": "11", "november": "11",
    "dec": "12", "december": "12",
  };

  const parts = dateStr.trim().toLowerCase().split(/\s+/);
  if (parts.length === 2) {
    const month = monthMap[parts[0]];
    const year = parts[1];
    if (month && year) {
      return `${month}/${year}`;
    }
  }

  // Return as-is if we can't parse it
  return dateStr;
}

/**
 * Map LinkedIn employment type
 */
function mapEmploymentType(type?: string): string {
  if (!type) return "";
  const typeMap: Record<string, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    internship: "Internship",
    temporary: "Temporary",
    volunteer: "Volunteer",
  };
  return typeMap[type.toLowerCase()] || type;
}

// =================================================================
// === GÜNCELLENMİŞ FONKSİYON ===
// =================================================================

/**
 * Categorize skill based on name (Updated with comprehensive list)
 */
function categorizeSkill(skillName: string): { category: string; level: string } {
  const name = skillName.toLowerCase();

  // Frontend skills
  const frontendKeywords = [
    "react",
    "vue",
    "angular",
    "javascript",
    "typescript",
    "html",
    "css",
    "sass",
    "scss",
    "tailwind",
    "bootstrap",
    "next.js",
    "nextjs",
    "vue.js",
    "angular.js",
    "jquery",
    "webpack",
    "vite",
    "framer",
    "three.js",
    "ui/ux",
    "figma",
    "kendo",
    "svelte",
    "mui",
    "materialui",
    "material-ui",
    "babel",
    "blazor",
  ];

  // Backend skills
  const backendKeywords = [
    "node.js",
    "nodejs",
    "express",
    "nest.js",
    "nestjs",
    "django",
    "flask",
    "spring",
    "java",
    "python",
    "go",
    "golang",
    "rust",
    "php",
    "ruby",
    "rails",
    "api",
    "rest",
    "graphql",
    "microservice",
    "asp.net",
    "asp",
    "vbscript",
    "vb.net",
    "wcf",
    "asp.net mvc",
    "asp.net core",
    "web api",
    "c++",
    "cpp",
    "scala",
    "elixir",
    "erlang",
    "haskell",
    "clojure",
    "laravel",
    "symfony",
    "entity framework",
  ];

  // Mobile skills
  const mobileKeywords = [
    "android",
    "mobile",
    "flutter",
    "swift",
    "kotlin",
    "obj-c",
    "objective-c",
    "xamarin",
    "react-native",
    "ionic",
  ];

  // Desktop/Microsoft skills
  const desktopKeywords = [
    "c#",
    "csharp",
    ".net",
    "dotnet",
    "wpf",
    "winforms",
    "uwp",
    "silverlight",
    "devexpress",
    "telerik",
    "syncfusion",
    "c",
    "delphi",
    "pascal",
    "matlab",
    "assembly",
    "asm",
    "f#",
    "fsharp",
  ];

  // DevOps skills
  const devopsKeywords = [
    "docker",
    "kubernetes",
    "k8s",
    "jenkins",
    "gitlab",
    "ci/cd",
    "terraform",
    "ansible",
    "aws",
    "azure",
    "gcp",
    "linux",
    "bash",
    "shell",
    "sh",
    "zsh",
    "nginx",
    "apache",
    "cloud",
    "powershell",
    "github",
    "git",
    "grafana",
    "prometheus",
    "devops",
  ];

  // Database skills
  const databaseKeywords = [
    "postgresql",
    "postgres",
    "mysql",
    "mongodb",
    "redis",
    "elasticsearch",
    "firebase",
    "supabase",
    "sql",
    "nosql",
    "sql server",
    "mssql",
    "oracle",
    "sqlite",
    "cassandra",
    "dynamodb",
    "couchdb",
    "pl/sql",
    "t-sql",
  ];

  // Tools/Other skills
  const toolsKeywords = [
    "jira",
    "confluence",
    "slack",
    "agile",
    "scrum",
    "json",
    "yaml",
    "yml",
    "markdown",
    "md",
    "xml",
  ];

  // Assign category (Priority matters: Frontend > Backend > Mobile > Desktop > DevOps > Database > Tools)
  let category = "Other";
  if (frontendKeywords.some((keyword) => name.includes(keyword))) {
    category = "Frontend";
  } else if (backendKeywords.some((keyword) => name.includes(keyword))) {
    category = "Backend";
  } else if (mobileKeywords.some((keyword) => name.includes(keyword))) {
    category = "Mobile";
  } else if (desktopKeywords.some((keyword) => name.includes(keyword))) {
    category = "Desktop";
  } else if (devopsKeywords.some((keyword) => name.includes(keyword))) {
    category = "DevOps";
  } else if (databaseKeywords.some((keyword) => name.includes(keyword))) {
    category = "Database";
  } else if (toolsKeywords.some((keyword) => name.includes(keyword))) {
    category = "Tools";
  }

  // Default level (can be adjusted manually later)
  const level = "Intermediate";

  return { category, level };
}

/**
 * Validate LinkedIn JSON structure
 */
export function validateLinkedInJSON(jsonData: unknown): {
  valid: boolean;
  error?: string;
} {
  try {
    if (!jsonData || typeof jsonData !== "object") {
      return { valid: false, error: "Invalid JSON format" };
    }

    // Check if it has LinkedIn export structure
    const data = jsonData as LinkedInExport;
    if (!data.Profile && !data.Positions && !data.Education && !data.Skills) {
      return {
        valid: false,
        error: "This doesn't appear to be a LinkedIn export file",
      };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Failed to validate JSON" };
  }
}

/**
 * Parse CSV data (Basic CSV parser)
 */
function parseCSV(csvText: string): string[][] {
  const lines: string[] = [];
  let currentLine = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === '\n' && !insideQuotes) {
      lines.push(currentLine);
      currentLine = '';
      continue;
    }

    currentLine += char;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.map(line => {
    const fields: string[] = [];
    let currentField = '';
    let insideFieldQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        insideFieldQuotes = !insideFieldQuotes;
      } else if (char === ',' && !insideFieldQuotes) {
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }

    fields.push(currentField.trim());
    return fields;
  });
}

/**
 * Parse LinkedIn CSV export (Positions, Education, Skills)
 */
interface LinkedInCSVExport {
  Positions?: string;
  Education?: string;
  Skills?: string;
}

export function parseLinkedInCSV(csvData: LinkedInCSVExport): ParsedCVData {
  const result: ParsedCVData = {
    experiences: [],
    education: [],
    skills: [],
  };

  // Parse Positions (Experiences)
  if (csvData.Positions) {
    const lines = parseCSV(csvData.Positions);
    if (lines.length > 1) {
      const headers = lines[0].map(h => h.toLowerCase());
      const companyIdx = headers.indexOf('company name');
      const titleIdx = headers.indexOf('title');
      const descriptionIdx = headers.indexOf('description');
      const locationIdx = headers.indexOf('location');
      const startedIdx = headers.indexOf('started on');
      const finishedIdx = headers.indexOf('finished on');

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i];
        if (row[companyIdx] && row[titleIdx]) {
          result.experiences.push({
            company: row[companyIdx],
            position: row[titleIdx],
            startDate: parseCSVDate(row[startedIdx]),
            endDate: row[finishedIdx] ? parseCSVDate(row[finishedIdx]) : undefined,
            current: !row[finishedIdx],
            description: row[descriptionIdx],
            location: row[locationIdx],
            employmentType: "",
          });
        }
      }
    }
  }

  // Parse Education
  if (csvData.Education) {
    const lines = parseCSV(csvData.Education);
    if (lines.length > 1) {
      const headers = lines[0].map(h => h.toLowerCase());
      const schoolIdx = headers.indexOf('school name');
      const degreeIdx = headers.indexOf('degree name');
      const startDateIdx = headers.indexOf('start date');
      const endDateIdx = headers.indexOf('end date');
      const notesIdx = headers.indexOf('notes');
      const activitiesIdx = headers.indexOf('activities');

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i];
        if (row[schoolIdx] && row[degreeIdx]) {
          result.education.push({
            school: row[schoolIdx],
            degree: row[degreeIdx],
            field: undefined,
            startDate: parseCSVDate(row[startDateIdx]),
            endDate: row[endDateIdx] ? parseCSVDate(row[endDateIdx]) : undefined,
            description: undefined,
            grade: row[notesIdx],
            activities: row[activitiesIdx],
            location: undefined,
          });
        }
      }
    }
  }

  // Parse Skills
  if (csvData.Skills) {
    const lines = parseCSV(csvData.Skills);
    if (lines.length > 1) {
      const headers = lines[0].map(h => h.toLowerCase());
      const nameIdx = headers.indexOf('name');

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i];
        if (row[nameIdx]) {
          const { category, level } = categorizeSkill(row[nameIdx]);
          result.skills.push({
            name: row[nameIdx],
            category,
            level,
          });
        }
      }
    }
  }

  return result;
}

/**
 * Validate LinkedIn CSV data
 */
export function validateLinkedInCSV(csvData: LinkedInCSVExport): {
  valid: boolean;
  error?: string;
} {
  try {
    if (!csvData || typeof csvData !== "object") {
      return { valid: false, error: "Invalid CSV format" };
    }

    // Check if it has at least one of the expected CSV fields
    if (!csvData.Positions && !csvData.Education && !csvData.Skills) {
      return {
        valid: false,
        error: "This doesn't appear to be a LinkedIn CSV export file",
      };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Failed to validate CSV" };
  }
}