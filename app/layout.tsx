import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/app/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Storm Streamer Hub",
  description: "Follow your favorite storm chasers live",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <div className="min-h-screen bg-[#3a5084]">
      <Navbar/>
      <header className="text-center py-8">
        <h1 className="text-white text-4xl font-bold">Live Streaming Storm Chaser Hub</h1>
        <p className="text-blue-200 text-lg">Your place to watch the latest live streaming storm chasers</p>
        <p className="text-blue-200 text-lg">Severe Weather, Tornadoes, Hurricanes, Blizzards & More</p>

      </header>
      <main className="p-6">{children}</main>
      <footer className="bg-gray-800 text-white text-center py-4 mt-8">
        <p>&copy; 2024 Live Streaming Storm Chaser Hub. All rights reserved.</p>
      </footer>
    </div>
    </body>
    </html>
  );
}
