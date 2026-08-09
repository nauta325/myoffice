"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createStudent(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const school = String(formData.get("school") ?? "").trim();
  const parentPhone = String(formData.get("parentPhone") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const classRoomId = Number(formData.get("classRoomId")) || null;

  if (!name || !grade) return;

  await prisma.student.create({
    data: {
      name,
      grade,
      school: school || null,
      parentPhone: parentPhone || null,
      phone: phone || null,
      classRoomId,
    },
  });
  revalidatePath("/students");
  revalidatePath("/");
}

export async function updateStudentClass(formData: FormData) {
  const id = Number(formData.get("id"));
  const classRoomId = Number(formData.get("classRoomId")) || null;
  if (!id) return;
  await prisma.student.update({ where: { id }, data: { classRoomId } });
  revalidatePath("/students");
}

export async function toggleActive(formData: FormData) {
  const id = Number(formData.get("id"));
  const active = formData.get("active") === "true";
  if (!id) return;
  await prisma.student.update({ where: { id }, data: { active: !active } });
  revalidatePath("/students");
  revalidatePath("/");
}
