// app/privacy-policy/page.tsx
export const metadata = {
  title: "Privacy Policy - The Daily Chronicle",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-16 max-w-3xl">
      <div className="border-b-2 border-primary pb-6 mb-10">
        <h1 className="font-serif text-4xl font-black">Privacy Policy</h1>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-wide mt-2">
          Last Updated: July 3, 2026
        </p>
      </div>

      <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary">
        <p>
          At <strong>The Daily Chronicle</strong>, available from your domain,
          one of our main priorities is the privacy of our visitors. This
          Privacy Policy document contains types of information that is
          collected and recorded by our platform and how we use it.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          If you register for an account on our platform, write articles, or
          contact us directly, we may collect information including but not
          limited to:
        </p>
        <ul>
          <li>
            <strong>Account Profile Data:</strong> Names, usernames, email
            addresses, and passwords.
          </li>
          <li>
            <strong>Content Contributions:</strong> Articles, drafts, uploaded
            feature images, and author biography details.
          </li>
          <li>
            <strong>Log Files:</strong> Standard IP addresses, browser types,
            Internet Service Providers (ISP), date/time stamps, and referral
            pages.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We leverage the data we collect to support our editorial operations,
          specifically to:
        </p>
        <ul>
          <li>
            Provide, operate, and maintain our multi-author publishing
            framework.
          </li>
          <li>
            Improve, personalize, and expand your customized article feed stream
            content profiles.
          </li>
          <li>
            Understand and analyze how you interact with our dynamic pagination
            features.
          </li>
          <li>
            Communicate with you regarding administrative updates, system
            security, or editorial milestones.
          </li>
        </ul>

        <h2>3. Cookies and Web Beacons</h2>
        <p>
          Like any other modern digital publication, The Daily Chronicle uses
          &quot;cookies&quot;. These cookies are used to store data including
          visitors&apos; preferences, and the pages on the website that the
          visitor accessed or visited. The information is used to optimize the
          users&apos; experience by customizing our web page content based on
          visitors&apos; browser configuration metrics.
        </p>

        <h2>4. Data Protection and Security</h2>
        <p>
          The security of your contributions and profile information is of
          paramount importance to us. We implement rigorous structural
          protections to secure user databases, prevent unauthorized access, and
          prevent modification of administrative publication properties.
          However, please remember that no structural web transfer transmission
          framework over the Internet is 100% secure.
        </p>

        <h2>5. Contact Us</h2>
        <p>
          If you have additional questions or require more information about our
          Privacy Policy data paradigms, do not hesitate to reach out via our
          contact hub or email us directly at{" "}
          <a
            href="mailto:privacy@dailychronicle.com"
            className="text-accent hover:underline"
          >
            privacy@dailychronicle.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
