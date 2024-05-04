import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

import Nav from "./Nav";
import SearBox from '@componets/SearchBox'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} max-w-screen-lg m-auto px-6 md:px-24  pb-10 `}>
        <Nav />
        <main>
        <SearBox></SearBox>

        {children}
        </main>
        <Script
          src='https://analytics.wunhao.com/script.js'
          data-website-id='f1d46e25-f881-421e-a09f-bcbdb4f27b3d'
          strategy='lazyOnload'></Script>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "npmstats",
  description:
    "An unofficial site of npm package download statistics, used for technical reference.",
};
