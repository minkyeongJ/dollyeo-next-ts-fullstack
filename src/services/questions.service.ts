import type { Question } from "@/types/data";
import { mockQuestionsDB } from "@/mocks";
// import { connectDB } from "./database.service";

/**
 * 질문 서비스
 * useMock 파라미터에 따라 목데이터 또는 실제 DB 사용
 */
export const QuestionsService = {
  /**
   * 모든 질문 조회
   */
  getAll: async (userId: string, useMock: boolean): Promise<Question[]> => {
    if (useMock) {
      // 목데이터에서 조회
      await delay(300); // 네트워크 지연 시뮬레이션
      return mockQuestionsDB.getAll(userId);
    }

    // TODO: 실제 DB 조회
    // await connectDB();
    // return await QuestionModel.find({ userId });
    throw new Error("실제 DB 연결이 구현되지 않았습니다.");
  },

  /**
   * ID로 질문 조회
   */
  getById: async (id: string, useMock: boolean): Promise<Question | null> => {
    if (useMock) {
      await delay(200);
      return mockQuestionsDB.getById(id);
    }

    // TODO: 실제 DB 조회
    throw new Error("실제 DB 연결이 구현되지 않았습니다.");
  },

  /**
   * 질문 생성
   */
  create: async (
    content: string,
    userId: string,
    useMock: boolean
  ): Promise<Question> => {
    if (useMock) {
      await delay(300);
      return mockQuestionsDB.create(content, userId);
    }

    // TODO: 실제 DB 생성
    throw new Error("실제 DB 연결이 구현되지 않았습니다.");
  },

  /**
   * 질문 수정
   */
  update: async (
    id: string,
    content: string,
    useMock: boolean
  ): Promise<Question | null> => {
    if (useMock) {
      await delay(300);
      return mockQuestionsDB.update(id, content);
    }

    // TODO: 실제 DB 수정
    throw new Error("실제 DB 연결이 구현되지 않았습니다.");
  },

  /**
   * 질문 삭제
   */
  delete: async (id: string, useMock: boolean): Promise<boolean> => {
    if (useMock) {
      await delay(200);
      return mockQuestionsDB.delete(id);
    }

    // TODO: 실제 DB 삭제
    throw new Error("실제 DB 연결이 구현되지 않았습니다.");
  },

  /**
   * 질문 포함/제외 토글
   */
  toggleIncluded: async (
    id: string,
    included: boolean,
    useMock: boolean
  ): Promise<Question | null> => {
    if (useMock) {
      await delay(200);
      return mockQuestionsDB.toggleIncluded(id, included);
    }

    // TODO: 실제 DB 토글
    throw new Error("실제 DB 연결이 구현되지 않았습니다.");
  },
};

// 네트워크 지연 시뮬레이션 헬퍼
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

