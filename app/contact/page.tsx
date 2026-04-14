"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Send,
  Shield,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\(\)\+]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! We'll get back to you within 24 hours.",
        });

        // Reset form on success
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });

        // Optional: Reset the select dropdown
        // You might need to add a ref to reset the select
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Unable to send message. Please call or text us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <Image
          src="/contact-hero.jpg"
          alt="Contact My Handyman Inc"
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
              Get in Touch With Us
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">
              Have a question or ready to start your next project? Reach out
              today for a free, no-obligation estimate.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="tel:+12034413471">
                <Button className="gap-2">
                  <PhoneCall className="size-5.5" />
                  Call (203) 441-3471
                </Button>
              </Link>
              <Link href="sms:+12034413471">
                <Button
                  variant="outline"
                  className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <MessageCircle className="size-5.5" />
                  Text Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Send Us a Message
                </h2>
                <p className="mt-2 text-gray-600">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </p>
              </div>

              {submitStatus.type === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-green-700">{submitStatus.message}</p>
                </div>
              )}

              {submitStatus.type === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{submitStatus.message}</p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-6 border p-6 rounded-lg shadow-sm"
              >
                <div>
                  <Label htmlFor="name" className="text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(203) 441-3471"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="service" className="text-gray-700">
                    Service Needed (Optional)
                  </Label>
                  <Select
                    onValueChange={handleServiceChange}
                    value={formData.service}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appliance-repair">
                        Appliance Repair
                      </SelectItem>
                      <SelectItem value="roof-repair">Roof Repair</SelectItem>
                      <SelectItem value="carpentry">
                        Carpentry & Cabinets
                      </SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="flooring">Flooring</SelectItem>
                      <SelectItem value="deck-fence">Decks & Fences</SelectItem>
                      <SelectItem value="remodeling">Remodeling</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please describe your project or question..."
                    rows={5}
                    className={errors.message ? "border-red-500" : ""}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  <Send className="size-5" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to be contacted via text,
                  email, or phone. We respect your privacy and will never share
                  your information.
                </p>
              </form>
            </div>

            {/* Contact Info Cards */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Connect With Us
                </h2>
                <p className="mt-2 text-gray-600">
                  Prefer to reach out directly? Here's how you can get in touch.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <PhoneCall className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Call Us</CardTitle>
                      <CardDescription className="mt-1">
                        Speak directly with a team member
                      </CardDescription>
                      <Link
                        href="tel:+12034413471"
                        className="text-primary font-semibold text-xl mt-2 inline-block hover:underline"
                      >
                        (203) 441-3471
                      </Link>
                      <p className="text-sm text-gray-500 mt-2">
                        Mon-Fri: 8am - 6pm | Sat: 9am - 4pm
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Text Us</CardTitle>
                      <CardDescription className="mt-1">
                        Fastest response time for quick questions
                      </CardDescription>
                      <Link
                        href="sms:+12034413471"
                        className="text-primary font-semibold text-xl mt-2 inline-block hover:underline"
                      >
                        (203) 441-3471
                      </Link>
                      <p className="text-sm text-gray-500 mt-2">
                        Include your name and project details for a faster
                        response
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Email Us</CardTitle>
                      <CardDescription className="mt-1">
                        Send us your project details
                      </CardDescription>
                      <Link
                        href="mailto:myhandymaninc1@gmail.com"
                        className="text-primary font-semibold text-xl mt-2 inline-block hover:underline"
                      >
                        myhandymaninc1@gmail.com
                      </Link>
                      <p className="text-sm text-gray-500 mt-2">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border border-primary/20">
                  <CardContent className="p-6">
                    <CardTitle className="text-lg mb-4">
                      Service Areas
                    </CardTitle>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="text-gray-700">Orange, CT</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="text-gray-700">Woodbridge, CT</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Response Promise */}
              <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900">
                  Quick Response Guarantee
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  We respond to all inquiries within 24 hours. For emergencies,
                  please call us directly at (203) 441-3471.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Why Homeowners Choose Us
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Quality craftsmanship, honest pricing, and exceptional customer
              service
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "Licensed & Insured",
                description: "Fully compliant with CT requirements",
              },
              {
                icon: <Star className="w-8 h-8 text-primary" />,
                title: "5-Star Rated",
                description: "Dozens of satisfied customers",
              },
              {
                icon: <Clock className="w-8 h-8 text-primary" />,
                title: "Same-Day Service",
                description: "Fast response when you need it",
              },
              {
                icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
                title: "1-Year Guarantee",
                description: "Peace of mind on all work",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="text-center p-6 border-none shadow-sm hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="mb-3 flex justify-center">{item.icon}</div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/70 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Emergency Repairs? Need Immediate Help?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Don't wait. Call us now for urgent repairs in Orange and Woodbridge.
          </p>
          <div className="mt-8">
            <Link href="tel:+12034413471">
              <Button variant="secondary" size="lg" className="gap-2">
                <PhoneCall className="size-5.5" />
                Call Now: (203) 441-3471
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
