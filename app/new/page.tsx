import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Fence,
  House,
  MapPin,
  Newspaper,
  ShieldCheck,
  Star,
  Users,
  WashingMachine,
  Wrench,
} from "lucide-react";
import QuoteForm from "@/components/QuoteForm";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";

// Add the confirmed registration number to your Next.js environment.
const hicNumber = process.env.NEXT_PUBLIC_CT_HIC_NUMBER?.trim();

type Service = {
  name: string;
  detail: string;
  href: string;
  icon: keyof typeof serviceIcons;
};

const services: Service[] = [
  {
    name: "General Handyman",
    detail: "Repairs & maintenance",
    href: "/services/handyman",
    icon: "tools",
  },
  {
    name: "Home Renovations",
    detail: "Kitchens, baths & more",
    href: "/services/renovations",
    icon: "wrench",
  },
  {
    name: "Appliance Installation",
    detail: "Dishwashers, ranges & more",
    href: "/services/appliance-installation",
    icon: "appliance",
  },
  {
    name: "Decks & Outdoor Projects",
    detail: "Build, repair & upgrade",
    href: "/services/decks",
    icon: "fence",
  },
  {
    name: "Home Upgrades",
    detail: "Improvements that add value",
    href: "/services/home-upgrades",
    icon: "house",
  },
];

const towns = [
  ["Stamford", "stamford"],
  ["Greenwich", "greenwich"],
  ["Fairfield", "fairfield"],
  ["Norwalk", "norwalk"],
  ["New Haven", "new-haven"],
  ["Hartford", "hartford"],
  ["Bridgeport", "bridgeport"],
].map(([name, slug]) => ({ name, href: `/connecticut/${slug}` }));

type Guide = {
  category: string;
  title: string;
  href: string;
  image: string;
  alt: string;
};

// Starter topics. Add article pages at these URLs when the guides are ready.
const guides: [Guide & { description: string }, ...Guide[]] = [
  {
    category: "Construction",
    title: "How to Track New Housing Projects in Fairfield County",
    description:
      "Where to find public notices, planning meetings, and updates on proposed developments in your town.",
    href: "/ct-property-news/fairfield-county-housing-projects",
    image: "construction.webp",
    alt: "Timber framing of a house under construction",
  },
  {
    category: "Real Estate",
    title: "Where to Find Connecticut Home Sales Data",
    href: "/ct-property-news/connecticut-home-sales",
    image: "home.webp",
    alt: "Traditional house with a landscaped front yard",
  },
  {
    category: "Home Improvement",
    title: "What Goes Into a Kitchen Renovation Budget?",
    href: "/home-improvement/kitchen-renovation-costs",
    image: "kitchen.webp",
    alt: "Renovated kitchen with an island and pendant lights",
  },
  {
    category: "Local News",
    title: "How to Follow Development Proposals in Stamford",
    href: "/ct-property-news/stamford-development",
    image: "town.webp",
    alt: "New England town green and a white steeple",
  },
];

export const metadata: Metadata = {
  title: "Connecticut Home Improvement & Property News | MyHandymanInc.",
  description:
    "Find Connecticut handyman services, renovation guidance, and local property and construction resources. Request a free project estimate.",
};

const serviceIcons = {
  tools: Wrench,
  wrench: Wrench,
  appliance: WashingMachine,
  fence: Fence,
  house: House,
};

const highlights = [
  {
    icon: Wrench,
    title: "Experienced & Reliable",
    detail: "Home improvement pros",
  },
  {
    icon: ShieldCheck,
    title: hicNumber ? "CT Registered Contractor" : "Connecticut Home Services",
    detail: hicNumber
      ? `HIC Reg. # ${hicNumber}`
      : "Repairs, installations & renovations",
  },
  {
    icon: Users,
    title: "Local & Trusted",
    detail: "Serving Connecticut communities",
  },
  {
    icon: Star,
    title: "Home & Property Resources",
    detail: "Guides for local homeowners",
  },
];

const pageWidth =
  "mx-auto w-[calc(100%-1.65rem)] max-w-[1320px] min-[491px]:w-[calc(100%-2.4rem)] min-[1031px]:w-[calc(100%-4.5rem)]";
const heading =
  "text-[clamp(1.45rem,2.2vw,1.9rem)] font-bold leading-tight tracking-tight";
