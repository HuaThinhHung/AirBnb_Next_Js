"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useAdminToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback an toàn khi hook được dùng ngoài Provider (ví dụ trong layout đặc biệt)
    return {
      showToast: (message: string, type: ToastType = "info") => {
        if (type === "error") {
          console.error("[Toast:error]", message);
        } else if (type === "success") {
          console.log("[Toast:success]", message);
        } else {
          console.log("[Toast:info]", message);
        }
      },
    };
  }
  return ctx;
}

let toastIdCounter = 1;

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = toastIdCounter++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const bgByType: Record<ToastType, string> = {
    success: "bg-emerald-600",
    error: "bg-red-600",
    info: "bg-slate-800",
    warning: "bg-amber-500",
  };

  const iconByType: Record<ToastType, React.ReactNode> = {
    success: (
      <span className="text-lg" aria-hidden="true">
        ✅
      </span>
    ),
    error: (
      <span className="text-lg" aria-hidden="true">
        ⚠️
      </span>
    ),
    info: (
      <span className="text-lg" aria-hidden="true">
        ℹ️
      </span>
    ),
    warning: (
      <span className="text-lg" aria-hidden="true">
        ⚠️
      </span>
    ),
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed inset-x-0 top-4 z-[60] flex flex-col items-center space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto max-w-sm w-full rounded-xl shadow-lg text-white px-4 py-3 flex items-center gap-3 ${bgByType[toast.type]}`}
          >
            <div>{iconByType[toast.type]}</div>
            <div className="text-sm font-medium">{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}


