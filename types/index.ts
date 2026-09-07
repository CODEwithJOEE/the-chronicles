// types/index.ts
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  category_id: number | null;
  featured_image: string | null;
  author_id: string | null;
  status: "published" | "draft";
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  created_at: string;
  updated_at: string;
  author?: string;
  category_name?: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  service: string;
  website: string | null;
  message: string;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "author" | "reader";
  created_at: string;
}
