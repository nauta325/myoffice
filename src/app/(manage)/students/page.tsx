import { prisma } from "@/lib/prisma";
import { ClassSelect } from "@/components/ClassSelect";
import { createStudent, toggleActive } from "./actions";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const [students, classes] = await Promise.all([
    prisma.student.findMany({
      orderBy: [{ active: "desc" }, { name: "asc" }],
      include: { classRoom: true },
    }),
    prisma.classRoom.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">학생 관리</h1>
        <p className="mt-1 text-sm text-slate-500">
          재원생 {students.filter((s) => s.active).length}명
        </p>
      </div>

      {/* 학생 추가 폼 */}
      <form action={createStudent} className="card grid gap-3 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label className="label">이름 *</label>
          <input name="name" required placeholder="홍길동" className="input" />
        </div>
        <div>
          <label className="label">학년 *</label>
          <input name="grade" required placeholder="중3" className="input" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">학교</label>
          <input name="school" placeholder="OO중학교" className="input" />
        </div>
        <div>
          <label className="label">반</label>
          <select name="classRoomId" className="input" defaultValue="">
            <option value="">미배정</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label">학부모 연락처</label>
          <input name="parentPhone" placeholder="010-0000-0000" className="input" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">학생 연락처</label>
          <input name="phone" placeholder="010-0000-0000" className="input" />
        </div>
        <div className="flex items-end sm:col-span-2">
          <button type="submit" className="btn-primary w-full">
            + 학생 등록
          </button>
        </div>
      </form>

      {/* 학생 목록 */}
      {students.length === 0 ? (
        <p className="card text-center text-sm text-slate-400">
          등록된 학생이 없습니다.
        </p>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                <th className="px-4 py-3 font-medium">이름</th>
                <th className="px-4 py-3 font-medium">학년</th>
                <th className="px-4 py-3 font-medium">학교</th>
                <th className="px-4 py-3 font-medium">반</th>
                <th className="px-4 py-3 font-medium">학부모 연락처</th>
                <th className="px-4 py-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((s) => (
                <tr key={s.id} className={s.active ? "" : "opacity-50"}>
                  <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">{s.grade}</td>
                  <td className="px-4 py-3 text-slate-600">{s.school ?? "-"}</td>
                  <td className="px-4 py-3">
                    <ClassSelect
                      studentId={s.id}
                      currentClassId={s.classRoomId}
                      classes={classes}
                    />
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.parentPhone ?? "-"}</td>
                  <td className="px-4 py-3">
                    <form action={toggleActive}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="active" value={String(s.active)} />
                      <button
                        type="submit"
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          s.active
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {s.active ? "재원" : "휴/퇴원"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
