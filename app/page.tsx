import HomeFooter from "@/components/HomeFooter";
import HomeNavbar from "@/components/HomeNavbar";
import QuoteForm from "@/components/QuoteForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  ClipboardIcon,
  MessageCircle,
  PhoneCall,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-150px)]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/hero_image.jpg"
            alt="Beautiful custom deck"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full">
            {/* Left side - Text content */}
            <div className="text-left space-y-6 text-white">
              <h1 className="text-4xl sm:text-3xl md:text-5xl lg:text-6xl font-bold md:leading-20  md:pt-0 pt-12">
                YOUR TRUSTED, LOCAL HANDYMAN & HOME IMPROVEMENT EXPERTS
              </h1>
              <p className="text-base sm:text-lg md:text-xl">
                Our top-rated pros in Connecticut are ready to tackle all your
                home projects – big or small – on time & on budget. Guaranteed.
              </p>
              <div className="flex md:flex-row hidden gap-6">
                <Button className="gap-x-3">
                  <MessageCircle className="size-5" />
                  Click to Text Us
                </Button>
                <Button className="gap-x-3">
                  <PhoneCall className="size-5" />
                  Click to Call Us
                </Button>
                <Button className="gap-x-3">
                  <ClipboardIcon className="size-5" />
                  Get an Estimate
                </Button>
              </div>
            </div>

            {/* Right side - Quote Form */}
            <div>
              <QuoteForm
                title="Get a Quote"
                subtitle="Tell us about your project"
                buttonText="Get Quote"
                compact={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col justify-center items-center text-center">
            <h2 className="text-4xl md:text-5xl font-bold">
              Solutions For All Your Home Projects
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Quality craftsmanship, premium materials, and expert service for
              every budget
            </p>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-6 mt-12 md:items-stretch items-center justify-center">
            {[
              {
                icon: "/icons/1.png",
                title: "Maintenace",
                description:
                  "One-time and recurring maintenance solutions make it easy to keep your home in tip-top shape. From air filter replacement to winterization and everything in between, get peace of mind knowing all your home maintenance is handled by pros.",
              },
              {
                icon: "/icons/2.png",
                title: "Small Projects & Repairs",
                description:
                  "On-call handyman services to take care of all your small projects and home repairs – fast. Drywall, doors, ceiling fans, light fixtures, and so much more. Our skilled professionals provide dependable, hassle-free solutions for your home.",
              },
              {
                icon: "/icons/3.png",
                title: "Updates & Remodels",
                description:
                  "Professional contractors ready to update or remodel any room in your home. From kitchens, bathrooms and basements to decks, driveways, and fences our top-rated pros will add value to your home improvement project without adding stress to your life.",
              },
            ].map((service) => (
              <Card
                key={service.title}
                className="w-full max-w-sm flex flex-col h-full"
              >
                <CardHeader>
                  <div className="flex justify-center">
                    <Image
                      src={service.icon}
                      alt={`${service.title} Icon`}
                      width={156}
                      height={156}
                    />
                  </div>
                </CardHeader>
                <CardContent className="mt-4 text-base sm:text-lg md:text-xl flex flex-col items-center gap-6 flex-grow">
                  <h3 className="font-bold text-3xl md:text-4xl text-center">
                    {service.title}
                  </h3>
                  <p className="text-center text-gray-600">
                    {service.description}
                  </p>
                  <Button className="w-full mt-auto">Learn More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Gallery Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">Recent Projects</h2>
            <p className="mt-4 text-gray-600 text-lg">
              See our quality work in action
            </p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center items-stretch">
            {[
              {
                title: "Porch Railing Installation",
                src: "/home/1.jpg",
              },
              {
                title: "Custom Built Mailbox Onsite and Installation",
                src: "/home/2.jpg",
              },
              {
                title: "Custom Basement Hand Railing Installation",
                src: "/home/3.jpeg",
              },
            ].map((project) => (
              <Card
                key={project.title}
                className="max-w-sm w-full cursor-pointer p-6 hover:shadow-xl transition-shadow"
              >
                <div className="relative h-56 w-full overflow-hidden rounded-lg">
                  <Image
                    src={project.src}
                    alt={project.title}
                    fill
                    className="object-cover hover:scale-105 transition duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-center text-gray-700">
                    {project.title}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Promise Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold">
            Our Quality Promise to You
          </h2>
          <p className="my-6 text-base sm:text-lg md:text-xl text-gray-600">
            At My Handy Man, we treat your home like it’s our own. We promise
            and guarantee quality craftsmanship and excellent customer service,
            all backed by an industry-leading labor guarantee. Home improvements
            just got easier!
          </p>
          <Button size="lg">Our Promise</Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
            <p className="my-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-600">
              Our step-by-step process makes it easy to get your home projects
              started. From your first call to project completion, we're with
              you every step of the way.
            </p>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-6 mt-6 items-stretch justify-center">
            {[
              {
                title: "Step 1: Contact Us",
                description:
                  "Call or email us. We have team members waiting for your call!",
              },
              {
                title: "Step 2: Discuss Your Project",
                description:
                  "Let our specialist know all of the details of your project.",
              },
              {
                title: "Step 3: Schedule",
                description:
                  "Schedule a time for our specialist to start making your project a reality.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="w-full max-w-lg p-6 flex flex-col h-full"
              >
                <CardHeader className="flex-grow">
                  <div className="flex justify-center">
                    <Image
                      src={`/icons/${i + 4}.png`}
                      width={156}
                      height={156}
                      alt={item.title}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-center mt-4">
                    {item.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-base sm:text-lg text-center text-gray-600">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Customers Love Us Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold">
              Why Our Customers Love Us
            </h2>
            <p className="my-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-600">
              We stand behind every job with guarantees that give you peace of
              mind.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
            {[
              "Fast, easy scheduling and estimates",
              "100% satisfaction guarantee",
              "Upfront pricing with no surprises",
              "MyHandyMan Quality Guarantee",
              "Locally-owned and operated",
              "Licensed, bonded, and insured",
              "Background checks on all craftsmen",
              "Clean job site promise",
            ].map((benefit) => (
              <div
                key={benefit}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white transition-colors"
              >
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
