interface LocationCardProps {
  id: number;
  name: string;
  province: string;
  country: string;
  image: string;
  distance?: string;
}

export default function LocationCard({
  id,
  name,
  province,
  country,
  image,
  distance,
}: LocationCardProps) {
  const handleClick = () => {
    // Navigate to rooms filtered by location
    window.location.href = `/rooms?location=${id}`;
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer transition-all duration-300 hover:scale-105"
    >
      <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-24 sm:h-32 bg-gray-200">
          <img
            src={
              image ||
              "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop"
            }
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop";
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 bg-white">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-1">
            {name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
            {province}
            {country && `, ${country}`}
          </p>
          {distance && <p className="text-xs text-gray-500 mt-1">{distance}</p>}
        </div>
      </div>
    </div>
  );
}
