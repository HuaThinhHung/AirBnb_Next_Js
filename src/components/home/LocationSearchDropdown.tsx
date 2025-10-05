"use client";

import { useEffect, useState, useRef } from "react";
import { getLocations } from "@/lib/locationService";
import Link from "next/link";

type LocationItem = {
  id: number;
  tenViTri?: string;
  tinhThanh?: string;
  quocGia?: string;
  hinhAnh?: string;
};

interface LocationSearchDropdownProps {
  onSelectLocation?: (locationId: number) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationSearchDropdown({
  onSelectLocation,
  placeholder = "Tìm kiếm địa điểm...",
  className = "",
}: LocationSearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationItem[]>(
    []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load all locations on mount
  useEffect(() => {
    const loadLocations = async () => {
      setLoading(true);
      const res = (await getLocations()) as any;
      if (res.success) {
        setLocations(res.locations || []);
      }
      setLoading(false);
    };
    loadLocations();
  }, []);

  // Filter locations based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredLocations(locations.slice(0, 8)); // Show first 8 when no query
    } else {
      const q = query.toLowerCase();
      const filtered = locations.filter((loc) =>
        `${loc.tenViTri || ""} ${loc.tinhThanh || ""} ${loc.quocGia || ""}`
          .toLowerCase()
          .includes(q)
      );
      setFilteredLocations(filtered.slice(0, 8));
    }
  }, [query, locations]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: LocationItem) => {
    setQuery(`${loc.tenViTri}, ${loc.tinhThanh}, ${loc.quocGia}`);
    setIsOpen(false);
    if (onSelectLocation) {
      onSelectLocation(loc.id);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full text-sm text-gray-600 bg-transparent border-0 focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Đang tải danh sách vị trí...
            </div>
          ) : filteredLocations.length > 0 ? (
            <ul className="py-2">
              {filteredLocations.map((loc) => (
                <li key={loc.id}>
                  <button
                    onClick={() => handleSelectLocation(loc)}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors text-left"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      {loc.hinhAnh ? (
                        <img
                          src={loc.hinhAnh}
                          alt={loc.tenViTri || "Location"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-gray-400"
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
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {loc.tenViTri}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {loc.tinhThanh}, {loc.quocGia}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy vị trí phù hợp
            </div>
          )}

          {/* View all link */}
          {filteredLocations.length > 0 && (
            <div className="border-t border-gray-200 p-2">
              <Link
                href="/search"
                className="block w-full px-4 py-2 text-center text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Xem tất cả vị trí →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
