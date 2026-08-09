import { prisma } from "@/lib/prisma";
import { createClass, deleteClass } from "./actions";

export const dynamic = "force-dynamic";

export default async function ClassesPage() {
  const classes = await prisma.classRoom.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { students: true, exams: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">반 관리</h1>
        <p className="mt-1 text-sm text-slate-500">
          과목·학년별 반을 만들고 학생을 배정하세요.
        </p>
      </div>

      {/* 반 추가 폼 */}
      <form action={createClass} className="card grid gap-3 sm:grid-cols-5">
        <div className="sm:col-span-2">
          <label className="label">반 이름</label>
          <input name="name" required placeholder="예: 중3 수학 심화A" className="input" />
        </div>
        <div>
          <label className="label">과목</label>
          <input name="subject" required placeholder="수학" className="input" />
        </div>
        <div>
          <label className="label">학년</label>
          <input name="grade" required placeholder="중3" className="input" />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="label">담당 강사</label>
            <input name="teacher" placeholder="선택" className="input" />
          </div>
        </div>
        <div className="sm:col-span-5">
          <button type="submit" className="btn-primary">
            + 반 추가
          </button>
        </div>
      </form>

      {/* 반 목록 */}
      {classes.length === 0 ? (
        <p className="card text-center text-sm text-slate-400">
          아직 반이 없습니다. 위에서 첫 반을 추가하세요.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {classes.map((c) => (
            <div key={c.id} className="card flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{c.name}</span>
                  <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                    {c.subject}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {c.grade} · {c.teacher ?? "담당 미지정"} · 학생 {c._count.students}명 ·
                  시험 {c._count.exams}회
                </p>
              </div>
              <form action={deleteClass}>
                <input type="hidden" name="id" value={c.id} />
                <button
                  type="submit"
                  className="rounded-lg px-2 py-1 text-xs text-rose-500 hover:bg-rose-50"
                >
                  삭제
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
