import { Link, useParams } from "react-router-dom";
import newsData from "@/mocks/news.json";

export default function NewsDetails() {
  const { id } = useParams();
  const news = newsData.find((n) => n.id === id);

  if (!news) {
    return <div className="p-6 text-red-600">News not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back button */}
      <Link
        to="/"
        className="mb-4 inline-flex items-center text-blue-600 hover: dark:text-blue-400"
      >
        ← Back
      </Link>

      <img
        src={news.image}
        alt={news.title}
        loading="lazy"
        className="mb-4 h-64 w-full rounded-lg object-cover"
      />

      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{news.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">{news.date}</p>
      <p className="mt-4 whitespace-pre-line text-lg text-gray-800 dark:text-gray-200">
        {news.text}
      </p>
    </div>
  );
}
