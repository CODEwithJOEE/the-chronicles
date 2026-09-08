import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types";
import { getImageUrl } from "@/lib/image-utils";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const plainText = article.content.replace(/<[^>]*>/g, "");
  const excerpt =
    plainText.length > 110 ? plainText.substring(0, 110) + "..." : plainText;

  // Construct full image URL if only filename is stored
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;

    // If it's already a full URL, return it
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Otherwise, construct the full URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/article-images/${imagePath}`;
  };

  const imageUrl = getImageUrl(article.featured_image);

  return (
    <Link href={`/article/${article.slug}`} className="group h-full">
      <article className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col h-full">
        <div className="relative h-48 bg-gray-100 flex-shrink-0">
          {article.featured_image ? (
            <Image
              src={
                article.featured_image.startsWith("http")
                  ? article.featured_image
                  : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/article-images/${article.featured_image}`
              }
              alt={article.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <span className="text-xs font-bold uppercase text-accent tracking-wider">
            {article.category_name || "Uncategorized"}
          </span>
          <h3 className="font-serif text-xl font-bold mt-1 mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 flex-1">{excerpt}</p>
          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 flex-shrink-0">
            By {article.author || "Staff Writer"} &bull;{" "}
            {new Date(article.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </article>
    </Link>
  );
}
