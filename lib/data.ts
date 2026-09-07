// Single source of truth for all portfolio content — but the actual editable
// CONTENT (profile, experience, education, skills, certifications, and the
// couple of manually-tracked site-wide facts) lives in ../content/*.json, not
// here. This file imports that JSON, type-checks it against the interfaces
// below (a JSON import is type-checked structurally against whatever type
// annotation it's assigned to — a required field missing or the wrong type
// in the JSON fails `npm run build`'s TypeScript step with a clear error,
// which is real validation, not just a hope that the JSON is well-formed),
// and derives everything the UI actually imports. Component files are
// unaffected by this — they still `import { profile, experience, ... } from
// "@/lib/data"` exactly as before.
//
// To update real content: edit the relevant file under content/, commit,
// push — the existing GitHub Actions workflow rebuilds and redeploys
// automatically. Files can be edited directly on github.com (no local setup
// needed) for a quick text change. scripts/build_resume.py reads the same
// profile/experience/education JSON, so regenerating the resume PDF after an
// edit picks up the change too — see that script's own header for the command.
//
// The API Playground's mock endpoint/preset data (below, unchanged) is
// deliberately NOT in JSON — it's tightly coupled to the typed
// response-resolution logic keyed off specific endpoint ids, not "CV
// content" someone would want to hand-edit.
import profileJson from "@/content/profile.json";
import educationJson from "@/content/education.json";
import experienceJson from "@/content/experience.json";
import skillsJson from "@/content/skills.json";
import certificationsJson from "@/content/certifications.json";
import siteMetaJson from "@/content/site-meta.json";

// One accent color per skill category / stat / cert, cycling through the
// full sourced palette — purely visual grouping, not a ranking.
export type Accent = "primary" | "info" | "success" | "warning" | "danger";

interface ProfileData {
  name: string;
  title: string;
  location: string;
  email: string;
  availability: string;
  summary: string;
  nationality: string;
  spokenLanguages: string[];
  areasOfExpertise: string[];
  resumeUrl: string;
  socials: {
    githubHandle: string;
    github: string;
    linkedin: string;
    linkedinCertifications: string;
  };
}

interface EducationData {
  degree: string;
  school: string;
  location: string;
  period: string;
}

type Role = {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string | null;
  period: string;
  bullets: string[];
};

type Skill = { name: string; level: number };

type SkillCategoryData = {
  category: string;
  accent: Accent;
  skills: Skill[];
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  kind: "certificate" | "publication";
  accent: Accent;
  // Rendered from the source PDF's first page via scripts/render_certificates.py
  // — not present for the ACM publication (no certificate image exists for it).
  image?: string;
  verifyUrl?: string;
  credentialId?: string;
  meta?: string;
};

interface SiteMetaData {
  careerStartDate: string;
  linesOfCodeWritten: string;
}

// JSON string fields widen to plain `string`, not the literal union types
// above (TypeScript does NOT infer literal types for .json module imports
// the way `as const` would) — so an `as` cast alone would silently accept a
// typo'd "accent": "pruple" in the JSON with zero warning. These two small
// checks give a real, actionable build-time error instead ("Invalid accent
// ... in content/skills.json category X — must be one of: ..."), which is
// strictly better than the passive type-check we'd have gotten even if TS
// *did* narrow JSON literals automatically.
const ACCENTS: readonly Accent[] = ["primary", "info", "success", "warning", "danger"];

function assertAccent(value: string, context: string): Accent {
  if (!(ACCENTS as readonly string[]).includes(value)) {
    throw new Error(`Invalid accent "${value}" in ${context} — must be one of: ${ACCENTS.join(", ")}`);
  }
  return value as Accent;
}

function assertCertKind(value: string, context: string): "certificate" | "publication" {
  if (value !== "certificate" && value !== "publication") {
    throw new Error(`Invalid kind "${value}" in ${context} — must be "certificate" or "publication"`);
  }
  return value;
}

const profileData: ProfileData = profileJson;
const educationData: EducationData = educationJson;
const experienceData: Role[] = experienceJson;

const skillCategories: SkillCategoryData[] = skillsJson.map((c) => ({
  category: c.category,
  accent: assertAccent(c.accent, `content/skills.json category "${c.category}"`),
  skills: c.skills,
}));

