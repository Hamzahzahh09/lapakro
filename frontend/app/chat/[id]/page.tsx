"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/chat?id=${params.id}`);
    } else {
      router.replace("/chat");
    }
  }, [params, router]);

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
      <div className="text-center space-y-2">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FFD700] border-r-transparent align-[-0.125em]" />
        <p className="text-sm font-medium text-slate-600">
          Mengalihkan ke percakapan...
        </p>
      </div>
    </div>
  );
}
