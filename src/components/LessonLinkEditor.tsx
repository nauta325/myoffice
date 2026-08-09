"use client";

import { useState, useTransition } from "react";
import { saveLessonUrl } from "@/app/(manage)/courses/actions";
import { resolveVideo } from "@/lib/utils";

// 강의 하나의 영상 링크를 붙여넣고 저장하는 인라인 에디터
export function LessonLinkEditor({
  lessonId,
  initialUrl,
}: {
  lessonId: number;
  initialUrl: string | null;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [saved, setSaved] = useState(initialUrl ?? "");
  const [pending, startTransition] = useTransition();

  const dirty = url.trim() !== saved.trim();
  const resolved = resolveVideo(saved);

  function save() {
    startTransition(async () => {
      await saveLessonUrl(lessonId, url);
      setSaved(url.trim());
    });
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="네이버 마이박스 등 영상 링크를 붙여넣기"
        className="input flex-1"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={save}
          disabled={!dirty || pending}
          className="btn-primary whitespace-nowrap"
        >
          {pending ? "저장 중…" : "저장"}
        </button>
        {url.trim() && (
          <a
            href={url.trim()}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost whitespace-nowrap"
          >
            미리보기 ↗
          </a>
        )}
      </div>
      <StatusBadge kind={resolved.kind} dirty={dirty} />
    </div>
  );
}

function StatusBadge({
  kind,
  dirty,
}: {
  kind: ReturnType<typeof resolveVideo>["kind"];
  dirty: boolean;
}) {
  if (dirty)
    return (
      <span className="shrink-0 text-xs font-medium text-amber-600">
        저장 안 됨
      </span>
    );
  const map: Record<typeof kind, { label: string; cls: string }> = {
    empty: { label: "링크 없음", cls: "text-slate-400" },
    external: { label: "링크 연결됨", cls: "text-emerald-600" },
    youtube: { label: "YouTube 임베드", cls: "text-emerald-600" },
    file: { label: "영상 파일", cls: "text-emerald-600" },
  };
  const m = map[kind];
  return <span className={`shrink-0 text-xs font-medium ${m.cls}`}>{m.label}</span>;
}
