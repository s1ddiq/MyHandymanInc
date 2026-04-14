import QuoteForm from "@/components/QuoteForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  ClipboardIcon,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Search,
  Shield,
  Truck,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Roof Leak Repair Orange & Woodbridge CT | My Handyman Inc",
  description:
    "Fast & reliable roof leak repair in Orange and Woodbridge, CT. Free estimates, 24/7 emergency service, family-owned. Call (203) 441-3471 today!",
  keywords:
    "roof leak repair Orange CT, roof repair Woodbridge CT, emergency roof repair, My Handyman Inc Connecticut",
  authors: [{ name: "My Handyman Inc" }],
  openGraph: {
    title: "Roof Leak Repair Orange & Woodbridge CT",
    description:
      "Professional roof leak repair services. Same-day service. Free estimates. Family-owned since 2012.",
    type: "website",
  },
};

export default function RoofRepairPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <Image
          src="/roof-repair-hero.jpg"
          alt="Roof Repair"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Text content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6 text-white">
                <MapPin className="w-4 h-4" />
                Serving Orange & Woodbridge, CT Since 2012
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Fast & Reliable Roof Leak Repair
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/90">
                Protecting homes in Orange and Woodbridge, Connecticut from
                water damage. Same-day service. Free estimates. Family-owned.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="tel:+12034413471">
                  <Button className="gap-2">
                    <PhoneCall className="size-5" />
                    Call (203) 441-3471
                  </Button>
                </Link>
                <Link href="sms:+12034413471">
                  <Button
                    variant="outline"
                    className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  >
                    <MessageCircle className="size-5" />
                    Text Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - Quote Form */}
            <div className="lg:pl-8">
              <QuoteForm
                title="Get a Quote"
                subtitle="Tell us about your roof issue and we'll get back to you within 24 hours."
                buttonText="Submit"
                compact={false}
                service="Roof Repair"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Expert Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Expert Roof Leak Repair Services
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              We provide professional and affordable roof leak repair for
              homeowners in Orange, Woodbridge, and throughout Fairfield and New
              Haven Counties, with fast response and reliable service.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-10 h-10 text-primary" />,
                title: "Comprehensive Leak Detection",
                description:
                  "Advanced moisture mapping and thermal imaging to locate hidden leaks without unnecessary demolition.",
              },
              {
                icon: <Truck className="w-10 h-10 text-primary" />,
                title: "Emergency Tarping & Repairs",
                description:
                  "24/7 emergency response to stop active leaks and prevent further damage to your home's interior.",
              },
              {
                icon: <Wrench className="w-10 h-10 text-primary" />,
                title: "Full Roof Restoration",
                description:
                  "From minor shingle replacement to complete roof repairs, we restore your roof's integrity and extend its lifespan.",
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Why Connecticut Trusts Us
              </h2>
              <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
                We're your neighbors in connecticut, committed to honest work
                and lasting relationships.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Locally Owned & Operated – We're your neighbors",
                  "Licensed & Insured – Fully compliant with CT requirements",
                  "Free, No-Obligation Estimates – Upfront pricing",
                  "Same-Day Service Available – Fast response",
                  "5-Star Rated – Dozens of satisfied customers",
                  "Warranty on All Work – Peace of mind guaranteed",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl bg-gray-200"
              title="Roof Repair in Connecticut"
            >
              {/* <Image
                src="/ct-flag.jpg"
                alt="Connecticut Flag"
                width={100}
                height={100}
                className="object-cover absolute right-0 cursor-pointer z-9"
                title="Connecticut Flag"
              /> */}
              <div className="absolute inset-0 bg-[url(/roof-repair-2.jpg)] bg-contain flex items-end p-6">
                {/* <span className="text-white font-bold text-base bg-primary px-4 py-2 backdrop-blur-sm">
                  Roof Repair in CT
                </span> */}
              </div>
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
              We know Connecticut weather. From summer storms to winter ice
              dams, we've got your roof covered.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white rounded-2xl p-8 shadow-2xl border border-primary/30 border-t-4 border-t-primary">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Orange, CT
              </h3>
              <p className="mt-3 text-muted-foreground">
                Fast response times throughout Orange Center, Turkey Hill, and
                all surrounding neighborhoods. Specializing in asphalt shingle,
                flat roof, and cedar shake repairs.
              </p>
            </Card>
            <Card className="bg-white rounded-2xl p-8 shadow-2xl border border-primary/30 border-t-4 border-t-primary">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Woodbridge, CT
              </h3>
              <p className="mt-3 text-muted-foreground">
                Proudly serving Woodbridge homes near Amity Road, Racebrook, and
                all local historic properties. Respectful service with attention
                to your home's character.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Warning Signs Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold leading-20">
              Common Signs You Need Roof Repair
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Don't ignore these warning signs. Early intervention saves money
              and protects your home.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "💧",
                title: "Water Stains on Ceilings",
                description:
                  "Yellow or brown spots indicate active leaks that need immediate attention.",
              },
              {
                icon: "🍃",
                title: "Missing or Damaged Shingles",
                description:
                  "Wind, hail, and age can compromise shingles, exposing your roof deck to moisture.",
              },
              {
                icon: "🏠",
                title: "Granules in Gutters",
                description:
                  "Excessive shingle granules mean your roof is deteriorating and may need repair or replacement.",
              },
            ].map((sign, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-md transition-all duration-300"
              >
                <div className="text-4xl mb-4">{sign.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {sign.title}
                </h3>
                <p className="text-muted-foreground">{sign.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/70 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Active Leak? Need Immediate Help?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            We offer 24/7 emergency roof leak repair in Orange and Woodbridge.
            Call or email us now for a free estimate.
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
        </div>
      </section>

      {/* Trust Badges */}

      {/* Footer */}
    </main>
  );
}
