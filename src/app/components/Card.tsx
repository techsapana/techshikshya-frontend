import Image from "next/image";
import Link from "next/link";

interface CardProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  href: string;
}

const Card = ({ imageSrc, title, subtitle, href }: CardProps) => {
  return (
    <div className="relative w-64 h-80 overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-md transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl">
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/30 to-transparent" />

      <div className="absolute bottom-0 w-full p-4 text-white">
        <h3 className="font-bold text-lg drop-shadow">{title}</h3>
        <p className="text-sm text-white/90">{subtitle}</p>
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-slate-900/90 via-blue-900/90 to-slate-900/90 text-white flex flex-col justify-center items-center p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-2 bg-linear-to-r from-blue-500 to-sky-500 px-4 py-2 text-sm font-semibold rounded-full hover:from-blue-600 hover:to-sky-600 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Card;
