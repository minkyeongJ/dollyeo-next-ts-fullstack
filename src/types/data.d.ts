// ==================== User ====================

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Question ====================

export interface Question {
  id: string;
  content: string;
  userId: string;
  isIncluded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Participant ====================

export interface Participant {
  id: string;
  name: string;
  userId: string;
  isIncluded: boolean;
  createdAt: Date;
}

// ==================== Roulette ====================

export interface RouletteResult {
  id?: string;
  selectedItem: string;
  selectedIndex: number;
  items: string[];
  timestamp: Date;
  userId?: string;
}

export interface RouletteState {
  items: string[];
  isSpinning: boolean;
  result: RouletteResult | null;
}

// 참여자-질문 매칭 기록
export interface RouletteRecord {
  id: string;
  participantId: string;
  participantName: string;
  questionId: string;
  questionContent: string;
  round: number;
  timestamp: Date;
  isCorrect?: boolean; // 맞춤/틀림 여부 (undefined: 미선택)
  groupName?: string;
}

// ==================== Sharing ====================

export interface SharingSettings {
  isPublic: boolean;
  shareToken: string;
  expiresAt?: Date;
}

// ==================== API Response ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ==================== Form Data ====================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
