"use client";

import { useCallback, useMemo, useState } from "react";
import {
  apiPlaygroundEndpoints,
  apiPresetCategories,
  buildContactMailto,
  findEndpointByMethodPath,
  formatEndpointUrl,
  resolveMockResponse,
  type Endpoint,
  type HistoryItem,
  type HttpMethod,
  type JsonValue,
  type PresetRequest,
} from "@/lib/data";
import { createLocalStorageStore, useLocalStorageStore } from "@/lib/local-storage-store";
import { EndpointList } from "./EndpointList";
import { PresetsSection } from "./PresetsSection";
import { RequestBuilder } from "./RequestBuilder";
import { RequestHistory } from "./RequestHistory";
import { ResponseDisplay } from "./ResponseDisplay";
import { StatsBar } from "./StatsBar";

const HISTORY_KEY = "api-playground-history";
const STATS_KEY = "api-playground-stats";
const MIN_DELAY_MS = 1500;
const MAX_EXTRA_DELAY_MS = 1000;

type PlaygroundStats = {
  totalRequests: number;
  endpointHitCounts: Record<string, number>;
  totalResponseTimeMs: number;
  lastRequestAt: number | null;
};

const emptyStats: PlaygroundStats = {
  totalRequests: 0,
  endpointHitCounts: {},
  totalResponseTimeMs: 0,
  lastRequestAt: null,
};

const historyStore = createLocalStorageStore<HistoryItem[]>(HISTORY_KEY, []);
const statsStore = createLocalStorageStore<PlaygroundStats>(STATS_KEY, emptyStats);

type ActiveResult = {
  statusCode: number;
  statusLabel: string;
  emoji: string;
  body: Record<string, JsonValue>;
  time: number;
  // Only set for a genuinely-valid POST /api/profile/contact submission — a
  // real mailto: link so the "simulated" send can actually be sent for real.
  mailtoUrl?: string;
};

function defaultParamValues(endpoint: Endpoint): Record<string, string> {
  const values: Record<string, string> = {};
  endpoint.pathParams?.forEach((param) => {
    values[param.name] = param.example;
  });
  endpoint.queryParams?.forEach((param) => {
    if (param.example) values[param.name] = param.example;
  });
  return values;
}

