// app/admin/leads/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  service: string;
  website: string | null;
  message: string;
  created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLeads(data);
    }
    setLoading(false);
  };

  const getServiceBadge = (service: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      "guest-post": {
        label: "Guest Post ($49)",
        className: "bg-blue-100 text-blue-800",
      },
      "niche-edit": {
        label: "Niche Edit ($35)",
        className: "bg-yellow-100 text-yellow-800",
      },
      "content-placement": {
        label: "Full Setup ($79)",
        className: "bg-green-100 text-green-800",
      },
      general: { label: "General", className: "bg-gray-100 text-gray-800" },
    };
    const badge = badges[service] || badges["general"];
    return (
      <span
        className={`text-xs font-bold uppercase px-2 py-1 rounded ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div className="container py-12 max-w-6xl">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex justify-between items-center border-b pb-6 mb-8">
          <h2 className="text-2xl font-bold">
            📥 Backlink &amp; Guest Post Leads
          </h2>
          <Link
            href="/admin"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading leads...</p>
        ) : leads.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No client messages received yet. Try filling out the contact form!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">
                    Client Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">
                    Requested Service
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">
                    Target URL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">
                    Message Pitch
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      {getServiceBadge(lead.service)}
                    </td>
                    <td className="px-4 py-3">
                      {lead.website ? (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent font-bold hover:underline"
                        >
                          View Site ↗
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 italic max-w-xs whitespace-pre-wrap">
                      {lead.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
