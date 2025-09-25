// interface PbjsBid {
//   adId: string;
//   adUnitCode: string;
//   bidder: string;
//   cpm: number;
//   currency: string;
//   width: number;
//   height: number;
//   creativeId?: string;
//   requestId?: string;
//   [key: string]: unknown;
// }

// interface PbjsAdUnit {
//   code: string;
//   mediaTypes: {
//     banner: { sizes: number[][] };
//   };
//   bids: Array<{
//     bidder: string;
//     params: Record<string, unknown>;
//   }>;
// }

// interface Pbjs {
//   que: Array<() => void>;
//   addAdUnits: (adUnits: PbjsAdUnit | PbjsAdUnit[]) => void;
//   requestBids: (options: { timeout: number; bidsBackHandler?: (bids: PbjsBid[]) => void }) => void;
//   renderAd: (doc: Document, adId: string) => void;
//   onEvent: (event: "bidResponse" | "bidWon", handler: (bid: PbjsBid) => void) => void;
//   getHighestCpmBids: (adUnitCode?: string) => PbjsBid[];
// }

// interface Window {
//   pbjs: Pbjs;
// }
// Минимально достаточно для учебного проекта

// src/types/prebid.d.ts
// Глобальные типы Prebid для проекта (без any)

declare global {
  type PbjsSize = readonly [number, number];

  interface PbjsBid {
    adId: string;
    adUnitCode: string;
    bidder: string;
    cpm: number;
    currency?: string;
    width?: number;
    height?: number;
    meta?: {
      advertiserName?: string;
      networkId?: string | number;
      [k: string]: unknown;
    };
    [extra: string]: unknown;
  }

  interface PbjsMediaTypes {
    banner: { sizes: PbjsSize[] };
  }

  interface PbjsBidderParams {
    [key: string]: unknown;
  }

  interface PbjsAdUnit {
    code: string; // = id iframe
    mediaTypes: PbjsMediaTypes;
    bids: Array<{ bidder: string; params: PbjsBidderParams }>;
  }

  interface RequestBidsOpts {
    timeout: number;
    bidsBackHandler?: (bids: PbjsBid[]) => void;
    adUnitCodes?: string[];
  }

  interface PbjsUserSyncConfig { enabled?: boolean }
  interface PbjsConfig { debug?: boolean; userSync?: PbjsUserSyncConfig }

  interface PbjsAuctionInitEvent {
    auctionId: string;
    timestamp?: number;
    adUnitCodes?: string[];
    bidderRequests?: unknown[];
    [k: string]: unknown;
  }

  interface PbjsAuctionEndEvent {
    auctionId: string;
    timestamp?: number;
    bidsReceived?: PbjsBid[];
    winningBids?: PbjsBid[];
    adUnitCodes?: string[];
    [k: string]: unknown;
  }

  interface Pbjs {
    que: Array<() => void>;
    addAdUnits(adUnits: PbjsAdUnit | PbjsAdUnit[]): void;
    requestBids(options: RequestBidsOpts): void;
    renderAd(doc: Document, adId: string): void;

    onEvent(event: "bidResponse", handler: (bid: PbjsBid) => void): void;
    onEvent(event: "bidWon", handler: (bid: PbjsBid) => void): void;
    onEvent(event: "auctionInit", handler: (evt: PbjsAuctionInitEvent) => void): void;
    onEvent(event: "auctionEnd", handler: (evt: PbjsAuctionEndEvent) => void): void;

    setConfig?(cfg: PbjsConfig): void;
    getHighestCpmBids?(adUnitCode?: string): PbjsBid[];
  }

  interface PbjsSizeConfig {
    mediaQuery: string;
    sizesSupported: PbjsSize[]; // массив кортежей [w,h]
    labels?: string[];
  }

  interface PbjsConfig {
    debug?: boolean;
    userSync?: PbjsUserSyncConfig;
    sizeConfig?: PbjsSizeConfig[];
    bidderTimeout?: number;
  }

  interface Window {
    pbjs: Pbjs;
  }
}

export {};
