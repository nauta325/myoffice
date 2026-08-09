import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function WatchHomePage() {
  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  const totalLessons = courses.reduce((n, c) => n + c.lessons.length, 0);
  const ready = courses.reduce(
    (n, c) => n + c.lessons.filter((l) => l.videoUrl?.trim()).length,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">강의 목차</h1>
        <p className="mt-1 text-sm text-slate-500">
          전체 {totalLessons}개 강의 · 시청 가능 {ready}개
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="card text-center text-sm text-slate-400">
          아직 등록된 강의가 없습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {courses.map((c) => (
            <section key={c.id} className="card">
              <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">
                {c.code && (
                  <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                    {c.code}
                  </span>
                )}
                <h2 className="text-lg font-bold text-slate-900">{c.title}</h2>
              </div>

              {c.lessons.length === 0 ? (
                <p className="py-2 text-sm text-slate-400">강의 준비 중입니다.</p>
              ) : (
                <ul className="divide-y divide-slate-50">
                  {c.lessons.map((l) => {
                    const ready = Boolean(l.videoUrl?.trim());
                    const inner = (
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                              ready
                                ? "bg-brand-600 text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {ready ? "▶" : "⏳"}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {l.code && (
                                <span className="mr-1.5 text-xs text-brand-600">
                                  {l.code}
                                </span>
                              )}
                              {l.title}
                            </p>
                            {l.page && (
                              <p className="text-xs text-slate-400">교재 {l.page}p</p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            ready ? "text-brand-600" : "text-slate-300"
                          }`}
                        >
                          {ready ? "시청하기 →" : "준비중"}
                        </span>
                      </div>
                    );
                    return (
                      <li key={l.id}>
                        {ready ? (
                          <Link href={`/watch/${l.id}`} className="block hover:bg-slate-50">
                            {inner}
                          </Link>
                        ) : (
                          <div className="cursor-not-allowed opacity-70">{inner}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
