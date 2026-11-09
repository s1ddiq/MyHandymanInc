"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ChevronDown, MapPin, Menu, Phone, ShieldCheck, X } from "lucide-react";
import { Show, UserButton, useUser } from "@clerk/nextjs";
import { nav } from "@/lib/config/navigations";

const ctPhone = { label: "(203) 441-3471", href: "tel:+12034413471" };
const hicNumber = process.env.NEXT_PUBLIC_CT_HIC_NUMBER?.trim();

const towns = [
  "Stamford",
  "Greenwich",
  "Fairfield",
  "Norwalk",
  "New Haven",
  "Hartford",
  "Bridgeport",
].map((name) => ({
  name,
  href: `/connecticut/${name.toLowerCase().replaceAll(" ", "-")}`,
}));

type NavigationLink = {
  name: string;
  href: string;
};

type NavigationItem = NavigationLink & {
  children?: NavigationLink[];
};

const navigation: NavigationItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Services",
    href: "/services",
    children: [
      { name: "General Handyman", href: "/services/handyman" },
      { name: "Home Renovations", href: "/services/renovations" },
      {
        name: "Appliance Installation",
        href: "/services/appliance-installation",
      },
      { name: "Decks & Outdoor Projects", href: "/services/decks" },
      { name: "Home Upgrades", href: "/services/home-upgrades" },
      { name: "Roof Repair", href: "/roof-repair" },
      { name: "Appliance Repair", href: "/appliance-repair" },
    ],
  },
  {
    name: "CT Property News",
    href: "/ct-property-news",
    children: [
      {
        name: "Fairfield County Housing Projects",
        href: "/ct-property-news/fairfield-county-housing-projects",
      },
      {
        name: "Connecticut Home Sales",
        href: "/ct-property-news/connecticut-home-sales",
      },
      {
        name: "Stamford Development Proposals",
        href: "/ct-property-news/stamford-development",
      },
    ],
  },
  {
    name: "Home Improvement",
    href: "/home-improvement",
    children: [
      {
        name: "Kitchen Renovation Costs",
        href: "/home-improvement/kitchen-renovation-costs",
      },
      { name: "Home Renovations", href: "/services/renovations" },
    ],
  },
  { name: "Connecticut Towns", href: "/connecticut", children: towns },
  { name: "About", href: "/why-us" },
  { name: "Contact", href: "/contact" },
];

const contentWidth =
  "mx-auto w-[calc(100%-1.65rem)] max-w-[1320px] min-[491px]:w-[calc(100%-2.4rem)] min-[1031px]:w-[calc(100%-4.5rem)]";
const estimateButton =
  "inline-flex items-center justify-center rounded-[7px] bg-[#2d7619] px-4 py-1.5 text-center text-[.8rem] font-bold leading-tight text-white transition-colors hover:bg-[#205912]";
const navLink =
  "text-[.79rem] font-bold underline-offset-4 hover:text-[#205912] hover:underline";

