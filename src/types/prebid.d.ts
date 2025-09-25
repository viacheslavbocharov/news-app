interface PbjsBid {
  adId: string;
  adUnitCode: string;
  bidder: string;
  cpm: number;
  currency: string;
  width: number;
  height: number;
  creativeId?: string;
  requestId?: string;
  [key: string]: unknown;
}

interface PbjsAdUnit {
  code: string;
  mediaTypes: {
    banner: { sizes: number[][] };
  };
  bids: Array<{
    bidder: string;
    params: Record<string, unknown>;
  }>;
}

interface Pbjs {
  que: Array<() => void>;
  addAdUnits: (adUnits: PbjsAdUnit | PbjsAdUnit[]) => void;
  requestBids: (options: { timeout: number; bidsBackHandler?: (bids: PbjsBid[]) => void }) => void;
  renderAd: (doc: Document, adId: string) => void;
  onEvent: (event: "bidResponse" | "bidWon", handler: (bid: PbjsBid) => void) => void;
  getHighestCpmBids: (adUnitCode?: string) => PbjsBid[];
}

interface Window {
  pbjs: Pbjs;
}
