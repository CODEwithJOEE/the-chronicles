// components/Footer.tsx
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#111] text-white mt-20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-serif text-2xl font-black text-white hover:text-accent transition-colors"
            >
              The Chronicle
            </Link>
            <p className="mt-4 text-sm text-white/80 leading-relaxed">
              Delivering curated stories, deep-dive investigations, and premium
              updates on design, technology, and culture every single day.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-serif text-white text-lg font-bold mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/80 hover:text-accent transition-colors"
                >
                  Latest Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-white/80 hover:text-accent transition-colors"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/80 hover:text-accent transition-colors"
                >
                  About Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-accent transition-colors"
                >
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-white text-lg font-bold mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-white/60 flex-shrink-0" />
                <a
                  href="mailto:joemarie27r@gmail.com"
                  className="text-white/80 hover:text-accent transition-colors"
                >
                  joemarie27r@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-white/60 flex-shrink-0" />
                <a
                  href="mailto:joemarie.r@techguys.work"
                  className="text-white/80 hover:text-accent transition-colors"
                >
                  joemarie.r@techguys.work
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-white/60 flex-shrink-0" />
                <span className="text-white/80">Dipolog City, Philippines</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-serif text-white text-lg font-bold mb-4">
              Follow Us
            </h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors text-white text-sm font-bold hover:text-white"
                aria-label="Twitter"
              >
                X
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors text-white text-sm font-bold hover:text-white"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors text-white text-sm font-bold hover:text-white"
                aria-label="LinkedIn"
              >
                IN
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors text-white text-sm font-bold hover:text-white"
                aria-label="Facebook"
              >
                FB
              </a>
            </div>
            <p className="mt-4 text-xs text-white/60">
              Stay updated via our active social channels.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} The Chronicle. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy-policy"
              className="text-white/60 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-white/60 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
