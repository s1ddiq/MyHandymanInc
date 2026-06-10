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
      <div className="f mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

          {/* Our Locations */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Our Locations & Phone Numbers
            </h4>
            <ul className="space-y-4 grid grid-cols-2">
              <li>
                <div className="flex flex-col">
                  <span className="font-medium text-white">
                    Philadelphia, PA
                  </span>
                  <a
                    href="tel:+12157289008"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    215-728-9008
                  </a>
                </div>
              </li>
              <li>
                <div className="flex flex-col">
                  <span className="font-medium text-white">Plainfield, NJ</span>
                  <a
                    href="tel:+19738999626"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    973-899-9626
                  </a>
                </div>
              </li>
              <li>
                <div className="flex flex-col">
                  <span className="font-medium text-white">Elmsford, NY</span>
                  <a
                    href="tel:+16464169009"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    646-416-9009
                  </a>
                </div>
              </li>
              <li>
                <div className="flex flex-col">
                  <span className="font-medium text-white">Rockville, MD</span>
                  <a
                    href="tel:+13012009008"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    301-200-9008
                  </a>
                </div>
              </li>
              <li>
                <div className="flex flex-col">
                  <span className="font-medium text-white">
                    Stamford, CT{" "}
                    <span className="text-xs text-primary">(Main Office)</span>
                  </span>
                  <a
                    href="tel:+12034413471"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    203-441-3471
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Email & Support + Service Hours */}
          <div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">
                Email & Support
              </h4>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <a
                  href="mailto:myhandymaninc1@gmail.com"
                  className="text-gray-400 hover:text-primary transition-colors break-all"
                >
                  myhandymaninc1@gmail.com
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">
                Service Hours
              </h4>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-gray-400">
                  <p>Mon-Fri: 8:00 AM – 6:00 PM</p>
                  <p>Sat: 9:00 AM – 4:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Get a Free Estimate + Promise */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Get a Free Estimate
            </h4>
            <p className="text-gray-400 mb-4">
              Ready to start your next project? Contact us today for a free,
              no-obligation estimate.
            </p>
            <Link href="/contact">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Get Your Estimate
              </Button>
            </Link>
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
        <div className="max-w-7xlf mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <Link
                href="/sitemap.xml"
                className="hover:text-primary transition-colors"
              >
                Sitemap
              </Link>
              <Link
                href="mailto:snashct@gmail.com"
                className="hover:text-primary transition-colors underline-offset-1"
                title="Made with 💖 in Stamford, Conn."
              >
                Made by Siddiq
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
