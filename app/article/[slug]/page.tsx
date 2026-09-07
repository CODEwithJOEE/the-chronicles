// app/article/[slug]/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  console.log("Looking for article with slug:", slug);

  const article = await db.articles.getBySlug(slug);

  if (!article) {
    console.log("Article not found, showing 404");
    notFound();
  }

  // Calculate reading time
  const wordCount = article.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Get latest posts for sidebar
  const latestPosts = await db.articles.getLatest(4, article.id);

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 max-w-3xl">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/?category=${article.category_id}`}
              className="hover:text-accent"
            >
              {article.category_name || "Uncategorized"}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-400 truncate">{article.title}</span>
          </nav>

          <article>
            <header className="mb-8">
              <h1 className="font-serif text-4xl lg:text-5xl font-black leading-tight mb-4">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span>
                  By <strong>{article.author || "Guest Writer"}</strong>
                </span>
                <span>•</span>
                <span>
                  {new Date(article.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                  <Clock size={14} /> {readingTime} min read
                </span>
                {article.status === "draft" && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs font-bold">
                    DRAFT MODE
                  </span>
                )}
              </div>
            </header>

            {article.featured_image && (
              <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* ✅ FIXED: Proper link styling with underline and color */}
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-a:text-accent prose-a:underline prose-a:decoration-2 prose-a:decoration-accent/30 hover:prose-a:decoration-accent prose-a:transition-all prose-a:font-medium"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <h3 className="font-sans text-sm uppercase tracking-wider border-b-2 border-primary pb-3 mb-6 font-bold">
            Latest Updates
          </h3>
          <div className="space-y-6">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className="flex gap-4 group"
              >
                {post.featured_image && (
                  <div className="relative w-20 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-serif font-semibold text-sm group-hover:text-accent transition-colors">
                    {post.title}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
