"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CURRICULUM } from "@/lib/curriculum";

// 교재 목차(CURRICULUM)를 한 번에 생성 — 강좌가 하나도 없을 때만 동작(중복/덮어쓰기 방지)
export async function seedCurriculum() {
  const existing = await prisma.course.count();
  if (existing > 0) return;

  for (let i = 0; i < CURRICULUM.length; i++) {
    const c = CURRICULUM[i];
    const course = await prisma.course.create({
      data: { code: c.code, title: c.title, order: i },
    });
    for (let u = 0; u < c.units.length; u++) {
      const unit = c.units[u];
      await prisma.lesson.create({
        data: {
          code: unit.code || null,
          title: unit.title,
          page: unit.page,
          order: u,
          courseId: course.id,
        },
      });
    }
  }
  revalidatePath("/courses");
  revalidatePath("/watch");
}

// ─── 강좌(챕터) ───
export async function createCourse(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  if (!title) return;

  const last = await prisma.course.findFirst({ orderBy: { order: "desc" } });
  await prisma.course.create({
    data: { title, code: code || null, order: (last?.order ?? -1) + 1 },
  });
  revalidatePath("/courses");
  revalidatePath("/watch");
}

export async function deleteCourse(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.course.delete({ where: { id } });
  revalidatePath("/courses");
  revalidatePath("/watch");
}

// ─── 강의(Unit) ───
export async function createLesson(formData: FormData) {
  const courseId = Number(formData.get("courseId"));
  const title = String(formData.get("title") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const pageRaw = String(formData.get("page") ?? "").trim();
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  if (!courseId || !title) return;

  const last = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
  });
  await prisma.lesson.create({
    data: {
      courseId,
      title,
      code: code || null,
      page: pageRaw ? Number(pageRaw) : null,
      videoUrl: videoUrl || null,
      order: (last?.order ?? -1) + 1,
    },
  });
  revalidatePath(`/courses/${courseId}`);
  revalidatePath("/watch");
}

export async function deleteLesson(formData: FormData) {
  const id = Number(formData.get("id"));
  const courseId = Number(formData.get("courseId"));
  if (!id) return;
  await prisma.lesson.delete({ where: { id } });
  revalidatePath(`/courses/${courseId}`);
  revalidatePath("/watch");
}

// 영상 링크만 저장 (원장이 마이박스 링크를 붙여넣는 핵심 동작)
export async function saveLessonUrl(lessonId: number, videoUrl: string) {
  const trimmed = videoUrl.trim();
  const lesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: { videoUrl: trimmed || null },
  });
  revalidatePath(`/courses/${lesson.courseId}`);
  revalidatePath("/watch");
}
