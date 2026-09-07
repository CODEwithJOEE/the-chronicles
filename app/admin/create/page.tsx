"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { TipTapEditor } from "@/components/TipTapEditor";

export default function CreateArticlePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(data || []);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Upload image if provided
      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("article-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("article-images")
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      // Generate slug if not provided
      const finalSlug =
        slug ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Create article
      const { error: insertError } = await supabase.from("articles").insert([
        {
          title,
          slug: finalSlug,
          content,
          category_id: categoryId,
          featured_image: imageUrl,
          author_id: user?.id,
          status,
          meta_title: metaTitle,
          meta_description: metaDescription,
          meta_keywords: metaKeywords,
        },
      ]);

      if (insertError) throw insertError;

      setSuccess("Article created successfully!");
      setTimeout(() => router.push("/admin"), 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the article.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6">Write a New Article</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-bold mb-2">
                Article Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-accent"
                placeholder="e.g. Title of the Article"
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-bold mb-2">
                URL Slug{" "}
                <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-accent"
                placeholder="e.g. custom-url-slug"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-bold mb-2"
              >
                Category
              </label>
              <select
                id="category"
                value={categoryId || ""}
                onChange={(e) =>
                  setCategoryId(
                    e.target.value ? parseInt(e.target.value) : null,
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-accent"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-bold mb-2">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "published" | "draft")
                }
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-accent"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-bold mb-2">
              Featured Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-bold mb-2">
              Content *
            </label>
            <TipTapEditor
              value={content}
              onChange={handleContentChange}
              placeholder="Write your article content here..."
            />
          </div>

          {/* SEO Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-lg mb-4">
              🔍 Search Engine Optimization (SEO)
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="metaTitle"
                  className="block text-sm font-bold mb-2"
                >
                  Meta Title{" "}
                  <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-accent"
                  placeholder="e.g. Beyond the Hype: The Reality of Edge AI"
                />
              </div>

              <div>
                <label
                  htmlFor="metaDescription"
                  className="block text-sm font-bold mb-2"
                >
                  Meta Description{" "}
                  <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-accent resize-y"
                  placeholder="Write a catchy summary that makes users want to click your link on Google..."
                />
              </div>

              <div>
                <label
                  htmlFor="metaKeywords"
                  className="block text-sm font-bold mb-2"
                >
                  Meta Keywords{" "}
                  <span className="text-gray-500 font-normal">
                    (Optional - Comma separated)
                  </span>
                </label>
                <input
                  type="text"
                  id="metaKeywords"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-accent"
                  placeholder="e.g. tech, edge ai, artificial intelligence, trends"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
            <Link
              href="/admin"
              className="bg-gray-600 text-white px-6 py-3 rounded font-bold hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