const certificationsData: Certification[] = certificationsJson.map((c) => ({
  ...c,
  kind: assertCertKind(c.kind, `content/certifications.json entry "${c.id}"`),
  accent: assertAccent(c.accent, `content/certifications.json entry "${c.id}"`),
}));

const siteMeta: SiteMetaData = siteMetaJson;

export const careerStartDate = siteMeta.careerStartDate;

function yearsSince(dateString: string): number {
  const start = new Date(dateString);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const monthDiff = now.getMonth() - start.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < start.getDate())) {
    years -= 1;
  }
  return years;
}

function yearsBetween(startDate: string, endDate: string | null): number {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

// Computed at build time from careerStartDate — redeploying refreshes it.
export const yearsOfExperience = yearsSince(careerStartDate);

export const profile = profileData;
export const socials = profileData.socials;
// Served from public/resume/ — regenerated from the resume's own text with
// the phone number omitted entirely (not just visually redacted), since the
// public Contact section deliberately excludes it too. Regenerate via
// scripts/build_resume.py if the underlying resume content ever changes.
export const resumeUrl = profileData.resumeUrl;
// Deep link to the certifications tab specifically, used by the
// Certifications section's "view all on LinkedIn" CTA.
export const linkedinCertificationsUrl = profileData.socials.linkedinCertifications;

export const education = educationData;

export const experience: Role[] = experienceData;

// Real tenure per role, computed from the dates above — feeds the overview chart.
export const tenureByRole = experience
  .map((role) => ({
    company: role.company,
    years: Math.round(yearsBetween(role.start, role.end) * 10) / 10,
  }))
  .reverse(); // oldest first

// "level" is a self-rated proficiency (0-100), not a factual claim — adjust
// freely in content/skills.json. Derived into the two shapes components
// actually use (a plain category->list map, and a separate category->accent
// map) from ONE array in the JSON, so the two can never drift out of sync
// the way two independently hand-edited maps could.
export const skills: Record<string, Skill[]> = Object.fromEntries(
  skillCategories.map((c) => [c.category, c.skills])
);

export const skillCategoryColors: Record<string, Accent> = Object.fromEntries(
  skillCategories.map((c) => [c.category, c.accent])
);

export const totalSkillsCount = Object.values(skills).reduce((sum, list) => sum + list.length, 0);

export const topSkills = Object.values(skills)
  .flat()
  .sort((a, b) => b.level - a.level)
  .slice(0, 8)
  .reverse(); // vertical bar chart reads bottom-to-top

// Curated, not the full list — see linkedinCertificationsUrl for the rest.
export const certifications: Certification[] = certificationsData;

// Each stat-card icon chip uses its own accent gradient (the same
// primary/info/success/warning swatches Material Dashboard's own sidebar
// color-picker offers) rather than one uniform dark tile — more color, still
// pulled from the exact same sourced palette. Labels/captions/icon/color here
// are presentation config, not CV facts, so they stay in code rather than
// content/*.json; the VALUES are all computed from the JSON-sourced content
// above (or from site-meta.json for the one genuinely manual figure) so they
// can never go stale relative to the content that backs them.
export const stats: Array<{
  label: string;
  value: string;
  caption: string;
  icon: "Code2" | "Briefcase" | "Layers" | "Award";
  color: "primary" | "info" | "success" | "warning";
}> = [
  {
    label: "Lines of Code Written",
    value: siteMeta.linesOfCodeWritten,
    caption: "and counting — updated manually",
    icon: "Code2",
    color: "primary",
  },
  {
    label: "Years of Experience",
    value: `${yearsOfExperience}+`,
    caption: "in software engineering",
    icon: "Briefcase",
    color: "info",
  },
  {
    label: "Technologies & Tools",
    value: `${totalSkillsCount}+`,
    caption: "across the stack",
    icon: "Layers",
    color: "success",
  },
  {
    label: "Certifications Earned",
    value: `${certifications.length}`,
    caption: "more on LinkedIn",
    icon: "Award",
    color: "warning",
  },
];

// ============================================================================
// API Playground — interactive Postman/Swagger-style mock API explorer.
// Deliberately styled distinct from the rest of the dashboard (see
// components/api-playground/*), per agentsmd/DESIGN_SPECS.md. All data below
// is static/mocked — there is no real backend behind these endpoints.
// ============================================================================

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface QueryParam {
  name: string;
  type: "string" | "number" | "boolean";
  description: string;
  required: boolean;
  example?: string;
}

export interface PathParam {
  name: string;
  type: "string" | "number";
  description: string;
  example: string;
}

export interface RequestBodySpec {
  type: "json";
  schema: Record<string, "string" | "number" | "boolean" | "array">;
  example: Record<string, JsonValue>;
}

export interface ResponseSpec {
  statusCode: number;
  statusLabel: string;
  emoji: string;
  contentType: "application/json";
  body: Record<string, JsonValue>;
  description?: string;
}

export interface Endpoint {
  id: string;
  path: string;
  method: HttpMethod;
  category: "profile" | "experience" | "skills" | "projects" | "fun" | "stats" | "search";
  description: string;
  queryParams?: QueryParam[];
  pathParams?: PathParam[];
  requestBody?: RequestBodySpec;
  responses: ResponseSpec[];
}

export interface PresetRequest {
  id: string;
  label: string;
  description: string;
  method: HttpMethod;
  path: string;
  queryParams?: Record<string, string>;
  body?: Record<string, JsonValue>;
}

export interface PresetCategory {
  name: string;
  description?: string;
  presets: PresetRequest[];
}

export interface HistoryItem {
  id: string;
  method: HttpMethod;
  endpoint: string;
  statusCode: number;
  timestamp: number; // epoch ms — easier to persist to localStorage than a Date
}

export const apiPlaygroundEndpoints: Endpoint[] = [
  // ===== PROFILE =====
  {
    id: "get-cv",
    path: "/api/profile/cv",
    method: "GET",
    category: "profile",
    description: "Download Garry's CV as structured data",
    responses: [
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "✅",
        contentType: "application/json",
        body: {
          status: "success",
          message: "CV loaded fresh from the vault",
          data: {
            name: "Garry Stevens",
            title: "Backend Engineer",
            location: "South Jakarta, Indonesia",
            email: "stevens.garrys@gmail.com",
            bio: "Backend Engineer with 7+ years of experience building enterprise-grade Java applications. Passionate about clean code, system reliability, and shipping features that matter.",
            summary:
              "Experienced in designing RESTful services, optimizing databases, and improving system reliability in production environments. Strong focus on data integrity, performance optimization, and writing testable, maintainable code.",
            links: {
              github: "https://github.com/garrystevens007",
              linkedin: "https://linkedin.com/in/garrystevens",
            },
          },
        },
      },
    ],
  },
  {
    id: "get-about",
    path: "/api/profile/about",
    method: "GET",
    category: "profile",
    description: "Get more about Garry (playful narrative version)",
    responses: [
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "✅",
        contentType: "application/json",
        body: {
          status: "success",
          message: "Found 1 backend engineer in database",
          data: {
            who: "Garry Stevens - a backend engineer who actually ships things",
            currently: "Building distributed systems and fixing production bugs at 3 AM",
            passionate_about: [
              "RESTful API design",
              "Database optimization",
              "System reliability",
              "Clean, testable code",
              "Mentoring junior engineers",
            ],
            fun_fact:
              "Has fixed more security vulnerabilities than can be counted on fingers. Currently leading initiatives on code quality and system resilience.",
            open_to: ["Opportunities", "Collaborations", "Interesting projects"],
            response_time: "Usually replies within 24 hours",
          },
        },
      },
    ],
  },
  {
    id: "post-contact",
    path: "/api/profile/contact",
    method: "POST",
    category: "profile",
    description: "Send Garry a message (simulated)",
    requestBody: {
      type: "json",
      schema: { name: "string", email: "string", subject: "string", message: "string" },
      example: {
        name: "John Doe",
        email: "john@example.com",
        subject: "Let's collaborate",
        message: "I think we could build something great together...",
      },
    },
    responses: [
      {
        statusCode: 201,
        statusLabel: "Created",
        emoji: "🎉",
        contentType: "application/json",
        body: {
          status: "success",
          message: "Message received and queued for processing",
          data: {
            ticket_id: "MSG-20240907-XYZ123",
            submitted_at: "2024-09-07T10:30:45Z",
            estimated_response: "24 hours",
            note: "Garry will review this message and respond personally. Thanks for reaching out!",
          },
        },
      },
      {
        statusCode: 400,
        statusLabel: "Bad Request",
        emoji: "⚠️",
        contentType: "application/json",
        body: {
          status: "error",
          message: "Validation failed",
          errors: {
            email: "Invalid email format",
            message: "Message must be at least 10 characters",
          },
        },
      },
    ],
  },

  // ===== EXPERIENCE =====
  {
    id: "get-experience-timeline",
    path: "/api/experience/timeline",
    method: "GET",
    category: "experience",
    description: "Get career timeline with detailed roles",
    responses: [
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "✅",
        contentType: "application/json",
        body: {
          status: "success",
          data: {
            total_years: yearsOfExperience,
            companies: 2,
            roles: [
              {
                position: "Software Engineer",
                company: "Unit4 — United Kingdom, Remote",
                duration: "May 2023 — Present",
                highlights: [
                  "Identified and remediated a critical security vulnerability where user passwords were stored in plaintext",
                  "Developed and maintained enterprise REST APIs in Java for ERP modules",
                  "Investigated and resolved production incidents using root-cause analysis",
                  "Optimized SQL queries to improve performance of data-intensive workflows",
                  "Contributed to CI/CD workflows using Jenkins and Azure DevOps",
                ],
              },
              {
                position: "Software Engineer",
                company: "Samsung Research Indonesia — Jakarta, Hybrid",
                duration: "Feb 2022 — Apr 2023",
                highlights: [
                  "Designed and developed an internal web platform supporting AI training workflows",
                  "Built ~10 RESTful API endpoints from scratch using Java MVC pattern",
                  "Modeled database interactions and implemented backend logic",
                  "Implemented Elasticsearch indexing for improved search accuracy",
                  "Containerized services using Docker for consistent development environments",
                  "Worked in Agile environment using Jira and Kanban for iterative delivery",
                ],
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: "get-experience-role",
    path: "/api/experience/roles/{company}",
    method: "GET",
    category: "experience",
    description: "Get detailed information about a specific role",
    pathParams: [
      { name: "company", type: "string", description: 'Company name: "unit4" or "samsung"', example: "unit4" },
    ],
    responses: [
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "✅",
        contentType: "application/json",
        body: {
          status: "success",
          data: {
            position: "Software Engineer",
            company: "Unit4",
            location: "United Kingdom, Remote",
            duration: "May 2023 — Present",
            duration_months: 16,
            key_achievements: [
              {
                title: "Security Vulnerability Fix",
                description:
                  "Identified and fixed a critical vulnerability where passwords were stored in plaintext. Implemented secure encryption and safe handling across API and database layers.",
                impact: "100% of users secured",
              },
              {
                title: "REST API Development",
                description:
                  "Developed and maintained enterprise REST APIs in Java for ERP modules, ensuring backward compatibility.",
                impact: "Delivering backend enhancements end-to-end",
              },
            ],
          },
        },
      },
      {
        statusCode: 404,
        statusLabel: "Not Found",
        emoji: "🤔",
        contentType: "application/json",
        body: {
          status: "error",
          message: "Company not found",
          available_companies: ["unit4", "samsung"],
        },
      },
    ],
  },

  // ===== SKILLS =====
  {
    id: "get-skills",
    path: "/api/skills",
    method: "GET",
    category: "skills",
    description: "Get all skills grouped by category",
    queryParams: [
      { name: "category", type: "string", description: "Filter by skill category", required: false, example: "languages" },
    ],
    responses: [
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "✅",
        contentType: "application/json",
        body: {
          status: "success",
          data: {
            languages: [
              { skill: "Java", proficiency: 90, years: 7 },
              { skill: "SQL", proficiency: 85, years: 6 },
              { skill: "JavaScript", proficiency: 70, years: 4 },
            ],
            frameworks: [
              { skill: "Spring Boot", proficiency: 85, years: 6 },
              { skill: "RESTful APIs", proficiency: 90, years: 7 },
              { skill: "MVC Pattern", proficiency: 85, years: 5 },
            ],
            databases: [
              { skill: "MySQL", proficiency: 80, years: 5 },
              { skill: "PostgreSQL", proficiency: 75, years: 4 },
              { skill: "Elasticsearch", proficiency: 70, years: 2 },
            ],
            tools: [
              { skill: "Docker", proficiency: 75, years: 3 },
              { skill: "Git", proficiency: 85, years: 7 },
              { skill: "Jenkins", proficiency: 70, years: 2 },
            ],
          },
        },
      },
    ],
  },
  {
    id: "get-skill-detail",
    path: "/api/skills/{skillName}",
    method: "GET",
    category: "skills",
    description: "Get detailed info about a specific skill",
    pathParams: [
      { name: "skillName", type: "string", description: 'Skill name: "java", "spring", "docker", etc.', example: "java" },
    ],
    responses: [
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "✅",
        contentType: "application/json",
        body: {
          status: "success",
          data: {
            skill: "Java",
            proficiency_level: "Expert",
            proficiency_score: 90,
            years_of_experience: 7,
            description: "Extensive experience building enterprise-grade Java applications",
            projects_used_in: ["ERP modules at Unit4", "AI training platform at Samsung", "Multiple microservices"],
            expertise: [
              "Object-oriented design",
              "Concurrency and multithreading",
              "Spring Framework ecosystem",
              "JUnit and Mockito for testing",
              "Maven and Gradle for build management",
            ],
          },
        },
      },
    ],
  },

  // ===== PROJECTS =====
  {
    id: "get-projects",
    path: "/api/projects",
    method: "GET",
    category: "projects",
    description: "Get list of featured projects",
    queryParams: [
      { name: "limit", type: "number", description: "Number of projects to return", required: false, example: "10" },
      { name: "tech", type: "string", description: "Filter by technology", required: false, example: "java" },
    ],
    responses: [
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "✅",
        contentType: "application/json",
        body: {
          status: "success",
          count: 3,
          data: [
            {
              id: "proj-001",
              name: "AI Training Platform",
              description: "Internal web platform supporting AI training workflows",
              company: "Samsung Research Indonesia",
              duration: "Feb 2022 — Apr 2023",
              technologies: ["Java", "Spring Boot", "REST API", "MySQL", "Docker"],
              highlights: [
                "Built 10+ REST API endpoints from scratch",
                "Implemented Elasticsearch for search accuracy",
                "Containerized microservices with Docker",
              ],
            },
            {
              id: "proj-002",
              name: "Security Vulnerability Remediation",
              description: "Fixed critical security vulnerability in enterprise system",
              company: "Unit4",
              duration: "May 2023 — Jun 2023",
              technologies: ["Java", "Encryption", "Security", "Spring"],
              highlights: [
                "Identified plaintext password storage issue",
                "Implemented secure encryption mechanisms",
                "Secured 100% of user data",
              ],
            },
            {
              id: "proj-003",
              name: "Java Training Curriculum",
              description: "Structured Java curriculum and hands-on projects for a national upskilling program",
              company: "Course-Net Indonesia",
              duration: "Feb 2019 — Jan 2022",
              technologies: ["Java", "Curriculum Design", "Mentoring"],
              highlights: ["Delivered Java training to 500+ students", "Designed hands-on, job-readiness-focused projects"],
            },
          ],
        },
      },
    ],
  },
  {
    id: "get-project-detail",
    path: "/api/projects/{projectId}",
    method: "GET",
    category: "projects",
    description: "Get detailed info about a specific project",
    pathParams: [{ name: "projectId", type: "string", description: "Project ID", example: "proj-001" }],
    responses: [
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "✅",
        contentType: "application/json",
        body: {
          status: "success",
          data: {
            id: "proj-001",
            name: "AI Training Platform",
            description:
              "Internal web platform supporting AI training workflows with Elasticsearch integration and Docker containerization",
            company: "Samsung Research Indonesia",
            role: "Software Engineer",
            duration: "14 months",
            technologies: ["Java", "Spring Boot", "REST API", "MySQL", "Elasticsearch", "Docker", "MVC Pattern", "Jira"],
            detailed_achievements: [
              {
                title: "REST API Development",
                description: "Designed and implemented 10+ RESTful API endpoints using Java Spring framework",
                metrics: "100% of required endpoints delivered",
              },
              {
                title: "Database Design",
                description: "Modeled database interactions using MVC pattern with optimized queries",
                metrics: "< 200ms average query time",
              },
              {
                title: "Search Infrastructure",
                description: "Implemented and fine-tuned Elasticsearch for relevance scoring",
                metrics: "99.2% search accuracy",
              },
            ],
            team_size: "8 engineers",
            agile_method: "Kanban",
          },
        },
      },
    ],
  },

  // ===== FUN =====
  {
    id: "get-joke",
    path: "/api/fun/joke",
    method: "GET",
    category: "fun",
    description: "Get a programming joke",
    responses: [
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "😂",
        contentType: "application/json",
        body: {
          status: "success",
          data: { joke: "Why do Java developers wear glasses?", punchline: "Because they don't C#", rating: "dad-joke/10" },
        },
      },
    ],
  },
  {
    id: "get-fact",
    path: "/api/fun/random-fact",
    method: "GET",
    category: "fun",
    description: "Get a random fact about Garry",
    responses: [
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "✨",
        contentType: "application/json",
        body: {
          status: "success",
          data: {
            fact: "Garry has debugged production issues at 3 AM more times than there are beans in a Java JAR file",
            context: "Welcome to the life of a backend engineer",
          },
        },
      },
    ],
  },
  {
    id: "get-status",
    path: "/api/fun/status",
    method: "GET",
    category: "fun",
    description: "Get Garry's current status (creative)",
    responses: [
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "💪",
        contentType: "application/json",
        body: {
          status: "success",
          data: {
            currently: "Building cool things",
            mood: "💪 Ready for new challenges",
            caffeine_level: 87,
            focus_mode: true,
            next_deadline: "Always shipping on time",
          },
        },
      },
    ],
  },

  // ===== STATS =====
  {
    id: "get-stats",
    path: "/api/stats",
    method: "GET",
    category: "stats",
    description: "Get career statistics",
    responses: [
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "📊",
        contentType: "application/json",
        body: {
          status: "success",
          data: {
            lines_of_code_written: 30000,
            bugs_fixed: 156,
            security_vulnerabilities_resolved: 8,
            features_shipped: 47,
            code_reviews_conducted: 230,
            test_coverage: "85%",
            ci_cd_pipelines_set_up: 12,
            containers_deployed: 45,
            database_optimizations: 23,
            production_uptime: "99.8%",
          },
        },
      },
    ],
  },

  // ===== SEARCH =====
  {
    id: "get-search",
    path: "/api/search",
    method: "GET",
    category: "search",
    description: "Search across all content",
    queryParams: [
      { name: "q", type: "string", description: "Search query", required: true, example: "java" },
      { name: "type", type: "string", description: 'Result type: "all", "skills", "projects", "experience"', required: false, example: "all" },
    ],
    responses: [
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "🔍",
        contentType: "application/json",
        body: {
          status: "success",
          results: {
            skills: [{ name: "Java", proficiency: 90 }],
            projects: [
              { name: "AI Training Platform", relevance: 0.95 },
              { name: "ERP Modules", relevance: 0.92 },
            ],
            experience: [{ highlight: "Java Spring framework expertise", company: "Unit4" }],
          },
          total_results: 5,
        },
      },
      {
        statusCode: 200,
        statusLabel: "OK",
        emoji: "🔍",
        contentType: "application/json",
        description: "No results found",
        body: {
          status: "success",
          results: {},
          total_results: 0,
          message: 'No results found. Try searching for "java", "spring", "docker", etc.',
        },
      },
    ],
  },
];

