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
          <p className="mt-4 text-gray-300">Effective Date: January 1, 2024</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              MyHandymanInc ("we," "our," or "us") respects your privacy and is
              committed to protecting your personal information. This Privacy
              Policy explains how we collect, use, and safeguard your data when
              you visit our website or use our services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-600 mb-4">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <strong>Personal Information:</strong> Name, phone number, email
                address, and service address
              </li>
              <li>
                <strong>Service Information:</strong> Details about your home,
                repair needs, and project requirements
              </li>
              <li>
                <strong>Automatically Collected Information:</strong> IP
                address, browser type, device information, and pages visited on
                our website
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Schedule and manage service appointments</li>
              <li>Communicate regarding your repair or service request</li>
              <li>Send estimates, invoices, and updates</li>
              <li>Provide customer support</li>
              <li>Improve our website and services</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              3. SMS / Text Message Communications (10DLC Compliant)
            </h2>
            <p className="text-gray-600 mb-4">
              If you provide your phone number, you may receive SMS messages
              from MyHandymanInc related to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Appointment confirmations and reminders</li>
              <li>Service updates and technician arrival notifications</li>
              <li>Estimates, invoices, and customer support</li>
            </ul>

            <div className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
              <p className="text-gray-700 mb-2">
                <strong>🔹 Consent:</strong> By providing your phone number, you
                consent to receive SMS messages from us.{" "}
                <em>Consent is not a condition of purchase.</em>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>🔹 Message Frequency:</strong> Message frequency may
                vary depending on your interaction with our services.
              </p>
              <p className="text-gray-700 mb-2">
                <strong>🔹 Message & Data Rates:</strong> Message and data rates
                may apply based on your mobile carrier.
              </p>
              <p className="text-gray-700 mb-2">
                <strong>🔹 Opt-Out Instructions:</strong> You can opt out of SMS
                communications at any time by replying STOP to any message.
              </p>
              <p className="text-gray-700">
                <strong>🔹 Help Instructions:</strong> For assistance, reply
                HELP or contact us at (203) 441-3471.
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              4. Information Sharing
            </h2>
            <p className="text-gray-600 mb-4">
              We do not sell, rent, or share your personal information with
              third parties for marketing purposes.
            </p>
            <p className="text-gray-600 mb-4">
              We may share information only when necessary to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Provide requested services</li>
              <li>Comply with legal obligations</li>
              <li>Protect our rights and safety</li>
              <li>
                With service providers who assist our business operations (under
                confidentiality agreements)
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Security</h2>
            <p className="text-gray-600 mb-6">
              We take reasonable measures to protect your information from
              unauthorized access, disclosure, or misuse. However, no method of
              transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              6. Cookies & Tracking
            </h2>
            <p className="text-gray-600 mb-6">
              Our website may use cookies or similar technologies to improve
              user experience and analyze website traffic. You can adjust your
              browser settings to refuse cookies if you prefer.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              7. Third-Party Services
            </h2>
            <p className="text-gray-600 mb-6">
              We may use third-party tools (such as payment processors or
              scheduling platforms) to operate our business. These providers may
              have access to necessary information but are required to protect
              it.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Your Rights</h2>
            <p className="text-gray-600 mb-4">You may request to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data (where applicable)</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="text-gray-600 mb-6">
              To make a request, contact us using the information below.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Data Retention</h2>
            <p className="text-gray-600 mb-6">
              We retain your personal information for as long as necessary to
              provide our services, comply with legal obligations, resolve
              disputes, and enforce our agreements. Typically, we retain
              customer data for 7 years as required by tax and insurance
              regulations.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              10. Children's Privacy
            </h2>
            <p className="text-gray-600 mb-6">
              Our services are not directed to individuals under the age of 13,
              and we do not knowingly collect information from children.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              11. Changes to This Policy
            </h2>
            <p className="text-gray-600 mb-6">
              We may update this Privacy Policy at any time. Updates will be
              posted on this page with a revised effective date.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              12. Contact Information
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-2">
                <strong>MyHandymanInc</strong>
              </p>
              <p className="text-gray-600 mb-2">📞 Phone: (203) 441-3471</p>
              <p className="text-gray-600 mb-2">
                ✉️ Email: myhandymaninc1@gmail.com
              </p>
              <p className="text-gray-600">🌐 Website: myhandymaninc.com</p>
              <p className="text-gray-600 mt-2">
                📍 Serving: Orange, Woodbridge, and surrounding CT areas
              </p>
            </div>
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
