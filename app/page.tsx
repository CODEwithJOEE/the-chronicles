// app/page.tsx - With debugging
import { db } from "@/lib/db";
import { ArticleCard } from "@/components/ArticleCard";
import { FeaturedHero } from "@/components/FeaturedHero";
import { LoadMoreButton } from "@/components/LoadMoreButton";

interface HomePageProps {
  searchParams: { category?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const categoryId = searchParams.category
    ? parseInt(searchParams.category)
    : undefined;

  console.log("Category ID:", categoryId);

  // Fetch all published articles
  const allArticles = await db.articles.getPublished(20, 0);

  console.log("All articles found:", allArticles.length);
  console.log(
    "Articles:",
    allArticles.map((a) => ({
      id: a.id,
      title: a.title,
      category_id: a.category_id,
      status: a.status,
    })),
  );

  // Get hero (first article)
  const heroArticle = allArticles.length > 0 ? allArticles[0] : null;

  // Get remaining articles (skip hero)
  const articles = allArticles.slice(1);

  // Get total count
  const totalCount = await db.articles.count();

  // Determine page title
  let pageTitle = "Latest Stories";
  if (categoryId && articles.length > 0) {
    const categoryName = articles[0]?.category_name || "Category";
    pageTitle = categoryName;
  }

  // Show debug info (remove after fixing)
  const debugInfo = {
    totalArticles: allArticles.length,
    heroExists: !!heroArticle,
    articlesCount: articles.length,
    categoryFilter: categoryId || "none",
  };

  return (
    <div className="container py-12">
      {/* Debug Banner - REMOVE AFTER FIXING */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-6 text-sm">
        <p className="font-bold">🔍 Debug Info:</p>
        <p>Total Articles: {debugInfo.totalArticles}</p>
        <p>Articles Displayed: {debugInfo.articlesCount}</p>
        <p>Category Filter: {debugInfo.categoryFilter}</p>
        {allArticles.map((a, i) => (
          <p key={a.id} className="ml-2">
            {i + 1}. {a.title} (Category: {a.category_id || "NULL"}, Status:{" "}
            {a.status})
          </p>
        ))}
      </div>

      {heroArticle && !categoryId && <FeaturedHero article={heroArticle} />}

      <h2 className="font-serif text-4xl font-black border-b-2 border-primary pb-3 mb-10">
        {pageTitle}
      </h2>

      {articles.length === 0 ? (
        <p className="col-span-full text-center text-gray-500 py-12">
          No articles found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {articles.length > 0 && totalCount > 9 && (
        <div className="text-center mt-16">
          <LoadMoreButton initialOffset={9} categoryId={categoryId} />
        </div>
      )}
    </div>
  );
}
