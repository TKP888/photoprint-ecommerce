"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  productName: string;
  productImage: string;
  onClose: () => void;
  duration?: number;
  isError?: boolean;
}

export default function Toast({
  message,
  productName,
  productImage,
  onClose,
  duration = 3000,
  isError = false,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-[slideUp_0.3s_ease-out]">
      <div
        className={`rounded-lg shadow-lg border p-4 min-w-[300px] max-w-[400px] flex items-center gap-4 ${
          isError ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex-shrink-0">
          <img
            src={productImage}
            alt={productName}
            className="w-16 h-16 object-cover rounded"
          />
        </div>
        <div className="flex-1">
          <p
            className={`text-sm font-semibold ${
              isError ? "text-red-900" : "text-gray-900"
            }`}
          >
            {message}
          </p>
          <p
            className={`text-sm mt-1 ${
              isError ? "text-red-700" : "text-gray-600"
            }`}
          >
            {productName}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
