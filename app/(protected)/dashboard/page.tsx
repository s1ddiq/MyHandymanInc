// * ALL THIS PAGE DOES IS REDIRECT. DO NOT TOUCH!
"use server";
import { checkRole } from "@/lib/utils/roles";
import { redirect } from "next/navigation";

export default async function Page() {
  if (checkRole("admin")) {
    redirect(process.env.ADMIN_PATH!);
  }

  if (checkRole("sales_rep")) {
    redirect("/sales");
  }

  redirect("/404");
}
