"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Aceptar",
  cancelLabel = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      confirmBtn:
        "bg-red-500 hover:bg-red-600 text-white",
      border: "border-red-500/20",
    },
    warning: {
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      confirmBtn:
        "bg-amber-500 hover:bg-amber-600 text-obsidian",
      border: "border-amber-500/20",
    },
    info: {
      iconBg: "bg-gold-400/10",
      iconColor: "text-gold-400",
      confirmBtn:
        "bg-gold-400 hover:bg-gold-500 text-obsidian",
      border: "border-gold-400/20",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#111111] border border-neutral-800 rounded-sm shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 text-neutral-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className={`p-3 rounded-full ${styles.iconBg}`}>
              <AlertTriangle className={`w-7 h-7 ${styles.iconColor}`} />
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-2 mb-8">
            <h3 className="font-serif text-lg font-semibold text-white">
              {title}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-3 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold tracking-widest uppercase transition-all rounded-sm text-neutral-300 hover:text-white disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-all rounded-sm disabled:opacity-50 ${styles.confirmBtn}`}
            >
              {isLoading ? "Procesando..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
