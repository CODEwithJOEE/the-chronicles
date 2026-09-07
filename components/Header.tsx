// components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown, User, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Category } from "@/types";

interface HeaderProps {
  categories?: Category[];
}

export function Header({ categories: initialCategories }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>(
    initialCategories || [],
  );
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!initialCategories) {
        const { data } = await supabase
          .from("categories")
          .select("*")
          .order("name");
        setCategories(data || []);
      }
    };
    fetchCategories();
  }, [initialCategories]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const searchArticles = async () => {
      if (searchQuery.length >= 2) {
        const { data } = await supabase
          .from("articles")
          .select("id, title, slug, featured_image")
          .eq("status", "published")
          .ilike("title", `%${searchQuery}%`)
          .limit(5);
        setSearchResults(data || []);
      } else {
        setSearchResults([]);
      }
    };
    searchArticles();
  }, [searchQuery]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-2xl font-black"
          >
            <span>The Chronicle</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation */}
          <nav
            className={`${
              isOpen ? "fixed inset-0 top-16 bg-white p-6" : "hidden"
            } md:flex md:items-center md:gap-8 md:static md:bg-transparent md:p-0`}
          >
            <ul className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
              <li>
                <Link
                  href="/"
                  className={`hover:text-accent ${pathname === "/" ? "text-accent" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`hover:text-accent ${pathname === "/about" ? "text-accent" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className={`hover:text-accent ${pathname === "/services" ? "text-accent" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  Services
                </Link>
              </li>
              <li className="relative group">
                <button className="flex items-center gap-1 hover:text-accent">
                  Resources <ChevronDown size={16} />
                </button>
                <ul className="hidden group-hover:block absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[200px]">
                  <li>
                    <Link
                      href="/resources"
                      className="block px-4 py-2 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      All Resources
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/?category=${cat.id}`}
                        className="block px-4 py-2 hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`hover:text-accent ${pathname === "/contact" ? "text-accent" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right side: Search & Auth */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:text-accent"
              >
                <Search size={20} />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white shadow-lg rounded-lg p-3">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-accent"
                    autoFocus
                  />
                  {searchResults.length > 0 && (
                    <ul className="mt-2 border-t pt-2">
                      {searchResults.map((result) => (
                        <li key={result.id}>
                          <Link
                            href={`/article/${result.slug}`}
                            className="block py-1 hover:text-accent"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery("");
                            }}
                          >
                            {result.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-accent transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
