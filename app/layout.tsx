'use client';
import GNB from "@/components/GNB";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "먹방 유튜버들의 맛집 리스트의 랭킹을 모아두는 서비스",
//   description: "먹방 유튜버들의 맛집 리스트의 랭킹을 모아두는 서비스",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <GNB />
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
