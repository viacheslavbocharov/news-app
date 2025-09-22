import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useArticle } from "@/features/article/hooks";

function safeDecodeIdToLink(id?: string) {
  if (!id) return undefined;
  try {
    return atob(decodeURIComponent(id));
  } catch {
    return undefined;
  }
}

export default function NewsDetails() {
  const { id } = useParams<{ id: string }>();

  const url = useMemo(() => safeDecodeIdToLink(id), [id]);

  const { data, isLoading, isError, error } = useArticle(url);

  if (!id || !url) {
    return <div className="p-6 text-red-600">Bad route</div>;
  }

  if (isLoading) return <div className="p-6">Loading article…</div>;
  if (isError) return <div className="p-6 text-red-600">Error: {(error as Error).message}</div>;
  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/" className="mb-4 inline-flex items-center text-blue-600 dark:text-blue-400">
        ← Back
      </Link>

      {data.heroImage && (
        <img
          src={data.heroImage}
          alt={data.title ?? "Article image"}
          loading="lazy"
          className="mb-4 h-64 w-full rounded-lg object-cover"
        />
      )}

      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
        {data.title ?? "Untitled"}
      </h1>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {data.author ? `${data.author} • ` : ""}
        {data.publishedAt ? new Date(data.publishedAt).toLocaleString() : ""}
      </p>

      <article className="prose dark:prose-invert mt-6 max-w-none">
        {data.paragraphs.map((p) => (
          <p key={p.slice(0, 20)} className="text-lg leading-relaxed">
            {p}
          </p>
        ))}
      </article>
    </div>
  );
}
