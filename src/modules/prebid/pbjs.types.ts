export type PbjsSize = readonly [number, number];

export type PbjsQueue = Array<() => void>;
export type PbjsPlaceholder = { que: PbjsQueue } & Partial<Pbjs>;

export interface PbjsGlobal {
  pbjs?: Pbjs | PbjsPlaceholder;
  _pbjsLoad?: Promise<Pbjs>;
}

export interface PbjsBid {
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

export interface PbjsMediaTypes {
  banner: { sizes: PbjsSize[] };
}

export interface PbjsBidderParams {
  [key: string]: unknown;
}

export interface PbjsAdUnit {
  code: string;
  mediaTypes: PbjsMediaTypes;
  bids: Array<{ bidder: string; params: PbjsBidderParams }>;
}

export interface RequestBidsOpts {
  timeout: number;
  bidsBackHandler?: (bids: PbjsBid[]) => void;
  adUnitCodes?: string[];
}

export interface PbjsUserSyncConfig {
  enabled?: boolean;
}

export interface PbjsSizeConfig {
  mediaQuery: string;
  sizesSupported: PbjsSize[];
  labels?: string[];
}

export interface PbjsConfig {
  debug?: boolean;
  userSync?: PbjsUserSyncConfig;
  sizeConfig?: PbjsSizeConfig[];
  bidderTimeout?: number;
}

export interface PbjsAuctionInitEvent {
  auctionId: string;
  timestamp?: number;
  adUnitCodes?: string[];
  bidderRequests?: unknown[];
  [k: string]: unknown;
}

export interface PbjsAuctionEndEvent {
  auctionId: string;
  timestamp?: number;
  bidsReceived?: PbjsBid[];
  winningBids?: PbjsBid[];
  adUnitCodes?: string[];
  [k: string]: unknown;
}

export interface Pbjs {
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
