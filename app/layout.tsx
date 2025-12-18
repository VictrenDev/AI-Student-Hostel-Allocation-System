import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ProtectLayout from "@/src/helpers/protect-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HostelEase | Simplify Your Hostel Allocation",
  description:
    "An intelligent platform designed to streamline hostel room assignments for students and administrators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProtectLayout>
          {children}
          <Toaster richColors={true} position="top-center" />
        </ProtectLayout>
      </body>
    </html>
  );
}
