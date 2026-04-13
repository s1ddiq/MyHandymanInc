import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  ClipboardIcon,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Shield,
  Wrench,
  Snowflake,
  Droplets,
  Wind,
  Flame,
  Sparkles,
  Mic,
  Tv,
  Smartphone,
  BellElectricIcon,
  GlassWaterIcon,
  DropletIcon,
  SpeakerIcon,
  Volume2Icon,
  MicroscopeIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Appliance Repair Orange & Woodbridge CT | My Handyman Inc",
  description:
    "Fast & reliable appliance repair in Orange and Woodbridge, CT. Same-day service for refrigerators, washers, dryers, ovens & more. Samsung & LG specialists. Call (203) 441-3471 today!",
  keywords:
    "appliance repair Orange CT, appliance repair Woodbridge CT, refrigerator repair, washer dryer repair, Samsung appliance repair, LG appliance repair, My Handyman Inc Connecticut",
  authors: [{ name: "My Handyman Inc" }],
  openGraph: {
    title: "Appliance Repair Orange & Woodbridge CT",
    description:
      "Professional appliance repair services. Same-day service. Free estimates. Samsung & LG specialists. Family-owned since 2012.",
    type: "website",
  },
};

export default function ApplianceRepairPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <Image
          src="/appliance-repair-1.jpg"
          alt="Appliance Repair"
          fill
          className="object-cover grayscale-50"
          priority
        />
        <div className="absolute inset-0 bg-black/50 grayscale-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6 text-white">
              <MapPin className="w-4 h-4" />
              Serving Orange & Woodbridge, CT Since 2012
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Fast & Reliable Appliance Repair
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">
              Same-day service for refrigerators, washers, dryers, ovens, and
              more. Samsung & LG specialists. Family-owned.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="tel:+12034413471">
                <Button className="gap-2">
                  <PhoneCall className="size-5.5" />
                  Call (203) 441-3471
                </Button>
              </Link>
              <Link href="sms:+12034413471">
                <Button variant="outline" className="gap-2">
                  <MessageCircle className="size-5.5" />
                  Text Us
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="gap-2">
                  <ClipboardIcon className="size-5.5" />
                  Free Estimate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Key Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Wind className="w-10 h-10 text-primary" />,
                title: "Same-Day Service",
                description:
                  "Most appointments are same-day or next-day. We arrive on time and rarely cancel once booked.",
              },
              {
                icon: <Wrench className="w-10 h-10 text-primary" />,
                title: "16+ Years in Business",
                description:
                  "Over 16 years serving Connecticut with highly trained, experienced technicians you can trust.",
              },
              {
                icon: <Sparkles className="w-10 h-10 text-primary" />,
                title: "Accurate Diagnostics",
                description:
                  "We identify root causes quickly, avoid unnecessary part replacements, and deliver long-term solutions.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Why Connecticut Trusts Us for Appliance Repair
              </h2>
              <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
                We're your neighbors, committed to honest work and lasting
                relationships.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Same-day & next-day appointments – Fast response when you need it",
                  "16+ years serving Connecticut – Established, trusted, and reliable",
                  "10+ years hands-on technician experience – Skilled professionals",
                  "Samsung & LG appliance specialists – Complex electronics expertise",
                  "Licensed, clean, and professional technicians – Respectful service",
                  "Fully equipped for on-the-spot diagnostics – First-visit repairs",
                  "We rarely cancel scheduled appointments – Dependable service",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl bg-gray-200">
              <Image
                src="/appliance-repair-2.jpg"
                alt="Appliance Repair Technician"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <span className="text-white font-bold text-lg bg-primary/90 px-4 py-2 rounded-lg">
                  Professional Appliance Repair
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Service Appliance Repair */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Full-Service Appliance Repair
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              We repair, service, and install all major household appliances
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Snowflake className="w-10 h-10 text-primary" />,
                title: "Refrigerator Repair",
                description:
                  "Cooling issues, ice makers, water dispensers, and temperature control problems.",
              },
              {
                icon: <Droplets className="w-10 h-10 text-primary" />,
                title: "Washer Repair",
                description:
                  "Not spinning, draining issues, leaks, and strange noises resolved quickly.",
              },
              {
                icon: <Wind className="w-10 h-10 text-primary" />,
                title: "Dryer Repair",
                description:
                  "No heat, not tumbling, excessive noise, and venting problems fixed.",
              },
              {
                icon: <Flame className="w-10 h-10 text-primary" />,
                title: "Oven & Stove Repair",
                description:
                  "Gas or electric, uneven heating, faulty igniters, and temperature calibration.",
              },
              {
                icon: <Droplets className="w-10 h-10 text-primary" />,
                title: "Dishwasher Repair",
                description:
                  "Not draining, poor cleaning, leaks, and control panel issues resolved.",
              },
              {
                icon: <Sparkles className="w-10 h-10 text-primary" />,
                title: "Microwave Repair",
                description:
                  "Not heating, touchpad issues, and turntable problems diagnosed quickly.",
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Samsung & LG Specialists - Featured Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            ⭐ Our Specialty
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Samsung & LG Appliance Repair Specialists
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto mb-6">
            Many companies avoid working on brands like Samsung and LG due to
            complex electronics and frequent control board issues.
          </p>
          <p className="text-xl font-bold mb-6">
            At My Handyman Inc, this is one of our biggest strengths.
          </p>
          <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8">
            Our technicians are university-trained electronic specialists,
            making advanced diagnostics and control board repair a core
            expertise.
          </p>
          <Link href="tel:+12034413471">
            <Button
              variant="secondary"
              className="gap-2 text-primary font-bold"
            >
              <PhoneCall className="size-5.5" />
              Call if others couldn't fix your appliance
            </Button>
          </Link>
        </div>
      </section>

      {/* Advanced Diagnostics */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Advanced Diagnostics & Control Board Repair
              </h2>
              <p className="mt-4 text-xl font-semibold text-primary">
                We don't guess—we diagnose.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Identify root causes quickly",
                  "Diagnose control board & electrical issues",
                  "Avoid unnecessary part replacements",
                  "Deliver long-term repair solutions",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-primary font-bold italic">
                This saves you time, money, and repeat breakdowns.
              </p>
            </div>
            <div className="order-1 md:order-2 bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
              <div className="text-6xl mb-4 flex-center text-primary">
                <MicroscopeIcon size={128} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                University-Trained Electronic Specialists
              </h3>
              <p className="text-gray-600">
                Our technicians have advanced training in complex electronics,
                making us uniquely qualified to handle control board failures
                and electrical diagnostics that other companies can't solve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Service Areas */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Serving Orange & Woodbridge, CT
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Fast response times throughout both communities. We know
              Connecticut homes and their appliance needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white rounded-2xl p-8 shadow-xl border border-primary/30 border-t-4 border-t-primary">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Orange, CT
              </h3>
              <p className="mt-3 text-gray-600">
                Fast response times throughout Orange Center, Turkey Hill, and
                all surrounding neighborhoods. Specializing in all major
                appliance brands and models.
              </p>
            </Card>
            <Card className="bg-white rounded-2xl p-8 shadow-xl border border-primary/30 border-t-4 border-t-primary">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Woodbridge, CT
              </h3>
              <p className="mt-3 text-gray-600">
                Proudly serving Woodbridge homes near Amity Road, Racebrook, and
                all local properties. Respectful service with attention to your
                home's needs.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Common Appliance Problems Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Common Signs You Need Appliance Repair
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Don't ignore these warning signs. Early intervention saves money
              and prevents breakdowns.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Volume2Icon,
                title: "Unusual Noises",
                description:
                  "Grinding, squealing, or banging sounds indicate mechanical issues that need attention.",
              },
              {
                icon: DropletIcon,
                title: "Water Leaks",
                description:
                  "Puddles around appliances can signal failed seals, hoses, or internal components.",
              },
              {
                icon: BellElectricIcon,
                title: "Not Working Properly",
                description:
                  "Inconsistent temperatures, poor cleaning, or longer cycles mean it's time for repair.",
              },
            ].map((sign, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-md transition-all duration-300"
              >
                <div className="text-5xl mb-4 text-center text-primary flex-center">
                  <sign.icon className="size-5.5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {sign.title}
                </h3>
                <p className="text-gray-600">{sign.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landlord & Property Manager Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4 text-center">🏢</div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Appliance Repair for Landlords & Property Managers
              </h3>
              <p className="text-gray-600 text-center mb-6">
                We work closely with landlords and property managers by:
              </p>
              <ul className="space-y-3">
                {[
                  "Providing fast tenant service",
                  "Offering maintenance guidance",
                  "Helping extend appliance lifespan",
                  "Reducing repeat repair issues",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4 text-center">💡</div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Appliance Installation & Buying Advice
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Not sure whether to repair or replace? We help you:
              </p>
              <ul className="space-y-3">
                {[
                  "Choose reliable appliances",
                  "Avoid wasting money on bad purchases",
                  "Professionally install new units",
                  "Make cost-effective decisions",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Answers to common questions about our appliance repair service
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "How fast can you get to Orange or Woodbridge?",
                a: "Same-day or next-day in most cases. We prioritize emergency repairs and schedule appointments quickly.",
              },
              {
                q: "Do you repair Samsung & LG appliances?",
                a: "Yes — we specialize in them. Our technicians are university-trained electronic specialists who handle complex control board issues.",
              },
              {
                q: "Do you service apartments and rentals?",
                a: "Yes, including multi-unit buildings throughout Orange and Woodbridge.",
              },
              {
                q: "Should I repair or replace my appliance?",
                a: "We give honest, cost-effective recommendations based on your appliance's age, condition, and repair cost.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  ❓ {faq.q}
                </h4>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/70 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Schedule Appliance Repair Today
          </h2>
          <p className="mt-4 text-lg text-white/90">
            If you need fast, professional appliance repair in Orange or
            Woodbridge, trust My Handyman Inc. Call or email us now for same-day
            service and free estimates!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="tel:+12034413471">
              <Button variant="outline" className="text-primary">
                <PhoneCall className="size-5.5" />
                (203) 441-3471
              </Button>
            </Link>
            <Link href="mailto:info@myhandymaninc.com">
              <Button variant="outline" className="text-primary">
                <Mail className="size-5.5" />
                info@myhandymaninc.com
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/90">
            Same-day and next-day appointments available | Free estimates
          </p>
        </div>
      </section>

      {/* Trust Badges */}
    </main>
  );
}
