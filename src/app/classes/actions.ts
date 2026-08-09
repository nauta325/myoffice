"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createClass(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const teacher = String(formData.get("teacher") ?? "").trim();

  if (!name || !subject || !grade) return;

  await prisma.classRoom.create({
    data: { name, subject, grade, teacher: teacher || null },
  });
  revalidatePath("/classes");
  revalidatePath("/");
}

export async function deleteClass(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.classRoom.delete({ where: { id } });
  revalidatePath("/classes");
  revalidatePath("/");
}
