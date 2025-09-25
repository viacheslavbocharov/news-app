import { useEffect, useState } from "react";

type AdLog = { ts: number; type: string; data: unknown };

function getStr(obj: unknown, key: string): string | null {
  if (!obj || typeof obj !== "object") return null;
  const val = (obj as Record<string, unknown>)[key];
  return typeof val === "string" ? val : null;
}

function keyOf(l: AdLog): string {
  const adId = getStr(l.data, "adId");
  if (adId) return `${l.type}-${adId}`;
  const auctionId = getStr(l.data, "auctionId");
  if (auctionId) return `${l.type}-${auctionId}`;
  return `${l.type}-${l.ts}`;
}

export default function AdsDebug() {
  const [logs, setLogs] = useState<AdLog[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<AdLog>;
      setLogs((prev) => [ce.detail, ...prev].slice(0, 200));
    };
    window.addEventListener("ads:event", handler as EventListener);
    return () => window.removeEventListener("ads:event", handler as EventListener);
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Prebid Auction Log</h1>
      <ul className="space-y-3">
        {logs.map((l) => (
          <li key={keyOf(l)} className="rounded border p-3 text-sm">
            <div className="font-mono text-xs text-gray-500">
              {new Date(l.ts).toLocaleTimeString()} · {l.type}
            </div>
            <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(l.data, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
