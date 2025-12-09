import type { Participant } from "@/types/data";
import { mockParticipantsDB } from "@/mocks";
// import { connectDB } from "./database.service";

/**
 * 참여자 서비스
 * useMock 파라미터에 따라 목데이터 또는 실제 DB 사용
 */
export const ParticipantsService = {
  /**
   * 모든 참여자 조회
   */
  getAll: async (userId: string, useMock: boolean): Promise<Participant[]> => {
    if (useMock) {
      // 목데이터에서 조회
      await delay(300); // 네트워크 지연 시뮬레이션
      return mockParticipantsDB.getAll(userId);
    }

    // TODO: 실제 DB 조회
    // await connectDB();
    // return await ParticipantModel.find({ userId });
    throw new Error("실제 DB 연결이 구현되지 않았습니다.");
  },

  /**
   * ID로 참여자 조회
   */
  getById: async (id: string, useMock: boolean): Promise<Participant | null> => {
    if (useMock) {
      await delay(200);
      return mockParticipantsDB.getById(id);
    }

    // TODO: 실제 DB 조회
    throw new Error("실제 DB 연결이 구현되지 않았습니다.");
  },

  /**
   * 참여자 생성
   */
  create: async (
    name: string,
    userId: string,
    useMock: boolean
  ): Promise<Participant> => {
    if (useMock) {
      await delay(300);
      return mockParticipantsDB.create(name, userId);
    }

    // TODO: 실제 DB 생성
    throw new Error("실제 DB 연결이 구현되지 않았습니다.");
  },

  /**
   * 참여자 수정
   */
  update: async (
    id: string,
    name: string,
    useMock: boolean
  ): Promise<Participant | null> => {
    if (useMock) {
      await delay(300);
      return mockParticipantsDB.update(id, name);
    }

    // TODO: 실제 DB 수정
    throw new Error("실제 DB 연결이 구현되지 않았습니다.");
  },

  /**
   * 참여자 삭제
   */
  delete: async (id: string, useMock: boolean): Promise<boolean> => {
    if (useMock) {
      await delay(200);
      return mockParticipantsDB.delete(id);
    }

    // TODO: 실제 DB 삭제
    throw new Error("실제 DB 연결이 구현되지 않았습니다.");
  },
};

// 네트워크 지연 시뮬레이션 헬퍼
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

