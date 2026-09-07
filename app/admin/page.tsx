// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface Article {
  id: number;
  title: string;
  slug: string;
  status: "published" | "draft";
  created_at: string;
  author?: string;
}

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      // Check if user is admin
      const { data: user } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (user?.role !== "admin") {
        router.push("/");
        return;
      }

      fetchArticles();
    };

    checkAuth();
  }, [router]);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        users!articles_author_id_fkey (username)
      `,
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      setArticles(
        data.map((item) => ({
          ...item,
          author: item.users?.username,
        })),
      );
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (!error) {
      setArticles(articles.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="container py-12">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-wrap justify-between items-center border-b pb-6 mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/create"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              + Create New Article
            </Link>
            <Link
              href="/admin/leads"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              View Leads
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading articles...</p>
        ) : articles.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No articles found. Click &quot;Create New Article&quot; to write
            your first post!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">{article.title}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {article.author || "Unknown"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                          article.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(article.created_at).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/article/${article.slug}`}
                          target="_blank"
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/edit/${article.id}`}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link
          href="/"
          className="inline-block mt-6 text-purple-600 font-semibold hover:underline"
        >
          ← Back to Public Homepage
        </Link>
      </div>
    </div>
  );
}
