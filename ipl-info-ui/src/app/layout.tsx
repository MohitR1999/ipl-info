'use client'
import type { Metadata } from "next";
import { ThemeModeScript } from 'flowbite-react';
import Nav from "./nav/Nav";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
