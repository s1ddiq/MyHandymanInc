import HomeNavbar from "@/components/HomeNavbar";
import "../globals.css";
import HomeFooter from "@/components/HomeFooter";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-full flex flex-col">
      <HomeNavbar />
      {children}
      <HomeFooter />
    </main>
  );
}
