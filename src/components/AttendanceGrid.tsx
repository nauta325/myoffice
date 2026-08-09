"use client";

import { useState, useTransition } from "react";
import {
  ATTENDANCE_META,
  ATTENDANCE_ORDER,
  type AttendanceStatus,
} from "@/lib/utils";
import { markAllPresent, setAttendance } from "@/app/attendance/actions";

type Row = {
  studentId: number;
  name: string;
  grade: string;
  status: AttendanceStatus | null;
};

export function AttendanceGrid({
  classRoomId,
  dateKey,
  initialRows,
}: {
  classRoomId: number;
  dateKey: string;
  initialRows: Row[];
}) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [pending, startTransition] = useTransition();

  function mark(studentId: number, status: AttendanceStatus) {
    // 낙관적 업데이트
    setRows((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
    startTransition(() => setAttendance(studentId, dateKey, status));
  }

  function allPresent() {
    setRows((prev) =>
      prev.map((r) => (r.status === null ? { ...r, status: "PRESENT" } : r))
    );
    startTransition(() => markAllPresent(classRoomId, dateKey));
  }

  const checked = rows.filter((r) => r.status !== null).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {checked}/{rows.length}명 체크됨
          {pending && <span className="ml-2 text-brand-500">저장 중…</span>}
        </p>
        <button onClick={allPresent} className="btn-ghost text-sm">
          전체 출석 처리
        </button>
      </div>

      <div className="card space-y-1 p-2">
        {rows.map((r) => (
          <div
            key={r.studentId}
            className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-slate-50"
          >
            <div className="min-w-0">
              <span className="font-medium text-slate-800">{r.name}</span>
              <span className="ml-2 text-xs text-slate-400">{r.grade}</span>
            </div>
            <div className="flex shrink-0 gap-1">
              {ATTENDANCE_ORDER.map((status) => {
                const active = r.status === status;
                const meta = ATTENDANCE_META[status];
                return (
                  <button
                    key={status}
                    onClick={() => mark(r.studentId, status)}
                    title={meta.label}
                    className={`h-8 w-8 rounded-lg border text-xs font-bold transition ${
                      active
                        ? meta.className
                        : "border-slate-200 bg-white text-slate-300 hover:border-slate-300 hover:text-slate-500"
                    }`}
                  >
                    {meta.short}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
