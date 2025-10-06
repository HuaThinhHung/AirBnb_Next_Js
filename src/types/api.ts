// API Response Types

// Base types for API entities
export interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

export interface Room {
  id: number;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean;
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean;
  hoBoi: boolean;
  banUi?: boolean;
  maViTri: number;
  hinhAnh: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

export interface LocationsResponse extends ApiResponse {
  locations: Location[];
  pagination?: {
    pageIndex: number;
    pageSize: number;
    totalRow: number;
    totalPages: number;
  };
}

export interface RoomsResponse extends ApiResponse {
  rooms: Room[];
  pagination?: {
    pageIndex: number;
    pageSize: number;
    totalRow: number;
    totalPages: number;
  };
}

export interface LocationResponse extends ApiResponse {
  location: Location;
}

export interface RoomResponse extends ApiResponse {
  room: Room;
}
