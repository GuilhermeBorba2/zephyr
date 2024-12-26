import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';

const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.autoClose) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, 5000);
        return () => clearTimeout(timer);
      }
    });
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center justify-between p-4 rounded-lg shadow-lg min-w-[300px]
            ${toast.type === 'success' ? 'bg-green-500' : ''}
            ${toast.type === 'error' ? 'bg-red-500' : ''}
            ${toast.type === 'info' ? 'bg-blue-500' : ''}
            text-white
          `}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-white hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;