import "./globals.css";
import Providers from "@/components/Providers"; // your file with SessionProvider + Toaster
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automated Timetable System",
  description: "FYP Prototype",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
