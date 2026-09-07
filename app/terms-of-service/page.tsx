// app/terms-of-service/page.tsx
export const metadata = {
  title: "Terms of Service - The Daily Chronicle",
};

export default function TermsOfServicePage() {
  return (
    <div className="container py-16 max-w-3xl">
      <div className="border-b-2 border-primary pb-6 mb-10">
        <h1 className="font-serif text-4xl font-black">Terms of Service</h1>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-wide mt-2">
          Effective Date: July 3, 2026
        </p>
      </div>

      <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary">
        <p>
          Welcome to <strong>The Daily Chronicle</strong>. By accessing our
          website and ecosystem, you agree to comply with and be bound by the
          following terms and conditions. Please read these terms carefully
          before utilizing our system.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By browsing, accessing, registering, or contributing content to The
          Daily Chronicle, you acknowledge that you have read, understood, and
          agreed to execute obligations under these Terms of Service, along with
          our fully incorporated Privacy Policy system.
        </p>

        <h2>2. User Content &amp; Publishing Roles</h2>
        <p>
          Authors and registered contributors retain the underlying moral
          copyrights to original materials published inside our system. However,
          by submitting content, you grant The Daily Chronicle a perpetual,
          global, non-exclusive, royalty-free license to display, distribute,
          host, and index your stories across our landing streams.
        </p>
        <p>
          You agree that you will not post articles, upload assets, or input
          summaries that contain material that infringes upon third-party
          intellectual copyrights or proprietary privacy bounds.
        </p>

        <h2>3. Prohibited Conduct</h2>
        <p>When interacting with our framework, you explicitly agree not to:</p>
        <ul>
          <li>
            Attempt to breach database interfaces or bypass secure session
            layers within administrative controllers.
          </li>
          <li>
            Scrape content from our dynamic landing card grids using automated
            extraction systems without explicit written consent.
          </li>
          <li>
            Inject malicious payloads into submission fields or disrupt our
            asynchronous API pagination streams.
          </li>
        </ul>

        <h2>4. Disclaimers &amp; Limitation of Liability</h2>
        <p>
          The materials, analysis, opinions, and news indexes on The Daily
          Chronicle are provided on an &quot;as is&quot; and &quot;as
          available&quot; basis. We offer no warranties, explicit or implied,
          that the narrative summaries or database configurations will operate
          entirely uninterrupted or free of errors.
        </p>

        <h2>5. Modifications to Service</h2>
        <p>
          The Daily Chronicle reserves the right to modify or discontinue any
          module, feed configuration, category structure, or access token at any
          time without prior notice. Continued use of the platform following
          updates to these Terms denotes official acceptance.
        </p>

        <h2>6. Governing Jurisdiction</h2>
        <p>
          These terms shall be governed by and constructed in accordance with
          local legal frameworks, without giving effect to any rules or
          parameters concerning conflict of laws.
        </p>
      </div>
    </div>
  );
}
