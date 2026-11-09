import Link from "next/link";
import { CheckCircle2, Clock, Mail } from "lucide-react";

const ctPhone = { label: "(203) 441-3471", href: "tel:+12034413471" };
const supportEmail = "myhandymaninc1@gmail.com";

const offices = [
  { city: "Stamford, CT", phone: ctPhone },
  {
    city: "Philadelphia, PA",
    phone: { label: "(215) 728-9008", href: "tel:+12157289008" },
  },
  {
    city: "Plainfield, NJ",
    phone: { label: "(973) 899-9626", href: "tel:+19738999626" },
  },
  {
    city: "Elmsford, NY",
    phone: { label: "(646) 416-9009", href: "tel:+16464169009" },
  },
  {
    city: "Rockville, MD",
    phone: { label: "(301) 200-9008", href: "tel:+13012009008" },
  },
];

const contentWidth =
  "mx-auto w-[calc(100%-1.65rem)] max-w-[1320px] min-[491px]:w-[calc(100%-2.4rem)] min-[1031px]:w-[calc(100%-4.5rem)]";
const sectionHeading = "mb-2 text-[1.03rem] leading-tight font-bold text-white";

export default function HomeFooter() {
  return (
    <footer className="bg-[#102a38] text-[.88rem] leading-normal text-[#dbe6eb] [&_a:hover]:underline [&_a:hover]:underline-offset-3 [color-scheme:light] [font-family:Arial,Helvetica,sans-serif] [&_:is(a,button):focus-visible]:outline [&_:is(a,button):focus-visible]:outline-2 [&_:is(a,button):focus-visible]:outline-offset-[3px] [&_:is(a,button):focus-visible]:outline-[#318b22]">
      <div
        className={`${contentWidth} grid gap-4 py-8 min-[491px]:grid-cols-2 min-[491px]:gap-6 min-[1031px]:grid-cols-[.9fr_1.4fr_1.1fr_1fr]`}
      >
        <div>
          <Link
            href="/"
            className="mb-2 inline-block text-[1.38rem] leading-tight font-extrabold text-white [font-family:Georgia,serif]"
          >
            MyHandymanInc.
          </Link>
          <p>
            Home repairs, renovations, and practical resources for Connecticut
            homeowners.
          </p>
        </div>
        <div>
          <h2 className={sectionHeading}>Our Locations</h2>
          <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0">
            {offices.map(({ city, phone }, index) => (
              <li key={city} className="grid">
                <strong className="text-[.8rem] text-white">
                  {city}
                  {index === 0 && " · Main Office"}
                </strong>
                <a href={phone.href}>{phone.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={sectionHeading}>Email & Support</h2>
          <p className="flex items-start gap-1.5 [overflow-wrap:anywhere] [&>svg]:mt-0.5 [&>svg]:shrink-0">
            <Mail size={16} aria-hidden="true" />
            <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </p>
          <h2 className={`${sectionHeading} mt-3.5`}>Service Hours</h2>
          <p className="flex items-start gap-1.5 [overflow-wrap:anywhere] [&>svg]:mt-0.5 [&>svg]:shrink-0">
            <Clock size={16} aria-hidden="true" />
            <span>
              Mon–Fri, 8 AM–6 PM
              <br />
              Sat, 9 AM–4 PM
              <br />
              Sun, closed
            </span>
          </p>
        </div>
        <div>
          <h2 className={sectionHeading}>Get a Free Estimate</h2>
          <p>Tell us what you have in mind for your home.</p>
          <Link
            href="/#estimate"
            className="mt-3 inline-flex min-h-10 items-center justify-center rounded-[7px] bg-[#2d7619] px-4 py-2 text-center leading-tight font-bold text-white transition-colors hover:bg-[#205912]"
          >
            Get Your Estimate
          </Link>
          <ul className="mt-3 list-none p-0 text-[.8rem] [&>li]:flex [&>li]:items-center [&>li]:gap-1.5 [&_svg]:shrink-0 [&_svg]:text-[#a9de94]">
            <li>
              <CheckCircle2 size={15} aria-hidden="true" /> Licensed &amp;
              Insured
            </li>
            <li>
              <CheckCircle2 size={15} aria-hidden="true" /> 100% Satisfaction
              Guaranteed
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20">
        <div
          className={`${contentWidth} flex flex-wrap justify-between gap-x-4 gap-y-2 py-3.5 text-[.8rem]`}
        >
          <p>
            © {new Date().getFullYear()} MyHandymanInc. All rights reserved.
          </p>
          <nav
            className="flex flex-wrap gap-x-4 gap-y-2"
            aria-label="Footer navigation"
          >
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/sitemap.xml">Sitemap</Link>
            <a href="mailto:snashct@gmail.com">Made by Siddiq</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
