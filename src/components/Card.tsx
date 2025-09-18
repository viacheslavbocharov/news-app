import { Link } from "react-router-dom";

type CardProps = {
  id: string;
  image: string;
  title: string;
  date: string;
  text: string;
};

export default function Card({ id, image, title, date, text }: CardProps) {
  return (
    <Link
      to={`/news/${id}`}
      className="max-w-md rounded-lg border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-900 shadow hover:shadow-lg
                 transition-transform duration-200 hover:scale-105 block"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          srcSet={`
            ${image}?w=400 400w,
            ${image}?w=800 800w,
            ${image}?w=1200 1200w
          `}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
        <p className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-5">{text}</p>
      </div>
    </Link>
  );
}
