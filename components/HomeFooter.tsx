import React from "react";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const HomeFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">MyHandyMan</h3>
            <p className="text-gray-400 mb-4">
              Your trusted, local handyman & home improvement experts in
              Connecticut. Quality craftsmanship, premium materials, and expert
              service for every budget.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" /> About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" /> Our Services
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" /> Our Promise
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" /> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-primary transition-colors"
                >
                  (203) 208-6095
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <a
                  href="mailto:info@myhandymaninc.com"
                  className="hover:text-primary transition-colors"
                >
                  info@myhandymaninc.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Connecticut, USA</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
                  <p>Sat: 9:00 AM - 4:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Get a Free Estimate
            </h4>
            <p className="text-gray-400 mb-4">
              Ready to start your next project? Contact us today for a free,
              no-obligation estimate.
            </p>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Get Your Estimate
            </Button>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>100% Satisfaction Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} MyHandyMan. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link href="/" className="hover:text-primary transition-colors">
                Sitemap
              </Link>
              <Link
                href="https://github.com/s1ddiq"
                className="hover:text-primary transition-colors underline-offset-1"
              >
                Developed by{" "}
                <Link
                  href="https://s1ddiqs-room.vercel.app/"
                  className="text-primary"
                >
                  s1ddiq
                </Link>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
