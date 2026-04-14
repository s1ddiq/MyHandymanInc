import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | My Handyman Inc - Orange & Woodbridge CT",
  description:
    "Read our terms of service for handyman, appliance repair, and roofing services in Connecticut and Westchester County, NY.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
          <p className="mt-4 text-gray-300">Effective Date: January 1, 2024</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Welcome to MyHandymanInc. By accessing our website or using our
              services, you agree to the following Terms of Service.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              1. Services Provided
            </h2>
            <p className="text-gray-600 mb-4">MyHandymanInc provides:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Appliance repair, installation, and diagnostics</li>
              <li>Roof repair, leak detection, and replacement services</li>
              <li>General handyman services</li>
            </ul>
            <p className="text-gray-600 mb-6">
              We service customers throughout Connecticut and Westchester
              County, NY. All services are subject to availability and
              scheduling.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              2. Diagnostic Fee & Estimates
            </h2>
            <p className="text-gray-600 mb-4">
              A non-refundable diagnostic fee is required for appliance repair
              visits. The diagnostic fee covers:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Full evaluation of the issue</li>
              <li>Identification of required repairs</li>
            </ul>

            <div className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
              <p className="text-gray-700">
                <strong>
                  👉 If the issue is minor and can be resolved within
                  approximately one (1) hour without parts
                </strong>
                , it may be completed at no additional labor charge.
              </p>
            </div>

            <p className="text-gray-600 mb-4">Any repair requiring:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Parts</li>
              <li>Extended labor</li>
              <li>Return visits</li>
            </ul>
            <p className="text-gray-600 mb-6">
              Will be quoted separately and must be approved before work
              proceeds.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              3. Roofing Services Disclaimer
            </h2>
            <p className="text-gray-600 mb-4">
              Roof inspections and repairs are based on visible conditions at
              the time of service.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Hidden damage may not be immediately detectable</li>
              <li>Additional repairs may be required once work begins</li>
              <li>
                Temporary repairs (e.g., leak patches) are not guaranteed as
                permanent solutions
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              4. Payments & Appointments
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Payment may be required in advance to secure appointments</li>
              <li>
                Accepted payment methods will be provided at time of booking
              </li>
              <li>
                Appointments are typically scheduled within a time window (e.g.,
                3–5 PM)
              </li>
              <li>
                Failure to provide access to the property may result in
                cancellation or additional fees
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              5. Cancellations & Rescheduling
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                Customers must provide reasonable notice for cancellations or
                rescheduling
              </li>
              <li>Same-day cancellations may be subject to a service charge</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-600 mb-4">
              MyHandymanInc is not liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Pre-existing conditions or damages</li>
              <li>Manufacturer defects</li>
              <li>Delays caused by parts availability or external factors</li>
            </ul>
            <p className="text-gray-600 mb-6">
              To the fullest extent permitted by law, our liability is limited
              to the amount paid for services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Warranties</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                Labor warranties (if provided) will be disclosed at time of
                service
              </li>
              <li>Parts warranties are subject to manufacturer terms</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Website Use</h2>
            <p className="text-gray-600 mb-4">
              By using this website, you agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Misuse contact forms</li>
              <li>Submit false or misleading information</li>
              <li>Attempt unauthorized access to systems</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              9. Modifications to Terms
            </h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to update these Terms of Service at any time.
              Continued use of our services constitutes acceptance of updated
              terms.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Governing Law</h2>
            <p className="text-gray-600 mb-6">
              These terms are governed by the laws of the State of Connecticut.
              Any disputes shall be resolved in the courts of New Haven County,
              Connecticut.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">11. Contact Us</h2>
            <p className="text-gray-600 mb-2">
              Questions about these Terms of Service? Contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-2">📞 Phone: (203) 441-3471</p>
              <p className="text-gray-600 mb-2">
                ✉️ Email: myhandymaninc1@gmail.com ✉️ Email:
              </p>
              <p className="text-gray-600">
                🌐 Website: myhandymaninc.com 🔨 Developer: snashct@gmail.com
              </p>
              <p className="text-gray-600 mt-2">
                📍 Serving: Connecticut & Westchester County, NY
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
