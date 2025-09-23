import { useQuery } from "@tanstack/react-query";
import { type ArticleResponse, fetchArticle } from "../api";

type ApiError = { status?: number; code?: string; message?: string };

export function useArticle(url?: string) {
  return useQuery<ArticleResponse, ApiError>({
    queryKey: ["article", { url }],
    enabled: !!url,
    queryFn: async () => {
      if (!url) {
        throw { status: 400, message: "No URL" } as ApiError;
      }
      return fetchArticle(url);
    },
    retry: (count, err) => {
      if (err?.status === 401) return false;
      return count < 2;
    },
    staleTime: 5 * 60 * 1000,
  });
}
