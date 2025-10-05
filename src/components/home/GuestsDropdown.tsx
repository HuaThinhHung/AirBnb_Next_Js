"use client";

import { useState, useRef, useEffect } from "react";

interface GuestsDropdownProps {
  onChange?: (guests: number) => void;
  className?: string;
}

export default function GuestsDropdown({
  onChange,
  className = "",
}: GuestsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalGuests = adults + children;

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

  useEffect(() => {
    if (onChange) {
      onChange(totalGuests);
    }
  }, [totalGuests, onChange]);

  const getGuestText = () => {
    if (totalGuests === 0) return "Thêm khách";
    const parts = [];
    if (adults > 0) parts.push(`${adults} người lớn`);
    if (children > 0) parts.push(`${children} trẻ em`);
    if (infants > 0) parts.push(`${infants} em bé`);
    return parts.join(", ");
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-sm text-gray-600 bg-transparent border-0 focus:ring-0 focus:outline-none"
      >
        {getGuestText()}
      </button>

      {isOpen && (
        <div className="absolute z-50 right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4">
          {/* Adults */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <div className="font-medium text-gray-900">Người lớn</div>
              <div className="text-sm text-gray-500">Từ 13 tuổi trở lên</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                disabled={adults <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
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
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span className="w-8 text-center font-medium">{adults}</span>
              <button
                type="button"
                onClick={() => setAdults(Math.min(16, adults + 1))}
                disabled={adults >= 16}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <div className="font-medium text-gray-900">Trẻ em</div>
              <div className="text-sm text-gray-500">Độ tuổi 2–12</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setChildren(Math.max(0, children - 1))}
                disabled={children <= 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
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
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span className="w-8 text-center font-medium">{children}</span>
              <button
                type="button"
                onClick={() => setChildren(Math.min(15, children + 1))}
                disabled={children >= 15}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium text-gray-900">Em bé</div>
              <div className="text-sm text-gray-500">Dưới 2 tuổi</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInfants(Math.max(0, infants - 1))}
                disabled={infants <= 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
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
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span className="w-8 text-center font-medium">{infants}</span>
              <button
                type="button"
                onClick={() => setInfants(Math.min(5, infants + 1))}
                disabled={infants >= 5}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Close button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