const heroButton =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white px-3 py-2 text-center text-sm font-bold text-white transition-colors sm:px-4 sm:text-base";
const guideLabel = "mt-1.5 flex items-center gap-1 text-xs text-[#465564]";
const serviceCard =
  "flex h-full min-h-[118px] items-center justify-center rounded-[10px] border px-2 py-2.5 text-center leading-tight shadow-sm";
const townLink =
  "flex h-full items-center justify-center gap-1 rounded-md border bg-white px-1 py-2 text-center text-xs font-bold leading-tight hover:border-[#2d7619] hover:bg-[#eef6ee]";

type GuideImageProps = {
  guide: Pick<Guide, "image" | "alt">;
  featured?: boolean;
};

function GuideImage({ guide, featured = false }: GuideImageProps) {
  return (
    <Image
      className={
        featured
          ? "block aspect-[2.72] h-auto w-full object-cover"
          : "block aspect-[1.46] h-auto w-full rounded-[7px] object-cover"
      }
      src={`/${guide.image}`}
      alt={guide.alt}
      width={featured ? 450 : 124}
      height={featured ? 165 : 85}
    />
  );
}

export default function Home() {
  const [featured, ...latest] = guides;

  return (
    <>
      <HomeNavbar />
      <main className="bg-white text-base leading-normal text-[#102235] [color-scheme:light] [font-family:Arial,Helvetica,sans-serif] [&_:is(a,button,input,select,textarea):focus-visible]:outline [&_:is(a,button,input,select,textarea):focus-visible]:outline-2 [&_:is(a,button,input,select,textarea):focus-visible]:outline-offset-[3px] [&_:is(a,button,input,select,textarea):focus-visible]:outline-[#318b22]">
        <section
          className="relative isolate overflow-hidden bg-[#16322c] text-white"
          aria-labelledby="ct-hero-title"
        >
          <Image
            className="-z-[2] object-cover object-[center_53%]"
            src="/hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 -z-[1] bg-[linear-gradient(90deg,#061a18e8,#09201b88)] min-[761px]:bg-[linear-gradient(90deg,#061916e3,#09201bb0_37%,#0a1e1921_75%,transparent)]" />
          <div
            className={`${pageWidth} pt-[1.8rem] pb-[1.6rem] min-[491px]:pt-[clamp(2.25rem,3.6vw,3.7rem)]`}
          >
            <p className="text-[.93rem] font-bold tracking-wide uppercase">
              Connecticut Homeowners’ Resource
            </p>
            <h1
              id="ct-hero-title"
              className="mt-2.5 mb-3 max-w-[20.5em] text-[2.04rem] font-bold leading-[1.12] tracking-tight min-[491px]:text-[clamp(2.2rem,3.15vw,3.5rem)]"
            >
              Home Improvement, Construction &amp; Property News for Connecticut
            </h1>
            <p className="max-w-[550px] text-[clamp(1rem,1.45vw,1.2rem)]">
              Expert home services, renovation guides, real estate updates, and
              local construction resources in one place.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 min-[491px]:gap-3.5">
              <Link
                className={`${heroButton} bg-[#2d7619] hover:bg-[#205912]`}
                href="#home-services"
              >
                Our Home Services <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                className={`${heroButton} bg-[#102b2c64] hover:bg-[#102b2cb8]`}
                href="#property-news"
              >
                Latest CT Property News
              </Link>
            </div>
          </div>
          <ul
            className={`${pageWidth} my-0 grid list-none grid-cols-2 gap-y-3.5 bg-[#102a24e8] px-0 py-3.5 min-[761px]:grid-cols-4`}
          >
            {highlights.map(({ icon: Icon, title, detail }) => (
              <li
                key={title}
                className="flex items-center gap-2 px-2 text-[.72rem] leading-tight even:border-l even:border-white/55 min-[491px]:gap-3 min-[491px]:px-3 min-[491px]:text-[.8rem] min-[761px]:justify-center min-[761px]:[&+li]:border-l min-[761px]:[&+li]:border-white/55"
              >
                <Icon
                  className="w-[21px] shrink-0 min-[491px]:w-[30px]"
                  size={30}
                  aria-hidden="true"
                />
                <span>
                  <strong>{title}</strong>
                  <br />
                  {detail}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className={`${pageWidth} grid gap-4 py-7 min-[761px]:grid-cols-[minmax(0,1fr)_minmax(220px,.42fr)] min-[1031px]:grid-cols-[minmax(0,1fr)_minmax(250px,.32fr)] min-[1101px]:gap-6`}
          aria-labelledby="property-news"
        >
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <h2
                id="property-news"
                className={`${heading} scroll-mt-[5.5rem]`}
              >
                Latest Connecticut Property &amp; Home News
              </h2>
              <Link
                className="inline-flex items-center gap-1.5 text-[.8rem] font-bold text-[#174b78] hover:underline"
                href="/ct-property-news"
              >
                View All CT News <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid items-start gap-4 min-[491px]:grid-cols-[1.25fr_1fr] min-[1101px]:gap-6">
              <article className="overflow-hidden rounded-[9px] border border-[#d9e0e4] bg-[#f7f9f9] shadow-sm">
                <Link href={featured.href} className="group block">
                  <GuideImage guide={featured} featured />
                  <div className="relative px-[1.15rem] pt-[1.05rem] pb-[.85rem]">
                    <span className="absolute bottom-full left-4 translate-y-[45%] rounded bg-[#17578b] px-2 py-1 text-[.67rem] font-bold uppercase text-white">
                      {featured.category}
                    </span>
                    <h3 className="text-[clamp(1.18rem,1.65vw,1.52rem)] font-bold leading-tight tracking-tight group-hover:text-[#205912] group-hover:underline">
                      {featured.title}
                    </h3>
                    <p className="my-2 text-[.92rem] leading-snug text-[#465564]">
                      {featured.description}
                    </p>
                    <span className={guideLabel}>
                      <Newspaper size={15} aria-hidden="true" /> Guide topic
                    </span>
                  </div>
                </Link>
              </article>
              <ul className="m-0 list-none p-0 [&>li+li]:mt-2.5 [&>li+li]:border-t [&>li+li]:border-[#d9e0e4] [&>li+li]:pt-2.5">
                {latest.map((guide) => (
                  <li key={guide.href}>
                    <article>
                      <Link
                        href={guide.href}
                        className="group grid grid-cols-[95px_minmax(0,1fr)] items-center gap-3 min-[491px]:grid-cols-[65px_minmax(0,1fr)] min-[491px]:gap-2 min-[1031px]:grid-cols-[minmax(85px,.6fr)_minmax(0,1fr)] min-[1031px]:gap-3.5"
                      >
                        <GuideImage guide={guide} />
                        <div>
                          <p className="mb-1 text-[.69rem] font-extrabold uppercase text-[#165483]">
                            {guide.category}
                          </p>
                          <h3 className="text-[.92rem] font-bold leading-tight tracking-tight group-hover:text-[#205912] group-hover:underline">
                            {guide.title}
                          </h3>
                          <span className={guideLabel}>
                            <Newspaper size={14} aria-hidden="true" /> Guide
                            topic
                          </span>
                        </div>
                      </Link>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside
            id="estimate"
            className="scroll-mt-[5.5rem] self-start rounded-[9px] bg-[#e9eff2] p-[1.15rem]"
            aria-labelledby="ct-estimate-heading"
          >
            <h2 id="ct-estimate-heading" className={heading}>
              Get a Free Estimate
            </h2>
            <p className="mt-2 mb-3 text-[.91rem] leading-snug">
              Tell us about your project and we’ll get back to you.
            </p>
            <div
              className="
              [&_form]:grid [&_form]:gap-2.5
              [&_:is(input:not([type=checkbox],[type=radio],[type=hidden]),select,textarea,button[role=combobox])]:w-full
              [&_:is(input:not([type=checkbox],[type=radio],[type=hidden]),select,textarea,button[role=combobox])]:min-h-[37px]
              [&_:is(input:not([type=checkbox],[type=radio],[type=hidden]),select,textarea,button[role=combobox])]:rounded-md
              [&_:is(input:not([type=checkbox],[type=radio],[type=hidden]),select,textarea,button[role=combobox])]:border
              [&_:is(input:not([type=checkbox],[type=radio],[type=hidden]),select,textarea,button[role=combobox])]:border-[#b7c4ca]
              [&_:is(input:not([type=checkbox],[type=radio],[type=hidden]),select,textarea,button[role=combobox])]:bg-white
              [&_:is(input:not([type=checkbox],[type=radio],[type=hidden]),select,textarea,button[role=combobox])]:px-2.5
              [&_:is(input:not([type=checkbox],[type=radio],[type=hidden]),select,textarea,button[role=combobox])]:py-1.5
              [&_:is(input:not([type=checkbox],[type=radio],[type=hidden]),select,textarea,button[role=combobox])]:text-sm
              [&_textarea]:min-h-[68px] [&_textarea]:resize-y
              [&_button[type=submit]]:min-h-[42px] [&_button[type=submit]]:w-full
              [&_button[type=submit]]:rounded-md [&_button[type=submit]]:bg-[#2d7619]
              [&_button[type=submit]]:font-bold [&_button[type=submit]]:text-white
              [&_button[type=submit]:hover]:bg-[#205912] [&_button[type=submit]:disabled]:cursor-default
              [&_button[type=submit]:disabled]:opacity-[.65]
            "
            >
              <QuoteForm
                title=""
                subtitle=""
                buttonText="Request Estimate"
                compact
              />
            </div>
          </aside>
        </section>

        <section
          id="home-services"
          className="scroll-mt-[5.5rem] bg-[#eff3f4] pt-[1.15rem] pb-[1.65rem]"
          aria-labelledby="ct-services-heading"
        >
          <div className={pageWidth}>
            <header className="mb-4 text-center">
              <h2 id="ct-services-heading" className={heading}>
                Our Home Improvement Services
              </h2>
              <p className="mt-1.5 text-[#465564]">
                Professional, reliable services for your home, inside and out.
              </p>
            </header>
            <ul className="m-0 grid list-none grid-cols-2 gap-2.5 p-0 min-[491px]:grid-cols-3 min-[491px]:gap-4 min-[761px]:grid-cols-6">
              {services.map((service) => {
                const Icon = serviceIcons[service.icon];
                return (
                  <li key={service.href}>
                    <Link
                      className={`${serviceCard} flex-col gap-1 border-[#dce3e6] bg-white hover:border-[#2d7619]`}
                      href={service.href}
                    >
                      <Icon
                        className="mb-1 shrink-0 text-[#2d7619]"
                        size={34}
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      <strong className="max-w-40 text-[.93rem]">
                        {service.name}
                      </strong>
                      <span className="text-xs text-[#465564]">
                        {service.detail}
                      </span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  className={`${serviceCard} gap-1 border-[#2d7619] bg-white text-[.82rem] font-bold text-[#205912] hover:bg-[#eef6ee]`}
                  href="/services"
                >
                  View All Services <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section
          className="bg-[#e7f0f3] bg-[linear-gradient(90deg,#f7fbfc98,#f7fbfc_45%),url(/ct-home/coast.webp)] bg-left bg-no-repeat py-7 [background-size:cover,auto_100%] min-[761px]:bg-[linear-gradient(90deg,transparent,#f7fbfc_80px),url(/ct-home/coast.webp)]"
          aria-labelledby="ct-towns-heading"
        >
          <div
            className={`${pageWidth} grid items-center gap-[1.4rem] min-[761px]:grid-cols-2 min-[1101px]:grid-cols-[1.12fr_1fr]`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="relative grid w-[62px] shrink-0 place-items-center text-[#123b58] min-[491px]:w-[94px]"
                aria-hidden="true"
              >
                <svg className="w-full" viewBox="0 0 108 80" focusable="false">
                  <path
                    fill="currentColor"
                    d="m13 8 39-1 1 8 6-1-1-6 39 1 7 51-11 2-3 5-24-3-34 5L5 78l7-18-4-2z"
                  />
                </svg>
                <span className="absolute text-base font-extrabold text-white min-[491px]:text-2xl">
                  CT
                </span>
              </div>
              <div>
                <h2 id="ct-towns-heading" className={heading}>
                  Explore Connecticut by Town
                </h2>
                <p className="mt-1.5 text-sm">
                  Find local property news, construction updates, and home
                  improvement resources for communities across Connecticut.
                </p>
              </div>
            </div>
            <ul className="m-0 grid list-none grid-cols-2 gap-2.5 p-0 min-[491px]:grid-cols-4">
              {towns.map((town) => (
                <li key={town.href}>
                  <Link
                    href={town.href}
                    className={`${townLink} border-[#a7b8c0]`}
                  >
                    <MapPin
                      className="shrink-0 text-[#185567]"
                      size={16}
                      aria-hidden="true"
                    />
                    {town.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className={`${townLink} border-[#2d7619] text-[#205912]`}
                  href="/connecticut"
                >
                  View All Towns <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
