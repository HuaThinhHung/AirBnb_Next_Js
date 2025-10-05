interface PropertyTypeCardProps {
  title: string;
  subtitle: string;
  image: string;
  count?: string;
}

export default function PropertyTypeCard({
  title,
  subtitle,
  image,
  count,
}: PropertyTypeCardProps) {
  return (
    <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
      <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-48 sm:h-64 bg-gray-200">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop";
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Content on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold text-lg sm:text-xl mb-1">{title}</h3>
            <p className="text-sm text-white/90">{subtitle}</p>
            {count && <p className="text-xs text-white/80 mt-1">{count}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
