import { useQuery } from "@tanstack/react-query";
import { type ArticlePreviewResponse, fetchArticlePreview } from "../api";

type ApiError = { status?: number; code?: string; message?: string };

export function useArticleHero(url?: string, enabled = true) {
  return useQuery<ArticlePreviewResponse, ApiError, string | null>({
    queryKey: ["articleHero", { url }],
    enabled: enabled && !!url,
    queryFn: async () => {
      if (!url) throw { status: 400, message: "No URL" } as ApiError;
      return fetchArticlePreview(url);
    },
    select: (a) => a.heroImage ?? null,
    staleTime: 10 * 60 * 1000,
  });
}
