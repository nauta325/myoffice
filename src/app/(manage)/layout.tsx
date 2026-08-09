import { Nav } from "@/components/Nav";

// 관리(원장)용 레이아웃 — 상단 관리 메뉴 포함
export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </>
  );
}