export const apiPresetCategories: PresetCategory[] = [
  {
    name: "Quick Start",
    description: "Common, beginner-friendly requests",
    presets: [
      { id: "preset-cv", label: "Get CV Data", description: "Download structured CV data", method: "GET", path: "/api/profile/cv" },
      { id: "preset-skills", label: "Check Skills", description: "See all technical skills grouped by category", method: "GET", path: "/api/skills" },
      { id: "preset-timeline", label: "View Experience", description: "See full career timeline", method: "GET", path: "/api/experience/timeline" },
    ],
  },
  {
    name: "Advanced",
    description: "Complex queries with filters",
    presets: [
      { id: "preset-java-skills", label: "Java Skills Detail", description: "Get detailed info about Java expertise", method: "GET", path: "/api/skills/java" },
      { id: "preset-unit4-role", label: "Unit4 Role Details", description: "Get detailed info about current role", method: "GET", path: "/api/experience/roles/unit4" },
      { id: "preset-search", label: "Search for Java", description: "Search across portfolio for Java mentions", method: "GET", path: "/api/search", queryParams: { q: "java" } },
    ],
  },
  {
    name: "Fun & Errors",
    description: "Try these for fun or to see error handling",
    presets: [
      { id: "preset-joke", label: "Get a Joke", description: "Need a laugh?", method: "GET", path: "/api/fun/joke" },
      { id: "preset-fact", label: "Random Fact", description: "Learn something about Garry", method: "GET", path: "/api/fun/random-fact" },
      { id: "preset-status", label: "Check Status", description: "What's Garry up to?", method: "GET", path: "/api/fun/status" },
      { id: "preset-404", label: "Error Scenario (404)", description: "See how errors are handled", method: "GET", path: "/api/nonexistent" },
    ],
  },
  {
    name: "Interactive",
    description: "Endpoints that accept input",
    presets: [
      {
        id: "preset-contact",
        label: "Send Message",
        description: "Try sending a message",
        method: "POST",
        path: "/api/profile/contact",
        body: { name: "John Doe", email: "john@example.com", subject: "Let's collaborate", message: "I think we could build something great together..." },
      },
    ],
  },
];

