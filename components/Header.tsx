// components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // ✅ Add useRouter
import { Menu, X, Search, ChevronDown, LogOut } from "lucide-react";
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
  const router = useRouter(); // ✅ Add router

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // ✅ Handle logout with redirect
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    router.push("/"); // Redirect to homepage
    // Or use: router.push("/login"); if you want to go to login page
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left side */}
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-2xl font-black flex-shrink-0"
          >
            <span>The Chronicle</span>
          </Link>

          {/* Desktop Navigation - Center (hidden on mobile) */}
          <nav className="hidden md:flex md:items-center md:gap-8">
            <ul className="flex flex-row items-center gap-6">
              <li>
                <Link
                  href="/"
                  className={`hover:text-accent ${pathname === "/" ? "text-accent" : ""}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`hover:text-accent ${pathname === "/about" ? "text-accent" : ""}`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className={`hover:text-accent ${pathname === "/services" ? "text-accent" : ""}`}
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
                    >
                      All Resources
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/?category=${cat.id}`}
                        className="block px-4 py-2 hover:bg-gray-50"
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
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right side: Search & Admin Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}

            {/* Admin Controls - Only show when logged in */}
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600 truncate max-w-[120px]">
                  {user.email}
                </span>

                <button
                  onClick={handleLogout} // ✅ Use the new handler
                  className="p-2 text-red-500 hover:text-red-700"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}

            {/* Mobile Menu Button - Right side */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 ml-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Full screen overlay */}
        {isOpen && (
          <nav className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-white border-t border-gray-200 overflow-y-auto z-40">
            <div className="container py-6">
              <ul className="flex flex-col gap-4">
                <li>
                  <Link
                    href="/"
                    className={`block text-lg font-medium hover:text-accent ${
                      pathname === "/" ? "text-accent" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className={`block text-lg font-medium hover:text-accent ${
                      pathname === "/about" ? "text-accent" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className={`block text-lg font-medium hover:text-accent ${
                      pathname === "/services" ? "text-accent" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <div className="block text-lg font-medium text-gray-700">
                    Resources
                  </div>
                  <ul className="mt-2 ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                    <li>
                      <Link
                        href="/resources"
                        className="block hover:text-accent"
                        onClick={() => setIsOpen(false)}
                      >
                        All Resources
                      </Link>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={`/?category=${cat.id}`}
                          className="block hover:text-accent"
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
                    className={`block text-lg font-medium hover:text-accent ${
                      pathname === "/contact" ? "text-accent" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Contact Us
                  </Link>
                </li>

                {/* Mobile Admin Controls - Only show when logged in */}
                {user && (
                  <>
                    <li className="border-t border-gray-200 pt-4 mt-2">
                      <div className="text-sm text-gray-600">
                        Signed in as
                        <div className="font-medium text-gray-800 truncate">
                          {user.email}
                        </div>
                      </div>
                    </li>
                    <li></li>
                    <li>
                      <button
                        onClick={handleLogout} // ✅ Use the new handler
                        className="w-full text-left text-red-500 font-medium hover:text-red-700"
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
