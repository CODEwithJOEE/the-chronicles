// components/FeaturedHero.tsx
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types";

interface FeaturedHeroProps {
  article: Article;
}

export function FeaturedHero({ article }: FeaturedHeroProps) {
  const plainText = article.content.replace(/<[^>]*>/g, "");
  const excerpt =
    plainText.length > 180 ? plainText.substring(0, 180) + "..." : plainText;

  // Helper function for cleaner code
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/article-images/${imagePath}`;
  };

  const imageUrl = getImageUrl(article.featured_image);

  return (
    <Link href={`/article/${article.slug}`} className="block">
      <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-gray-200 rounded-lg overflow-hidden mb-16 transition-all hover:-translate-y-1 hover:shadow-lg min-h-[400px]">
        <div className="relative h-64 lg:h-[450px] bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              priority // ✅ Equivalent to loading="eager" for LCP
              sizes="(max-width: 768px) 100vw, 50vw" // ✅ Fixes the warning
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Featured Image
            </div>
          )}
        </div>

        <div className="p-8 flex flex-col justify-center">
          <span className="inline-block bg-accent text-white text-xs font-bold uppercase px-3 py-1 rounded mb-4 self-start tracking-wider">
            Featured Story
          </span>
          <h1 className="font-serif text-3xl lg:text-4xl font-black leading-tight mb-4 line-clamp-3">
            {article.title}
          </h1>
          <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3">
            {excerpt}
          </p>
          <div className="text-sm text-gray-400">
            By <strong>{article.author || "Staff Writer"}</strong> &bull;{" "}
            {new Date(article.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </article>
    </Link>
  );
}
