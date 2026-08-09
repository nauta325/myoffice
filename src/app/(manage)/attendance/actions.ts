"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseDateKey, type AttendanceStatus } from "@/lib/utils";

// 학생 1명의 특정 날짜 출결을 설정 (있으면 수정, 없으면 생성)
export async function setAttendance(
  studentId: number,
  dateKey: string,
  status: AttendanceStatus
) {
  const date = parseDateKey(dateKey);
  await prisma.attendance.upsert({
    where: { studentId_date: { studentId, date } },
    create: { studentId, date, status },
    update: { status },
  });
  revalidatePath("/attendance");
  revalidatePath("/");
}

// 반 전체를 한 번에 출석 처리 (아직 체크 안 된 학생만)
export async function markAllPresent(classRoomId: number, dateKey: string) {
  const date = parseDateKey(dateKey);
  const students = await prisma.student.findMany({
    where: { classRoomId, active: true },
    select: { id: true },
  });
  await prisma.$transaction(
    students.map((s) =>
      prisma.attendance.upsert({
        where: { studentId_date: { studentId: s.id, date } },
        create: { studentId: s.id, date, status: "PRESENT" },
        update: {},
      })
    )
  );
  revalidatePath("/attendance");
  revalidatePath("/");
}
