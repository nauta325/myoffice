import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createCourse, deleteCourse, seedCurriculum } from "./actions";

export const dynamic = "force-dynamic";

export default async function CoursesAdminPage() {
  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: { lessons: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">강의 관리</h1>
          <p className="mt-1 text-sm text-slate-500">
            강좌(챕터)를 만들고, 각 강의에 네이버 마이박스 영상 링크를 등록하세요.
          </p>
        </div>
        <Link href="/watch" target="_blank" className="btn-ghost">
          학생 화면 보기 ↗
        </Link>
      </div>

      {/* 강좌 추가 */}
      <form action={createCourse} className="card grid gap-3 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label className="label">표시 라벨 (선택)</label>
          <input name="code" placeholder="예: CHAPTER 07" className="input" />
        </div>
        <div className="sm:col-span-3">
          <label className="label">챕터 제목 *</label>
          <input name="title" required placeholder="예: 형용사와 부사" className="input" />
        </div>
        <div className="flex items-end sm:col-span-1">
          <button type="submit" className="btn-primary w-full">
            + 추가
          </button>
        </div>
      </form>

      {/* 강좌 목록 */}
      {courses.length === 0 ? (
        <div className="card space-y-4 text-center">
          <p className="text-sm text-slate-500">
            아직 강좌가 없습니다. 교재 목차를 한 번에 불러오거나, 위에서 직접 추가하세요.
          </p>
          <form action={seedCurriculum}>
            <button type="submit" className="btn-primary">
              📚 교재 목차 불러오기 (GRAMMAR BASICS + CHAPTER 01~06)
            </button>
          </form>
          <p className="text-xs text-slate-400">
            챕터 7개 · 강의 16개가 생성되며, 각 강의에 영상 링크만 붙이면 됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => {
            const linked = c.lessons.filter((l) => l.videoUrl?.trim()).length;
            const total = c.lessons.length;
            return (
              <div key={c.id} className="card flex items-center justify-between">
                <Link href={`/courses/${c.id}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {c.code && (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                        {c.code}
                      </span>
                    )}
                    <span className="font-semibold text-slate-900">{c.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    강의 {total}개 · 링크 등록 {linked}/{total}
                    {total > 0 && linked === total && " ✅ 완료"}
                  </p>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/courses/${c.id}`}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    강의 관리
                  </Link>
                  <form action={deleteCourse}>
                    <input type="hidden" name="id" value={c.id} />
                    <button
                      type="submit"
                      className="rounded-lg px-2 py-1.5 text-xs text-rose-500 hover:bg-rose-50"
                    >
                      삭제
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
