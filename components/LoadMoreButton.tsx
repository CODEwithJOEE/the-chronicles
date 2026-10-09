// components/LoadMoreButton.tsx
"use client";

import { useState } from "react";
import { ArticleCard } from "./ArticleCard";
import { Article } from "@/types";

interface LoadMoreButtonProps {
  initialOffset: number;
  categoryId?: number;
}

export function LoadMoreButton({
  initialOffset,
  categoryId,
}: LoadMoreButtonProps) {
  const [newArticles, setNewArticles] = useState<Article[]>([]);
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

      if (data.articles?.length) {
        setNewArticles((prev) => [...prev, ...data.articles]);
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

  return (
    <>
      {/* ✅ Rendered cards — same component as the initial page */}
      {newArticles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}

      {/* ✅ Load more button — spans full grid width */}
      {hasMore && (
        <div className="col-span-full text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-white text-primary border border-gray-300 rounded-full font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50"
          >
            {loading ? "Loading Articles..." : "Load More Articles ↓"}
          </button>
        </div>
      )}
    </>
  );
}
