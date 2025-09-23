import { Link } from "react-router-dom";
import { usePrefetchArticle } from "@/features/feed/hooks/usePrefetchArticle";
import { encodeLinkToId } from "@/features/news/linkCodec";

type CardProps = {
  link: string;
  image?: string;
  title: string;
  date?: string;
  preview?: string;
};

export default function Card({ link, image, title, date, preview }: CardProps) {
  const id = encodeLinkToId(link);
  const prefetch = usePrefetchArticle();

  return (
    <Link
      to={`/news/${id}`}
      onMouseEnter={() => prefetch(link)}
      className="max-w-md rounded-lg border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-900 shadow hover:shadow-lg
                 transition-transform duration-200 hover:scale-105 block"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-sm text-gray-400">
            no image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {date && <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>}
        {preview && <p className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-5">{preview}</p>}
      </div>
    </Link>
  );
}
