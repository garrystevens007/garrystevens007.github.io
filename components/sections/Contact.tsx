import { Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { SectionHeading } from "@/components/dashboard/SectionHeading";
import { profile, socials } from "@/lib/data";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 pb-8">
      <SectionHeading eyebrow="Get in touch" title="Contact" />
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-card dark:border-neutral-700 dark:bg-neutral-800">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a href={`mailto:${profile.email}`} className="flex items-center gap-3 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-700">
            <Mail className="text-primary" size={18} />
            <div>
              <p className="text-xs text-neutral-400">Email</p>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{profile.email}</p>
            </div>
          </a>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-700"
          >
            <LinkedinIcon className="text-info" size={18} />
            <div>
              <p className="text-xs text-neutral-400">LinkedIn</p>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Connect on LinkedIn</p>
            </div>
          </a>
          <div className="flex items-center gap-3 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-700">
            <MapPin className="text-success" size={18} />
            <div>
              <p className="text-xs text-neutral-400">Location</p>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{profile.location}</p>
            </div>
          </div>
        </div>
        <a
          href={socials.github}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center gap-3 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-700"
        >
          <GithubIcon className="text-neutral-700 dark:text-neutral-300" size={18} />
          <div>
            <p className="text-xs text-neutral-400">GitHub</p>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{socials.githubHandle}</p>
          </div>
        </a>
      </div>
    </section>
  );
}
