import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | My Handyman Inc - Orange & Woodbridge CT",
  description:
    "Read our terms of service for handyman and repair services in Orange and Woodbridge, CT.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
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
              By accessing our website or using our handyman and repair
              services, you agree to these Terms of Service. Please read them
              carefully.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Our Services</h2>
            <p className="text-gray-600 mb-6">
              My Handyman Inc provides professional handyman, home improvement,
              appliance repair, and roof leak repair services in Orange,
              Woodbridge, and surrounding areas of Connecticut. All services are
              subject to availability and technician expertise.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              2. Estimates & Pricing
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                Free estimates are provided at our discretion and are
                non-binding.
              </li>
              <li>
                Final pricing may vary based on actual time, materials, and
                unforeseen issues discovered during work.
              </li>
              <li>
                We provide upfront pricing before starting any work whenever
                possible.
              </li>
              <li>Emergency and same-day services may have additional fees.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              3. Appointments & Cancellations
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                We strive to arrive at scheduled appointment times but cannot
                guarantee exact arrival times.
              </li>
              <li>Please provide at least 2 hours notice for cancellations.</li>
              <li>
                We reserve the right to cancel or reschedule appointments due to
                emergencies, weather, or other circumstances.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Payment Terms</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                Payment is due upon completion of services unless otherwise
                agreed.
              </li>
              <li>We accept cash, check, and major credit cards.</li>
              <li>Returned checks are subject to a $35 processing fee.</li>
              <li>
                Outstanding invoices beyond 30 days may incur interest charges.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              5. Warranty & Guarantee
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                We offer a 1-year labor guarantee on most handyman services.
              </li>
              <li>
                Manufacturer warranties on parts or appliances apply separately.
              </li>
              <li>
                The warranty does not cover damage caused by misuse, neglect, or
                normal wear and tear.
              </li>
              <li>
                Warranty claims must be reported within the guarantee period.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              6. Customer Responsibilities
            </h2>
            <p className="text-gray-600 mb-4">As a customer, you agree to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Provide safe and clear access to work areas</li>
              <li>
                Disclose any known hazards or issues (e.g., mold, asbestos)
              </li>
              <li>Obtain necessary permits where required</li>
              <li>Secure pets during service appointments</li>
              <li>
                Be present or provide access to the property for scheduled work
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-600 mb-6">
              To the maximum extent permitted by law, My Handyman Inc shall not
              be liable for indirect, incidental, or consequential damages
              arising from our services. Our total liability shall not exceed
              the amount paid for the specific service giving rise to the claim.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              8. Property Access & Safety
            </h2>
            <p className="text-gray-600 mb-6">
              By scheduling services, you grant our technicians permission to
              enter your property at the agreed time. You are responsible for
              securing valuables and ensuring a safe work environment.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              9. Intellectual Property
            </h2>
            <p className="text-gray-600 mb-6">
              All content on this website (text, images, logos) is the property
              of My Handyman Inc and may not be used without permission.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              10. Modifications to Terms
            </h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to update these Terms of Service at any time.
              Continued use of our services constitutes acceptance of updated
              terms.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">11. Governing Law</h2>
            <p className="text-gray-600 mb-6">
              These terms are governed by the laws of the State of Connecticut.
              Any disputes shall be resolved in the courts of New Haven County,
              Connecticut.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">12. Contact Us</h2>
            <p className="text-gray-600 mb-2">
              Questions about these Terms of Service? Contact us:
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
