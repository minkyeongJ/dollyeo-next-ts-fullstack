import type { Question } from "@/types/data";

export const mockQuestions: Question[] = [
  {
    id: "q-1",
    content: "오늘 점심 뭐 먹을까요?",
    userId: "user-1",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "q-2",
    content: "다음 스프린트에서 어떤 기능을 먼저 개발할까요?",
    userId: "user-1",
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
  },
  {
    id: "q-3",
    content: "이번 주 코드 리뷰는 누가 담당할까요?",
    userId: "user-1",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "q-4",
    content: "팀 회의 발표자는 누구로 할까요?",
    userId: "user-1",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
  },
  {
    id: "q-5",
    content: "오늘 회식 장소는 어디로 할까요?",
    userId: "user-1",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
];

// 목데이터 조작을 위한 헬퍼 (메모리에서만 동작)
let questionsStore = [...mockQuestions];

export const mockQuestionsDB = {
  getAll: (userId?: string) => {
    if (userId) {
      return questionsStore.filter((q) => q.userId === userId);
    }
    return questionsStore;
  },

  getById: (id: string) => {
    return questionsStore.find((q) => q.id === id) || null;
  },

  create: (content: string, userId: string): Question => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      content,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    questionsStore.push(newQuestion);
    return newQuestion;
  },

  update: (id: string, content: string): Question | null => {
    const index = questionsStore.findIndex((q) => q.id === id);
    if (index === -1) return null;

    questionsStore[index] = {
      ...questionsStore[index],
      content,
      updatedAt: new Date(),
    };
    return questionsStore[index];
  },

  delete: (id: string): boolean => {
    const index = questionsStore.findIndex((q) => q.id === id);
    if (index === -1) return false;

    questionsStore.splice(index, 1);
    return true;
  },

  // 테스트용: 초기 상태로 리셋
  reset: () => {
    questionsStore = [...mockQuestions];
  },
};

