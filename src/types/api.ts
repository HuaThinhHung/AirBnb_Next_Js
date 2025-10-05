// API Response Types

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  [key: string]: any;
}

export interface LocationsResponse extends ApiResponse {
  locations: any[];
  pagination?: {
    pageIndex: number;
    pageSize: number;
    totalRow: number;
    totalPages: number;
  };
}

export interface RoomsResponse extends ApiResponse {
  rooms: any[];
  pagination?: {
    pageIndex: number;
    pageSize: number;
    totalRow: number;
    totalPages: number;
  };
}

export interface LocationResponse extends ApiResponse {
  location: any;
}

export interface RoomResponse extends ApiResponse {
  room: any;
}
