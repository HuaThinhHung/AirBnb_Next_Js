"use client";

type AdminTableContainerProps = {
  loading: boolean;
  empty: boolean;
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  children: React.ReactNode;
};

export default function AdminTableContainer({
  loading,
  empty,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  children,
}: AdminTableContainerProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">{emptyIcon ?? "📄"}</div>
        <p className="text-xl text-gray-700 font-semibold">
          {emptyTitle ?? "Không có dữ liệu"}
        </p>
        {emptyDescription && (
          <p className="mt-2 text-sm text-gray-500">{emptyDescription}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}


