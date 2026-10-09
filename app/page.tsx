// app/page.tsx
import { db } from "@/lib/db";
import { ArticleCard } from "@/components/ArticleCard";
import { FeaturedHero } from "@/components/FeaturedHero";
import { LoadMoreButton } from "@/components/LoadMoreButton";
import { Suspense } from "react";

export const revalidate = 60;

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const categoryId = params.category ? parseInt(params.category) : undefined;

  const [allArticles, totalCount] = await Promise.all([
    db.articles.getPublished(20, 0, categoryId),
    db.articles.count(categoryId),
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

  // ✅ Fixed: Handle all 3 cases (category filter / 1 article / 2+ articles)
  const displayArticles =
    categoryId || articles.length === 0 ? allArticles : articles;

  const showHero = heroArticle && !categoryId && articles.length > 0;

  return (
    <div className="container py-12">
      {showHero && heroArticle && <FeaturedHero article={heroArticle} />}

      <h2 className="font-serif text-4xl font-black border-b-2 border-primary pb-3 mb-10">
        {pageTitle}
      </h2>

      {allArticles.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No articles published yet.
        </p>
      ) : (
        <div
          id="articleGrid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
        >
          {displayArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}

          {allArticles.length > 0 && totalCount > 20 && (
            <Suspense fallback={null}>
              <LoadMoreButton initialOffset={20} categoryId={categoryId} />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
}
