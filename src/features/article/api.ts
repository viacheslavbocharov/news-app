import { api } from "@/lib/api";

export type ArticleResponse = {
  sourceUrl: string;
  title: string | null;
  author: string | null;
  publishedAt: string | null;
  heroImage?: string | null;
  paragraphs: string[];
  text: string;   
  images: string[];
};

export function fetchArticle(url: string) {
  const qs = new URLSearchParams({ url });
  return api<ArticleResponse>(`/article?${qs.toString()}`);
}

export type ArticlePreviewResponse = {
  sourceUrl: string;
  title: string | null;
  author: string | null;
  publishedAt: string | null;
  heroImage: string | null;
};

export function fetchArticlePreview(url: string) {
  return api<ArticlePreviewResponse>(`/article/preview?url=${encodeURIComponent(url)}`);
}
