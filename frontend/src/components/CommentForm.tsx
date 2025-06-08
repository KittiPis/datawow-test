"use client";

import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
};

export function CommentForm({ onSubmit, onCancel, placeholder }: Props) {
  const [text, setText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [show, setShow] = useState(false); // 🔄 สำหรับ delay animation

  // ตรวจหน้าจอ
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // แสดง modal แบบ fade-in เมื่อ isMobile เปลี่ยนเป็น true
  useEffect(() => {
    if (isMobile) {
      const timer = setTimeout(() => setShow(true), 10); // 💡 delay transition trigger
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isMobile]);

  const form = (
    <div className="space-y-2">
      {isMobile && (
        <h2 className="text-lg font-semibold text-gray-900">Add Comments</h2>
      )}

      <textarea
        placeholder={placeholder || "What’s on your mind..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500"
      />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            onClick={onCancel}
            className="rounded border border-gray-300 px-4 py-1 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          onClick={() => {
            onSubmit(text);
            setText("");
          }}
          disabled={!text.trim()}
          className="rounded bg-green-600 px-4 py-1 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-40"
        >
          Post
        </button>
      </div>
    </div>
  );

  return isMobile ? (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${
        show ? "opacity-100 bg-black/40" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`w-full max-w-md bg-white rounded-md p-5 shadow-xl relative transform transition-all duration-300 ${
          show
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 -translate-y-2 opacity-0"
        }`}
      >
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
        {form}
      </div>
    </div>
  ) : (
    <div className="mt-4">{form}</div>
  );
}
