# 🎓 학원 출결·성적 관리

초중고 입시학원용 **출결 체크 + 성적 관리** 웹 앱입니다.
엑셀 대신 클릭 몇 번으로 출석을 체크하고, 점수를 입력하면 평균·석차가 자동 계산됩니다.

> 단일 관리자(원장) 기준 MVP. 로그인 없이 바로 사용하며, 이후 강사/학부모 계정으로 확장할 수 있는 구조입니다.

## 주요 기능

| 화면 | 설명 |
| --- | --- |
| **📊 대시보드** | 재원생 수, 운영 반, 오늘 출결 현황, 최근 시험 평균을 한눈에 |
| **✅ 출결** | 반·날짜 선택 후 학생별 상태(출석/지각/결석/조퇴/인정)를 클릭 → **자동 저장**. "전체 출석 처리" 버튼 지원 |
| **📝 성적** | 시험 생성 → 학생별 점수 입력 → **평균·최고·최저·석차 자동 계산** |
| **👥 학생** | 학생 등록, 반 배정, 재원/휴원 상태 관리 |
| **🏫 반 관리** | 과목·학년별 반 생성 및 강사 배정 |

## 기술 스택

- **[Next.js 14](https://nextjs.org/)** (App Router) + **React 18** + **TypeScript**
- **[Tailwind CSS](https://tailwindcss.com/)** — UI 스타일
- **[Prisma](https://www.prisma.io/)** + **SQLite** — 데이터베이스 (별도 서버 설치 불필요)
- **Server Actions** — 별도 API 서버 없이 폼 처리 및 자동 저장

## 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 데이터베이스 생성 + 샘플 데이터 넣기
npm run db:push
npm run db:seed

# 3. 개발 서버 실행
npm run dev
# → http://localhost:3000
```

### 자주 쓰는 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run db:push` | 스키마를 DB에 반영 |
| `npm run db:seed` | 샘플 데이터 생성 |
| `npm run db:reset` | DB 초기화 후 샘플 데이터 재생성 |

## 데이터 모델

```
ClassRoom (반)  ─┬─< Student (학생) ─┬─< Attendance (출결, 날짜별 1건)
                 │                    └─< Grade (성적)
                 └─< Exam (시험) ──────────< Grade (성적)
```

- **출결**은 `학생 × 날짜`로 유일 (하루 한 번). 상태는 `PRESENT/LATE/ABSENT/EARLY/EXCUSED`.
- **성적**은 `시험 × 학생`으로 유일. 석차는 입력된 점수 기준으로 실시간 계산(동점은 공동 등수).

## 데이터베이스에 대하여

개발용으로 파일 기반 **SQLite**(`prisma/dev.db`)를 사용합니다. `.gitignore`에 포함되어 저장소에 올라가지 않으므로,
새 환경에서는 `npm run db:push && npm run db:seed`로 손쉽게 생성할 수 있습니다.
실서비스로 확장할 때는 `prisma/schema.prisma`의 `datasource`를 PostgreSQL 등으로 교체하면 됩니다.

## 앞으로 확장하기 좋은 방향

- 강사별 로그인 및 담당 반 권한 분리
- 학부모용 성적/출결 조회 화면 및 알림톡 발송
- 출결/성적 리포트 PDF·엑셀 내보내기
- 월별 통계 및 학생별 성적 추이 그래프
