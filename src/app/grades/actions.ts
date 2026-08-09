"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseDateKey } from "@/lib/utils";

export async function createExam(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const classRoomId = Number(formData.get("classRoomId"));
  const dateKey = String(formData.get("date") ?? "").trim();
  const maxScore = Number(formData.get("maxScore")) || 100;

  if (!name || !classRoomId || !dateKey) return;

  await prisma.exam.create({
    data: {
      name,
      classRoomId,
      date: parseDateKey(dateKey),
      maxScore,
    },
  });
  revalidatePath("/grades");
  revalidatePath("/");
}

export async function deleteExam(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.exam.delete({ where: { id } });
  revalidatePath("/grades");
  revalidatePath("/");
}

// 점수 저장 (빈 값이면 삭제)
export async function saveGrade(
  examId: number,
  studentId: number,
  score: number | null
) {
  if (score === null || Number.isNaN(score)) {
    await prisma.grade.deleteMany({ where: { examId, studentId } });
  } else {
    await prisma.grade.upsert({
      where: { examId_studentId: { examId, studentId } },
      create: { examId, studentId, score },
      update: { score },
    });
  }
  revalidatePath("/grades");
  revalidatePath("/");
}
