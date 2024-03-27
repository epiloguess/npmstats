import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SearchFromNpm from "@/_component/SearchFromNpm";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Npm Stats",
  description: "An unofficial, well maintained site of npm package download statistics for comparison, used for technical reference.",
};

import Nav from "./Nav";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} max-w-screen-xl m-auto px-6 md:px-24  pb-10 `}>
        <Nav />
        <SearchFromNpm></SearchFromNpm>

        {children}

      </body>
    </html>
  );
}