// Generic 404 for requests that don't resolve to any defined endpoint (e.g.
// the "Error Scenario (404)" preset, or a manually-edited URL that doesn't
// match anything) — mirrors a real API's catch-all handler.
export const apiNotFoundResponse: ResponseSpec = {
  statusCode: 404,
  statusLabel: "Not Found",
  emoji: "🤔",
  contentType: "application/json",
  body: {
    status: "error",
    code: "NOT_FOUND",
    message: "Endpoint not found. Check the URL and try again.",
    documentation: "https://github.com/garrystevens007/garry.github.io",
  },
};

export const apiPlaygroundLoadingMessages = [
  "🔍 Searching database...",
  "⚙️ Processing your request...",
  "🚀 Deploying from the cloud...",
  "🧠 Consulting the backend oracle...",
  "📡 Pinging the server...",
  "🔐 Encrypting transmission...",
  "⏳ Almost there...",
];

export function getAllEndpoints(): Endpoint[] {
  return apiPlaygroundEndpoints;
}

export function getEndpointsByCategory(category: string): Endpoint[] {
  return apiPlaygroundEndpoints.filter((ep) => ep.category === category);
}

export function getEndpointById(id: string): Endpoint | undefined {
  return apiPlaygroundEndpoints.find((ep) => ep.id === id);
}

