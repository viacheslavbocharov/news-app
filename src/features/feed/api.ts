import { api } from "@/lib/api";

export type FeedItem = {
  guid: string;
  title: string;
  link: string;
  isoDate: string | null;
};
export type FeedResponse = {
  sourceUrl: string;
  title: string;
  itemsCount: number;
  items: FeedItem[];
};

export function fetchFeed(url?: string, force = false) {
  const qs = new URLSearchParams();
  if (url) qs.set("url", url);
  if (force) qs.set("force", "1");
  const q = qs.toString();
  return api<FeedResponse>(`/feed${q ? `?${q}` : ""}`);
}
