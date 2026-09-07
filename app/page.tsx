// app/page.tsx - Alternative with Hero + Grid
import { db } from "@/lib/db";
import { ArticleCard } from "@/components/ArticleCard";
import { FeaturedHero } from "@/components/FeaturedHero";

interface HomePageProps {
  searchParams: { category?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const categoryId = searchParams.category
    ? parseInt(searchParams.category)
    : undefined;

  // Fetch all published articles
  const allArticles = await db.articles.getPublished(20, 0);

  // Separate hero and rest
  const heroArticle = allArticles.length > 0 ? allArticles[0] : null;
  const articles = allArticles.slice(1); // This will be empty if only 1 article

  return (
    <div className="container py-12">
      {heroArticle && !categoryId && <FeaturedHero article={heroArticle} />}

      <h2 className="font-serif text-4xl font-black border-b-2 border-primary pb-3 mb-10">
        {categoryId ? "Category" : "Latest Stories"}
      </h2>

      {/* If only 1 article, show it in the grid anyway */}
      {articles.length === 0 && heroArticle && !categoryId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <ArticleCard article={heroArticle} />
        </div>
      ) : articles.length === 0 ? (
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
    </div>
  );
}
