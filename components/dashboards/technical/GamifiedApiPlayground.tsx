"use client";

import { useCallback, useMemo, useState } from "react";
import { EndpointList } from "@/components/api-playground/EndpointList";
import { PresetsSection } from "@/components/api-playground/PresetsSection";
import { RequestBuilder } from "@/components/api-playground/RequestBuilder";
import { RequestHistory } from "@/components/api-playground/RequestHistory";
import { ResponseDisplay } from "@/components/api-playground/ResponseDisplay";
import { useGame, type Award } from "@/context/GameContext";
import {
  apiPlaygroundEndpoints,
  apiPresetCategories,
  buildContactMailto,
  endpointDifficulty,
  findEndpointByMethodPath,
  formatEndpointUrl,
  resolveMockResponse,
  secretEndpoints,
  type Endpoint,
  type HistoryItem,
  type HttpMethod,
  type JsonValue,
  type PresetRequest,
} from "@/lib/data";
import { ComboIndicator, GameStatusBar, PointsAward } from "./GameHud";

const MIN_DELAY_MS = 900;
const MAX_EXTRA_DELAY_MS = 700;
const MAX_HISTORY = 5;

type ActiveResult = {
  statusCode: number;
  statusLabel: string;
  emoji: string;
  body: Record<string, JsonValue>;
  time: number;
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

/**
 * The API Playground with the gamification layer on top.
 *
 * History and stats are intentionally NOT persisted here (unlike the classic
 * playground on /portfolio): the score is session-scoped, so a history that
 * outlived it would show requests that earned points you no longer have.
 */
export function GamifiedApiPlayground() {
  const { recordRequest, unlockedSecretEndpoints, unlockedSecrets, lastAward } = useGame();

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
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [resultAward, setResultAward] = useState<Award | null>(null);

  // Unlocked secrets are appended so they appear at the bottom of the list,
  // where the "just unlocked" banner points.
  const availableEndpoints = useMemo(
    () => [...apiPlaygroundEndpoints, ...unlockedSecretEndpoints],
    [unlockedSecretEndpoints]
  );

  const secretIds = useMemo(
    () => unlockedSecretEndpoints.map((endpoint) => endpoint.id),
    [unlockedSecretEndpoints]
  );

  const selectEndpoint = useCallback(
    (endpoint: Endpoint, overrideParams?: Record<string, string>, overrideBody?: string) => {
      setSelectedEndpoint(endpoint);
      setNotFoundPath(null);
      setResult(null);
      setResultAward(null);
      setParamValues(overrideParams ?? defaultParamValues(endpoint));
      setRequestBody(
        overrideBody ?? (endpoint.requestBody ? JSON.stringify(endpoint.requestBody.example, null, 2) : "")
      );
    },
    []
  );

  const handleLoadPreset = useCallback(
    (preset: PresetRequest) => {
      const match = findEndpointByMethodPath(preset.method, preset.path, availableEndpoints);
      if (!match) {
        setSelectedEndpoint(null);
        setNotFoundPath(preset.path);
        setParamValues({});
        setRequestBody("");
        setResult(null);
        setResultAward(null);
        return;
      }
      const merged = {
        ...defaultParamValues(match.endpoint),
        ...match.pathParamValues,
        ...(preset.queryParams ?? {}),
      };
      selectEndpoint(match.endpoint, merged, preset.body ? JSON.stringify(preset.body, null, 2) : undefined);
    },
    [availableEndpoints, selectEndpoint]
  );

  const handleLoadHistoryItem = useCallback(
    (item: HistoryItem) => {
      const match = findEndpointByMethodPath(item.method, item.endpoint, availableEndpoints);
      if (!match) {
        setSelectedEndpoint(null);
        setNotFoundPath(item.endpoint);
        setParamValues({});
        setRequestBody("");
        setResult(null);
        setResultAward(null);
        return;
      }
      selectEndpoint(match.endpoint, { ...defaultParamValues(match.endpoint), ...match.pathParamValues });
    },
    [availableEndpoints, selectEndpoint]
  );

  const previewUrl = useMemo(() => {
    if (notFoundPath) return notFoundPath;
    if (!selectedEndpoint) return "";
    return formatEndpointUrl(selectedEndpoint, paramValues);
  }, [selectedEndpoint, paramValues, notFoundPath]);

  const handleSend = useCallback(async () => {
    setIsLoading(true);
    setResult(null);
    setResultAward(null);

    const start = Date.now();
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_DELAY_MS + Math.random() * MAX_EXTRA_DELAY_MS)
    );

    const responseSpec = resolveMockResponse({
      endpoint: notFoundPath ? null : selectedEndpoint,
      pathParamValues: paramValues,
      queryParamValues: paramValues,
      requestBodyText: requestBody,
    });
    const time = Math.round(Date.now() - start);
    const isValidContactSubmission =
      selectedEndpoint?.id === "post-contact" && responseSpec.statusCode === 201;

    setResult({
      statusCode: responseSpec.statusCode,
      statusLabel: responseSpec.statusLabel,
      emoji: responseSpec.emoji,
      body: responseSpec.body,
      time,
      mailtoUrl: isValidContactSubmission ? (buildContactMailto(requestBody) ?? undefined) : undefined,
    });
    setIsLoading(false);

    const method: HttpMethod = notFoundPath ? "GET" : (selectedEndpoint?.method ?? "GET");

    // A 404 preset has no endpoint object, so score it as the easiest tier —
    // it still counts as a request (and picks up the error-handling bonus).
    const award = recordRequest({
      endpointId: selectedEndpoint?.id ?? `not-found:${notFoundPath ?? "unknown"}`,
      method,
      difficulty: selectedEndpoint ? endpointDifficulty(selectedEndpoint) : "easy",
      statusCode: responseSpec.statusCode,
    });
    setResultAward(award);

    setHistory((prev) =>
      [
        {
          id: `${Date.now()}`,
          method,
          endpoint: previewUrl,
          statusCode: responseSpec.statusCode,
          timestamp: Date.now(),
        },
        ...prev,
      ].slice(0, MAX_HISTORY)
    );
  }, [notFoundPath, selectedEndpoint, paramValues, requestBody, previewUrl, recordRequest]);

  const lockedSecrets = secretEndpoints.filter((secret) => !unlockedSecrets.includes(secret.id));

  return (
    <section id="playground" className="scroll-mt-24" aria-labelledby="playground-heading">
      <div className="mb-6">
        <h2 id="playground-heading" className="text-2xl font-bold text-white">
          API Playground
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Every response here is mocked — there is no backend. Points, combos and secret endpoints
          are the game layer on top.
        </p>
      </div>

      {/* The playground keeps its own deliberately-distinct light styling
          (agentsmd/DESIGN_SPECS.md) — presented here as a bright panel inset
          into the dark dashboard rather than restyled into it. */}
      <div className="rounded-xl border-2 border-pink-500/40 bg-white p-4 shadow-2xl shadow-pink-900/20 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[40%_60%]">
          <div>
            <GameStatusBar />
            <EndpointList
              endpoints={availableEndpoints}
              selectedEndpoint={selectedEndpoint}
              onSelectEndpoint={(endpoint) => selectEndpoint(endpoint)}
              showDifficulty
              secretEndpointIds={secretIds}
            />

            {lockedSecrets.length > 0 && (
              <div className="mt-4 rounded-lg border border-dashed border-purple-300 bg-purple-50 p-4">
                <h3 className="mb-2 text-sm font-bold text-purple-800">
                  🔒 {lockedSecrets.length} secret{lockedSecrets.length === 1 ? "" : "s"} still hidden
                </h3>
                <ul className="space-y-1 text-xs text-purple-700">
                  {lockedSecrets.map((secret) => (
                    <li key={secret.id}>• {secret.unlockLabel}</li>
                  ))}
                </ul>
              </div>
            )}

            <PresetsSection presetCategories={apiPresetCategories} onLoadPreset={handleLoadPreset} />
          </div>

          <div className="space-y-4">
            <RequestBuilder
              endpoint={selectedEndpoint}
              notFoundPreview={notFoundPath ? { method: "GET", path: notFoundPath } : null}
              paramValues={paramValues}
              onParamChange={(name, value) =>
                setParamValues((prev) => ({ ...prev, [name]: value }))
              }
              requestBody={requestBody}
              onBodyChange={setRequestBody}
              previewUrl={previewUrl}
              isLoading={isLoading}
              onSend={handleSend}
            />

            {resultAward && lastAward?.id === resultAward.id && <PointsAward award={resultAward} />}

            <ComboIndicator />
            <ResponseDisplay isLoading={isLoading} result={result} />
          </div>
        </div>

        <RequestHistory
          requests={history}
          onLoadRequest={handleLoadHistoryItem}
          onClearHistory={() => setHistory([])}
        />
      </div>
    </section>
  );
}
