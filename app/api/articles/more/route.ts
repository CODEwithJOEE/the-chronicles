// app/api/articles/more/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    html += `
      <a href="/article/${article.slug}" class="group">
        <article class="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="relative h-48 bg-gray-100">
            ${
              article.featured_image
                ? `
              <img src="/uploads/${article.featured_image}" alt="${article.title}" class="w-full h-full object-cover" />
            `
                : `
              <div class="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
            `
            }
          </div>
          <div class="p-5">
            <span class="text-xs font-bold uppercase text-accent tracking-wider">${article.category_name || "Uncategorized"}</span>
            <h3 class="font-serif text-xl font-bold mt-1 mb-2 group-hover:text-accent transition-colors">${article.title}</h3>
            <p class="text-sm text-gray-600 line-clamp-3">${excerpt}</p>
            <div class="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
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
