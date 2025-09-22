import { Link } from "react-router-dom";
import { useArticleHero } from "@/features/article/hooks";
import { encodeLinkToId } from "@/features/news/linkCodec";
import { isSupportedLink } from "@/features/news/supported";
import { useInViewport } from "@/shared/useInViewport";

type Props = {
  link: string;
  title: string;
  date?: string;
  imageFallback?: string;
};

export default function ArticleCard({ link, title, date, imageFallback }: Props) {
  const id = encodeLinkToId(link);
  const { ref, inView } = useInViewport<HTMLAnchorElement>();
  const supported = isSupportedLink(link);

  const { data: hero } = useArticleHero(link, inView && supported);

  const image = hero || imageFallback;

  return (
    <Link
      ref={ref}
      to={supported ? `/news/${id}` : "#"}
      className="max-w-md rounded-lg border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-900 shadow hover:shadow-lg
                 transition-transform duration-200 hover:scale-105 block"
      aria-disabled={!supported}
      onClick={(e) => {
        if (!supported) e.preventDefault();
      }}
      title={supported ? title : "Article preview is not supported for this source"}
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
          <div className="absolute inset-0 grid place-items-center text-xs text-gray-400">
            no image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {date && <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>}
      </div>
    </Link>
  );
}
