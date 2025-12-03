import mongoose from "mongoose";
import type { Question, Participant, RouletteResult, User } from "@/types/data";

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * MongoDB 연결 캐시 인터페이스
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * MongoDB 연결을 생성하거나 기존 연결을 반환합니다.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// ==================== User CRUD ====================

/**
 * 이메일로 사용자 조회
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  // TODO: 실제 MongoDB 모델 구현
  return null;
}

/**
 * 새 사용자 생성
 */
export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  // TODO: 실제 MongoDB 모델 구현
  throw new Error("Not implemented");
}

// ==================== Question CRUD ====================

/**
 * 사용자의 모든 질문 조회
 */
export async function getQuestionsByUserId(userId: string): Promise<Question[]> {
  // TODO: 실제 MongoDB 모델 구현
  return [];
}

/**
 * 질문 생성
 */
export async function createQuestionInDB(
  content: string,
  userId: string
): Promise<Question> {
  // TODO: 실제 MongoDB 모델 구현
  throw new Error("Not implemented");
}

/**
 * 질문 삭제
 */
export async function deleteQuestionInDB(questionId: string): Promise<boolean> {
  // TODO: 실제 MongoDB 모델 구현
  return false;
}

// ==================== Participant CRUD ====================

/**
 * 사용자의 모든 참여자 조회
 */
export async function getParticipantsByUserId(
  userId: string
): Promise<Participant[]> {
  // TODO: 실제 MongoDB 모델 구현
  return [];
}

/**
 * 참여자 생성
 */
export async function createParticipantInDB(
  name: string,
  userId: string
): Promise<Participant> {
  // TODO: 실제 MongoDB 모델 구현
  throw new Error("Not implemented");
}

/**
 * 참여자 삭제
 */
export async function deleteParticipantInDB(
  participantId: string
): Promise<boolean> {
  // TODO: 실제 MongoDB 모델 구현
  return false;
}

// ==================== Roulette Result CRUD ====================

/**
 * 룰렛 결과 저장
 */
export async function saveRouletteResult(
  result: RouletteResult,
  userId: string
): Promise<RouletteResult> {
  // TODO: 실제 MongoDB 모델 구현
  throw new Error("Not implemented");
}

/**
 * 공유 토큰으로 룰렛 데이터 조회
 */
export async function getSharedRoulette(shareToken: string): Promise<{
  title: string;
  items: string[];
} | null> {
  // TODO: 실제 MongoDB 모델 구현
  return null;
}

