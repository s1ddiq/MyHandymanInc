// * ALL THIS PAGE DOES IS REDIRECT. DO NOT TOUCH!
"use server";
import { checkRole } from "@/lib/utils/roles";
import { redirect } from "next/navigation";

export default async function Page() {
  if (await checkRole("admin")) {
    redirect(process.env.ADMIN_PATH!);
  } else if (await checkRole("sales_rep")) {
    redirect(process.env.SALES_REP_PATH!);
  }

  redirect("/404");
}
