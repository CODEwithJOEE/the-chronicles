// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import {
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  FileText,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  ChevronDown,
} from "lucide-react";

interface Article {
  id: number;
  title: string;
  slug: string;
  status: "published" | "draft";
  created_at: string;
  author?: string;
  category_id?: number;
}

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickEditId, setQuickEditId] = useState<number | null>(null);
  const [quickEditData, setQuickEditData] = useState<{
    title: string;
    status: "published" | "draft";
    category_id?: number;
  } | null>(null);
  const [updating, setUpdating] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      fetchCategories();
    };

    checkAuth();
  }, [router]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(data || []);
  };

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
      const formatted = data.map((item) => ({
        ...item,
        author: item.users?.username,
      }));
      setArticles(formatted);
      setFilteredArticles(formatted);
    }
    setLoading(false);
  };

  // Filter and Search functionality
  useEffect(() => {
    let filtered = articles;

    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.author?.toLowerCase().includes(query) ||
          article.status.toLowerCase().includes(query),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (article) => article.category_id === parseInt(selectedCategory),
      );
    }

    // Date filter
    if (selectedDate !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((article) => {
        const created = new Date(article.created_at);

        switch (selectedDate) {
          case "today":
            return created >= today;
          case "week": {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return created >= weekAgo;
          }
          case "month": {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return created >= monthAgo;
          }
          case "year": {
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return created >= yearAgo;
          }
          default:
            return true;
        }
      });
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedDate, articles]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredArticles.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (!error) {
      const updated = articles.filter((a) => a.id !== id);
      setArticles(updated);
      setFilteredArticles(updated);
    }
  };

  // Quick Edit handlers
  const openQuickEdit = (article: Article) => {
    setQuickEditId(article.id);
    setQuickEditData({
      title: article.title,
      status: article.status,
      category_id: article.category_id,
    });
  };

  const closeQuickEdit = () => {
    setQuickEditId(null);
    setQuickEditData(null);
  };

  const saveQuickEdit = async () => {
    if (!quickEditId || !quickEditData) return;

    setUpdating(true);
    const { error } = await supabase
      .from("articles")
      .update({
        title: quickEditData.title,
        status: quickEditData.status,
        category_id: quickEditData.category_id,
      })
      .eq("id", quickEditId);

    if (!error) {
      const updatedArticles = articles.map((a) =>
        a.id === quickEditId
          ? {
              ...a,
              title: quickEditData.title,
              status: quickEditData.status,
              category_id: quickEditData.category_id,
            }
          : a,
      );
      setArticles(updatedArticles);
      setFilteredArticles(
        filteredArticles.map((a) =>
          a.id === quickEditId
            ? {
                ...a,
                title: quickEditData.title,
                status: quickEditData.status,
                category_id: quickEditData.category_id,
              }
            : a,
        ),
      );
      closeQuickEdit();
    }
    setUpdating(false);
  };

  const getStatusColor = (status: string) => {
    return status === "published"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-amber-100 text-amber-800 border-amber-200";
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Uncategorized";
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || "Uncategorized";
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDate("all");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedDate !== "all";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                Content Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your articles, drafts, and published content
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow"
              >
                <FileText size={18} />
                Write New
              </Link>
              <Link
                href="/admin/leads"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-sm hover:shadow"
              >
                <Eye size={18} />
                View Leads
              </Link>
            </div>
          </div>

          {/* Search and Filters - Inline layout */}
          <div className="mt-6 flex flex-col lg:flex-row gap-3">
            {/* Search - Left side */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Filters - Right side */}
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 whitespace-nowrap"
                >
                  <Filter size={18} className="text-gray-400" />
                  <span className="text-sm font-medium">
                    {selectedCategory === "all"
                      ? "All Categories"
                      : getCategoryName(parseInt(selectedCategory))}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isCategoryOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                        selectedCategory === "all"
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id.toString());
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                          selectedCategory === cat.id.toString()
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsDateOpen(!isDateOpen)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 whitespace-nowrap"
                >
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-sm font-medium">
                    {selectedDate === "all"
                      ? "All Dates"
                      : selectedDate.charAt(0).toUpperCase() +
                        selectedDate.slice(1)}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isDateOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isDateOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2">
                    {[
                      { value: "all", label: "All Dates" },
                      { value: "today", label: "Today" },
                      { value: "week", label: "This Week" },
                      { value: "month", label: "This Month" },
                      { value: "year", label: "This Year" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedDate(option.value);
                          setIsDateOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                          selectedDate === option.value
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
                >
                  <X size={16} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Results Count */}
          {hasActiveFilters && (
            <div className="mt-3 text-sm text-gray-500">
              Found {filteredArticles.length} result
              {filteredArticles.length !== 1 ? "s" : ""}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                  {getCategoryName(parseInt(selectedCategory))}
                </span>
              )}
              {selectedDate !== "all" && (
                <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                  {selectedDate}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Total
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {articles.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Published
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {articles.filter((a) => a.status === "published").length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Drafts
            </p>
            <p className="text-2xl font-bold text-amber-600">
              {articles.filter((a) => a.status === "draft").length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              This Month
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {
                articles.filter((a) => {
                  const now = new Date();
                  const created = new Date(a.created_at);
                  return (
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </p>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-500">Loading articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">
                {searchQuery ||
                selectedCategory !== "all" ||
                selectedDate !== "all"
                  ? "No articles match your filters"
                  : "No articles found"}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchQuery ||
                selectedCategory !== "all" ||
                selectedDate !== "all"
                  ? "Try adjusting your search or filters"
                  : "Click 'Write New' to create your first article"}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Clear all filters →
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                        Author
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 hidden sm:table-cell">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((article) => (
                      <tr
                        key={article.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                      >
                        {quickEditId === article.id ? (
                          // Quick Edit Row
                          <td colSpan={6} className="px-6 py-4 bg-blue-50/50">
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                <input
                                  type="text"
                                  value={quickEditData?.title || ""}
                                  onChange={(e) =>
                                    setQuickEditData((prev) =>
                                      prev
                                        ? { ...prev, title: e.target.value }
                                        : null,
                                    )
                                  }
                                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-700"
                                  placeholder="Article title..."
                                />
                                <select
                                  value={quickEditData?.status || "draft"}
                                  onChange={(e) =>
                                    setQuickEditData((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            status: e.target.value as
                                              | "published"
                                              | "draft",
                                          }
                                        : null,
                                    )
                                  }
                                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white text-gray-700"
                                >
                                  <option value="published">Published</option>
                                  <option value="draft">Draft</option>
                                </select>
                                <select
                                  value={quickEditData?.category_id || ""}
                                  onChange={(e) =>
                                    setQuickEditData((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            category_id: e.target.value
                                              ? parseInt(e.target.value)
                                              : undefined,
                                          }
                                        : null,
                                    )
                                  }
                                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white text-gray-700"
                                >
                                  <option value="">Uncategorized</option>
                                  {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                      {cat.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={saveQuickEdit}
                                  disabled={updating}
                                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                                >
                                  <Check size={16} />
                                  {updating ? "Saving..." : "Update"}
                                </button>
                                <button
                                  onClick={closeQuickEdit}
                                  className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                  <X size={16} />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                        ) : (
                          // Normal Row
                          <>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900 line-clamp-1">
                                  {article.title}
                                </p>
                                <p className="text-xs text-gray-400 md:hidden mt-1">
                                  {article.author || "Unknown"} •{" "}
                                  {new Date(
                                    article.created_at,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                              {article.author || "Unknown"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                {getCategoryName(article.category_id)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  article.status,
                                )}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    article.status === "published"
                                      ? "bg-emerald-500"
                                      : "bg-amber-500"
                                  }`}
                                />
                                {article.status.charAt(0).toUpperCase() +
                                  article.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                              {new Date(article.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/article/${article.slug}`}
                                  target="_blank"
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View"
                                >
                                  <Eye size={16} />
                                </Link>
                                <button
                                  onClick={() => openQuickEdit(article)}
                                  className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                  title="Quick Edit"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <Link
                                  href={`/admin/edit/${article.id}`}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Full Edit"
                                >
                                  <FileText size={16} />
                                </Link>
                                <button
                                  onClick={() => handleDelete(article.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                      Showing {startIndex + 1}–
                      {Math.min(endIndex, filteredArticles.length)} of{" "}
                      {filteredArticles.length} articles
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={18} className="text-gray-600" />
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            if (pageNum > totalPages) return null;

                            return (
                              <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                  currentPage === pageNum
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          },
                        )}
                      </div>

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
