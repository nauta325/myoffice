import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EARLY" | "EXCUSED";

// 초중고 입시 학원 샘플 데이터
async function main() {
  console.log("🌱 시드 데이터 생성 시작...");

  // 기존 데이터 정리 (순서 주의: 자식 → 부모)
  await prisma.grade.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.student.deleteMany();
  await prisma.classRoom.deleteMany();

  // 반 생성
  const math3 = await prisma.classRoom.create({
    data: { name: "중3 수학 심화A", subject: "수학", grade: "중3", teacher: "김원장" },
  });
  const eng2 = await prisma.classRoom.create({
    data: { name: "고2 영어 정규", subject: "영어", grade: "고2", teacher: "이선생" },
  });
  const kor6 = await prisma.classRoom.create({
    data: { name: "초6 국어 독해", subject: "국어", grade: "초6", teacher: "박선생" },
  });

  // 학생 생성
  const studentsData = [
    { name: "강민준", school: "한빛중", grade: "중3", parentPhone: "010-1234-0001", classRoomId: math3.id },
    { name: "김서연", school: "한빛중", grade: "중3", parentPhone: "010-1234-0002", classRoomId: math3.id },
    { name: "이도윤", school: "새롬중", grade: "중3", parentPhone: "010-1234-0003", classRoomId: math3.id },
    { name: "박하은", school: "새롬중", grade: "중3", parentPhone: "010-1234-0004", classRoomId: math3.id },
    { name: "최지호", school: "대성고", grade: "고2", parentPhone: "010-1234-0005", classRoomId: eng2.id },
    { name: "정예린", school: "대성고", grade: "고2", parentPhone: "010-1234-0006", classRoomId: eng2.id },
    { name: "윤시우", school: "대성고", grade: "고2", parentPhone: "010-1234-0007", classRoomId: eng2.id },
    { name: "장수아", school: "햇살초", grade: "초6", parentPhone: "010-1234-0008", classRoomId: kor6.id },
    { name: "임건우", school: "햇살초", grade: "초6", parentPhone: "010-1234-0009", classRoomId: kor6.id },
    { name: "한나윤", school: "푸른초", grade: "초6", parentPhone: "010-1234-0010", classRoomId: kor6.id },
  ];

  const students = [];
  for (const s of studentsData) {
    students.push(await prisma.student.create({ data: s }));
  }

  // 출결 기록: 최근 5회 수업 (자정 UTC 기준 날짜 키)
  const statuses: AttendanceStatus[] = ["PRESENT", "PRESENT", "PRESENT", "LATE", "ABSENT"];
  const today = new Date();
  for (let d = 0; d < 5; d++) {
    const day = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - d * 2)
    );
    for (const student of students) {
      // 대부분 출석, 가끔 지각/결석 섞기
      const roll = (student.id + d) % 7;
      const status: AttendanceStatus =
        roll === 0 ? "ABSENT" : roll === 1 ? "LATE" : "PRESENT";
      await prisma.attendance.create({
        data: { studentId: student.id, date: day, status },
      });
    }
  }
  void statuses;

  // 시험 및 성적
  const examConfigs = [
    { classRoom: math3, name: "3월 정기평가", offsetDays: 20 },
    { classRoom: math3, name: "4월 정기평가", offsetDays: 5 },
    { classRoom: eng2, name: "1학기 중간고사", offsetDays: 15 },
    { classRoom: kor6, name: "독해력 진단", offsetDays: 10 },
  ];

  for (const cfg of examConfigs) {
    const examDate = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - cfg.offsetDays)
    );
    const exam = await prisma.exam.create({
      data: { name: cfg.name, date: examDate, maxScore: 100, classRoomId: cfg.classRoom.id },
    });

    const classStudents = students.filter((s) => s.classRoomId === cfg.classRoom.id);
    for (const student of classStudents) {
      // 60~100 사이 의사난수 점수
      const base = 60 + ((student.id * 13 + cfg.offsetDays * 7) % 41);
      await prisma.grade.create({
        data: { examId: exam.id, studentId: student.id, score: base },
      });
    }
  }

  console.log(
    `✅ 완료: 반 3개, 학생 ${students.length}명, 출결·시험·성적 샘플 생성됨`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
