import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReadingProgress } from "@/components/ReadingProgress";
import { getImageUrl } from "@/lib/image-utils";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await db.articles.getAllSlugs(); // ✅ lightweight
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.articles.getBySlug(slug);
  if (!article) return {};

  const pageTitle = article.meta_title || `${article.title} - The Chronicle`;
  const pageDescription =
    article.meta_description ||
    article.content.replace(/<[^>]*>/g, "").substring(0, 155) + "...";

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: article.meta_keywords || undefined,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "article",
      images: article.featured_image
        ? [getImageUrl(article.featured_image)!]
        : [],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // ✅ Fetch article + latest posts in parallel
  const [article, allLatest] = await Promise.all([
    db.articles.getBySlug(slug),
    db.articles.getLatest(5), // fetch 5, then filter out current below
  ]);

  if (!article) notFound();

  // ✅ Exclude the current article from the sidebar
  const latestPosts = allLatest.filter((p) => p.id !== article.id).slice(0, 4);

  const wordCount = article.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const featuredImageUrl = getImageUrl(article.featured_image);

  return (
    <>
      <ReadingProgress />
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 max-w-3xl">
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
                    {readingTime} min read
                  </span>
                  {article.status === "draft" && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs font-bold">
                      DRAFT MODE
                    </span>
                  )}
                </div>
              </header>

              {featuredImageUrl && (
                <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={featuredImageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div
                className="prose prose-lg max-w-none prose-headings:font-serif prose-a:text-accent prose-a:underline"
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
              {latestPosts.map((post) => {
                const postImageUrl = getImageUrl(post.featured_image);
                return (
                  <Link
                    key={post.id}
                    href={`/article/${post.slug}`}
                    className="flex gap-4 group"
                  >
                    {postImageUrl ? (
                      <div className="relative w-20 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <Image
                          src={postImageUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-16 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                        No img
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif font-semibold text-sm group-hover:text-accent transition-colors line-clamp-2">
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
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