export function searchEndpoints(query: string): Endpoint[] {
  const q = query.toLowerCase();
  return apiPlaygroundEndpoints.filter(
    (ep) => ep.path.toLowerCase().includes(q) || ep.description.toLowerCase().includes(q) || ep.category.includes(q)
  );
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    profile: "👤",
    experience: "💼",
    skills: "🛠️",
    projects: "🚀",
    fun: "🎮",
    stats: "📊",
    search: "🔍",
  };
  return icons[category] || "📌";
}

// Fills {pathParam} placeholders and appends query params. Unfilled path
// params are left as the literal "{name}" placeholder (rather than collapsing
// to an empty path segment) so the live URL preview shows what's still needed.
export function formatEndpointUrl(endpoint: Endpoint, params: Record<string, string> = {}): string {
  let url = endpoint.path;

  endpoint.pathParams?.forEach((param) => {
    const value = params[param.name];
    url = url.replace(`{${param.name}}`, value ? encodeURIComponent(value) : `{${param.name}}`);
  });

  const queryParts: string[] = [];
  endpoint.queryParams?.forEach((param) => {
    const value = params[param.name];
    if (value) queryParts.push(`${param.name}=${encodeURIComponent(value)}`);
  });
  if (queryParts.length > 0) url += `?${queryParts.join("&")}`;

  return url;
}

