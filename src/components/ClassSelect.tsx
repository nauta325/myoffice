"use client";

import { useRef } from "react";
import { updateStudentClass } from "@/app/students/actions";

type ClassOption = { id: number; name: string };

// 학생의 반을 변경하면 즉시 저장하는 셀렉트
export function ClassSelect({
  studentId,
  currentClassId,
  classes,
}: {
  studentId: number;
  currentClassId: number | null;
  classes: ClassOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateStudentClass} className="inline">
      <input type="hidden" name="id" value={studentId} />
      <select
        name="classRoomId"
        defaultValue={currentClassId ?? ""}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded border border-slate-200 bg-white px-2 py-1 text-xs"
      >
        <option value="">미배정</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </form>
  );
}
