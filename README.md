# 돌려요 (Dollyeo) - 룰렛 애플리케이션

질문과 참여자를 관리하고 룰렛으로 무작위 선택을 할 수 있는 풀스택 웹 애플리케이션입니다.

## 🚀 기술 스택

### Core Stack

| 구분 | 기술 | 버전 | 설명 |
|------|------|------|------|
| **프레임워크** | Next.js | 16 | App Router 기반 풀스택 프레임워크 |
| **언어** | TypeScript | 5 | 타입 안정성 확보 |
| **스타일링** | Tailwind CSS | 4 | 유틸리티 기반 CSS 프레임워크 |
| **데이터베이스** | MongoDB + Mongoose | 7 / 9 | NoSQL 데이터베이스 |

### Feature Libraries

| 기능 | 라이브러리 | 설명 |
|------|------------|------|
| **상태 관리 (비동기)** | TanStack React Query | 서버 상태 캐싱, 재검증, 로딩/에러 상태 관리 |
| **상태 관리 (전역 UI)** | Zustand | UI 관련 글로벌 상태 관리 |
| **폼 관리** | React Hook Form + Zod | 타입 기반 폼 유효성 검사 |
| **애니메이션** | Framer Motion | 선언적 애니메이션 구현 |
| **인증** | NextAuth.js (Auth.js) | 인증 시스템 |
| **테스트** | Jest + React Testing Library | 단위 테스트 및 컴포넌트 테스트 |

---

## 📁 프로젝트 구조

```
/dollyeo-next-ts-fullstack
├── src/
│   ├── app/                          # 1. Next.js App Router (Routing & Rendering)
│   │   ├── (auth)/                   # 인증 라우트 그룹
│   │   │   ├── login/                # 로그인 페이지
│   │   │   └── register/             # 회원가입 페이지
│   │   ├── (dashboard)/              # 대시보드 (인증 필수 라우트)
│   │   │   ├── layout.tsx            # Server Component 기반 인증 검사
│   │   │   ├── providers.tsx         # React Query Provider
│   │   │   ├── questions/            # 질문 관리 페이지
│   │   │   ├── participants/         # 참여자 관리 페이지
│   │   │   └── roulette/             # 룰렛 돌리기 페이지 (핵심)
│   │   ├── api/auth/[...nextauth]/   # NextAuth API 라우트
│   │   ├── share/[shareToken]/       # 공유 링크 동적 라우팅
│   │   ├── layout.tsx                # 루트 레이아웃
│   │   └── page.tsx                  # 루트 페이지
│   │
│   ├── actions/                      # 2. Server Actions (DB/데이터 변경 주력 계층)
│   │   ├── auth.actions.ts           # NextAuth signIn/signOut 래핑 및 폼 처리
│   │   └── data.actions.ts           # 질문, 참여자 CRUD, 공유 설정 변경 로직
│   │
│   ├── auth/                         # 3. NextAuth.js 설정 및 헬퍼 함수
│   │   ├── auth.ts                   # NextAuth 코어 설정 (handlers, auth)
│   │   └── authOptions.ts            # Provider 및 Callback 정의
│   │
│   ├── components/                   # 4. 재사용 가능한 UI 컴포넌트
│   │   ├── ui/                       # 범용 컴포넌트 (Button, Input, Modal)
│   │   └── features/                 # 기능별 컴포넌트 (RouletteWheel, ShareSettingsModal)
│   │
│   ├── hooks/                        # 5. Custom Hooks (로직 캡슐화)
│   │   ├── useRoulette.ts            # 순수 로직과 Zustand를 통합하는 Hook
│   │   └── usePDFExport.ts           # PDF 출력 Custom Hook
│   │
│   ├── services/                     # 6. DB 접근 및 외부 API (Server-Only)
│   │   └── database.service.ts       # MongoDB CRUD 순수 함수
│   │
│   ├── store/                        # 7. Zustand Store 정의
│   │   └── uiStore.ts                # isSpinning, 모달 상태 등 UI 상태
│   │
│   ├── types/                        # 8. TypeScript 타입 정의
│   │   ├── data.d.ts                 # Question, Participant, Result, Sharing
│   │   └── next-auth.d.ts            # NextAuth 세션 타입 확장
│   │
│   └── utils/                        # 9. 순수 유틸리티 함수 (100% 테스트 대상!)
│       └── roulette.utils.ts         # 룰렛 결과 산출/셔플 알고리즘
│
├── tests/                            # Jest/RTL 테스트 파일
│   └── roulette.utils.test.ts
│
├── public/                           # 정적 파일
├── jest.config.ts                    # Jest 설정
├── tsconfig.json                     # TypeScript 설정
└── package.json
```

---

## 🗺️ 기능별 라이브러리 매핑

| 페이지/기능 | Server Component (SC) | Client Component (CC) | 데이터/API |
|-------------|----------------------|----------------------|------------|
| **로그인 페이지** | Layout/Metadata | React Hook Form, NextAuth.js | NextAuth 인증, Server Actions |
| **질문 리스트** | 데이터 패칭 (Async/Await) | React Query, Zustand | MongoDB, Server Actions |
| **룰렛 돌리기** | - | Custom Hook, Framer Motion, Zustand | roulette.utils.ts |

---

## 🛠️ 시작하기

### 사전 요구사항

- Node.js 20.19.0 이상
- MongoDB (로컬 또는 Atlas)

### 설치

```bash
# 의존성 설치
npm install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# MongoDB 연결 문자열
MONGODB_URI=mongodb://localhost:27017/dollyeo

# NextAuth.js 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

---

## 📜 사용 가능한 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 실행 |
| `npm run test` | 테스트 실행 |
| `npm run test:watch` | 테스트 워치 모드 |
| `npm run test:coverage` | 커버리지 포함 테스트 |

---

## 🧪 테스트

```bash
# 테스트 실행
npm run test

# 커버리지 리포트 생성
npm run test:coverage
```

### 테스트 구조

- `tests/` - 단위 테스트 및 통합 테스트
- 룰렛 순수 함수 100% 커버리지 목표

---

## 📦 주요 의존성

```json
{
  "dependencies": {
    "next": "16.0.6",
    "react": "19.2.0",
    "@tanstack/react-query": "^5.90.11",
    "zustand": "^5.0.9",
    "react-hook-form": "^7.67.0",
    "zod": "^4.1.13",
    "framer-motion": "^12.23.25",
    "next-auth": "^4.24.13",
    "mongodb": "^7.0.0",
    "mongoose": "^9.0.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^4",
    "jest": "^30.2.0",
    "@testing-library/react": "^16.3.0"
  }
}
```

---

## 📄 라이선스

MIT License
