import type { JsonValue } from "@/lib/data";

type RequestBodyEditorProps = {
  value: string;
  onChange: (value: string) => void;
  example?: Record<string, JsonValue>;
};

export function RequestBodyEditor({ value, onChange, example }: RequestBodyEditorProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">Request Body</label>
        {example && (
          <button
            type="button"
            onClick={() => onChange(JSON.stringify(example, null, 2))}
            className="text-xs font-semibold text-pink-600 hover:text-pink-700"
          >
            Load Example
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={'{\n  "key": "value"\n}'}
        rows={8}
        spellCheck={false}
        aria-label="Request body (JSON)"
        className="w-full resize-none rounded border border-gray-300 bg-gray-900 p-3 font-mono text-sm text-gray-100 placeholder:text-gray-600 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
    </div>
  );
}
