// Single source of truth for the site's content. The editable CONTENT lives in ../content/*.json; this file imports
// it, checks it (a JSON import is type-checked structurally against the annotation it's assigned to, and the small
// assert helpers below turn a typo'd enum value into a clear build error), and derives what the pages import.
//
// To update content: edit the relevant file under content/, commit, push. The GitHub Actions workflow rebuilds and
// redeploys. scripts/build_resume.py reads the same profile/experience/education/skills JSON for the resume PDF.
import profileJson from "@/content/profile.json";
import educationJson from "@/content/education.json";
import experienceJson from "@/content/experience.json";
import skillsJson from "@/content/skills.json";
import certificationsJson from "@/content/certifications.json";
import siteMetaJson from "@/content/site-meta.json";
import casesJson from "@/content/cases.json";

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

export type EmploymentType = "full-time" | "contract" | "internship" | "freelance";

export type Role = {
  role: string;
  company: string;
  location: string;
  type: EmploymentType;
  start: string;
  end: string | null;
  period: string;
  summary: string;
  skills: string[];
  bullets: string[];
};

type Skill = { name: string; level: number; since: string };

export type SkillCategory = { category: string; skills: Skill[] };

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  kind: "certificate" | "publication";
  // Rendered from the source PDF's first page by scripts/render_certificates.py; the ACM publication has none.
  image?: string;
  verifyUrl?: string;
  credentialId?: string;
  meta?: string;
};

export type CaseImage = { src: string; alt: string; caption?: string; device?: "desktop" | "phone" };

export type CaseStudy = {
  slug: string;
  title: string;
  headline: string;
  organisation: string;
  year: string;
  summary: string;
  role: string;
  timeline: string;
  delivery?: string;
  status?: string;
  tags: string[];
  stats?: { value: string; label: string }[];
  context: string[];
  approach: { title: string; body: string }[];
  impact: { title: string; body: string }[];
  hero?: { desktop?: CaseImage; phone?: CaseImage };
  gallery?: CaseImage[];
  // A hand-drawn diagram component keyed by name (components/cases/Diagrams.tsx).
  diagram?: "dompi";
  // Shows the "I'd like to try this app" block (email or LinkedIn).
  tryApp?: boolean;
  footnote?: string;
};

type RawImage = { src: string; alt: string; caption?: string; device?: string };

const EMPLOYMENT_TYPES: readonly EmploymentType[] = ["full-time", "contract", "internship", "freelance"];

function assertEmploymentType(value: string, context: string): EmploymentType {
  if (!(EMPLOYMENT_TYPES as readonly string[]).includes(value)) {
    throw new Error(`Invalid type "${value}" in ${context}: must be one of ${EMPLOYMENT_TYPES.join(", ")}`);
  }
  return value as EmploymentType;
}

function assertCertKind(value: string, context: string): "certificate" | "publication" {
  if (value !== "certificate" && value !== "publication") {
    throw new Error(`Invalid kind "${value}" in ${context}: must be "certificate" or "publication"`);
  }
  return value;
}

function assertDevice(value: string | undefined, context: string): "desktop" | "phone" | undefined {
  if (value === undefined || value === "desktop" || value === "phone") return value;
  throw new Error(`Invalid device "${value}" in ${context}: must be "desktop" or "phone"`);
}

function assertDiagram(value: string | undefined, context: string): "dompi" | undefined {
  if (value === undefined || value === "dompi") return value;
  throw new Error(`Unknown diagram "${value}" in ${context}`);
}

export const profile: ProfileData = profileJson;
export const socials = profile.socials;
export const resumeUrl = profile.resumeUrl;
export const linkedinCertificationsUrl = profile.socials.linkedinCertifications;
export const education: EducationData = educationJson;

export const experience: Role[] = experienceJson.map((role) => ({
  ...role,
  type: assertEmploymentType(role.type, `content/experience.json entry "${role.company}"`),
}));

export const skillCategories: SkillCategory[] = skillsJson.map((c) => ({ category: c.category, skills: c.skills }));

export const certifications: Certification[] = certificationsJson.map((c) => ({
  ...c,
  kind: assertCertKind(c.kind, `content/certifications.json entry "${c.id}"`),
}));

export const cases: CaseStudy[] = casesJson.map((entry) => {
  const where = `content/cases.json entry "${entry.slug}"`;
  const raw = entry as typeof entry & {
    hero?: { desktop?: RawImage; phone?: RawImage };
    gallery?: RawImage[];
    diagram?: string;
  };
  const image = (img: RawImage): CaseImage => ({ ...img, device: assertDevice(img.device, where) });
  return {
    ...entry,
    hero: raw.hero
      ? {
          desktop: raw.hero.desktop && image(raw.hero.desktop),
          phone: raw.hero.phone && image(raw.hero.phone),
        }
      : undefined,
    gallery: raw.gallery?.map(image),
    diagram: assertDiagram(raw.diagram, where),
  };
});

export function caseBySlug(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}

// Anchored to the start of backend engineering (Samsung Research, Feb 2022), matching how the resume frames it.
// The instructor years are still listed in full under Experience.
export const backendExperienceStartDate = siteMetaJson.backendExperienceStartDate;

function yearsSince(isoDate: string): number {
  const start = new Date(isoDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  if (now.getMonth() < start.getMonth() || (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) {
    years--;
  }
  return years;
}

// Computed at build time; the site redeploys on every content edit, which keeps it current enough.
export const yearsOfExperience = yearsSince(backendExperienceStartDate);

export const companiesWorked = new Set(experience.map((role) => role.company)).size;

// The mailto behind "I'd like to try this app": opens the visitor's mail client with a ready message.
export function tryAppMailto(product: string): string {
  const subject = `Early access: ${product}`;
  const body = [
    "Hi Garry,",
    "",
    `I saw ${product} on your portfolio and I'd like to try it.`,
    "",
    "Name:",
    "Company / role:",
    "What I'd like to use it for:",
    "",
    "Thanks!",
  ].join("\n");
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
