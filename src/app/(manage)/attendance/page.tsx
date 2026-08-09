import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AttendanceGrid } from "@/components/AttendanceGrid";
import {
  formatKoreanDate,
  parseDateKey,
  todayKey,
  type AttendanceStatus,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: { class?: string; date?: string };
}) {
  const classes = await prisma.classRoom.findMany({ orderBy: { name: "asc" } });

  const dateKey = searchParams.date ?? todayKey();
  const selectedClassId = searchParams.class
    ? Number(searchParams.class)
    : classes[0]?.id ?? null;

  const date = parseDateKey(dateKey);

  const students = selectedClassId
    ? await prisma.student.findMany({
        where: { classRoomId: selectedClassId, active: true },
        orderBy: { name: "asc" },
        include: {
          attendances: { where: { date } },
        },
      })
    : [];

  const rows = students.map((s) => ({
    studentId: s.id,
    name: s.name,
    grade: s.grade,
    status: (s.attendances[0]?.status ?? null) as AttendanceStatus | null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">출결 체크</h1>
        <p className="mt-1 text-sm text-slate-500">
          반과 날짜를 고르고 학생별 상태를 클릭하세요. 자동 저장됩니다.
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
          {/* 반 / 날짜 선택 */}
          <form className="card flex flex-wrap items-end gap-3">
            <div>
              <label className="label">반</label>
              <select
                name="class"
                defaultValue={selectedClassId ?? ""}
                className="input min-w-[12rem]"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">날짜</label>
              <input type="date" name="date" defaultValue={dateKey} className="input" />
            </div>
            <button type="submit" className="btn-primary">
              조회
            </button>
            <span className="ml-auto text-sm text-slate-500">
              {formatKoreanDate(date)}
            </span>
          </form>

          {rows.length === 0 ? (
            <p className="card text-center text-sm text-slate-400">
              이 반에 배정된 재원생이 없습니다.
            </p>
          ) : (
            <AttendanceGrid
              key={`${selectedClassId}-${dateKey}`}
              classRoomId={selectedClassId!}
              dateKey={dateKey}
              initialRows={rows}
            />
          )}
        </>
      )}
    </div>
  );
}
