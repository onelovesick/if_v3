import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Infraforma | Digital Delivery for Engineering and Construction",
  description:
    "Digital delivery, information management, and handover strategy for engineering and construction teams working on complex projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
