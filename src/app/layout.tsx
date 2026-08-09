import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "학원 관리 & 강의실",
  description: "초중고 입시학원용 출결·성적 관리 및 영상 강의실",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
