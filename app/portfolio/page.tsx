import { DashboardShell } from "@/components/layout/DashboardShell";
import { Overview } from "@/components/sections/Overview";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";

// The original single-page portfolio, unchanged — it used to live at / and
// now sits here, linked from the role picker and from every dashboard's
// sidebar, so the role system is an addition rather than a replacement.
export default function PortfolioPage() {
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
