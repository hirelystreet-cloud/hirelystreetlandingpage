import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-site",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HirelyStreet | One platform for every service request",
  description:
    "Join the HirelyStreet waitlist to connect with trusted professionals online and offline.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
