// Hand-drawn architecture diagrams for case studies, keyed by `diagram` in content/cases.json. Colours come from the
// theme tokens, so they follow light and dark mode.

function Box({ x, y, w, h, title, lines = [], accent = false }: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        className={accent ? "fill-accent-soft stroke-accent" : "fill-paper stroke-rule"}
        strokeWidth={1.2}
      />
      <text x={x + 18} y={y + 28} className="fill-ink" fontSize={14} fontWeight={600}>
        {title}
      </text>
      {lines.map((line, i) => (
        <text key={line} x={x + 18} y={y + 52 + i * 21} className="fill-muted" fontSize={12}>
          {line}
        </text>
      ))}
    </g>
  );
}

function DompiDiagram() {
  return (
    <svg viewBox="0 0 880 240" role="img" aria-labelledby="dompi-diagram-title" className="block h-auto w-full min-w-[640px]">
      <title id="dompi-diagram-title">
        Dompi architecture: the encrypted app on the user&apos;s laptop, a relay in the cloud that cannot read backups,
        and the channels that feed it.
      </title>
      <Box
        x={10}
        y={20}
        w={310}
        h={200}
        title="User's laptop"
        lines={["Tauri shell · React UI", "Rust core: parsing, budgets, plans", "Encrypted SQLite, keys in OS keystore", "All financial history stays here"]}
      />
      <Box x={350} y={65} w={210} h={110} title="Cloudflare relay" lines={["Inbox for new entries", "Stores backups it cannot read"]} accent />
      <Box x={590} y={20} w={280} h={56} title="Telegram bot · “coffee 25k”" />
      <Box x={590} y={92} w={280} h={56} title="iPhone shortcut · QRIS receipt" />
      <Box x={590} y={164} w={280} h={56} title="Admin console · licences" />
      <g className="stroke-ink" strokeWidth={1.4} fill="none">
        <path d="M320 120 H350" />
        <path d="M560 120 H575 M575 48 V192 M575 48 H590 M575 120 H590 M575 192 H590" />
      </g>
    </svg>
  );
}

export function CaseDiagram({ name }: { name: "dompi" }) {
  switch (name) {
    case "dompi":
      return <DompiDiagram />;
  }
}
