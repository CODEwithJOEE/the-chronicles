// lib/db.ts
import { supabase } from "./supabase/client";
import { Article, Category, Inquiry, User } from "@/types";

export const db = {
  articles: {
    async getBySlug(slug: string): Promise<Article | null> {
      console.log("Looking for article with slug:", slug);

      const { data: article, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error("Error fetching article:", error);
        return null;
      }

      if (!article) {
        console.log("No article found with slug:", slug);
        return null;
      }

      let author = "Guest Writer";
      if (article.author_id) {
        const { data: user } = await supabase
          .from("users")
          .select("username")
          .eq("id", article.author_id)
          .maybeSingle();
        if (user) {
          author = user.username;
        }
      }

      let category_name = "Uncategorized";
      if (article.category_id) {
        const { data: category } = await supabase
          .from("categories")
          .select("name")
          .eq("id", article.category_id)
          .maybeSingle();
        if (category) {
          category_name = category.name;
        }
      }

      return {
        ...article,
        author,
        category_name,
      };
    },

    async getPublished(
      limit: number = 9,
      offset: number = 0,
      categoryId?: number,
    ): Promise<Article[]> {
      // ✅ Use JOIN to get all data in one query
      let query = supabase
        .from("articles")
        .select(
          `
      *,
      users!articles_author_id_fkey (
        username
      ),
      categories!articles_category_id_fkey (
        name
      )
    `,
        )
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching published articles:", error);
        return [];
      }

      // ✅ Transform data once
      return (data || []).map((article) => ({
        ...article,
        author: article.users?.username || "Guest Writer",
        category_name: article.categories?.name || "Uncategorized",
        users: undefined,
        categories: undefined,
      }));
    },

    async getLatest(limit: number = 4, excludeId?: number): Promise<Article[]> {
      let query = supabase
        .from("articles")
        .select(
          `
      *,
      users!articles_author_id_fkey (username),
      categories!articles_category_id_fkey (name)
    `,
        )
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(limit);

      // ✅ Exclude the current article
      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching latest articles:", error);
        return [];
      }

      // Transform data
      return (data || []).map((article) => ({
        ...article,
        author: article.users?.username || "Guest Writer",
        category_name: article.categories?.name || "Uncategorized",
        users: undefined,
        categories: undefined,
      }));
    },

    async getHero(categoryId?: number): Promise<Article | null> {
      let query = supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(1);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return null;
      }

      const article = data[0];

      let author = "Guest Writer";
      if (article.author_id) {
        const { data: user } = await supabase
          .from("users")
          .select("username")
          .eq("id", article.author_id)
          .maybeSingle();
        if (user) {
          author = user.username;
        }
      }

      let category_name = "Uncategorized";
      if (article.category_id) {
        const { data: category } = await supabase
          .from("categories")
          .select("name")
          .eq("id", article.category_id)
          .maybeSingle();
        if (category) {
          category_name = category.name;
        }
      }

      return {
        ...article,
        author,
        category_name,
      };
    },

    async count(categoryId?: number): Promise<number> {
      let query = supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("status", "published");

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { count, error } = await query;
      if (error) {
        console.error("Error counting articles:", error);
        return 0;
      }
      return count || 0;
    },

    // FIXED: search function - returns only what's needed
    async search(query: string): Promise<
      {
        id: number;
        title: string;
        slug: string;
        featured_image: string | null;
      }[]
    > {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, slug, featured_image")
        .eq("status", "published")
        .ilike("title", `%${query}%`)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error searching articles:", error);
        return [];
      }
      return data || [];
    },

    async create(
      article: Omit<Article, "id" | "created_at" | "updated_at">,
    ): Promise<Article | null> {
      const { data, error } = await supabase
        .from("articles")
        .insert([article])
        .select()
        .single();

      if (error) {
        console.error("Error creating article:", error);
        return null;
      }
      return data;
    },

    async update(
      id: number,
      article: Partial<Article>,
    ): Promise<Article | null> {
      const { data, error } = await supabase
        .from("articles")
        .update(article)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating article:", error);
        return null;
      }
      return data;
    },

    async delete(id: number): Promise<boolean> {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      return !error;
    },

    async getFeaturedImage(id: number): Promise<string | null> {
      const { data, error } = await supabase
        .from("articles")
        .select("featured_image")
        .eq("id", id)
        .single();

      if (error || !data) return null;
      return data.featured_image;
    },
  },

  categories: {
    async getAll(): Promise<Category[]> {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
      return data || [];
    },

    async getWithArticleCount(): Promise<any[]> {
      const { data, error } = await supabase
        .from("categories")
        .select(
          `
          *,
          articles:articles(count)
        `,
        )
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching categories with count:", error);
        return [];
      }
      return (data || []).map((cat) => ({
        ...cat,
        total_articles: cat.articles?.[0]?.count || 0,
      }));
    },
  },

  inquiries: {
    async create(
      inquiry: Omit<Inquiry, "id" | "created_at">,
    ): Promise<Inquiry | null> {
      const { data, error } = await supabase
        .from("inquiries")
        .insert([inquiry])
        .select()
        .single();

      if (error) {
        console.error("Error creating inquiry:", error);
        return null;
      }
      return data;
    },

    async getAll(): Promise<Inquiry[]> {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching inquiries:", error);
        return [];
      }
      return data || [];
    },
  },

  users: {
    async getByUsername(username: string): Promise<User | null> {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user:", error);
        return null;
      }
      return data;
    },

    async verifyPassword(
      username: string,
      password: string,
    ): Promise<User | null> {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (error || !data) return null;
      return data;
    },
  },
};
