// 출결 상태 유니온 타입 (SQLite enum 미지원으로 앱 레벨에서 정의)
export type AttendanceStatus =
  | "PRESENT"
  | "LATE"
  | "ABSENT"
  | "EARLY"
  | "EXCUSED";

// 출결 상태 라벨/색상 정의
export const ATTENDANCE_META: Record<
  AttendanceStatus,
  { label: string; short: string; className: string }
> = {
  PRESENT: {
    label: "출석",
    short: "출",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  LATE: {
    label: "지각",
    short: "지",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  ABSENT: {
    label: "결석",
    short: "결",
    className: "bg-rose-100 text-rose-700 border-rose-200",
  },
  EARLY: {
    label: "조퇴",
    short: "조",
    className: "bg-sky-100 text-sky-700 border-sky-200",
  },
  EXCUSED: {
    label: "인정",
    short: "인",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export const ATTENDANCE_ORDER: AttendanceStatus[] = [
  "PRESENT",
  "LATE",
  "ABSENT",
  "EARLY",
  "EXCUSED",
];

// "YYYY-MM-DD" 형식으로 (로컬 기준) 변환
export function toDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// "YYYY-MM-DD" 문자열을 자정(UTC) Date로 변환 — 날짜 키 일관성 유지
export function parseDateKey(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function todayKey(): string {
  return toDateInput(new Date());
}

// 한국어 날짜 표기
export function formatKoreanDate(date: Date): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일 (${
    days[date.getUTCDay()]
  })`;
}

// 점수 → 등급/색상 (100점 만점 환산 기준)
export function scoreColor(ratio: number): string {
  if (ratio >= 0.9) return "text-emerald-600";
  if (ratio >= 0.7) return "text-sky-600";
  if (ratio >= 0.5) return "text-amber-600";
  return "text-rose-600";
}
