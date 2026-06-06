// components/ProtectedClerkAuth.tsx
"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useState, useEffect } from "react";
import Link from "next/link";

type AuthType = "signin" | "signup";

interface ProtectedClerkAuthProps {
  type: AuthType;
  redirectUrl?: string;
}

export const ProtectedClerkAuth = ({
  type,
  redirectUrl = "/dashboard",
}: ProtectedClerkAuthProps) => {
  const trpc = useTRPC();
  const [accessCode, setAccessCode] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [error, setError] = useState("");

  const validateMutation = useMutation(
    trpc.accessCode.validate.mutationOptions({
      onSuccess: (data) => {
        if (data.valid) {
          setIsValidated(true);
          sessionStorage.setItem("accessCodeValidated", "true");
        } else {
          setError(error || "Invalid access code");
        }
      },
      onError: () => {
        setError("Something went wrong");
      },
    }),
  );

  useEffect(() => {
    const cached = sessionStorage.getItem("accessCodeValidated");
    if (cached === "true") {
      setIsValidated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!accessCode.trim()) {
      setError("Please enter an access code");
      return;
    }
    validateMutation.mutate({ code: accessCode });
  };

  const title = type === "signin" ? "Welcome Back" : "Welcome";
  const subtitle =
    type === "signin"
      ? "Enter your access code to sign in"
      : "Enter your access code to sign up";
  const buttonText =
    type === "signin" ? "Continue to Sign In" : "Continue to Sign Up";

  if (!isValidated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-gray-300">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="Access code"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={validateMutation.isPending}
              autoFocus
            />

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={validateMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {validateMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Validating...
                </span>
              ) : (
                buttonText
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Need an access code? Contact snashct@gmail.com
          </p>
          <div className="text-white mt-4 underline text-center">
            {type === "signin" ? (
              <Link href="/sign-up">I want to sign up</Link>
            ) : (
              <Link href="/sign-in">I want to sign in</Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const AuthComponent = type === "signin" ? SignIn : SignUp;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md">
        <AuthComponent
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-300",
              formFieldLabel: "text-gray-200",
              formFieldInput:
                "bg-white/20 border-white/30 text-white placeholder-gray-400",
              formFieldInputShowPasswordButton:
                "text-gray-400 hover:text-gray-200",
              dividerLine: "bg-white/20",
              dividerText: "text-gray-400",
              socialButtonsBlockButton:
                "bg-white/20 hover:bg-white/30 border-white/30 text-white",
              socialButtonsBlockButtonText: "text-white",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              footerActionLink: "text-blue-400 hover:text-blue-300",
            },
          }}
        />
      </div>
    </div>
  );
};
