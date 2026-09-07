// app/services/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Our Services - Sponsored Posts & Backlinks",
  description:
    "Grow your search engine rankings with high-quality contextual backlinks on our platform.",
};

export default function ServicesPage() {
  return (
    <div className="container py-16 max-w-5xl">
      <h1 className="font-serif text-4xl font-bold text-center mb-3">
        Advertise &amp; Build Authority
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Grow your search engine rankings with high-quality contextual backlinks
        on our platform.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm hover:-translate-y-2 transition-transform">
          <h3 className="font-serif text-2xl font-bold mb-4">
            Standard Guest Post
          </h3>
          <div className="text-3xl font-bold text-accent mb-4">
            $49{" "}
            <span className="text-base text-gray-500 font-normal">/ post</span>
          </div>
          <ul className="text-left text-gray-700 space-y-3 mb-8">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span> Provide your own unique
              article
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span> Up to 2 Do-Follow
              Backlinks
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span> Permanent Placement
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span> Indexed in Google within
              48h
            </li>
          </ul>
          <Link
            href="/contact?service=guest-post"
            className="block bg-primary text-white py-3 rounded font-bold hover:bg-accent transition-colors"
          >
            Order Now
          </Link>
        </div>

        <div className="bg-white border-2 border-accent rounded-lg p-8 text-center shadow-sm relative hover:-translate-y-2 transition-transform">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold uppercase px-4 py-1 rounded-full">
            Popular
          </span>
          <h3 className="font-serif text-2xl font-bold mb-4">
            Niche Edit / Link Insertion
          </h3>
          <div className="text-3xl font-bold text-accent mb-4">
            $35{" "}
            <span className="text-base text-gray-500 font-normal">/ link</span>
          </div>
          <ul className="text-left text-gray-700 space-y-3 mb-8">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span> Link placed in an
              existing article
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span> Instant authority
              transfer
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span> Natural contextual
              integration
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span> Permanent Do-Follow Link
            </li>
          </ul>
          <Link
            href="/contact?service=niche-edit"
            className="block bg-accent text-white py-3 rounded font-bold hover:bg-[#0055aa] transition-colors"
          >
            Order Now
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm hover:-translate-y-2 transition-transform">
          <h3 className="font-serif text-2xl font-bold mb-4">
            Content + Placement
          </h3>
          <div className="text-3xl font-bold text-accent mb-4">
            $79{" "}
            <span className="text-base text-gray-500 font-normal">
              / complete
            </span>
          </div>
          <ul className="text-left text-gray-700 space-y-3 mb-8">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span> We write the article
              (800+ words)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span> Niche-relevant research
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span> Up to 2 Permanent
              Backlinks
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span> Includes premium
              royalty-free image
            </li>
          </ul>
          <Link
            href="/contact?service=content-placement"
            className="block bg-primary text-white py-3 rounded font-bold hover:bg-accent transition-colors"
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
