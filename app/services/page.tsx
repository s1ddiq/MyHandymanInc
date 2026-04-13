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
  Hammer,
  Paintbrush,
  Droplets,
  Zap,
  Ruler,
  Home,
  Trees,
  Brush,
  Car,
  Lock,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Handyman Services Orange & Woodbridge CT | My Handyman Inc",
  description:
    "Professional handyman and home improvement services in Orange and Woodbridge, CT. Carpentry, plumbing, electrical, painting, and more. Family-owned since 2012. Call (203) 441-3471 today!",
  keywords:
    "handyman Orange CT, handyman Woodbridge CT, home repair, home improvement, carpentry, plumbing repair, electrical services, painting services, My Handyman Inc Connecticut",
  authors: [{ name: "My Handyman Inc" }],
  openGraph: {
    title: "Handyman Services Orange & Woodbridge CT",
    description:
      "Professional handyman and home improvement services. Free estimates. Family-owned since 2012.",
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <Image
          src="/services-hero.jpg"
          alt="Handyman Services"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6 text-white">
              <MapPin className="w-4 h-4" />
              Serving Orange & Woodbridge, CT Since 2012
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Professional Handyman & Home Improvement Services
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">
              From small repairs to complete remodels, we tackle all your home
              projects with quality craftsmanship and reliable service.
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

      {/* Transform Your Space Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Transform Your Space with Expert Handyman Services
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              At My Handyman Inc, we believe home maintenance should be done
              right at every level. We deliver honest, transparent customer
              service and skilled handyman services priced right.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Wrench className="w-10 h-10 text-primary" />,
                title: "Maintenance Solutions",
                description:
                  "One-time and recurring maintenance solutions make it easy to keep your home in tip-top shape. From air filter replacement to winterization and everything in between.",
              },
              {
                icon: <Hammer className="w-10 h-10 text-primary" />,
                title: "Small Projects & Repairs",
                description:
                  "On-call handyman services for all your small projects and home repairs – fast. Drywall, doors, ceiling fans, light fixtures, and so much more.",
              },
              {
                icon: <Home className="w-10 h-10 text-primary" />,
                title: "Updates & Remodels",
                description:
                  "Professional contractors ready to update or remodel any room in your home. From kitchens and bathrooms to decks and fences.",
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="mb-4 flex justify-center">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
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
                Why Connecticut Trusts My Handyman Inc
              </h2>
              <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
                We're your neighbors, committed to honest work and lasting
                relationships.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Locally owned & operated – We're your neighbors in CT",
                  "Licensed, bonded & insured – Fully compliant with CT requirements",
                  "Free, no-obligation estimates – Upfront pricing with no surprises",
                  "Same-day service available – Fast response when you need it",
                  "1-year guarantee on all work – Peace of mind guaranteed",
                  "Background checks on all craftsmen – Trustworthy professionals",
                  "Clean job site promise – We respect your home",
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
                src="/boston-architecture.jpg"
                alt="Handyman Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <span className="text-white font-bold text-lg bg-primary/90 px-4 py-2 rounded-lg">
                  Your Trusted Local Handyman
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Services Grid Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              We Do It All – No Job Too Big or Small
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Our professional handyman technicians handle an extensive variety
              of home repair and remodeling services
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Hammer className="w-8 h-8 text-primary" />,
                title: "Carpentry & Cabinets",
                description:
                  "Custom cabinets, shelving, trim work, and wood repairs.",
              },
              {
                icon: <Paintbrush className="w-8 h-8 text-primary" />,
                title: "Painting",
                description:
                  "Interior and exterior painting, staining, and touch-ups.",
              },
              {
                icon: <Droplets className="w-8 h-8 text-primary" />,
                title: "Plumbing",
                description:
                  "Faucet repair, toilet installation, pipe repairs, and more.",
              },
              {
                icon: <Zap className="w-8 h-8 text-primary" />,
                title: "Electrical",
                description:
                  "Light fixtures, outlet repair, ceiling fans, and switches.",
              },
              {
                icon: <Ruler className="w-8 h-8 text-primary" />,
                title: "Flooring",
                description:
                  "Hardwood, tile, laminate, and vinyl plank installation.",
              },
              {
                icon: <Home className="w-8 h-8 text-primary" />,
                title: "Drywall",
                description:
                  "Repairs, patching, texture matching, and hanging.",
              },
              {
                icon: <Trees className="w-8 h-8 text-primary" />,
                title: "Decks & Fences",
                description: "Repair, staining, and new construction.",
              },
              {
                icon: <Brush className="w-8 h-8 text-primary" />,
                title: "Gutters & Siding",
                description: "Cleaning, repair, and replacement services.",
              },
              {
                icon: <Car className="w-8 h-8 text-primary" />,
                title: "Masonry",
                description:
                  "Brick, stone, and concrete repair and installation.",
              },
              {
                icon: <Lock className="w-8 h-8 text-primary" />,
                title: "Windows & Doors",
                description: "Installation, repair, and weatherstripping.",
              },
              {
                icon: <LayoutDashboard className="w-8 h-8 text-primary" />,
                title: "Remodeling",
                description: "Kitchen, bathroom, basement, and room additions.",
              },
              {
                icon: <Sparkles className="w-8 h-8 text-primary" />,
                title: "Aging in Place",
                description:
                  "Grab bars, walk-in showers, and accessibility modifications.",
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-all duration-300 flex items-start gap-4"
              >
                <div className="shrink-0">{service.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Our step-by-step process makes it easy to get your home projects
              started
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Contact Us",
                description:
                  "Call, text, or email us. Our team is ready to discuss your project needs.",
              },
              {
                step: "02",
                title: "Discuss Your Project",
                description:
                  "Share all the details of your project with our specialist for accurate planning.",
              },
              {
                step: "03",
                title: "Schedule & Execute",
                description:
                  "Schedule a convenient time for our craftsmen to make your project a reality.",
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

      {/* Commercial Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl bg-gray-200 order-2 md:order-1">
              <Image
                src="/commercial-handyman.jpg"
                alt="Commercial Handyman Services"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 text-sm font-medium mb-4 text-primary">
                For Business Owners
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Commercial Handyman Services
              </h2>
              <p className="mt-4 text-base sm:text-lg text-gray-600">
                My Handyman Inc can handle a variety of commercial remodeling,
                maintenance, and repair services for business owners who need
                help keeping their office or property in top condition.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  "Office repairs and maintenance",
                  "Retail store improvements",
                  "Property management services",
                  "Tenant turnover repairs",
                  "Emergency repair services",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
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
              Fast response times throughout both communities. We know
              Connecticut homes and their unique needs.
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
                all surrounding neighborhoods. Specializing in all home repair
                and improvement services for Orange homeowners.
              </p>
            </Card>
            <Card className="bg-white rounded-2xl p-8 shadow-xl border border-primary/30 border-t-4 border-t-primary">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Woodbridge, CT
              </h3>
              <p className="mt-3 text-gray-600">
                Proudly serving Woodbridge homes near Amity Road, Racebrook, and
                all local historic properties. Respectful service with attention
                to your home's character.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Maximize Your Home's Value Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Maximize Your Home's Value
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              Whether you want to remodel your kitchen, upgrade your bathroom,
              or fix a broken step on your deck, My Handyman Inc has you
              covered. We're happy to assist you with home repair and handyman
              services of nearly any scope, big or small, and we'll finish on
              time and on budget.
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              Our handyman technicians take pride in providing quality
              workmanship, but we put just as much emphasis on the customer
              service you receive. From your very first interaction until long
              after the job is complete, you will be treated with respect and
              courtesy.
            </p>
            <div className="bg-gray-50 rounded-2xl p-8 mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Additional Services We Provide
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Furniture assembly",
                  "TV mounting",
                  "Smart home device installation",
                  "Caulking and sealing",
                  "Pressure washing",
                  "Weatherstripping and insulation",
                  "Tile and grout repair",
                  "Crown molding installation",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/70 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Tackle Your To-Do List?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Let us help you tackle your home projects once and for all. Call or
            email us now for a free estimate and same-day service options!
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
            Free estimates | 1-year guarantee on all work | Family-owned since
            2012
          </p>
        </div>
      </section>
    </main>
  );
}
