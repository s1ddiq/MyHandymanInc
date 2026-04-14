"use client";

import { Menu, PhoneCall, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const HomeNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-background md:static sticky top-0 z-90">
      {/* Top bar with phone number - this will scroll away */}
      <div className="bg-primary/80 text-primary-foreground p-2 text-sm sm:text-base md:text-lg font-bold tracking-wide  md:flex hidden justify-center items-center">
        <Link href="tel:2032086095" className="hover:underline">
          <PhoneCall className="inline mr-3 size-5.5" />
          CALL US NOW: (203) 208-6095
        </Link>
      </div>

      {/* Main navigation bar - ONLY this will stick */}
      <nav className="bg-primary px-4 sm:px-6 py-3 sm:py-4 md:py-6 sticky top-0 z-50">
        <div className="mx-auto flex items-center justify-between gap-4">
          {/* Logo / Header - Left */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-base sm:text-lg md:text-xl font-bold text-primary-foreground hover:opacity-80 transition-opacity flex gap-3 items-center border border-white p-3"
              onClick={closeMobileMenu}
            >
              <Image
                src="/favicon.ico"
                alt="Company Logo"
                width={32}
                height={32}
              />
              <p className=" font-bold">MyHandymanInc</p>
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <ul className="hidden md:flex space-x-4 lg:space-x-8 text-sm lg:text-base font-medium text-primary-foreground">
            <li>
              <Link href="/" className="hover:underline transition-all">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/roof-repair"
                className="hover:underline transition-all"
              >
                Roof Repair
              </Link>
            </li>
            <li>
              <Link
                href="/appliance-repair"
                className="hover:underline transition-all"
              >
                Appliance Repair
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:underline transition-all">
                Services
              </Link>
            </li>
            <li>
              <Link href="/why-us" className="hover:underline transition-all">
                Why Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline transition-all">
                Contact Us
              </Link>
            </li>
          </ul>

          {/* CTAs - Right */}
          <div className="md:flex gap-2 sm:gap-3 shrink-0 hidden">
            <Button variant="outline">Free Estimate</Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-primary-foreground p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile navigation links - Slide down menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-3 pt-3 border-t border-primary-foreground/20">
            <ul className="flex flex-col space-y-3 text-sm font-medium text-primary-foreground pb-4">
              <li>
                <Link
                  href="/"
                  className="block hover:underline transition-all py-1"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/roof-repair"
                  className="block hover:underline transition-all py-1"
                  onClick={closeMobileMenu}
                >
                  Roof Repair
                </Link>
              </li>
              <li>
                <Link
                  href="/appliance-repair"
                  className="block hover:underline transition-all py-1"
                  onClick={closeMobileMenu}
                >
                  Appliance Repair
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="block hover:underline transition-all py-1"
                  onClick={closeMobileMenu}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/why-us"
                  className="block hover:underline transition-all py-1"
                  onClick={closeMobileMenu}
                >
                  Why Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block hover:underline transition-all py-1"
                  onClick={closeMobileMenu}
                >
                  Contact Us
                </Link>
              </li>
              <li className="pt-2">
                <Button
                  variant="outline"
                  className="w-full text-black"
                  onClick={closeMobileMenu}
                >
                  Free Estimate
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HomeNavbar;