export function ApiPlayground() {
  const firstEndpoint = apiPlaygroundEndpoints[0] ?? null;

  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(firstEndpoint);
  const [notFoundPath, setNotFoundPath] = useState<string | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>(() =>
    firstEndpoint ? defaultParamValues(firstEndpoint) : {}
  );
  const [requestBody, setRequestBody] = useState(() =>
    firstEndpoint?.requestBody ? JSON.stringify(firstEndpoint.requestBody.example, null, 2) : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ActiveResult | null>(null);
  const [history, setHistory] = useLocalStorageStore(historyStore);
  const [stats, setStats] = useLocalStorageStore(statsStore);

  const selectEndpoint = useCallback(
    (endpoint: Endpoint, overrideParams?: Record<string, string>, overrideBody?: string) => {
      setSelectedEndpoint(endpoint);
      setNotFoundPath(null);
      setResult(null);
      setParamValues(overrideParams ?? defaultParamValues(endpoint));
      setRequestBody(overrideBody ?? (endpoint.requestBody ? JSON.stringify(endpoint.requestBody.example, null, 2) : ""));
    },
    []
  );

  const handleLoadPreset = useCallback(
    (preset: PresetRequest) => {
      const match = findEndpointByMethodPath(preset.method, preset.path);
      if (!match) {
        // e.g. the "Error Scenario (404)" preset — deliberately unmatched.
        setSelectedEndpoint(null);
        setNotFoundPath(preset.path);
        setParamValues({});
        setRequestBody("");
        setResult(null);
        return;
      }
      const merged = { ...defaultParamValues(match.endpoint), ...match.pathParamValues, ...(preset.queryParams ?? {}) };
      selectEndpoint(match.endpoint, merged, preset.body ? JSON.stringify(preset.body, null, 2) : undefined);
    },
    [selectEndpoint]
  );

  const handleLoadHistoryItem = useCallback(
    (item: HistoryItem) => {
      const match = findEndpointByMethodPath(item.method, item.endpoint);
      if (!match) {
        setSelectedEndpoint(null);
        setNotFoundPath(item.endpoint);
        setParamValues({});
        setRequestBody("");
        setResult(null);
        return;
      }
      selectEndpoint(match.endpoint, { ...defaultParamValues(match.endpoint), ...match.pathParamValues });
    },
    [selectEndpoint]
  );

  const previewUrl = useMemo(() => {
    if (notFoundPath) return notFoundPath;
    if (!selectedEndpoint) return "";
    return formatEndpointUrl(selectedEndpoint, paramValues);
  }, [selectedEndpoint, paramValues, notFoundPath]);

  const handleSend = useCallback(async () => {
    setIsLoading(true);
    setResult(null);

    const start = Date.now();
    const delay = MIN_DELAY_MS + Math.random() * MAX_EXTRA_DELAY_MS;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const responseSpec = resolveMockResponse({
      endpoint: notFoundPath ? null : selectedEndpoint,
      pathParamValues: paramValues,
      queryParamValues: paramValues,
      requestBodyText: requestBody,
    });
    const time = Math.round(Date.now() - start);
    const isValidContactSubmission = selectedEndpoint?.id === "post-contact" && responseSpec.statusCode === 201;

    setResult({
      statusCode: responseSpec.statusCode,
      statusLabel: responseSpec.statusLabel,
      emoji: responseSpec.emoji,
      body: responseSpec.body,
      time,
      mailtoUrl: isValidContactSubmission ? (buildContactMailto(requestBody) ?? undefined) : undefined,
    });
    setIsLoading(false);

    const method: HttpMethod = notFoundPath ? "GET" : selectedEndpoint?.method ?? "GET";
    const hitKey = `${method} ${previewUrl}`;

    setHistory((prev) =>
      [
        { id: `${Date.now()}`, method, endpoint: previewUrl, statusCode: responseSpec.statusCode, timestamp: Date.now() },
        ...prev,
      ].slice(0, 5)
    );

    setStats((prev) => ({
      totalRequests: prev.totalRequests + 1,
      endpointHitCounts: { ...prev.endpointHitCounts, [hitKey]: (prev.endpointHitCounts[hitKey] ?? 0) + 1 },
      totalResponseTimeMs: prev.totalResponseTimeMs + time,
      lastRequestAt: Date.now(),
    }));
  }, [notFoundPath, selectedEndpoint, paramValues, requestBody, previewUrl, setHistory, setStats]);

  const mostPopularEndpoint = useMemo(() => {
    const entries = Object.entries(stats.endpointHitCounts);
    if (entries.length === 0) return "—";
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [stats.endpointHitCounts]);

  const avgResponseTime = stats.totalRequests > 0 ? Math.round(stats.totalResponseTimeMs / stats.totalRequests) : 0;
  const lastRequestLabel = stats.lastRequestAt ? new Date(stats.lastRequestAt).toLocaleTimeString() : "—";

  return (
    <div className="rounded-xl border-2 border-pink-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🔌 API Playground</h2>
          <p className="mt-1 text-gray-600">
            Test real endpoints and explore mock data — a playful showcase of backend API design.
          </p>
        </div>
        <span
          title="All responses here are mocked/hardcoded for demo purposes — there's no real backend behind these endpoints."
          className="mt-1 flex h-6 w-6 flex-shrink-0 cursor-help items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600"
          aria-label="About this feature"
        >
          i
        </span>
      </div>

      <StatsBar
        totalRequests={stats.totalRequests}
        mostPopularEndpoint={mostPopularEndpoint}
        avgResponseTime={avgResponseTime}
        lastRequestTime={lastRequestLabel}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[40%_60%]">
        <div>
          <EndpointList
            endpoints={apiPlaygroundEndpoints}
            selectedEndpoint={selectedEndpoint}
            onSelectEndpoint={(endpoint) => selectEndpoint(endpoint)}
          />
          <PresetsSection presetCategories={apiPresetCategories} onLoadPreset={handleLoadPreset} />
        </div>

        <div className="space-y-6">
          <RequestBuilder
            endpoint={selectedEndpoint}
            notFoundPreview={notFoundPath ? { method: "GET", path: notFoundPath } : null}
            paramValues={paramValues}
            onParamChange={(name, value) => setParamValues((prev) => ({ ...prev, [name]: value }))}
            requestBody={requestBody}
            onBodyChange={setRequestBody}
            previewUrl={previewUrl}
            isLoading={isLoading}
            onSend={handleSend}
          />
          <ResponseDisplay isLoading={isLoading} result={result} />
        </div>
      </div>

      <RequestHistory requests={history} onLoadRequest={handleLoadHistoryItem} onClearHistory={() => setHistory([])} />
    </div>
  );
}
