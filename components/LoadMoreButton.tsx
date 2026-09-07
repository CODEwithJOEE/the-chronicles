// components/LoadMoreButton.tsx
"use client";

import { useState } from "react";

interface LoadMoreButtonProps {
  initialOffset: number;
  categoryId?: number;
}

export function LoadMoreButton({
  initialOffset,
  categoryId,
}: LoadMoreButtonProps) {
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        offset: offset.toString(),
        ...(categoryId && { category: categoryId.toString() }),
      });

      const response = await fetch(`/api/articles/more?${params}`);
      const data = await response.json();

      if (data.html) {
        const grid = document.getElementById("articleGrid");
        if (grid) {
          grid.insertAdjacentHTML("beforeend", data.html);
        }

        setOffset(offset + data.count);

        if (data.count < 9) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasMore) return null;

  return (
    <button
      onClick={loadMore}
      disabled={loading}
      className="px-8 py-3 bg-white text-primary border border-gray-300 rounded-full font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50"
    >
      {loading ? "Loading Articles..." : "Load More Articles ↓"}
    </button>
  );
}
