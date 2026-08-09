import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LessonLinkEditor } from "@/components/LessonLinkEditor";
import { createLesson, deleteLesson } from "../actions";

export const dynamic = "force-dynamic";

export default async function CourseLessonsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const courseId = Number(params.courseId);
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: { orderBy: { order: "asc" } } },
  });
  if (!course) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/courses" className="text-sm text-brand-600 hover:underline">
          ← 강의 관리
        </Link>
        <div className="mt-1 flex items-center gap-2">
          {course.code && (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
              {course.code}
            </span>
          )}
          <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          각 강의에 영상 링크(네이버 마이박스 공유 링크)를 붙여넣고 저장하세요.
        </p>
      </div>

      {/* 강의 목록 + 링크 편집 */}
      {course.lessons.length === 0 ? (
        <p className="card text-center text-sm text-slate-400">
          아직 강의가 없습니다. 아래에서 강의를 추가하세요.
        </p>
      ) : (
        <div className="space-y-3">
          {course.lessons.map((l) => (
            <div key={l.id} className="card space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {l.code && (
                      <span className="text-xs font-semibold text-brand-600">
                        {l.code}
                      </span>
                    )}
                    <span className="font-medium text-slate-800">{l.title}</span>
                  </div>
                  {l.page && (
                    <p className="mt-0.5 text-xs text-slate-400">교재 {l.page}p</p>
                  )}
                </div>
                <form action={deleteLesson}>
                  <input type="hidden" name="id" value={l.id} />
                  <input type="hidden" name="courseId" value={course.id} />
                  <button
                    type="submit"
                    className="rounded-lg px-2 py-1 text-xs text-rose-400 hover:bg-rose-50"
                  >
                    삭제
                  </button>
                </form>
              </div>
              <LessonLinkEditor lessonId={l.id} initialUrl={l.videoUrl} />
            </div>
          ))}
        </div>
      )}

      {/* 강의 추가 */}
      <form action={createLesson} className="card grid gap-3 sm:grid-cols-6">
        <input type="hidden" name="courseId" value={course.id} />
        <h2 className="sm:col-span-6 text-sm font-semibold text-slate-700">
          강의 추가
        </h2>
        <div className="sm:col-span-1">
          <label className="label">라벨</label>
          <input name="code" placeholder="Unit 03" className="input" />
        </div>
        <div className="sm:col-span-3">
          <label className="label">강의 제목 *</label>
          <input name="title" required placeholder="예: 부정관사 a/an" className="input" />
        </div>
        <div className="sm:col-span-1">
          <label className="label">교재 페이지</label>
          <input name="page" type="number" placeholder="82" className="input" />
        </div>
        <div className="flex items-end sm:col-span-1">
          <button type="submit" className="btn-primary w-full">
            + 추가
          </button>
        </div>
        <div className="sm:col-span-6">
          <label className="label">영상 링크 (선택 · 나중에 등록 가능)</label>
          <input name="videoUrl" placeholder="네이버 마이박스 공유 링크" className="input" />
        </div>
      </form>
    </div>
  );
}
