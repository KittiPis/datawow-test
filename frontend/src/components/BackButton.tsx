// ✅ เป็น Client Component จริง
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
      aria-label="Go Back"
    >
      <ArrowLeftIcon className="w-5 h-5" />
    </button>
  );
}
