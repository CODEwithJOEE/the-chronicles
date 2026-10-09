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

  return NextResponse.json({
    articles,
    count: articles.length,
  });
}
