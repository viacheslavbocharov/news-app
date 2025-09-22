import { useFeed } from "@/features/feed/hooks";
import ArticleCard from "@/components/ArticleCard";

export default function Home() {
  const { data, isLoading, isError, error } = useFeed();

  if (isLoading) return <div className="p-6">Loading feed…</div>;
  if (isError) return <div className="p-6 text-red-600">Error: {(error as Error).message}</div>;
  if (!data) return null;

  return (
    <div className="container mx-auto grid gap-6 px-4 py-6 md:grid-cols-2 lg:grid-cols-3">
      {data.items.map((item) => (
        <ArticleCard
          key={item.guid || item.link}
          link={item.link}
          title={item.title}
          date={item.isoDate ? new Date(item.isoDate).toLocaleString() : undefined}
        />
      ))}
    </div>
  );
}
