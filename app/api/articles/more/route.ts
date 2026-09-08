// app/api/articles/more/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper function for image URLs
const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/article-images/${imagePath}`;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const offset = parseInt(searchParams.get("offset") || "9");
  const categoryId = searchParams.get("category")
    ? parseInt(searchParams.get("category")!)
    : undefined;

  const articles = await db.articles.getPublished(9, offset, categoryId);

  let html = "";

  for (const article of articles) {
    const plainText = article.content.replace(/<[^>]*>/g, "");
    const excerpt =
      plainText.length > 110 ? plainText.substring(0, 110) + "..." : plainText;

    const imageUrl = getImageUrl(article.featured_image);

    html += `
      <a href="/article/${article.slug}" class="group h-full">
        <article class="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col h-full">
          <div class="relative h-48 bg-gray-100 flex-shrink-0">
            ${
              imageUrl
                ? `
              <img src="${imageUrl}" alt="${article.title}" class="w-full h-full object-cover" />
            `
                : `
              <div class="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
            `
            }
          </div>
          <div class="p-5 flex flex-col flex-1">
            <span class="text-xs font-bold uppercase text-accent tracking-wider">${article.category_name || "Uncategorized"}</span>
            <h3 class="font-serif text-xl font-bold mt-1 mb-2 group-hover:text-accent transition-colors line-clamp-2">${article.title}</h3>
            <p class="text-sm text-gray-600 line-clamp-3 flex-1">${excerpt}</p>
            <div class="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 flex-shrink-0">
              By ${article.author || "Staff Writer"} &bull; ${new Date(article.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </article>
      </a>
    `;
  }

  return NextResponse.json({
    html,
    count: articles.length,
  });
}
