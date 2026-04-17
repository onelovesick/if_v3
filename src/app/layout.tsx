import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Infraforma | Digital Delivery for Engineering and Construction",
  description:
    "A digital delivery experience for engineering and construction teams, connecting models, documents, field data, and handover into one controlled project layer.",
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
