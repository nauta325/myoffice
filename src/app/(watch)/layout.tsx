import Link from "next/link";

// 학생 강의실 전용 레이아웃 — 관리 메뉴 없이 깔끔하게
export default function WatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/watch" className="flex items-center gap-2 font-bold text-slate-900">
            <span className="text-2xl">🎬</span>
            <span>온라인 강의실</span>
          </Link>
          <span className="text-xs text-slate-400">영상을 눌러 수업을 시작하세요</span>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-4xl px-4 py-8 text-center text-xs text-slate-400">
        열심히 공부해요! 📚
      </footer>
    </div>
  );
}
