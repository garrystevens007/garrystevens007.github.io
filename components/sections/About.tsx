import { CheckCircle2, Download, GraduationCap, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/dashboard/SectionHeading";
import { education, profile, resumeUrl } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="scroll-mt-24">
      <SectionHeading eyebrow="Profile" title="About Me" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-card dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
            GS
          </div>
          <h3 className="mt-4 text-base font-semibold text-neutral-800 dark:text-white">{profile.name}</h3>
          <p className="text-sm text-neutral-400">{profile.title}</p>
          <p className="mt-2 flex items-center justify-center gap-1 text-xs text-neutral-400">
            <MapPin size={14} /> {profile.location}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
            <CheckCircle2 size={14} /> {profile.availability}
          </span>
          <a
            href={resumeUrl}
            download="Garry-Stevens-Resume.pdf"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Download size={16} /> Download Resume
          </a>
        </div>
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-card dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-white">Summary</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-300">{profile.summary}</p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-card dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-white">
              <GraduationCap size={16} /> Education
            </h3>
            <p className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">{education.degree}</p>
            <p className="text-xs text-neutral-400">
              {education.school}, {education.location} — {education.period}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
