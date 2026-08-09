// 교재 목차 (CONTENTS) — 강의실 기본 강좌/강의 데이터.
// 시드 스크립트와 관리 화면의 "교재 목차 불러오기" 버튼이 함께 사용한다.

export type CurriculumUnit = { code: string; title: string; page: number };
export type CurriculumChapter = {
  code: string;
  title: string;
  units: CurriculumUnit[];
};

export const CURRICULUM: CurriculumChapter[] = [
  {
    code: "GRAMMAR BASICS",
    title: "문법 기초",
    units: [{ code: "", title: "Grammar Basics", page: 6 }],
  },
  {
    code: "CHAPTER 01",
    title: "be동사",
    units: [
      { code: "Unit 01", title: "be동사의 현재형과 과거형", page: 12 },
      { code: "Unit 02", title: "be동사의 부정문과 의문문", page: 14 },
    ],
  },
  {
    code: "CHAPTER 02",
    title: "일반동사",
    units: [
      { code: "Unit 01", title: "일반동사의 현재형", page: 24 },
      { code: "Unit 02", title: "일반동사의 과거형", page: 26 },
      { code: "Unit 03", title: "일반동사의 부정문", page: 28 },
      { code: "Unit 04", title: "일반동사의 의문문", page: 30 },
    ],
  },
  {
    code: "CHAPTER 03",
    title: "조동사",
    units: [
      { code: "Unit 01", title: "can, may", page: 40 },
      { code: "Unit 02", title: "must, have to, should", page: 42 },
    ],
  },
  {
    code: "CHAPTER 04",
    title: "진행형과 미래시제",
    units: [
      { code: "Unit 01", title: "진행형", page: 52 },
      { code: "Unit 02", title: "will, be going to", page: 54 },
    ],
  },
  {
    code: "CHAPTER 05",
    title: "동사의 종류",
    units: [
      { code: "Unit 01", title: "감각동사 + 형용사", page: 64 },
      { code: "Unit 02", title: "목적어가 두 개 필요한 동사", page: 66 },
      { code: "Unit 03", title: "목적격 보어가 필요한 동사", page: 68 },
    ],
  },
  {
    code: "CHAPTER 06",
    title: "명사와 관사",
    units: [
      { code: "Unit 01", title: "셀 수 있는 명사 vs. 셀 수 없는 명사", page: 78 },
      { code: "Unit 02", title: "관사", page: 80 },
    ],
  },
];
