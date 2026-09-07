// app/resources/page.tsx
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata = {
  title: "Resources Hub - The Chronicle",
  description:
    "Curated topical hubs containing deep insights, tactical stack guides, and strategic advice for modern digital career progression.",
};

const categoryMeta: Record<string, { desc: string; icon: string }> = {
  "Freelance Insights": {
    desc: "Master the modern gig economy. Discover advanced client acquisition techniques, pricing strategies, and growth systems to scale your independent career.",
    icon: "01",
  },
  "Outsourcing & Tools": {
    desc: "Optimize your operations workflow. Explore curated software stacks, automation frameworks, and methods to leverage global talent smoothly.",
    icon: "02",
  },
  "Remote Career Guides": {
    desc: "Your structural roadmap to landing corporate remote roles. Master technical resumes, interview positioning, and cross-border workspace logistics.",
    icon: "03",
  },
};

export default async function ResourcesPage() {
  const categories = await db.categories.getWithArticleCount();

  return (
    <div className="container py-16 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-primary pb-8 mb-12">
        <div>
          <h1 className="font-serif text-5xl font-black mb-3">
            Knowledge Resources
          </h1>
          <p className="text-gray-600 max-w-xl">
            Curated topical hubs containing deep insights, tactical stack
            guides, and strategic advice for modern digital career progression.
          </p>
        </div>
        <span className="font-serif text-xl text-gray-500 mt-4 md:mt-0">
          Showing {categories.length} core pillars
        </span>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {categories.map((cat) => {
          const meta = categoryMeta[cat.name] || {
            desc: "Explore our curated directory of deep editorial investigations, columns, and educational industry breakdowns.",
            icon: "//",
          };

          return (
            <Link
              key={cat.id}
              href={`/?category=${cat.id}`}
              className="border-t border-primary pt-6 hover:border-accent transition-colors group"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-serif font-bold text-primary group-hover:text-accent transition-colors">
                  [{meta.icon}]
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded border border-gray-200">
                  {cat.total_articles} Articles
                </span>
              </div>
              <h2 className="font-serif text-3xl font-black mb-3 group-hover:text-accent transition-colors">
                {cat.name}
              </h2>
              <p className="text-gray-600 mb-6">{meta.desc}</p>
              <span className="text-sm font-bold uppercase tracking-wider group-hover:text-accent transition-colors">
                View Archive →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
