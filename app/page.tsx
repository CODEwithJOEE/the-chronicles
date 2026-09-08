import { db } from "@/lib/db";
import { ArticleCard } from "@/components/ArticleCard";
import { FeaturedHero } from "@/components/FeaturedHero";
import { LoadMoreButton } from "@/components/LoadMoreButton";
import { Suspense } from "react";

// ✅ Enable static generation
export const dynamic = "force-static";
export const revalidate = 60; // Revalidate every 60 seconds

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const categoryId = params.category ? parseInt(params.category) : undefined;

  const [allArticles, totalCount] = await Promise.all([
    db.articles.getPublished(20, 0),
    db.articles.count(),
  ]);

  // Separate hero and rest
  const heroArticle = allArticles.length > 0 ? allArticles[0] : null;
  const articles = allArticles.slice(1);

  // Determine page title
  let pageTitle = "Latest Stories";
  if (categoryId) {
    const categoryName =
      allArticles.find((a) => a.category_id === categoryId)?.category_name ||
      "Category";
    pageTitle = categoryName;
  }

  // Filter articles by category if categoryId is provided
  let displayArticles = categoryId
    ? allArticles.filter((a) => a.category_id === categoryId)
    : articles;

  // If no category filter and only 1 article total, show it in the grid
  const showHero = heroArticle && !categoryId && articles.length > 0;

  return (
    <div className="container py-12">
      {showHero && <FeaturedHero article={heroArticle} />}

      <h2 className="font-serif text-4xl font-black border-b-2 border-primary pb-3 mb-10">
        {pageTitle}
      </h2>

      {allArticles.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No articles published yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {/* If only 1 article and no category filter, show the hero in the grid */}
          {!categoryId && articles.length === 0 && heroArticle ? (
            <ArticleCard article={heroArticle} />
          ) : displayArticles.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-12">
              No articles found in this category.
            </p>
          ) : (
            displayArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </div>
      )}

      {allArticles.length > 0 && totalCount > 20 && (
        <div className="text-center mt-16">
          <Suspense
            fallback={<div className="text-gray-500">Loading more...</div>}
          >
            <LoadMoreButton initialOffset={20} categoryId={categoryId} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
