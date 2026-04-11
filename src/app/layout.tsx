import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Infraforma - Human-Led, Digitally Enabled",
  description:
    "Structured information management and digital delivery for the world's most complex infrastructure projects. ISO 19650 aligned. Based in Quebec City.",
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
