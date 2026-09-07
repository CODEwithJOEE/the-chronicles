// app/contact/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "general",
    website: "",
    message: "",
  });
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const { error } = await supabase.from("inquiries").insert([formData]);

      if (error) throw error;

      setStatus({
        type: "success",
        message:
          "🎉 Message Sent Successfully! We will review your inquiry and get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        service: "general",
        website: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "There was an error sending your message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-16 max-w-2xl">
      <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-12 shadow-sm">
        <h1 className="font-serif text-3xl font-bold mb-2">Get in Touch</h1>
        <p className="text-gray-600 mb-8">
          Ready to boost your site traffic? Send your request or pitch here.
        </p>

        {status.type === "success" && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded mb-6">
            {status.message}
          </div>
        )}
        {status.type === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-6">
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-bold mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-accent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Business Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-accent"
              placeholder="john@yourdomain.com"
            />
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-bold mb-2">
              Inquiry Type
            </label>
            <select
              id="service"
              value={formData.service}
              onChange={(e) =>
                setFormData({ ...formData, service: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-accent"
            >
              <option value="general">General Inquiry / Partnership</option>
              <option value="guest-post">Standard Guest Post ($49)</option>
              <option value="niche-edit">
                Niche Edit / Link Insertion ($35)
              </option>
              <option value="content-placement">
                Content + Placement Service ($79)
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-bold mb-2">
              Your Target Website URL (Optional)
            </label>
            <input
              type="text"
              id="website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-accent"
              placeholder="https://yourdomain.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold mb-2">
              Your Pitch / Requirements *
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-accent resize-y"
              placeholder="Provide details about your guest post content, keywords, or niche anchor layout requirements..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded font-bold hover:bg-accent transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
