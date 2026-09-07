import type { JsonValue } from "@/lib/data";

type ResponseBodyFormatterProps = {
  data: JsonValue;
};

// DESIGN_SPECS.md's "Color Classes (Inline)" list gives -600 shades (meant
// for a light background), but its own worked "Example JSON Display" sample
// renders inside a dark bg-gray-900 terminal box using -400 shades instead.
// Since the actual container here is dark (matching that worked example and
// the RequestBodyEditor's dark textarea), -400 is what's legible — that's
// what's used below, not the abstract -600 list.
function Primitive({ value }: { value: string | number | boolean | null }) {
  if (value === null) return <span className="text-gray-500">null</span>;
  if (typeof value === "string") return <span className="text-green-400">&quot;{value}&quot;</span>;
  if (typeof value === "number") return <span className="text-orange-400">{value}</span>;
  return <span className="text-purple-400">{String(value)}</span>;
}

function JsonNode({ value, keyName, isLast }: { value: JsonValue; keyName?: string; isLast: boolean }) {
  const comma = isLast ? "" : ",";
  const keyPrefix = keyName !== undefined ? (
    <>
      <span className="text-blue-400">&quot;{keyName}&quot;</span>
      <span className="text-gray-500">: </span>
    </>
  ) : null;

  if (value !== null && typeof value === "object") {
    const isArray = Array.isArray(value);
    const entries = isArray ? value.map((v, i) => [String(i), v] as const) : Object.entries(value);
    const [open, close] = isArray ? ["[", "]"] : ["{", "}"];

    if (entries.length === 0) {
      return (
        <div>
          {keyPrefix}
          <span className="text-green-400">
            {open}
            {close}
          </span>
          <span className="text-gray-500">{comma}</span>
        </div>
      );
    }

    return (
      <details open>
        <summary className="cursor-pointer list-none">
          {keyPrefix}
          <span className="text-green-400">{open}</span>
          <span className="ml-1 text-xs text-gray-500">
            {entries.length} {isArray ? "items" : "keys"}
          </span>
        </summary>
        <div className="ml-3 border-l border-gray-700 pl-3">
          {entries.map(([key, val], index) => (
            <JsonNode key={key} value={val} keyName={isArray ? undefined : key} isLast={index === entries.length - 1} />
          ))}
        </div>
        <div>
          <span className="text-green-400">{close}</span>
          <span className="text-gray-500">{comma}</span>
        </div>
      </details>
    );
  }

  return (
    <div>
      {keyPrefix}
      <Primitive value={value} />
      <span className="text-gray-500">{comma}</span>
    </div>
  );
}

export function ResponseBodyFormatter({ data }: ResponseBodyFormatterProps) {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-900 p-4 font-mono text-sm leading-snug text-gray-100">
      <code>
        <JsonNode value={data} isLast />
      </code>
    </pre>
  );
}
