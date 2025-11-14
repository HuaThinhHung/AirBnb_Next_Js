"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface RoomMapProps {
  roomId: number;
  roomName: string;
  address: string;
  coordinates?: {
    lat?: number | null;
    lng?: number | null;
  };
  locationMeta?: {
    tenViTri?: string;
    tinhThanh?: string;
    quocGia?: string;
  };
}

interface Coordinates {
  lat: number;
  lng: number;
}

const markerIcon = L.divIcon({
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -36],
  html: `
    <div style="
      width: 40px;
      height: 40px;
      border-radius: 12px 12px 12px 0;
      background: linear-gradient(135deg, #2563eb, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      transform: rotate(-45deg);
      box-shadow: 0 10px 25px rgba(37, 99, 235, 0.45);
    ">
      <span style="transform: rotate(45deg);">🏡</span>
    </div>
  `,
});

const normalizeKey = (value?: string | null) => {
  if (!value) return "";
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const KNOWN_LOCATION_COORDS: Record<string, Coordinates> = {
  [normalizeKey("Quận 1 Hồ Chí Minh Việt Nam")]: {
    lat: 10.776889,
    lng: 106.700806,
  },
  [normalizeKey("Langbiang Đà Lạt Việt Nam")]: {
    lat: 12.026527,
    lng: 108.442116,
  },
  [normalizeKey("Nha Trang Khánh Hòa Việt Nam")]: {
    lat: 12.238791,
    lng: 109.196749,
  },
  [normalizeKey("Quận 3 Hồ Chí Minh Việt Nam")]: {
    lat: 10.78402,
    lng: 106.69502,
  },
  [normalizeKey("Hội An Quảng Nam Việt Nam")]: {
    lat: 15.880058,
    lng: 108.338047,
  },
};

const findKnownCoordinates = (query: string): Coordinates | null => {
  const key = normalizeKey(query);
  if (key && KNOWN_LOCATION_COORDS[key]) {
    return KNOWN_LOCATION_COORDS[key];
  }
  return null;
};

const buildLocationQuery = (
  meta?: RoomMapProps["locationMeta"],
  fallbackAddress?: string
) => {
  const parts = [
    meta?.tenViTri,
    meta?.tinhThanh,
    meta?.quocGia,
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(", ");
  }

  return fallbackAddress || "";
};

export default function RoomMap({
  roomId,
  roomName,
  address,
  coordinates: presetCoordinates,
  locationMeta,
}: RoomMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerInstance = useRef<L.Marker | null>(null);

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hasPresetCoords =
      typeof presetCoordinates?.lat === "number" &&
      typeof presetCoordinates?.lng === "number" &&
      Number.isFinite(presetCoordinates.lat) &&
      Number.isFinite(presetCoordinates.lng);

    const query = buildLocationQuery(locationMeta, address);

    if (hasPresetCoords) {
      setCoordinates({
        lat: Number(presetCoordinates?.lat),
        lng: Number(presetCoordinates?.lng),
      });
      setError(null);
      setLoading(false);
      return;
    }

    const knownCoords = findKnownCoordinates(query);
    if (knownCoords) {
      setCoordinates(knownCoords);
      setError(null);
      setLoading(false);
      return;
    }

    if (!query) {
      setError("Không có thông tin vị trí để hiển thị bản đồ.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchCoordinates = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchQuery = encodeURIComponent(query);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${fetchQuery}`,
          {
            headers: {
              "Accept-Language": "vi",
            },
            signal: controller.signal,
          }
        );

        const data = (await response.json()) as Array<{
          lat: string;
          lon: string;
        }>;

        if (data && data.length > 0) {
          setCoordinates({
            lat: Number(data[0].lat),
            lng: Number(data[0].lon),
          });
        } else {
          setError("Không tìm thấy tọa độ cho địa chỉ này.");
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Không thể định vị địa chỉ. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();

    return () => controller.abort();
  }, [
    address,
    roomName,
    presetCoordinates?.lat,
    presetCoordinates?.lng,
    locationMeta?.tenViTri,
    locationMeta?.tinhThanh,
    locationMeta?.quocGia,
  ]);

  useEffect(() => {
    if (!coordinates || !containerRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView(coordinates, 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);
    } else {
      mapInstance.current.setView(coordinates, 14);
    }

    if (!markerInstance.current) {
      markerInstance.current = L.marker(coordinates, { icon: markerIcon }).addTo(
        mapInstance.current
      );
    } else {
      markerInstance.current.setLatLng(coordinates);
    }

    markerInstance.current
      .bindPopup(
        `<div style="min-width:180px;">
          <strong>${roomName}</strong><br/>
          Mã phòng: #${roomId}<br/>
          <span style="color:#6b7280;">${address}</span>
        </div>`
      )
      .openPopup();
  }, [coordinates, roomId, roomName, address]);

  useEffect(() => {
    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
      markerInstance.current = null;
    };
  }, []);

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          {error}
        </div>
      )}
      <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 text-gray-600 text-sm font-medium">
            <div className="mb-2 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            Đang định vị địa chỉ...
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>
      <p className="text-xs text-gray-500">
        Bản đồ ưu tiên tọa độ được lưu sẵn. Nếu không có, hệ thống định vị dựa
        trên tên vị trí + tỉnh thành + quốc gia bằng dịch vụ OpenStreetMap, nên
        hãy đảm bảo thông tin chính xác.
      </p>
    </div>
  );
}


