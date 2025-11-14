"use client";

import { useState, useEffect, useRef } from "react";
import { getUsersPaginated, deleteUser } from "@/lib/userService";
import Link from "next/link";

type RoleFilter = "all" | "ADMIN" | "USER";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  avatar: string;
  gender: boolean;
  role: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [allUsersCache, setAllUsersCache] = useState<User[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("");
  const [syncing, setSyncing] = useState(false);
  const pageSize = 10;
  const fetchAllPageSize = 100;
  const topRef = useRef<HTMLDivElement>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  const roleLabels: Record<RoleFilter, string> = {
    all: "Tất cả",
    ADMIN: "Admin",
    USER: "User",
  };
  const roleOptions: RoleFilter[] = ["all", "ADMIN", "USER"];

  const buildSuggestionList = (list: User[]) =>
    list.slice(0, 20).map((user) => {
      const safeName = user.name || "Không tên";
      const safeEmail = user.email || "Không email";
      return `${user.id} - ${safeName} | ${safeEmail}`;
    });

  const extractSearchTerm = (value: string) => {
    if (!value) return "";
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (trimmed.includes("|")) {
      return trimmed.split("|").pop()?.trim() || "";
    }
    if (/^\d+\s*-\s*/.test(trimmed)) {
      return trimmed.replace(/^\d+\s*-\s*/, "").trim();
    }
    return trimmed;
  };

  const filterUsersByKeyword = (list: User[], keyword: string) => {
    if (!keyword) return list;
    const normalized = keyword.toLowerCase();
    return list.filter((user) => {
      const matchesName = user.name?.toLowerCase().includes(normalized);
      const matchesEmail = user.email?.toLowerCase().includes(normalized);
      const matchesPhone = user.phone?.toLowerCase().includes(normalized);
      const matchesRole = user.role?.toLowerCase().includes(normalized);
      const matchesId = user.id?.toString().includes(normalized);
      return (
        matchesName ||
        matchesEmail ||
        matchesPhone ||
        matchesRole ||
        matchesId
      );
    });
  };

  const filterUsersByRole = (list: User[], role: RoleFilter) => {
    if (role === "all") return list;
    return list.filter(
      (user) => user.role?.toUpperCase() === role.toUpperCase()
    );
  };

  const applySearchPagination = (list: User[], page: number) => {
    const total = list.length;
    const totalPagesCalc = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPagesCalc);
    const paginated = list.slice((safePage - 1) * pageSize, safePage * pageSize);
    setUsers(paginated);
    setTotalPages(totalPagesCalc);
    setTotalCount(total);
    setCurrentPage(safePage);
    setSearchSuggestions(buildSuggestionList(list));
  };

  const fetchAllUsers = async (keyword: string) => {
    const firstPage = (await getUsersPaginated(
      1,
      fetchAllPageSize,
      keyword
    )) as {
      success: boolean;
      users: User[];
      totalPages: number;
    };

    if (!firstPage.success) {
      return null;
    }

    let aggregated = [...firstPage.users];
    const totalPagesToFetch = firstPage.totalPages;

    for (let page = 2; page <= totalPagesToFetch; page++) {
      const nextPage = (await getUsersPaginated(
        page,
        fetchAllPageSize,
        keyword
      )) as {
        success: boolean;
        users: User[];
      };
      if (nextPage.success) {
        aggregated = aggregated.concat(nextPage.users);
      } else {
        break;
      }
    }

    return aggregated;
  };

  const applyFiltersAndPaginate = (
    sourceList: User[],
    keyword: string,
    page: number,
    role: RoleFilter
  ) => {
    const processedKeyword = extractSearchTerm(keyword);
    const filteredList = filterUsersByRole(
      filterUsersByKeyword(sourceList, processedKeyword),
      role
    );
    applySearchPagination(filteredList, page);
  };

  const syncAllUsers = async () => {
    setSyncing(true);
    try {
      const aggregated = await fetchAllUsers("");
      if (aggregated) {
        setAllUsersCache(aggregated);
        setLastSyncedAt(new Date().toLocaleString());
        return aggregated;
      }
      return [];
    } finally {
      setSyncing(false);
    }
  };

  // Fetch users with caching (minimize reload)
  const fetchUsers = async (
    page = 1,
    keyword = "",
    options?: { forceRefresh?: boolean }
  ) => {
    const forceRefresh = options?.forceRefresh ?? false;
    setLoading(true);
    try {
      let cache = allUsersCache;
      if (forceRefresh || cache.length === 0) {
        cache = await syncAllUsers();
      }
      applyFiltersAndPaginate(cache, keyword, page, roleFilter);
    } catch (error) {
      console.error("❌ Lỗi tải người dùng:", error);
      setUsers([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const handleSearch = () => {
    setCurrentPage(1);
    if (allUsersCache.length === 0) {
      fetchUsers(1, searchKeyword);
      return;
    }
    applyFiltersAndPaginate(allUsersCache, searchKeyword, 1, roleFilter);
  };

  // Reset search
  const handleReset = () => {
    setSearchKeyword("");
    setCurrentPage(1);
    const targetRole: RoleFilter = "all";
    if (roleFilter !== targetRole) {
      setRoleFilter(targetRole);
    }
    if (allUsersCache.length === 0) {
      fetchUsers(1, "");
      return;
    }
    applyFiltersAndPaginate(allUsersCache, "", 1, targetRole);
  };

  // Change page
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchUsers(page, searchKeyword);
  };

  // Delete user
  const handleDelete = async (userId: number, userName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa người dùng "${userName}"?`)) return;

    const result = (await deleteUser(userId)) as {
      success: boolean;
      message?: string;
    };

    if (result.success) {
      alert("✅ Xóa người dùng thành công!");
      setAllUsersCache((prev) => {
        const updated = prev.filter((user) => user.id !== userId);
        applyFiltersAndPaginate(updated, searchKeyword, currentPage, roleFilter);
        return updated;
      });
    } else {
      alert("❌ Lỗi: " + (result.message || "Không thể xóa người dùng"));
    }
  };

  const handleManualRefresh = () => {
    fetchUsers(1, searchKeyword, { forceRefresh: true });
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (allUsersCache.length === 0) return;
    applyFiltersAndPaginate(allUsersCache, searchKeyword, 1, roleFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  // Scroll to top khi chuyển trang
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  // Render pagination - Modern Style
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        {/* Previous */}
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors"
        >
          ← Trước
        </button>

        {/* Page Numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`min-w-[40px] px-3 py-2 border rounded-md font-medium transition-colors ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors"
        >
          Sau →
        </button>
      </div>
    );
  };

  const formatBirthday = (value?: string) => {
    if (!value) return "Chưa cập nhật";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Chưa cập nhật";
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatGender = (gender?: boolean | null) => {
    if (gender === null || gender === undefined) return "Chưa rõ";
    return gender ? "Nam" : "Nữ";
  };

  const formatPhone = (phone?: string) => phone || "Chưa cập nhật";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Scroll Target */}
      <div ref={topRef} className="h-0" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý người dùng
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Tổng số: {totalCount} người dùng | Trang {currentPage}/
              {totalPages} | Vai trò: {roleLabels[roleFilter]}
              {lastSyncedAt && (
                <>
                  {" "}
                  | Lần đồng bộ:{" "}
                  <span className="font-medium text-gray-700">{lastSyncedAt}</span>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={loading || syncing}
              className="px-5 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {syncing ? "Đang đồng bộ..." : "↻ Đồng bộ dữ liệu"}
            </button>
            <Link
              href="/admin/users/create"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              + Thêm quản trị viên
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700">
                  Tìm kiếm nhanh
                </label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Nhập tên, email (ví dụ: gmail), số điện thoại hoặc ID người dùng"
                  list="users-suggestions"
                  className="mt-1 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div className="flex items-end gap-3">
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                >
                  🔍 Tìm
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <span>Lọc theo vai trò</span>
      
              </div>
              <div className="flex flex-wrap gap-2">
                {roleOptions.map((roleOption) => {
                  const isActive = roleFilter === roleOption;
                  return (
                    <button
                      key={roleOption}
                      type="button"
                      onClick={() => {
                        setCurrentPage(1);
                        setRoleFilter(roleOption);
                      }}
                      className={`px-4 py-2 rounded-full border font-semibold transition-all ${
                        isActive
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {roleLabels[roleOption]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <datalist id="users-suggestions">
          {searchSuggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">👤</div>
              <p className="text-gray-600 text-lg">Không tìm thấy người dùng</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full admin-responsive-table">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Thông tin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Avatar
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Chi tiết
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors sm:rounded-none sm:border-0 sm:shadow-none rounded-2xl border border-gray-100 shadow-sm"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900" data-label="STT">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-6 py-4 space-y-1" data-label="Thông tin">
                        <div className="text-base font-semibold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 break-all">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4" data-label="Avatar">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md mx-auto"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg mx-auto">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 space-y-2" data-label="Chi tiết">
                        <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">
                          <span>📞</span>
                          <span>{formatPhone(user.phone)}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                          <span>🎂</span>
                          <span>{formatBirthday(user.birthday)}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                          <span>{user.gender ? "👨" : "👩"}</span>
                          <span>{formatGender(user.gender)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-label="Role">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center" data-label="Hành động">
                        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="flex items-center justify-center gap-1 rounded-lg border-2 border-blue-100 bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Xem chi tiết"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <span className="text-sm font-semibold sm:hidden">
                              Xem
                            </span>
                          </Link>
                          <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="flex items-center justify-center gap-1 rounded-lg border-2 border-yellow-100 bg-yellow-50 px-3 py-2 text-yellow-600 hover:bg-yellow-100 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            <span className="text-sm font-semibold sm:hidden">
                              Sửa
                            </span>
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            className="flex items-center justify-center gap-1 rounded-lg border-2 border-red-100 bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100 transition-colors"
                            title="Xóa người dùng"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <span className="text-sm font-semibold sm:hidden">
                              Xóa
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && users.length > 0 && renderPagination()}
      </div>
    </div>
  );
}
