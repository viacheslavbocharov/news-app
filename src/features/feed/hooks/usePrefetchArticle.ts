import { useQueryClient } from "@tanstack/react-query";
import { fetchArticle } from "@/features/article/api";

export function usePrefetchArticle() {
  const qc = useQueryClient();
  return (url: string) =>
    qc.prefetchQuery({
      queryKey: ["article", { url }],
      queryFn: () => fetchArticle(url),
      staleTime: 5 * 60 * 1000,
    });
}
