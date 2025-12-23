import type { Metadata } from "next";
import LayoutHeader from "../_components/header";

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
    <>
      <LayoutHeader />

      {children}
    </>
  );
}
