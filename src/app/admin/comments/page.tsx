"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/lib/commentService";

interface CommentItem {
  id: number;
  maPhong: number;
  maNguoiBinhLuan: number;
  noiDung: string;
  saoBinhLuan: number;
  ngayBinhLuan: string;
}

interface CommentMutationResult {
  success: boolean;
  message?: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    id: 0,
    maPhong: "",
    maNguoiBinhLuan: "",
    noiDung: "",
    saoBinhLuan: 5,
  });

  useEffect(() => {
    fetchComments();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  const fetchComments = async () => {
    setLoading(true);
    const result = (await getAllComments()) as {
      success: boolean;
      comments: CommentItem[];
      message?: string;
    };

    if (result.success) {
      let filtered = result.comments;
      if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (comment) =>
            comment.id.toString().includes(lower) ||
            comment.maPhong.toString().includes(lower) ||
            comment.maNguoiBinhLuan.toString().includes(lower) ||
            comment.noiDung.toLowerCase().includes(lower)
        );
      }

      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setComments(filtered.slice(startIndex, endIndex));
      setTotalRows(filtered.length);
      setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));
      const suggestionList = result.comments
        .map(
          (comment) =>
            `${comment.id} - Phòng ${comment.maPhong} - User ${comment.maNguoiBinhLuan}`
        )
        .slice(0, 30);
      setSearchSuggestions(suggestionList);
    } else {
      setComments([]);
      setTotalRows(0);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      id: 0,
      maPhong: "",
      maNguoiBinhLuan: "",
      noiDung: "",
      saoBinhLuan: 5,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (comment: CommentItem) => {
    setIsEditing(true);
    setFormData({
      id: comment.id,
      maPhong: comment.maPhong.toString(),
      maNguoiBinhLuan: comment.maNguoiBinhLuan.toString(),
      noiDung: comment.noiDung,
      saoBinhLuan: comment.saoBinhLuan,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm(`Bạn có chắc muốn xóa bình luận #${commentId}?`)) return;
    const result = (await deleteComment(commentId)) as CommentMutationResult;
    if (result.success) {
      alert("✅ Xóa bình luận thành công!");
      fetchComments();
    } else {
      alert(result.message || "❌ Không thể xóa bình luận");
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "saoBinhLuan"
          ? Number(value)
          : value,
    }));
  };

  const validateForm = () => {
    if (!formData.maPhong || !formData.maNguoiBinhLuan) {
      return "Vui lòng nhập mã phòng và mã người bình luận";
    }
    if (!formData.noiDung.trim()) {
      return "Vui lòng nhập nội dung bình luận";
    }
    if (formData.saoBinhLuan < 1 || formData.saoBinhLuan > 5) {
      return "Số sao phải từ 1 đến 5";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      setFormError(errorMsg);
      return;
    }

    setSaving(true);
    setFormError(null);

    const createPayload = {
      maPhong: Number(formData.maPhong),
      maNguoiBinhLuan: Number(formData.maNguoiBinhLuan),
      noiDung: formData.noiDung.trim(),
      saoBinhLuan: formData.saoBinhLuan,
      ngayBinhLuan: new Date().toISOString(),
    };

    const updatePayload = {
      noiDung: formData.noiDung.trim(),
      saoBinhLuan: formData.saoBinhLuan,
    };

    const result: CommentMutationResult = isEditing
      ? ((await updateComment(formData.id, updatePayload)) as CommentMutationResult)
      : ((await createComment(createPayload)) as CommentMutationResult);

    setSaving(false);
    if (result.success) {
      alert(isEditing ? "✅ Cập nhật bình luận thành công!" : "✅ Thêm bình luận thành công!");
      setModalOpen(false);
      fetchComments();
    } else {
      setFormError(result.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  const ratingBadge = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-700";
    if (rating >= 3) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div ref={topRef} className="h-0" />

      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý bình luận</h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalRows > 0 ? (
                <>
                  Hiển thị {(currentPage - 1) * pageSize + 1} -{" "}
                  {Math.min(currentPage * pageSize, totalRows)} của {totalRows} bình luận
                </>
              ) : (
                "Chưa có bình luận nào"
              )}
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            + Thêm bình luận
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="🔍 Tìm theo ID, phòng, người dùng, nội dung..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            list="comments-suggestions"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
      </div>

      <div className="px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-xl text-gray-600">Không tìm thấy bình luận nào</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Phòng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Người bình luận
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Nội dung
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-24">
                        Đánh giá
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Ngày bình luận
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-32">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {comments.map((comment) => (
                      <tr key={comment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm font-mono text-gray-900">#{comment.id}</td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/admin/rooms/${comment.maPhong}`}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Phòng #{comment.maPhong}
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/admin/users/${comment.maNguoiBinhLuan}`}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            User #{comment.maNguoiBinhLuan}
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-gray-900 line-clamp-2">{comment.noiDung}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${ratingBadge(
                              comment.saoBinhLuan
                            )}`}
                          >
                            ⭐ {comment.saoBinhLuan}/5
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {formatDate(comment.ngayBinhLuan || new Date().toISOString())}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(comment)}
                              className="p-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="bg-white border-t border-gray-200 px-6 py-4 mt-6 rounded-b-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Trang{" "}
                    <span className="font-semibold text-gray-900">{currentPage}</span> của{" "}
                    <span className="font-semibold text-gray-900">{totalPages}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors"
                    >
                      ← Trước
                    </button>

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
                          onClick={() => setCurrentPage(pageNum)}
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

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors"
                    >
                      Sau →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <datalist id="comments-suggestions">
        {searchSuggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isEditing ? "Chỉnh sửa bình luận" : "Thêm bình luận mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã phòng
                  </label>
                  <input
                    name="maPhong"
                    type="number"
                    value={formData.maPhong}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    placeholder="Nhập mã phòng"
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã người bình luận
                  </label>
                  <input
                    name="maNguoiBinhLuan"
                    type="number"
                    value={formData.maNguoiBinhLuan}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    placeholder="Nhập mã người dùng"
                    required
                    min={1}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung
                </label>
                <textarea
                  name="noiDung"
                  value={formData.noiDung}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 min-h-[120px]"
                  placeholder="Nhập nội dung bình luận..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số sao (1-5)
                </label>
                <select
                  name="saoBinhLuan"
                  value={formData.saoBinhLuan}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} ⭐
                    </option>
                  ))}
                </select>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : isEditing ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

