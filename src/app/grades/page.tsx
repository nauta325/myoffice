import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GradeEntry } from "@/components/GradeEntry";
import { createExam, deleteExam } from "./actions";
import { formatKoreanDate, todayKey } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function GradesPage({
  searchParams,
}: {
  searchParams: { exam?: string };
}) {
  const classes = await prisma.classRoom.findMany({ orderBy: { name: "asc" } });
  const exams = await prisma.exam.findMany({
    orderBy: { date: "desc" },
    include: { classRoom: true, _count: { select: { grades: true } } },
  });

  const selectedExamId = searchParams.exam
    ? Number(searchParams.exam)
    : exams[0]?.id ?? null;

  const selectedExam = selectedExamId
    ? await prisma.exam.findUnique({
        where: { id: selectedExamId },
        include: {
          classRoom: {
            include: {
              students: {
                where: { active: true },
                orderBy: { name: "asc" },
              },
            },
          },
          grades: true,
        },
      })
    : null;

  const rows =
    selectedExam?.classRoom.students.map((s) => ({
      studentId: s.id,
      name: s.name,
      score: selectedExam.grades.find((g) => g.studentId === s.id)?.score ?? null,
    })) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">성적 관리</h1>
        <p className="mt-1 text-sm text-slate-500">
          시험을 만들고 점수를 입력하면 평균·석차가 자동 계산됩니다.
        </p>
      </div>

      {classes.length === 0 ? (
        <div className="card text-center text-sm text-slate-400">
          먼저{" "}
          <Link href="/classes" className="text-brand-600 hover:underline">
            반 관리
          </Link>
          에서 반을 만들어주세요.
        </div>
      ) : (
        <>
          {/* 시험 추가 */}
          <form action={createExam} className="card grid gap-3 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <label className="label">시험 이름</label>
              <input name="name" required placeholder="예: 3월 정기평가" className="input" />
            </div>
            <div>
              <label className="label">반</label>
              <select name="classRoomId" required className="input">
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">시험일</label>
              <input type="date" name="date" required defaultValue={todayKey()} className="input" />
            </div>
            <div>
              <label className="label">만점</label>
              <input type="number" name="maxScore" defaultValue={100} className="input" />
            </div>
            <div className="sm:col-span-5">
              <button type="submit" className="btn-primary">
                + 시험 추가
              </button>
            </div>
          </form>

          <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
            {/* 시험 목록 */}
            <div className="space-y-2">
              <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                시험 목록
              </h2>
              {exams.length === 0 ? (
                <p className="card text-center text-sm text-slate-400">
                  등록된 시험이 없습니다.
                </p>
              ) : (
                exams.map((exam) => {
                  const active = exam.id === selectedExamId;
                  return (
                    <div
                      key={exam.id}
                      className={`card flex items-center justify-between p-3 ${
                        active ? "ring-2 ring-brand-400" : ""
                      }`}
                    >
                      <Link href={`/grades?exam=${exam.id}`} className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {exam.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {exam.classRoom.name} · {formatKoreanDate(exam.date)}
                        </p>
                      </Link>
                      <form action={deleteExam}>
                        <input type="hidden" name="id" value={exam.id} />
                        <button
                          type="submit"
                          className="rounded px-1.5 py-1 text-xs text-rose-400 hover:bg-rose-50"
                        >
                          ✕
                        </button>
                      </form>
                    </div>
                  );
                })
              )}
            </div>

            {/* 점수 입력 */}
            <div>
              {selectedExam ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-slate-900">
                      {selectedExam.name}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {selectedExam.classRoom.name} ·{" "}
                      {formatKoreanDate(selectedExam.date)}
                    </p>
                  </div>
                  {rows.length === 0 ? (
                    <p className="card text-center text-sm text-slate-400">
                      이 반에 배정된 재원생이 없습니다.
                    </p>
                  ) : (
                    <GradeEntry
                      key={selectedExam.id}
                      examId={selectedExam.id}
                      maxScore={selectedExam.maxScore}
                      initialRows={rows}
                    />
                  )}
                </>
              ) : (
                <p className="card text-center text-sm text-slate-400">
                  왼쪽에서 시험을 선택하세요.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