// Matches a concrete method+path (e.g. from a preset or manual edit) against
// the endpoint list, resolving templated segments like {company} -> "unit4"
// along the way. Returns undefined if nothing matches (a real 404).
export function findEndpointByMethodPath(
  method: HttpMethod,
  path: string
): { endpoint: Endpoint; pathParamValues: Record<string, string> } | undefined {
  const [rawPath] = path.split("?");
  const requestSegments = rawPath.split("/");

  for (const endpoint of apiPlaygroundEndpoints) {
    if (endpoint.method !== method) continue;
    const templateSegments = endpoint.path.split("/");
    if (templateSegments.length !== requestSegments.length) continue;

    const pathParamValues: Record<string, string> = {};
    const isMatch = templateSegments.every((segment, index) => {
      if (segment.startsWith("{") && segment.endsWith("}")) {
        pathParamValues[segment.slice(1, -1)] = decodeURIComponent(requestSegments[index]);
        return true;
      }
      return segment === requestSegments[index];
    });

    if (isMatch) return { endpoint, pathParamValues };
  }

  return undefined;
}

// Validates a request body against an endpoint's declared schema. Handles
// the "array" type via Array.isArray (typeof an array is "object", so a
// naive typeof comparison against the literal string "array" can never
// match — this checks arrays explicitly instead).
export function validateRequestBody(
  endpoint: Endpoint,
  body: Record<string, JsonValue>
): { valid: boolean; errors?: string[] } {
  if (!endpoint.requestBody) return { valid: true };

  const errors: string[] = [];
  Object.entries(endpoint.requestBody.schema).forEach(([key, type]) => {
    if (!(key in body)) {
      errors.push(`Missing required field: ${key}`);
      return;
    }
    const value = body[key];
    const actualType = Array.isArray(value) ? "array" : typeof value;
    if (actualType !== type) {
      errors.push(`${key} must be ${type}`);
    }
  });

  return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
}

