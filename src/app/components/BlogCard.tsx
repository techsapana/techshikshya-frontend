import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  imageSrc?: string;
  href?: string;
  linkLabel?: string;
}

const BlogCard = ({
  title,
  imageSrc,
  href = "#",
  linkLabel = "Read Blog",
}: BlogCardProps) => {
  return (
    <div className="group w-full max-w-70 overflow-hidden rounded-2xl border border-blue-200/75 bg-white/92 shadow-md transition-shadow duration-300 hover:shadow-lg sm:max-w-xs">
      <div className="relative h-44 overflow-hidden bg-blue-50">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 320px"
          />
        ) : (
          <div className="h-full w-full bg-blue-100/70" aria-hidden="true" />
        )}
      </div>

      <div className="p-5">
        <h3 className="text-base md:text-lg font-semibold text-slate-900 leading-snug line-clamp-2 min-h-12">
          {title}
        </h3>
        <Link
          href={href}
          className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          {linkLabel}
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