export default function HomeNavbar() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(null);

  function closeMenus() {
    setMobileOpen(false);
    setOpenSection(null);
  }

  function handleEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape") return;
    if (openSection !== null) {
      setOpenSection(null);
      event.currentTarget
        .querySelector<HTMLButtonElement>(
          `[aria-controls="ct-subnav-${openSection}"]`,
        )
        ?.focus();
    } else if (mobileOpen) {
      setMobileOpen(false);
      event.currentTarget
        .querySelector<HTMLButtonElement>(
          '[aria-controls="ct-main-navigation"]',
        )
        ?.focus();
    }
  }

  return (
    <header
      className="sticky top-0 z-20 bg-white text-[#102235] min-[1031px]:relative [color-scheme:light] [font-family:Arial,Helvetica,sans-serif] [&_:is(a,button):focus-visible]:outline [&_:is(a,button):focus-visible]:outline-2 [&_:is(a,button):focus-visible]:outline-offset-[3px] [&_:is(a,button):focus-visible]:outline-[#318b22]"
      onKeyDown={handleEscape}
    >
      <div className="hidden bg-[#102c3b] text-[.76rem] font-semibold text-white min-[1031px]:block">
        <div
          className={`${contentWidth} flex min-h-[35px] items-center justify-between gap-2`}
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck
              className="shrink-0 text-[#a9de94]"
              size={17}
              aria-hidden="true"
            />{" "}
            {hicNumber
              ? `CT Registered Home Improvement Contractor · HIC Reg. # ${hicNumber}`
              : "Connecticut Home Improvement & Property News"}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="shrink-0" size={16} aria-hidden="true" /> Serving
            Homeowners Across Connecticut
          </span>
        </div>
      </div>
      <div
        className={`${contentWidth} grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 py-2.5 min-[491px]:grid-cols-[minmax(0,1fr)_auto_auto] min-[1031px]:grid-cols-[auto_minmax(0,1fr)] min-[1031px]:py-2 min-[1101px]:gap-x-8`}
      >
        <Link
          href="/"
          className="col-start-1 row-start-1 inline-flex flex-col items-center justify-self-start min-[1031px]:row-span-2"
          onClick={closeMenus}
        >
          <span className="flex items-center gap-1 whitespace-nowrap text-[clamp(1.4rem,2.5vw,2.15rem)] leading-none font-extrabold tracking-[-.045em] [font-family:Georgia,serif]">
            <svg
              className="h-auto w-[clamp(48px,6vw,80px)]"
              width="80"
              height="43"
              viewBox="0 0 88 46"
              aria-hidden="true"
            >
              <path
                fill="#123842"
                d="M1 43 24 20v-7h7v3l14-11 42 38H75L45 15 14 43Z"
              />
              <path fill="#34821e" d="m34 14 11-9 42 38h-9L45 15 34 24Z" />
              <path
                fill="#276440"
                d="M39 28h6v6h-6zm8 0h6v6h-6zm-8 8h6v6h-6zm8 0h6v6h-6z"
              />
            </svg>
            <span>MyHandymanInc.</span>
          </span>
          <span className="mt-0.5 text-[clamp(.44rem,.78vw,.68rem)] font-extrabold whitespace-nowrap uppercase">
            Home Improvement & Property News · Connecticut
          </span>
        </Link>

        <div className="col-start-2 row-start-1 hidden items-center justify-end gap-4 min-[491px]:flex">
          <a
            className="flex items-center gap-1.5 font-extrabold whitespace-nowrap"
            href={ctPhone.href}
          >
            <Phone className="text-[#205912]" size={17} aria-hidden="true" />{" "}
            {ctPhone.label}
          </a>
          <Link
            className={`${estimateButton} min-h-[34px]`}
            href="/#estimate"
            onClick={closeMenus}
          >
            Get a Free Estimate
          </Link>
        </div>

        <button
          type="button"
          className="col-start-2 row-start-1 grid cursor-pointer place-items-center rounded p-1.5 hover:bg-[#f1f6f7] min-[491px]:col-start-3 min-[1031px]:hidden"
          aria-expanded={mobileOpen}
          aria-controls="ct-main-navigation"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => (mobileOpen ? closeMenus() : setMobileOpen(true))}
        >
          {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav
          aria-label="Main navigation"
          id="ct-main-navigation"
          className={`col-span-full row-start-2 min-w-0 min-[1031px]:col-span-1 min-[1031px]:col-start-2 min-[1031px]:block min-[1031px]:max-h-none min-[1031px]:overflow-visible min-[1031px]:border-0 min-[1031px]:p-0 ${mobileOpen ? "mt-2.5 block max-h-[72vh] overflow-y-auto border-t border-[#d9e0e4] py-2 min-[1031px]:mt-0" : "hidden"}`}
        >
          <ul className="m-0 list-none p-0 min-[1031px]:flex min-[1031px]:flex-wrap min-[1031px]:items-center min-[1031px]:justify-end min-[1031px]:gap-x-[clamp(.45rem,.85vw,1rem)]">
            {navigation.map((item, index) => (
              <li
                key={item.href}
                className="relative flex flex-wrap items-center justify-between min-[1031px]:flex-nowrap min-[1031px]:justify-start min-[1031px]:whitespace-nowrap"
              >
                <Link
                  className={`${navLink} px-1 py-2 min-[1031px]:px-0`}
                  href={item.href}
                  onClick={closeMenus}
                >
                  {item.name}
                </Link>
                {item.children && (
                  <>
                    <button
                      type="button"
                      className="grid min-h-9 min-w-10 cursor-pointer place-items-center rounded px-0.5 hover:bg-[#f1f6f7] [&[aria-expanded=true]>svg]:rotate-180 min-[1031px]:min-h-0 min-[1031px]:min-w-0 min-[1031px]:py-1"
                      aria-label={`${item.name} links`}
                      aria-expanded={openSection === index}
                      aria-controls={`ct-subnav-${index}`}
                      onClick={() =>
                        setOpenSection(openSection === index ? null : index)
                      }
                    >
                      <ChevronDown size={14} aria-hidden="true" />
                    </button>
                    <ul
                      className="z-10 m-0 w-full list-none rounded-lg border border-[#d9e0e4] bg-[#f1f6f7] p-1.5 min-[1031px]:absolute min-[1031px]:top-full min-[1031px]:right-0 min-[1031px]:w-[17rem] min-[1031px]:bg-white min-[1031px]:shadow-lg"
                      id={`ct-subnav-${index}`}
                      hidden={openSection !== index}
                    >
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            className={`${navLink} block rounded px-3 py-2 whitespace-normal hover:bg-[#edf5eb]`}
                            href={child.href}
                            onClick={closeMenus}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
            <li className="flex items-center gap-1 px-1 py-2 whitespace-nowrap min-[1031px]:p-0">
              <Show when="signed-out">
                <Link className={navLink} href="/sign-in" onClick={closeMenus}>
                  Sign In
                </Link>
              </Show>
              <Show when="signed-in">
                <UserButton />
                {(role === "admin" || role === "sales_rep") && (
                  <button
                    type="button"
                    className={`${navLink} cursor-pointer p-1`}
                    onClick={() => {
                      closeMenus();
                      nav.goToDashboard();
                    }}
                  >
                    Dashboard
                  </button>
                )}
              </Show>
            </li>
          </ul>
          <a
            href={ctPhone.href}
            className="mx-1 my-2 inline-flex items-center gap-1 text-[.85rem] font-bold min-[491px]:hidden"
          >
            <Phone size={15} aria-hidden="true" /> {ctPhone.label}
          </a>
          <Link
            href="/#estimate"
            className={`${estimateButton} mx-1 my-2 min-h-10 min-[491px]:hidden`}
            onClick={closeMenus}
          >
            Get a Free Estimate
          </Link>
        </nav>
      </div>
    </header>
  );
}
