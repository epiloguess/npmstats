import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SearBox from "@/_component/SearchBox";
const inter = Inter({ subsets: ["latin"] });
import Script from "next/script";
export const metadata: Metadata = {
  title: "Npm Stats",
  description:
    "An unofficial, well maintained site of npm package download statistics for comparison, used for technical reference.",
};

import Nav from "./Nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} max-w-screen-xl m-auto px-6 md:px-24  pb-10 `}>
        <Nav />
        <SearBox></SearBox>
        {children}
        <Script src="https://analytics.wunhao.com/script.js" data-website-id="f1d46e25-f881-421e-a09f-bcbdb4f27b3d" strategy="lazyOnload"></Script>
      </body>
    </html>
  );
}
