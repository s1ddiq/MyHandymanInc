"use client";

import { Button } from "@/components/ui/button";
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
import { CheckCircle2, Send, X } from "lucide-react";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface QuoteFormProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  compact?: boolean;
  className?: string;
  service?: string;
}

export default function QuoteForm({
  title = "Get a Quote",
  subtitle = "Tell us about your project and we'll get back to you within 24 hours.",
  buttonText = "Send Request",
  compact = false,
  className = "",
  service = "Unspecified",
}: QuoteFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service,
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[\d\s\-\(\)\+]+$/.test(formData.phone)) {
      newErrors.phone = "Valid phone number";
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
          message: "Thanks! We'll reach out within 24 hours.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          service,
          message: "",
        });
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus({ type: null, message: "" });
        }, 5000);
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Unable to send. Please call us directly.",
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
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl ${className}`}>
      <div className="p-5 border-b border-gray-100">
        <h3
          className={`${compact ? "text-xl" : "text-2xl"}  font-bold text-gray-900`}
        >
          {title}
        </h3>
        {subtitle && !compact && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="px-5 pb-5">
        {submitStatus.type === "success" && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <p className="text-green-700 text-sm">{submitStatus.message}</p>
          </div>
        )}

        {submitStatus.type === "error" && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm">{submitStatus.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="quote-name" className="text-gray-700 text-sm">
              Full Name *
            </Label>
            <Input
              id="quote-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Smith"
              className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="quote-email" className="text-gray-700 text-sm">
              Email *
            </Label>
            <Input
              id="quote-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="quote-phone" className="text-gray-700 text-sm">
              Phone *
            </Label>
            <Input
              id="quote-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(203) 441-3471"
              className={`mt-1 ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {!compact && (
            <div>
              <Label htmlFor="quote-message" className="text-gray-700 text-sm">
                Project Details *
              </Label>
              <Textarea
                id="quote-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project..."
                rows={3}
                className={`mt-1 ${errors.message ? "border-red-500" : ""}`}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>
          )}

          {compact && (
            <div>
              <Label
                htmlFor="quote-message-compact"
                className="text-gray-700 text-sm"
              >
                Quick Description *
              </Label>
              <Input
                id="quote-message-compact"
                name="message"
                type="text"
                value={formData.message}
                onChange={handleChange}
                placeholder="What needs fixing?"
                className={`mt-1 ${errors.message ? "border-red-500" : ""}`}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full gap-2 bg-primary hover:bg-primary/90"
            disabled={isSubmitting}
          >
            <Send className="size-4" />
            {isSubmitting ? "Sending..." : buttonText}
          </Button>

          {/* <p className="text-xs text-gray-400 text-center">
            Free estimate • No obligation
          </p> */}
        </form>
      </div>
    </div>
  );
}
