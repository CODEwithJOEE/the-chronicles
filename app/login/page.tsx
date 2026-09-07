// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", email);

      // Try to sign in
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        console.error("Sign in error:", signInError);
        setError(`Login failed: ${signInError.message}`);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("No user found. Please check your credentials.");
        setLoading(false);
        return;
      }

      console.log("User logged in with ID:", data.user.id);

      // First, check if user exists in public.users
      const { data: userExists, error: checkError } = await supabase
        .from("users")
        .select("id, role")
        .eq("id", data.user.id)
        .maybeSingle();

      console.log("User in public.users:", userExists);

      // If user doesn't exist in public.users, create them
      if (!userExists) {
        console.log("User not in public.users, creating...");
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            username: email.split("@")[0],
            email: email,
            role: "admin",
          },
        ]);

        if (insertError) {
          console.error("Error creating user profile:", insertError);
          setError("Error creating user profile. Please contact admin.");
          setLoading(false);
          return;
        }

        // Re-fetch the user data
        const { data: newUser, error: fetchError } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (fetchError) {
          console.error("Error fetching new user:", fetchError);
          setError("Error fetching user permissions.");
          setLoading(false);
          return;
        }

        if (newUser?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        setLoading(false);
        return;
      }

      // User exists, check role
      if (userExists?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-accent"
              placeholder="admin@yourdomain.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-accent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-accent transition-colors disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
