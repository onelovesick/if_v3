import type { Metadata } from "next";
import { MotionProvider } from "@/components/MotionProvider";
import Grain from "@/components/Grain";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Infraforma — We harmonize the parties that deliver infrastructure",
  description:
    "An information management practice for major infrastructure programs. We work between owners, designers, and contractors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>
          <Loader />
          <Grain />
          <Cursor />
          <Nav />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
