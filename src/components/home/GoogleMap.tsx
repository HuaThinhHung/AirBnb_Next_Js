"use client";

import { useEffect, useRef, useState } from "react";

interface Location {
  lat: number;
  lng: number;
  title: string;
  description?: string;
  address?: string;
  type: "landmark" | "accommodation" | "shopping" | "entertainment";
  icon?: string;
}

export default function GoogleMapNew() {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const locations: Location[] = [
    {
      lat: 10.7769,
      lng: 106.7009,
      title: "Chợ Bến Thành",
      description: "Chợ truyền thống nổi tiếng nhất TP.HCM",
      address: "Lê Lợi, Quận 1, TP.HCM",
      type: "shopping",
      icon: "🛍️",
    },
    {
      lat: 10.7797,
      lng: 106.699,
      title: "Nhà thờ Đức Bà Sài Gòn",
      description: "Nhà thờ Công giáo nổi tiếng với kiến trúc Gothic",
      address: "Công xã Paris, Quận 1, TP.HCM",
      type: "landmark",
      icon: "⛪",
    },
    {
      lat: 10.777,
      lng: 106.6956,
      title: "Dinh Độc Lập",
      description: "Di tích lịch sử quan trọng của Việt Nam",
      address: "Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM",
      type: "landmark",
      icon: "🏛️",
    },
    {
      lat: 10.7629,
      lng: 106.6601,
      title: "Chung cư Diamond",
      description: "Căn hộ cao cấp với view sông đẹp",
      address: "1646A Võ Văn Kiệt, Quận 8, TP.HCM",
      type: "accommodation",
      icon: "🏢",
    },
    {
      lat: 10.7756,
      lng: 106.7019,
      title: "Phố đi bộ Nguyễn Huệ",
      description: "Khu vực đi bộ sầm uất nhất TP.HCM",
      address: "Nguyễn Huệ, Quận 1, TP.HCM",
      type: "entertainment",
      icon: "🚶",
    },
    {
      lat: 10.7944,
      lng: 106.7219,
      title: "Landmark 81",
      description: "Tòa nhà cao nhất Việt Nam",
      address: "Vinhomes Central Park, Bình Thạnh, TP.HCM",
      type: "landmark",
      icon: "🏗️",
    },
    {
      lat: 10.7719,
      lng: 106.7042,
      title: "Bitexco Financial Tower",
      description: "Tòa nhà văn phòng cao cấp với Skydeck",
      address: "Hải Triều, Quận 1, TP.HCM",
      type: "landmark",
      icon: "🏢",
    },
    {
      lat: 10.75,
      lng: 106.65,
      title: "Khu vực Quận 8",
      description: "Khu vực đang phát triển với nhiều tiềm năng",
      address: "Quận 8, TP.HCM",
      type: "accommodation",
      icon: "🏘️",
    },
  ];

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.warn(
        "Google Maps API key not found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file"
      );
      return;
    }

    // Kiểm tra xem Google Maps đã được load chưa
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Google Maps script");
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapOptions: any = {
      center: { lat: 10.7769, lng: 106.7009 }, // TP.HCM coordinates
      zoom: 13,
      styles: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#ffffff" }, { lightness: 17 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { lightness: 18 }],
        },
        {
          featureType: "road.local",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { lightness: 16 }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }, { lightness: 21 }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#dedede" }, { lightness: 21 }],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [
            { visibility: "on" },
            { color: "#ffffff" },
            { lightness: 16 },
          ],
        },
        {
          elementType: "labels.text.fill",
          stylers: [
            { saturation: 36 },
            { color: "#333333" },
            { lightness: 40 },
          ],
        },
        {
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#f2f2f2" }, { lightness: 19 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [{ color: "#fefefe" }, { lightness: 20 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }],
        },
      ],
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newMarkers: any[] = [];

    const getMarkerColor = (type: string) => {
      switch (type) {
        case "landmark":
          return "#ef4444"; // red
        case "accommodation":
          return "#3b82f6"; // blue
        case "shopping":
          return "#10b981"; // green
        case "entertainment":
          return "#f59e0b"; // yellow
        default:
          return "#6b7280"; // gray
      }
    };

    const getMarkerIcon = (type: string) => {
      switch (type) {
        case "landmark":
          return "🏛️";
        case "accommodation":
          return "🏨";
        case "shopping":
          return "🛍️";
        case "entertainment":
          return "🎭";
        default:
          return "📍";
      }
    };

    locations.forEach((location) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: newMap,
        title: location.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: getMarkerColor(location.type),
          fillOpacity: 0.9,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-4 max-w-xs">
            <div class="flex items-center mb-3">
              <span class="text-2xl mr-2">${
                location.icon || getMarkerIcon(location.type)
              }</span>
              <h3 class="font-bold text-gray-900 text-lg">${location.title}</h3>
            </div>
            ${
              location.description
                ? `<p class="text-sm text-gray-600 mb-2">${location.description}</p>`
                : ""
            }
            ${
              location.address
                ? `<p class="text-xs text-blue-600 font-medium">📍 ${location.address}</p>`
                : ""
            }
            <div class="mt-3 pt-2 border-t border-gray-200">
              <span class="inline-block px-2 py-1 text-xs font-medium rounded-full ${
                location.type === "landmark"
                  ? "bg-red-100 text-red-800"
                  : location.type === "accommodation"
                  ? "bg-blue-100 text-blue-800"
                  : location.type === "shopping"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }">
                ${
                  location.type === "landmark"
                    ? "Địa danh"
                    : location.type === "accommodation"
                    ? "Nơi ở"
                    : location.type === "shopping"
                    ? "Mua sắm"
                    : "Giải trí"
                }
              </span>
            </div>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(newMap, marker);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [isLoaded]);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Khám Phá TP. Hồ Chí Minh
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá những địa danh nổi tiếng và khu vực đang phát triển tại
            thành phố Hồ Chí Minh. Từ những di tích lịch sử đến những tòa nhà
            hiện đại, mỗi địa điểm đều mang đến trải nghiệm độc đáo.
          </p>
        </div>

        <div className="w-full h-[500px] rounded-3xl shadow-2xl overflow-hidden border-4 border-white relative">
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Địa danh</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Nơi ở</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Mua sắm</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Giải trí</span>
              </div>
            </div>
          </div>
          {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Google Maps API Key Required
                </h3>
                <p className="text-gray-600 mb-4">
                  Please add your Google Maps API key to the .env.local file
                </p>
                <div className="bg-gray-800 text-green-400 p-3 rounded-lg text-sm font-mono">
                  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
                </div>
              </div>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Các Địa Điểm Nổi Bật
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`w-4 h-4 rounded-full mr-3 ${
                      location.type === "landmark"
                        ? "bg-red-500"
                        : location.type === "accommodation"
                        ? "bg-blue-500"
                        : location.type === "shopping"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <span className="text-2xl">{location.icon}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {location.title}
                </h3>
                {location.description && (
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {location.description}
                  </p>
                )}
                {location.address && (
                  <p className="text-xs text-blue-600 font-medium mb-3">
                    📍 {location.address}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      location.type === "landmark"
                        ? "bg-red-100 text-red-800"
                        : location.type === "accommodation"
                        ? "bg-blue-100 text-blue-800"
                        : location.type === "shopping"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {location.type === "landmark"
                      ? "Địa danh"
                      : location.type === "accommodation"
                      ? "Nơi ở"
                      : location.type === "shopping"
                      ? "Mua sắm"
                      : "Giải trí"}
                  </span>
                  <button className="text-blue-500 hover:text-blue-700 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
