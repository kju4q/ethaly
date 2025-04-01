import { useEffect } from "react";
import {
  HeartIcon,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/24/outline";

interface ToastProps {
  message: string;
  isBookmarked: boolean;
  onClose: () => void;
}

export default function Toast({ message, isBookmarked, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-2 animate-slide-down">
      {isBookmarked ? (
        <HeartIconSolid className="w-5 h-5 text-pink-500" />
      ) : (
        <HeartIcon className="w-5 h-5 text-gray-400" />
      )}
      <span className="text-gray-700">{message}</span>
    </div>
  );
}
