import type { Participant } from "@/types/data";

export const mockParticipants: Participant[] = [
  {
    id: "p-1",
    name: "김철수",
    userId: "user-1",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "p-2",
    name: "이영희",
    userId: "user-1",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "p-3",
    name: "박민수",
    userId: "user-1",
    createdAt: new Date("2024-01-11"),
  },
  {
    id: "p-4",
    name: "최지연",
    userId: "user-1",
    createdAt: new Date("2024-01-11"),
  },
  {
    id: "p-5",
    name: "정우성",
    userId: "user-1",
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "p-6",
    name: "한소희",
    userId: "user-1",
    createdAt: new Date("2024-01-12"),
  },
];

// 목데이터 조작을 위한 헬퍼 (메모리에서만 동작)
let participantsStore = [...mockParticipants];

export const mockParticipantsDB = {
  getAll: (userId?: string) => {
    if (userId) {
      return participantsStore.filter((p) => p.userId === userId);
    }
    return participantsStore;
  },

  getById: (id: string) => {
    return participantsStore.find((p) => p.id === id) || null;
  },

  create: (name: string, userId: string): Participant => {
    const newParticipant: Participant = {
      id: `p-${Date.now()}`,
      name,
      userId,
      createdAt: new Date(),
    };
    participantsStore.push(newParticipant);
    return newParticipant;
  },

  update: (id: string, name: string): Participant | null => {
    const index = participantsStore.findIndex((p) => p.id === id);
    if (index === -1) return null;

    participantsStore[index] = {
      ...participantsStore[index],
      name,
    };
    return participantsStore[index];
  },

  delete: (id: string): boolean => {
    const index = participantsStore.findIndex((p) => p.id === id);
    if (index === -1) return false;

    participantsStore.splice(index, 1);
    return true;
  },

  // 테스트용: 초기 상태로 리셋
  reset: () => {
    participantsStore = [...mockParticipants];
  },
};

