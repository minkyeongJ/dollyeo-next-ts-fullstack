import type { User } from "@/types/data";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "테스트 사용자",
    email: "test@example.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "user-2",
    name: "김개발",
    email: "dev@example.com",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
];

export const getCurrentMockUser = (): User => mockUsers[0];

