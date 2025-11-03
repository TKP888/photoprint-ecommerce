import LimitedEditionCard from "@/components/ui/LimitedEditionCard";

interface LimitedEditionItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  href?: string;
}

interface LimitedEditionSectionProps {
  items: LimitedEditionItem[];
}

export default function LimitedEditionSection({
  items,
}: LimitedEditionSectionProps) {
  const displayItems = items.slice(0, 2);

  return (
    <section className="w-full py-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {displayItems.map((item) => (
          <LimitedEditionCard
            key={item.id}
            id={item.id}
            title={item.title}
            subtitle={item.subtitle}
            imageUrl={item.imageUrl}
            href={item.href}
          />
        ))}
      </div>
    </section>
  );
}
