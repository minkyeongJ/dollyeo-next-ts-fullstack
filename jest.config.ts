import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Next.js 앱의 경로를 제공하여 테스트 환경에서 next.config.js 및 .env 파일을 로드
  dir: "./",
});

const config: Config = {
  // 각 테스트 전에 실행할 설정 파일
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // 테스트 환경 설정
  testEnvironment: "jsdom",

  // 모듈 경로 별칭 설정 (tsconfig의 paths와 일치)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // 테스트 파일 패턴
  testMatch: [
    "<rootDir>/tests/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],

  // 커버리지 설정
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/app/layout.tsx",
  ],

  // 커버리지 임계값 설정
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default createJestConfig(config);

