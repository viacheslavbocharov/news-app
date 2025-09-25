type Size = readonly [number, number];

const ADTELLIGENT_AID = 350975;
const BIDMATIC_SOURCE = 886409;
const BOCHAROV_PUBLISHER_ID = "demo-pub-123";

type AnchorSlot = {
  code: string;
  selector: string;
  position: InsertPosition;
  sizes: readonly Size[];
  reserve?: Size;
};

const ANCHORS: readonly AnchorSlot[] = [
  {
    code: "ad-home-top",
    selector: "main",
    position: "beforebegin",
    sizes: [
      [970, 250],
      [970, 90],
      [728, 90],
      [320, 100],
      [320, 50],
    ],
    reserve: [728, 90],
  },
  {
    code: "ad-home-bottom",
    selector: "main",
    position: "afterend",
    sizes: [
      [970, 250],
      [970, 90],
      [728, 90],
      [320, 100],
      [320, 50],
    ],
    reserve: [728, 90],
  },
];

type AdEventType = "auctionInit" | "bidResponse" | "bidWon" | "auctionEnd" | "renderError";

function emitAdEvent(type: AdEventType, data: unknown): void {
  window.dispatchEvent(new CustomEvent("ads:event", { detail: { type, data, ts: Date.now() } }));
}

function mountSlot(anchor: Element, slot: AnchorSlot): HTMLIFrameElement {
  const band = document.createElement("div");
  band.className = "ad-band";
  band.style.cssText = "width:100%;display:block;";

  const inner = document.createElement("div");
  inner.className = "ad-container";
  const [rw, rh] = slot.reserve ?? slot.sizes[0] ?? [300, 250];
  inner.style.cssText = `position:relative;max-width:64rem;margin:0 auto;padding:0 1rem;min-height:${rh}px;`;

  const frame = document.createElement("iframe");
  frame.id = slot.code;
  frame.title = `Advertisement: ${slot.code}`;
  frame.width = String(rw);
  frame.height = String(rh);
  frame.style.border = "0";
  frame.style.display = "block";
  frame.style.margin = "0 auto";
  frame.style.overflow = "hidden";
  frame.setAttribute("scrolling", "no");
  frame.setAttribute("frameborder", "0");

  inner.appendChild(frame);
  band.appendChild(inner);
  anchor.insertAdjacentElement(slot.position, band);
  return frame;
}

function toPbjsSizes(sizes: readonly Size[]): PbjsSize[] {
  return sizes.map(([w, h]) => [w, h] as const) as PbjsSize[];
}

function toAdUnit(code: string, sizes: readonly Size[]): PbjsAdUnit {
  return {
    code,
    mediaTypes: { banner: { sizes: toPbjsSizes(sizes) } },
    bids: [
      { bidder: "adtelligent", params: { aid: ADTELLIGENT_AID } },
      { bidder: "bidmatic", params: { source: BIDMATIC_SOURCE } },
      { bidder: "bocharov", params: { publisherId: BOCHAROV_PUBLISHER_ID } },
    ],
  };
}

function getPbjs(): Pbjs | null {
  const maybe = (window as unknown as { pbjs?: Pbjs }).pbjs ?? null;
  if (!maybe) {
    console.error(
      '[ads] pbjs script not found. Ensure <script src="/prebid10.10.0.js"> in index.html',
    );
    return null;
  }
  if (!Array.isArray(maybe.que)) maybe.que = [];
  return maybe;
}

const rendered = new Set<string>();
let eventsBound = false;

function bindEventsOnce(pbjs: Pbjs): void {
  if (eventsBound) return;
  eventsBound = true;

  // почему не рендерим bidWon:
  // bidWon испускается после renderAd или когда ад-сервер отдал креатив.
  // Если ждать bidWon, чтобы вызвать renderAd, событие не придёт.
  // Поэтому рендерим на bidResponse сразу после аукциона.

  pbjs.onEvent("auctionInit", (evt) => {
    emitAdEvent("auctionInit", evt);
  });

  pbjs.onEvent("bidResponse", (bid) => {
    emitAdEvent("bidResponse", bid);
    if (rendered.has(bid.adUnitCode)) return;

    const iframe = document.getElementById(bid.adUnitCode) as HTMLIFrameElement | null;
    const doc = iframe?.contentWindow?.document;
    if (!doc) return;

    if (typeof bid.width === "number" && typeof bid.height === "number") {
      iframe.width = String(bid.width);
      iframe.height = String(bid.height);
      iframe.style.width = `${bid.width}px`;
      iframe.style.height = `${bid.height}px`;
      const host = iframe.parentElement as HTMLElement | null;
      if (host) host.style.minHeight = `${bid.height}px`;
    }

    if (doc.readyState === "loading") {
      doc.open();
      doc.write(
        "<!doctype html><html><head>" +
          "<meta charset='utf-8'/>" +
          "<style>html,body{margin:0;padding:0;overflow:hidden}</style>" +
          "</head><body></body></html>",
      );
      doc.close();
    }

    try {
      pbjs.renderAd(doc, bid.adId);
      rendered.add(bid.adUnitCode);
    } catch {
      /* ignore or handle */
    }
  });

  pbjs.onEvent("bidWon", (bid) => {
    emitAdEvent("bidWon", bid);
  });

  pbjs.onEvent("auctionEnd", (evt) => {
    emitAdEvent("auctionEnd", evt);
  });
}

function scanAndMountOnce(): string[] {
  const mountedCodes: string[] = [];
  for (const slot of ANCHORS) {
    const anchor = document.querySelector(slot.selector);
    if (!anchor) continue;
    if (document.getElementById(slot.code)) continue;

    mountSlot(anchor, slot);
    mountedCodes.push(slot.code);
  }
  return mountedCodes;
}

function runAuctionFor(codes: string[]): void {
  const pbjs = getPbjs();
  if (!pbjs || codes.length === 0) return;

  pbjs.que.push(() => {
    pbjs.setConfig?.({
      debug: true,
      userSync: { enabled: false },
      bidderTimeout: 3000,
      sizeConfig: [
        {
          mediaQuery: "(max-width: 480px)",
          sizesSupported: [
            [320, 50],
            [320, 100],
          ],
        },
        { mediaQuery: "(min-width: 481px) and (max-width: 1024px)", sizesSupported: [[728, 90]] },
        {
          mediaQuery: "(min-width: 1025px)",
          sizesSupported: [
            [970, 250],
            [970, 90],
            [728, 90],
          ],
        },
      ],
    });

    bindEventsOnce(pbjs);

    const units: PbjsAdUnit[] = ANCHORS.filter((a) => codes.includes(a.code)).map((a) =>
      toAdUnit(a.code, a.sizes),
    );

    pbjs.addAdUnits(units);
    pbjs.requestBids({ timeout: 3000, adUnitCodes: codes });
  });
}

function start(): void {
  const first = scanAndMountOnce();
  if (first.length > 0) runAuctionFor(first);

  const mo = new MutationObserver(() => {
    const added = scanAndMountOnce();
    if (added.length > 0) runAuctionFor(added);
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

start();
