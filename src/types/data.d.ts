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
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Participant ====================

export interface Participant {
  id: string;
  name: string;
  userId: string;
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
