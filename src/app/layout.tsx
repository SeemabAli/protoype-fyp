import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Automated Timetable System",
  description: "FYP RBAC Prototype",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
