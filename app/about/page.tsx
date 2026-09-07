// app/about/page.tsx
import Link from "next/link";
import { BookOpen, Users, Target } from "lucide-react";

export const metadata = {
  title: "About Us - The Chronicle",
  description: "Learn about The Chronicle, our mission, and our team.",
};

export default function AboutPage() {
  return (
    <div className="container py-16 max-w-3xl">
      <h1 className="font-serif text-4xl font-bold mb-6">
        About Our Publication
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Welcome to <strong>The Chronicle</strong>, an independent digital
        magazine focusing on cutting-edge industry news, technology trends,
        lifestyle insights, and authoritative opinions.
      </p>

      <p className="text-lg text-gray-700 mb-8">
        Our goal is simple: to deliver clean, engaging, and well-researched
        content to digital enthusiasts and business professionals around the
        globe. We hold our writing standards high, ensuring that every published
        piece adds true editorial value to our readers.
      </p>

      <div className="bg-white border-l-4 border-accent p-6 rounded-r-lg shadow-sm mb-8">
        <h4 className="font-bold text-lg mb-2">
          Content Creators &amp; SEO Agencies
        </h4>
        <p className="text-gray-600">
          We welcome collaboration with marketing professionals looking to share
          high-grade resources and establish domain authority through
          high-quality contextual links.
        </p>
      </div>

      <p className="text-gray-700">
        If you are interested in publishing an editorial guest post or inserting
        a link into our live content stream, please review our options on the{" "}
        <Link
          href="/services"
          className="text-accent font-bold hover:underline"
        >
          Services Page
        </Link>{" "}
        or get in touch with us directly via the contact portal.
      </p>
    </div>
  );
}
