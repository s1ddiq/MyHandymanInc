import { Button } from "@/components/ui/button";
import { Calendar, Clock, Mail, MapPin, PhoneCall, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | My Handyman Inc - Orange & Woodbridge CT",
  description:
    "Read our privacy policy to understand how My Handyman Inc collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          <p className="mt-4 text-gray-300">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              At My Handyman Inc, we respect your privacy and are committed to
              protecting your personal information. This Privacy Policy explains
              how we collect, use, and safeguard your data when you visit our
              website or use our services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-600 mb-4">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <strong>Personal Information:</strong> Name, email address,
                phone number, and home address when you contact us or request an
                estimate.
              </li>
              <li>
                <strong>Service Information:</strong> Details about your home,
                repair needs, and project requirements.
              </li>
              <li>
                <strong>Website Usage Data:</strong> IP address, browser type,
                pages visited, and time spent on our site (via cookies).
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Provide and schedule our handyman and repair services</li>
              <li>Respond to your inquiries and provide free estimates</li>
              <li>
                Communicate about appointments, follow-ups, and promotions
              </li>
              <li>Improve our website and customer service</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              3. Text Messaging & Communications
            </h2>
            <p className="text-gray-600 mb-4">
              When you provide your phone number, you consent to receive text
              messages from My Handyman Inc regarding:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Appointment confirmations and reminders</li>
              <li>Service updates and follow-ups</li>
              <li>Responses to your inquiries</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Message and data rates may apply. You can opt out at any time by
              replying STOP to any message.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              4. Information Sharing
            </h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or rent your personal information to third
              parties. We may share information only:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>With your consent</li>
              <li>To comply with legal requirements</li>
              <li>With service providers who assist our business operations</li>
              <li>To protect our rights, property, or safety</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Security</h2>
            <p className="text-gray-600 mb-6">
              We implement reasonable security measures to protect your personal
              information from unauthorized access, alteration, or disclosure.
              However, no internet transmission is 100% secure.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              6. Cookies & Tracking
            </h2>
            <p className="text-gray-600 mb-6">
              Our website uses cookies to enhance your browsing experience. You
              can disable cookies in your browser settings, but this may affect
              website functionality.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              7. Children's Privacy
            </h2>
            <p className="text-gray-600 mb-6">
              Our services are not directed to children under 13. We do not
              knowingly collect personal information from children.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Your Rights</h2>
            <p className="text-gray-600 mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Access the personal information we have about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              9. Changes to This Policy
            </h2>
            <p className="text-gray-600 mb-6">
              We may update this Privacy Policy from time to time. The updated
              version will be posted on this page with a revised "Last Updated"
              date.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
            <p className="text-gray-600 mb-2">
              If you have questions about this Privacy Policy, please contact
              us:
            </p>
            <ul className="list-none pl-0 text-gray-600 space-y-2">
              <li>📞 Phone: (203) 441-3471</li>
              <li>✉️ Email: info@myhandymaninc.com</li>
              <li>📍 Serving: Orange & Woodbridge, CT</li>
            </ul>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link href="/">
              <Button variant="outline">← Back to Home</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
