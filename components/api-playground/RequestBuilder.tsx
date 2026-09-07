import type { Endpoint, HttpMethod } from "@/lib/data";
import { MethodBadge } from "./MethodBadge";
import { RequestBodyEditor } from "./RequestBodyEditor";

type RequestBuilderProps = {
  endpoint: Endpoint | null;
  // Set only for a request that deliberately doesn't match any defined
  // endpoint (e.g. the "Error Scenario (404)" preset) — distinct from
  // `endpoint === null && notFoundPreview === null`, which means nothing has
  // been selected yet.
  notFoundPreview: { method: HttpMethod; path: string } | null;
  paramValues: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  requestBody: string;
  onBodyChange: (value: string) => void;
  previewUrl: string;
  isLoading: boolean;
  onSend: () => void;
};

function SendButton({ isLoading, onSend }: { isLoading: boolean; onSend: () => void }) {
  return (
    <button
      type="button"
      onClick={onSend}
      disabled={isLoading}
      className={`w-full rounded-lg px-6 py-3 font-bold text-white transition focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
        isLoading ? "cursor-not-allowed bg-gray-400" : "bg-pink-600 hover:bg-pink-700 active:scale-95"
      }`}
    >
      {isLoading ? "Sending..." : "🚀 SEND"}
    </button>
  );
}

export function RequestBuilder({
  endpoint,
  notFoundPreview,
  paramValues,
  onParamChange,
  requestBody,
  onBodyChange,
  previewUrl,
  isLoading,
  onSend,
}: RequestBuilderProps) {
  if (!endpoint && !notFoundPreview) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
        Select an endpoint from the list (or a preset) to build a request.
      </div>
    );
  }

  if (!endpoint && notFoundPreview) {
    return (
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Method &amp; Endpoint</label>
          <div className="flex items-center gap-2">
            <MethodBadge method={notFoundPreview.method} />
            <code className="text-sm font-mono text-gray-700">{notFoundPreview.path}</code>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            This path doesn&apos;t match any defined endpoint — sending it returns a real 404, just like an actual API.
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">URL Preview</label>
          <div className="break-all rounded bg-gray-100 p-3 font-mono text-sm text-gray-800">{previewUrl}</div>
        </div>
        <SendButton isLoading={isLoading} onSend={onSend} />
      </div>
    );
  }

  // TypeScript can't narrow `endpoint` across the early returns above, but
  // both null-cases are handled — endpoint is guaranteed non-null here.
  const activeEndpoint = endpoint as Endpoint;
  const hasParams = (activeEndpoint.pathParams?.length ?? 0) > 0 || (activeEndpoint.queryParams?.length ?? 0) > 0;
  const showBodyEditor = activeEndpoint.method === "POST" || activeEndpoint.method === "PUT";

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Method &amp; Endpoint</label>
        <div className="flex items-center gap-2">
          <MethodBadge method={activeEndpoint.method} />
          <code className="text-sm font-mono text-gray-700">{activeEndpoint.path}</code>
        </div>
        <p className="mt-1 text-xs text-gray-500">{activeEndpoint.description}</p>
      </div>

      {hasParams && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Parameters</label>
          {activeEndpoint.pathParams?.map((param) => (
            <div key={param.name}>
              <label htmlFor={`param-${param.name}`} className="mb-1 block text-xs font-medium text-gray-600">
                {param.name} <span className="text-gray-400">(path, {param.type})</span> — {param.description}
              </label>
              <input
                id={`param-${param.name}`}
                type="text"
                value={paramValues[param.name] ?? ""}
                onChange={(e) => onParamChange(param.name, e.target.value)}
                placeholder={param.example}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          ))}
          {activeEndpoint.queryParams?.map((param) => (
            <div key={param.name}>
              <label htmlFor={`param-${param.name}`} className="mb-1 block text-xs font-medium text-gray-600">
                {param.name}{" "}
                <span className="text-gray-400">
                  (query{param.required ? ", required" : ""}, {param.type})
                </span>{" "}
                — {param.description}
              </label>
              <input
                id={`param-${param.name}`}
                type="text"
                value={paramValues[param.name] ?? ""}
                onChange={(e) => onParamChange(param.name, e.target.value)}
                placeholder={param.example}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">URL Preview</label>
        <div className="break-all rounded bg-gray-100 p-3 font-mono text-sm text-gray-800">{previewUrl}</div>
      </div>

      {showBodyEditor && activeEndpoint.requestBody && (
        <RequestBodyEditor value={requestBody} onChange={onBodyChange} example={activeEndpoint.requestBody.example} />
      )}

      <details className="rounded bg-gray-50 p-3">
        <summary className="cursor-pointer font-semibold text-gray-700">Headers</summary>
        <div className="mt-2 space-y-1 font-mono text-xs text-gray-600">
          <div>Content-Type: application/json</div>
          <div>Authorization: Bearer mock-token-not-real</div>
          <div>X-Playground: true</div>
        </div>
      </details>

      <SendButton isLoading={isLoading} onSend={onSend} />
    </div>
  );
}
