// app/page.tsx
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

  console.log("Category ID:", categoryId); // Debug log

  // Fetch articles with category filter
  const [heroArticle, articles, totalCount] = await Promise.all([
    db.articles.getHero(categoryId),
    db.articles.getPublished(9, 0, categoryId),
    db.articles.count(categoryId),
  ]);

  // Get category name if filtering
  let pageTitle = "Latest Stories";
  if (categoryId && heroArticle?.category_name) {
    pageTitle = heroArticle.category_name;
  }

  // Debug log
  console.log("Articles found:", articles.length);
  console.log("Total count:", totalCount);

  return (
    <div className="container py-12">
      {heroArticle && <FeaturedHero article={heroArticle} />}

      <h2 className="font-serif text-4xl font-black border-b-2 border-primary pb-3 mb-10">
        {pageTitle}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {articles.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-12">
            No articles found in this category.
          </p>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>

      {articles.length > 0 && totalCount > 9 && (
        <div className="text-center mt-16">
          <LoadMoreButton initialOffset={9} categoryId={categoryId} />
        </div>
      )}
    </div>
  );
}
