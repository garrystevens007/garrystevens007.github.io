import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { projects } from "@/lib/data";

export function ProjectsHighlight() {
  return (
    <section id="projects" className="scroll-mt-24" aria-labelledby="projects-heading">
      <div className="mb-6">
        <h2 id="projects-heading" className="text-2xl font-bold text-white">
          Projects
        </h2>
        <p className="mt-1 text-sm text-gray-400">Featured technical work</p>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li
            key={project.id}
            className="group flex flex-col rounded-lg border border-gray-700 bg-gray-800 p-4 transition hover:border-pink-500 hover:shadow-xl hover:shadow-pink-600/20"
          >
            <div className="mb-3">
              <h3 className="text-lg font-bold text-white transition group-hover:text-pink-400">
                {project.name}
              </h3>
              {project.company && (
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {project.company}
                </p>
              )}
            </div>

            <p className="mb-3 text-sm text-gray-400">{project.description}</p>

            <ul className="mb-3 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-pink-500/30 bg-pink-900/30 px-2 py-1 text-xs text-pink-300"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <p className="mb-4 flex-1 text-xs italic text-gray-500">💡 {project.impact}</p>

            {(project.github || project.live) && (
              <div className="flex gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded bg-gray-700 px-3 py-2 text-xs font-semibold text-gray-100 transition hover:bg-gray-600"
                  >
                    <GithubIcon size={14} />
                    GitHub
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded bg-gradient-to-r from-primary-from to-primary-to px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    View
                  </a>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
