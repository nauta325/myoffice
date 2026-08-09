import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ATTENDANCE_META, formatKoreanDate, parseDateKey, todayKey } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const todayDate = parseDateKey(todayKey());

  const [studentCount, classCount, todayAttendance, recentExams] =
    await Promise.all([
      prisma.student.count({ where: { active: true } }),
      prisma.classRoom.count(),
      prisma.attendance.findMany({ where: { date: todayDate } }),
      prisma.exam.findMany({
        orderBy: { date: "desc" },
        take: 5,
        include: {
          classRoom: true,
          grades: true,
        },
      }),
    ]);

  // 오늘 출결 요약
  const todaySummary = {
    PRESENT: 0,
    LATE: 0,
    ABSENT: 0,
    EARLY: 0,
    EXCUSED: 0,
  } as Record<string, number>;
  for (const a of todayAttendance) todaySummary[a.status]++;
  const checkedToday = todayAttendance.length;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
          <p className="mt-1 text-sm text-slate-500">
            {formatKoreanDate(todayDate)} 기준
          </p>
        </div>
        <Link href="/attendance" className="btn-primary">
          오늘 출석 체크 →
        </Link>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="재원생" value={`${studentCount}명`} icon="👥" />
        <StatCard label="운영 반" value={`${classCount}개`} icon="🏫" />
        <StatCard
          label="오늘 출석"
          value={`${todaySummary.PRESENT}명`}
          icon="✅"
          hint={checkedToday === 0 ? "미체크" : `${checkedToday}명 체크됨`}
        />
        <StatCard
          label="오늘 결석/지각"
          value={`${todaySummary.ABSENT + todaySummary.LATE}명`}
          icon="⚠️"
        />
      </div>

      {/* 오늘 출결 상세 */}
      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">오늘 출결 현황</h2>
          <Link href="/attendance" className="text-sm text-brand-600 hover:underline">
            출석부 열기
          </Link>
        </div>
        {checkedToday === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            아직 오늘 출석을 체크하지 않았어요.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(["PRESENT", "LATE", "ABSENT", "EARLY", "EXCUSED"] as const).map(
              (status) => (
                <span
                  key={status}
                  className={`rounded-full border px-3 py-1 text-sm font-medium ${ATTENDANCE_META[status].className}`}
                >
                  {ATTENDANCE_META[status].label} {todaySummary[status]}
                </span>
              )
            )}
          </div>
        )}
      </section>

      {/* 최근 시험 */}
      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">최근 시험 평균</h2>
          <Link href="/grades" className="text-sm text-brand-600 hover:underline">
            성적 관리
          </Link>
        </div>
        {recentExams.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            등록된 시험이 없습니다.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentExams.map((exam) => {
              const scores = exam.grades.map((g) => g.score);
              const avg =
                scores.length > 0
                  ? scores.reduce((a, b) => a + b, 0) / scores.length
                  : null;
              return (
                <div
                  key={exam.id}
                  className="flex items-center justify-between py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {exam.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {exam.classRoom.name} · {exam.grades.length}명 응시
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">
                      {avg !== null ? avg.toFixed(1) : "-"}
                    </p>
                    <p className="text-xs text-slate-400">/ {exam.maxScore}점</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon: string;
  hint?: string;
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
