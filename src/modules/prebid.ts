// type Size = [number, number];

// const ANCHORS: Array<{
//   code: string;                 // id будущего iframe и adUnit.code
//   selector: string;             // где искать якорь
//   position: InsertPosition;     // 'afterbegin' | 'beforeend' | 'beforebegin' | 'afterend'
//   sizes: Size[];                // разрешённые размеры
//   reserve?: Size;               // опц.: какой размер резервировать, чтобы не было CLS
// }> = [
//   { code: "ad-home-top",     selector: "main .max-w-5xl", position: "afterbegin", sizes: [[300,250],[300,600]], reserve: [300,250] },
//   { code: "ad-home-sidebar", selector: "main .max-w-5xl", position: "beforeend",  sizes: [[300,250],[300,600]], reserve: [300,250] },
// ];

// const adUnits: PbjsAdUnit[] = [
//   {
//     code: "ad-home-top",
//     mediaTypes: {
//       banner: { sizes: [[300, 250], [300, 600]] },
//     },
//     bids: [
//       {
//         bidder: "adtelligent",
//         params: { aid: 350975 },
//       },
//     ],
//   },
//     {
//     code: "ad-home-sidebar",
//     mediaTypes: {
//       banner: { sizes: [[300, 250], [300, 600]] },
//     },
//     bids: [
//       {
//         bidder: "adtelligent",
//         params: { aid: 350975 },
//       },
//     ],
//   },
// ];

// function init() {
//   window.pbjs = window.pbjs || ({} as Pbjs);
//   window.pbjs.que = window.pbjs.que || [];

//   window.pbjs.que.push(() => {

//     window.pbjs.addAdUnits(adUnits);

//     window.pbjs.onEvent("bidResponse", (bid) => {
//       console.log("bidResponse", bid);
//       const iframe = document.getElementById(bid.adUnitCode) as HTMLIFrameElement | null;
//       if (!iframe?.contentWindow) return;
//       window.pbjs.renderAd(iframe.contentWindow.document, bid.adId);
//     });

//     window.pbjs.onEvent("bidWon", (bid) => {
//       console.log("bidWon", bid);
//     });

//     window.pbjs.requestBids({ timeout: 1000 });
//   });
// }

// if (document.readyState === "loading") {
//   document.addEventListener("DOMContentLoaded", init);
// } else {
//   init();
// }

// МИНИМАЛЬНО: ищем один стабильный якорь (контент в Layout) и вставляем 2 слота

type Size = readonly [number, number];

const ADTELLIGENT_AID = 350975; // из официальных тест-параметров
const BIDMATIC_SOURCE = 886409;

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
    selector: "main", // якорь — сам <main>
    position: "beforebegin", // ВСТАВИТЬ ПЕРЕД <main> (над контентом)
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
    selector: "main", // тот же якорь
    position: "afterend", // ВСТАВИТЬ ПОСЛЕ <main> (под контентом)
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
// function reserveCss([w, h]: Size): string {
//   return `display:block;min-width:${w}px;min-height:${h}px;`;
// }

function mountSlot(anchor: Element, slot: AnchorSlot): HTMLIFrameElement {
  // внешний бэнд на всю ширину
  const band = document.createElement("div");
  band.className = "ad-band";
  band.style.cssText = "width:100%;display:block;";

  // внутренний контейнер как у твоего Container (max-w-5xl)
  const inner = document.createElement("div");
  inner.className = "ad-container";
  const [rw, rh] = slot.reserve ?? slot.sizes[0] ?? [300, 250];
  inner.style.cssText =
    `position:relative;max-width:64rem;margin:0 auto;padding:0 1rem;` + `min-height:${rh}px;`;

  // iframe
  const frame = document.createElement("iframe");
  frame.id = slot.code;
  frame.title = `Advertisement: ${slot.code}`;
  frame.width = String(rw);
  frame.height = String(rh);
  frame.style.border = "0";
  frame.style.display = "block";
  frame.style.margin = "0 auto"; // центр по контейнеру
  frame.style.overflow = "hidden"; // на всякий случай
  frame.setAttribute("scrolling", "no"); // скрыть полосы в старых UA
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
      // Adtelligent
      { bidder: "adtelligent", params: { aid: ADTELLIGENT_AID } },
      // Bidmatic
      { bidder: "bidmatic", params: { source: BIDMATIC_SOURCE } },
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

function bindEventsOnce(pb: Pbjs): void {
  if (eventsBound) return;
  eventsBound = true;

  pb.onEvent("auctionInit", (evt: PbjsAuctionInitEvent) => {
    const bidders = (evt.bidderRequests ?? []).map((r) => {
      const br = r as { bidderCode?: string };
      return br.bidderCode ?? "unknown";
    });
    console.log("[ads] bidders in auction:", bidders);
  });

  pb.onEvent("bidResponse", (bid) => {
    if (rendered.has(bid.adUnitCode)) return;

    const iframe = document.getElementById(bid.adUnitCode) as HTMLIFrameElement | null;
    const doc = iframe?.contentWindow?.document;
    if (!doc) return;

    // Если пришли реальные размеры — применяем их
    if (typeof bid.width === "number" && typeof bid.height === "number") {
      iframe.width = String(bid.width);
      iframe.height = String(bid.height);
      iframe.style.width = `${bid.width}px`;
      iframe.style.height = `${bid.height}px`;
      const host = iframe.parentElement as HTMLElement | null; // .ad-container
      if (host) host.style.minHeight = `${bid.height}px`;
    }

    // Скелет без отступов и без прокрутки внутри фрейма
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
      pb.renderAd(doc, bid.adId);
      rendered.add(bid.adUnitCode);
    } catch {
      /* no-op в учебном сетапе */
    }
  });
}

/** Сканирует DOM, монтирует недостающие iframes и возвращает коды смонтированных слотов */
function scanAndMountOnce(): string[] {
  const mountedCodes: string[] = [];
  for (const slot of ANCHORS) {
    const anchor = document.querySelector(slot.selector);
    if (!anchor) continue;
    if (document.getElementById(slot.code)) continue; // уже есть

    mountSlot(anchor, slot);
    mountedCodes.push(slot.code);
  }
  return mountedCodes;
}

function runAuctionFor(codes: string[]): void {
  const pb = getPbjs();
  if (!pb || codes.length === 0) return;

  pb.que.push(() => {
    pb.setConfig?.({
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
    bindEventsOnce(pb);

    const units: PbjsAdUnit[] = ANCHORS.filter((a) => codes.includes(a.code)).map((a) =>
      toAdUnit(a.code, a.sizes),
    );

    pb.addAdUnits(units);
    pb.requestBids({ timeout: 3000, adUnitCodes: codes });
  });
}

function start(): void {
  // первая попытка (может ничего не смонтировать, если React ещё не отрисовал якорь)
  const first = scanAndMountOnce();
  if (first.length > 0) runAuctionFor(first);

  // наблюдаем появление якорей/контента (SPA-роутинг)
  const mo = new MutationObserver(() => {
    const added = scanAndMountOnce();
    if (added.length > 0) runAuctionFor(added);
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

// запускаем сразу: MutationObserver подхватит момент, когда React дорисует контент
start();
