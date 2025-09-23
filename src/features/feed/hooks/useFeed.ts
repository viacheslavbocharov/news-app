import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "../api";

export function useFeed(url?: string) {
  return useQuery({
    queryKey: ["feed", { url: url ?? "default" }],
    queryFn: () => fetchFeed(url),
    staleTime: 60 * 1000,
  });
}
