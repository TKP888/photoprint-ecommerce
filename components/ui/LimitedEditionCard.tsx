import Link from "next/link";

interface LimitedEditionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  href?: string;
}

export default function LimitedEditionCard({
  title,
  subtitle,
  imageUrl,
  href = "#",
}: LimitedEditionCardProps) {
  return (
    <Link
      href={href}
      className="group relative block h-[500px] md:h-[600px] overflow-hidden cursor-pointer"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
        {subtitle && (
          <p className="text-sm md:text-base font-normal mb-2 opacity-90">
            {subtitle}
          </p>
        )}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          {title}
        </h2>

        <div className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-extrabold hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 inline-block">
          Shop
        </div>
      </div>
    </Link>
  );
}
