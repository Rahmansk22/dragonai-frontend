import React, { createContext, useContext, useState, ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  function showToast(message: string, type: "success" | "error" | "info" = "info") {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }
  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-5 py-3 rounded-xl shadow-lg text-white font-semibold text-base pointer-events-auto transition-all animate-fade-in ${toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-red-600" : "bg-gray-800"}`}
            style={{ minWidth: 220, maxWidth: 340 }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
