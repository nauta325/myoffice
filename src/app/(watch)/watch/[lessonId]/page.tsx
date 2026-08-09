import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resolveVideo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LessonViewerPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const lessonId = Number(params.lessonId);
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: { include: { lessons: { orderBy: { order: "asc" } } } } },
  });
  if (!lesson) notFound();

  const video = resolveVideo(lesson.videoUrl);
  const siblings = lesson.course.lessons;
  const idx = siblings.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;

  return (
    <div className="space-y-5">
      <Link href="/watch" className="text-sm text-brand-600 hover:underline">
        ← 강의 목차
      </Link>

      {/* 강의 정보 */}
      <div>
        <p className="text-sm text-slate-400">
          {lesson.course.code ? `${lesson.course.code} · ` : ""}
          {lesson.course.title}
        </p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">
          {lesson.code && (
            <span className="mr-2 text-base text-brand-600">{lesson.code}</span>
          )}
          {lesson.title}
        </h1>
        {lesson.page && (
          <p className="mt-1 text-sm text-slate-400">교재 {lesson.page}p</p>
        )}
      </div>

      {/* 영상 영역 */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
        {video.kind === "youtube" ? (
          <div className="aspect-video">
            <iframe
              src={video.embedUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : video.kind === "file" ? (
          <video src={video.src} controls className="aspect-video w-full" />
        ) : (
          <ExternalVideoCard
            url={video.kind === "external" ? video.url : ""}
            provider={video.kind === "external" ? video.provider : "외부 링크"}
          />
        )}
      </div>

      {video.kind === "external" && (
        <p className="text-center text-xs text-slate-400">
          영상이 새 탭에서 열립니다. 시청 후 이 페이지로 돌아와 다음 강의를 이어가세요.
        </p>
      )}

      {lesson.note && (
        <div className="card bg-amber-50 text-sm text-amber-800">
          📌 {lesson.note}
        </div>
      )}

      {/* 이전/다음 */}
      <div className="flex items-center justify-between gap-3">
        {prev ? (
          <Link href={`/watch/${prev.id}`} className="btn-ghost flex-1 justify-start">
            ← {prev.title}
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link href={`/watch/${next.id}`} className="btn-ghost flex-1 justify-end">
            {next.title} →
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </div>
    </div>
  );
}

// 네이버 마이박스 등 임베드 불가 링크 — 새 탭 열기 카드
function ExternalVideoCard({
  url,
  provider,
}: {
  url: string;
  provider: string;
}) {
  return (
    <div className="flex aspect-video flex-col items-center justify-center gap-4 bg-slate-900 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl text-white">
        ▶
      </div>
      <p className="text-sm text-slate-300">{provider}에 올라온 강의 영상입니다</p>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
        >
          ▶ 영상 보기 (새 탭)
        </a>
      ) : (
        <p className="text-sm text-slate-500">아직 영상이 등록되지 않았습니다.</p>
      )}
    </div>
  );
}
