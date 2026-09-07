import { socials, type JsonValue } from "@/lib/data";
import { CopyButton } from "./CopyButton";
import { LoadingAnimation } from "./LoadingAnimation";
import { ResponseBodyFormatter } from "./ResponseBodyFormatter";
import { StatusBadge } from "./StatusBadge";

type ActiveResult = {
  statusCode: number;
  statusLabel: string;
  emoji: string;
  body: Record<string, JsonValue>;
  time: number;
  mailtoUrl?: string;
};

type ResponseDisplayProps = {
  isLoading: boolean;
  result: ActiveResult | null;
};

export function ResponseDisplay({ isLoading, result }: ResponseDisplayProps) {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {isLoading ? (
        <LoadingAnimation />
      ) : result ? (
        <div className="animate-fade-in space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <StatusBadge statusCode={result.statusCode} emoji={result.emoji} statusLabel={result.statusLabel} />
            <div className="text-xs text-gray-600">
              Response time: <span className="font-mono font-semibold">{result.time}ms</span>
            </div>
          </div>

          <details className="rounded bg-gray-50 p-3">
            <summary className="cursor-pointer font-semibold text-gray-700">Response Headers</summary>
            <div className="mt-2 space-y-1 font-mono text-xs text-gray-600">
              <div>Content-Type: application/json</div>
              <div>Server: Backend™ v1.0</div>
              <div>X-Response-Time: {result.time}ms</div>
            </div>
          </details>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-gray-700">Response Body</span>
              <CopyButton text={JSON.stringify(result.body, null, 2)} />
            </div>
            <ResponseBodyFormatter data={result.body} />
          </div>

          {result.mailtoUrl && (
            <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-gray-700">
                This endpoint is simulated — but that was a real message. Want to actually send it?
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={result.mailtoUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  📧 Send it for real
                </a>
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-blue-700 hover:underline"
                >
                  or connect on LinkedIn
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p>Select an endpoint and click SEND to see the response here</p>
        </div>
      )}
    </div>
  );
}
