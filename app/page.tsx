import { DashboardShell } from "@/components/layout/DashboardShell";
import { Overview } from "@/components/sections/Overview";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <DashboardShell>
      <div className="space-y-16">
        <Overview />
        <About />
        <Experience />
        <Skills />
        <Certifications />
        <Contact />
      </div>
    </DashboardShell>
  );
}
