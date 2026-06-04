// config/navigations.ts

export const ROUTES = {
  // Public routes
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",

  // Dashboard routes
  DASHBOARD: "/dashboard",
  DASHBOARD_OVERVIEW: "/dashboard/overview",
  DASHBOARD_LEADS: "/dashboard/leads",
  DASHBOARD_DEALS: "/dashboard/deals",

  // Admin routes
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_TEAMS: "/admin/teams",
  ADMIN_SETTINGS: "/admin/settings",

  // Sales rep specific routes
  SALES_PIPELINE: "/sales/pipeline",
  SALES_TARGETS: "/sales/targets",
  SALES_CLIENT: (clientId: string) => `/sales/clients/${clientId}`,

  // Settings & account
  PROFILE: "/profile",
  ACCOUNT_SETTINGS: "/settings/account",
  BILLING: "/settings/billing",

  // API routes (if needed)
  API_AUTH: "/api/auth",
  API_WEBHOOKS: "/api/webhooks/clerk",
} as const;

export const nav = {
  // Auth flows
  goToSignUp: () => redirect(ROUTES.SIGN_UP),
  goToSignIn: () => redirect(ROUTES.SIGN_IN),
  goToHome: () => redirect(ROUTES.HOME),

  // Dashboard flows
  goToDashboard: () => redirect(ROUTES.DASHBOARD),
  goToLeads: () => redirect(ROUTES.DASHBOARD_LEADS),
  goToDeals: () => redirect(ROUTES.DASHBOARD_DEALS),

  // Admin flows with access control
  goToAdmin: () => redirect(ROUTES.ADMIN),
  goToAdminUsers: () => redirect(ROUTES.ADMIN_USERS),

  // Sales flows
  goToPipeline: () => redirect(ROUTES.SALES_PIPELINE),
  goToSalesClient: (clientId: string) =>
    redirect(ROUTES.SALES_CLIENT(clientId)),

  // Utility
  goBack: () => redirect("back"),
  refresh: () => redirect("refresh"),
};

// Client-side navigation (for useRouter in Client Components)
import { redirect, useRouter } from "next/navigation";

export const useClientNav = () => {
  const router = useRouter();

  return {
    goToSignUp: () => router.push(ROUTES.SIGN_UP),
    goToSignIn: () => router.push(ROUTES.SIGN_IN),
    goToDashboard: () => router.push(ROUTES.DASHBOARD),
    goToLeads: () => router.push(ROUTES.DASHBOARD_LEADS),
    goToAdmin: () => router.push(ROUTES.ADMIN),
    goToPipeline: () => router.push(ROUTES.SALES_PIPELINE),
    goToSalesClient: (clientId: string) =>
      router.push(ROUTES.SALES_CLIENT(clientId)),
    goBack: () => router.back(),
  };
};
