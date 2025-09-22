import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFeed } from "./api";
import { fetchArticle } from "@/features/article/api";

export function useFeed(url?: string) {
  return useQuery({
    queryKey: ["feed", { url: url ?? "default" }],
    queryFn: () => fetchFeed(url),
    staleTime: 60 * 1000,
  });
}

export function usePrefetchArticle() {
  const qc = useQueryClient();
  return (url: string) =>
    qc.prefetchQuery({
      queryKey: ["article", { url }],
      queryFn: () => fetchArticle(url),
      staleTime: 5 * 60 * 1000,
    });
}
