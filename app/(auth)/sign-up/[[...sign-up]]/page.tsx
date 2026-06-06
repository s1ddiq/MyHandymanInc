// app/sign-up/page.tsx
import { ProtectedClerkAuth } from "@/features/auth/ProtectedClerkAuth";

export default function SignUpPage() {
  return <ProtectedClerkAuth type="signup" redirectUrl="/dashboard" />;
}
