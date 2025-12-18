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
        {/*Header */}
        <header className="absolute top-0 left-0 w-full z-50 p-6 transition-all bg-transparent">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center font-bold rounded-lg w-10 h-10 text-white"
                style={{ background: "var(--gradient-primary)" }}
              >
                H
              </div>
              <div className="text-2xl font-bold text-[var(--color-primary-700)]">
                Hostel
                <span className="text-[var(--color-primary-500)]">Ease</span>
              </div>
            </div>
          </div>
        </header>
        <ProtectLayout>
          {children}
          <Toaster richColors={true} position="top-center" />
        </ProtectLayout>
      </body>
    </html>
  );
}