// Resolves which mocked response a "request" should get back. A few
// endpoints react to what was actually typed (company name, search query,
// message validity) instead of a flat random chance, so error scenarios are
// reliably reachable rather than a 10% coin-flip that might never come up.
export function resolveMockResponse(params: {
  endpoint: Endpoint | null;
  pathParamValues: Record<string, string>;
  queryParamValues: Record<string, string>;
  requestBodyText: string;
}): ResponseSpec {
  const { endpoint, pathParamValues, queryParamValues, requestBodyText } = params;

  if (!endpoint) return apiNotFoundResponse;

  if (endpoint.id === "get-experience-role") {
    const company = (pathParamValues.company ?? "").trim().toLowerCase();
    const known = company === "unit4" || company === "samsung";
    return endpoint.responses.find((r) => r.statusCode === (known ? 200 : 404)) ?? endpoint.responses[0];
  }

  if (endpoint.id === "post-contact") {
    let body: Record<string, JsonValue> = {};
    try {
      const parsed: unknown = JSON.parse(requestBodyText || "{}");
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        body = parsed as Record<string, JsonValue>;
      }
    } catch {
      // Invalid JSON -> treat as an empty body, which fails validation below.
    }
    const { valid } = validateRequestBody(endpoint, body);
    const email = typeof body.email === "string" ? body.email : "";
    const message = typeof body.message === "string" ? body.message : "";
    const looksValid = valid && /\S+@\S+\.\S+/.test(email) && message.length >= 10;
    return endpoint.responses.find((r) => r.statusCode === (looksValid ? 201 : 400)) ?? endpoint.responses[0];
  }

  if (endpoint.id === "get-search") {
    const q = (queryParamValues.q ?? "").trim().toLowerCase();
    const knownTerms = ["java", "spring", "docker", "sql", "rest", "elasticsearch", "mvc"];
    const hasMatch = q.length > 0 && knownTerms.some((term) => q.includes(term));
    return hasMatch ? endpoint.responses[0] : endpoint.responses[1];
  }

  return endpoint.responses[0];
}

// The POST /api/profile/contact endpoint is otherwise pure mock — but a
// visitor who fills in a genuine message and gets a 201 back is one click
// from actually being able to send it. Built with plain encodeURIComponent,
// not URLSearchParams: mailto URIs (RFC 6068) percent-encode spaces, they
// don't use "+" the way a query string does, so URLSearchParams would leave
// literal "+" characters in the subject/body in some mail clients.
export function buildContactMailto(requestBodyText: string): string | null {
  try {
    const parsed: unknown = JSON.parse(requestBodyText || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const body = parsed as Record<string, JsonValue>;

    const name = typeof body.name === "string" ? body.name : "";
    const email = typeof body.email === "string" ? body.email : "";
    const subject = typeof body.subject === "string" && body.subject.trim() ? body.subject : "Message from your portfolio's API Playground";
    const message = typeof body.message === "string" ? body.message : "";

    const lines = [message, "", "—"];
    if (name) lines.push(`From: ${name}`);
    if (email) lines.push(`Reply-to: ${email}`);

    return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  } catch {
    return null;
  }
}
