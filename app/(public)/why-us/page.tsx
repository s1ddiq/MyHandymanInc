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
  Shield,
  Star,
  Users,
  ThumbsUp,
  Clock,
  Award,
  HeartHandshake,
  BadgeCheck,
  Calendar,
  Wrench,
  Sparkles,
  Trophy,
  HandshakeIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Why Choose My Handyman Inc | Orange & Woodbridge CT",
  description:
    "Discover why homeowners in Orange and Woodbridge, CT trust My Handyman Inc. Family-owned, 16+ years experience, licensed & insured, and backed by a 1-year guarantee.",
  keywords:
    "why choose My Handyman Inc, best handyman CT, trusted handyman Orange CT, handyman reviews Woodbridge CT, My Handyman Inc Connecticut",
  authors: [{ name: "My Handyman Inc" }],
  openGraph: {
    title: "Why Choose My Handyman Inc",
    description:
      "Family-owned, 16+ years experience, licensed & insured, and backed by a 1-year guarantee.",
    type: "website",
  },
};

export default function WhyUsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <Image
          src="/why-us-hero.jpg"
          alt="My Handyman Inc Team"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left side - Text content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6 text-white">
                <Star className="w-4 h-4" />
                Why Homeowners Choose Us
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Why Connecticut Trusts My Handyman Inc
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">
                Family-owned, 16+ years of experience, and a commitment to doing
                the job right the first time. Here's why we're different.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
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
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  >
                    <ClipboardIcon className="size-5" />
                    Free Estimate
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - Quote Form */}
            <div className="lg:pl-4">
              <QuoteForm
                title="Get a Quote"
                subtitle="Tell us about your project and we'll get back to you within 24 hours."
                buttonText="Get Quote"
                compact={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Our Quality Promise to You
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              At My Handyman Inc, we treat your home like it's our own. We
              promise and guarantee quality craftsmanship and excellent customer
              service.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <HeartHandshake className="w-12 h-12 text-primary" />,
                title: "Honest & Transparent",
                description:
                  "No hidden fees, no surprise charges. You'll know exactly what to expect before we start any work.",
              },
              {
                icon: <BadgeCheck className="w-12 h-12 text-primary" />,
                title: "1-Year Guarantee",
                description:
                  "All of our work is backed by an industry-leading 1-year labor guarantee. Your peace of mind matters.",
              },
              {
                icon: <Sparkles className="w-12 h-12 text-primary" />,
                title: "Clean Job Site",
                description:
                  "We treat your home with respect. Every job site is cleaned thoroughly before we leave.",
              },
            ].map((promise, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4 flex justify-center">{promise.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {promise.title}
                </h3>
                <p className="text-gray-600">{promise.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Reasons Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                6 Reasons Homeowners Love Us
              </h2>
              <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
                We've built our reputation on trust, quality, and doing the
                right thing for our neighbors in Connecticut.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Locally owned & operated since 2012 – We're your neighbors",
                  "16+ years of combined experience – Knowledge you can count on",
                  "Licensed, bonded & insured – Full compliance with CT requirements",
                  "Free, no-obligation estimates – Upfront pricing with no surprises",
                  "Same-day service available – Fast response when you need it",
                  "Background-checked technicians – Trustworthy professionals in your home",
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
                src="/trusted-handyman.jpg"
                alt="Trusted Handyman"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <span className="text-white font-bold text-lg bg-primary/90 px-4 py-2 rounded-lg">
                  Your Trusted Local Pros
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Calendar className="w-10 h-10 text-primary" />,
                number: "2012",
                label: "Year Established",
              },
              {
                icon: <Users className="w-10 h-10 text-primary" />,
                number: "2,500+",
                label: "Happy Customers",
              },
              {
                icon: <Star className="w-10 h-10 text-primary" />,
                number: "5-Star",
                label: "Rated on Google",
              },
              {
                icon: <Clock className="w-10 h-10 text-primary" />,
                number: "Same-Day",
                label: "Service Available",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.number}
                </div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              What Sets Us Apart
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              We don't just fix things – we build lasting relationships with our
              customers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Wrench className="w-8 h-8 text-primary" />,
                title: "University-Trained Electronic Specialists",
                description:
                  "Our technicians have advanced training in complex electronics, making us uniquely qualified for appliance repair and control board diagnostics.",
              },
              {
                icon: <Trophy className="w-8 h-8 text-primary" />,
                title: "Samsung & LG Specialists",
                description:
                  "Many companies avoid complex electronics. We specialize in them. This is one of our biggest strengths.",
              },
              {
                icon: <HandshakeIcon className="w-8 h-8 text-primary" />,
                title: "We Rarely Cancel Appointments",
                description:
                  "When we book your appointment, we show up. Dependability is at the core of our business.",
              },
              {
                icon: <Award className="w-8 h-8 text-primary" />,
                title: "Honest Repair vs. Replace Advice",
                description:
                  "We'll tell you if repair makes sense or if replacement is the better investment. No upsells, just honest guidance.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 flex gap-4 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="shrink-0">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Don't just take our word for it. Here's what your neighbors in
              Orange and Woodbridge have to say.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                location: "Orange, CT",
                text: "My Handyman Inc saved me when my refrigerator died on a Sunday. They came out the same day, diagnosed the issue quickly, and had it running again in an hour. So grateful for their fast service!",
                rating: 5,
              },
              {
                name: "David T.",
                location: "Woodbridge, CT",
                text: "I've used them for multiple projects – from fixing a leaky faucet to installing new light fixtures. Always professional, on time, and fairly priced. Couldn't ask for a better handyman service.",
                rating: 5,
              },
              {
                name: "Lisa R.",
                location: "Orange, CT",
                text: "They diagnosed a complex electrical issue that two other companies couldn't figure out. Their electronic specialists really know their stuff. Highly recommend!",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <Card
                key={idx}
                className="p-6 bg-gray-50 border-none shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.location}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Our Simple Process
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Getting your home projects done has never been easier.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Reach Out",
                description:
                  "Call, text, or email us. We'll answer your questions and schedule a convenient time.",
              },
              {
                step: "02",
                title: "Get a Free Estimate",
                description:
                  "We'll assess your project and provide upfront, transparent pricing with no obligation.",
              },
              {
                step: "03",
                title: "We Get to Work",
                description:
                  "Our skilled craftsmen complete the job on time, on budget, and with respect for your home.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 text-center shadow-md relative"
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Service Areas */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Proudly Serving Our Community
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              We're not a big corporate chain – we're your neighbors. We know
              Connecticut homes and their unique needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-50 rounded-2xl p-8 shadow-md border-t-4 border-t-primary">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Orange, CT
              </h3>
              <p className="mt-3 text-gray-600">
                We've been serving Orange homeowners for over a decade. From
                Orange Center to Turkey Hill, we know the community and its
                homes.
              </p>
            </Card>
            <Card className="bg-gray-50 rounded-2xl p-8 shadow-md border-t-4 border-t-primary">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Woodbridge, CT
              </h3>
              <p className="mt-3 text-gray-600">
                Proud to serve Woodbridge's historic homes and new construction
                alike. Respectful service with attention to your home's unique
                character.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/70 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Experience the My Handyman Inc Difference?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Join hundreds of satisfied homeowners in Orange and Woodbridge who
            trust us with their homes. Call or email us today for a free
            estimate.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="tel:+12034413471">
              <Button variant="outline" className="text-primary">
                <PhoneCall className="size-5.5" />
                (203) 441-3471
              </Button>
            </Link>
            <Link href="mailto:myhandymaninc1@gmail.com">
              <Button variant="outline" className="text-primary">
                <Mail className="size-5.5" />
                myhandymaninc1@gmail.com
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/90">
            Free estimates | 1-year guarantee | Family-owned since 2012
          </p>
        </div>
      </section>
    </main>
  );
}
