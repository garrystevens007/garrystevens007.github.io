import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { profile, socials } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/80">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-5 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <div className="flex items-center gap-5">
          <a href={`mailto:${profile.email}`} className="hover:text-accent">
            {profile.email}
          </a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-accent">
            <LinkedinIcon size={18} />
          </a>
          <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-accent">
            <GithubIcon size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
