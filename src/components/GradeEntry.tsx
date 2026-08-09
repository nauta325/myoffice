"use client";

import { useState, useTransition } from "react";
import { scoreColor } from "@/lib/utils";
import { saveGrade } from "@/app/(manage)/grades/actions";

type Row = {
  studentId: number;
  name: string;
  score: number | null;
};

export function GradeEntry({
  examId,
  maxScore,
  initialRows,
}: {
  examId: number;
  maxScore: number;
  initialRows: Row[];
}) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [pending, startTransition] = useTransition();

  function commit(studentId: number, raw: string) {
    const trimmed = raw.trim();
    const score = trimmed === "" ? null : Number(trimmed);
    if (score !== null && (Number.isNaN(score) || score < 0 || score > maxScore))
      return;

    setRows((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, score } : r))
    );
    startTransition(() => saveGrade(examId, studentId, score));
  }

  // 통계 계산
  const entered = rows.filter((r) => r.score !== null) as {
    studentId: number;
    name: string;
    score: number;
  }[];
  const scores = entered.map((r) => r.score);
  const avg = scores.length
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : null;
  const max = scores.length ? Math.max(...scores) : null;
  const min = scores.length ? Math.min(...scores) : null;

  // 석차 계산 (동점은 같은 등수)
  const sorted = [...entered].sort((a, b) => b.score - a.score);
  const rankMap = new Map<number, number>();
  sorted.forEach((r, i) => {
    if (i > 0 && r.score === sorted[i - 1].score) {
      rankMap.set(r.studentId, rankMap.get(sorted[i - 1].studentId)!);
    } else {
      rankMap.set(r.studentId, i + 1);
    }
  });

  return (
    <div className="space-y-4">
      {/* 통계 요약 */}
      <div className="grid grid-cols-4 gap-3">
        <Stat label="평균" value={avg !== null ? avg.toFixed(1) : "-"} />
        <Stat label="최고" value={max !== null ? String(max) : "-"} />
        <Stat label="최저" value={min !== null ? String(min) : "-"} />
        <Stat label="응시" value={`${entered.length}/${rows.length}`} />
      </div>

      {pending && <p className="text-xs text-brand-500">저장 중…</p>}

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
              <th className="px-4 py-3 font-medium">이름</th>
              <th className="px-4 py-3 font-medium">점수 (/{maxScore})</th>
              <th className="px-4 py-3 font-medium text-right">석차</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((r) => {
              const rank = rankMap.get(r.studentId);
              return (
                <tr key={r.studentId}>
                  <td className="px-4 py-2.5 font-medium text-slate-800">
                    {r.name}
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      min={0}
                      max={maxScore}
                      defaultValue={r.score ?? ""}
                      onBlur={(e) => commit(r.studentId, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                      }}
                      placeholder="-"
                      className={`w-20 rounded border border-slate-200 px-2 py-1 text-sm font-semibold outline-none focus:border-brand-500 ${
                        r.score !== null
                          ? scoreColor(r.score / maxScore)
                          : "text-slate-400"
                      }`}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-500">
                    {rank ? `${rank}등` : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card py-3 text-center">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}
