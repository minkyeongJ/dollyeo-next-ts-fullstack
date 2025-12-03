"use server";

import { revalidatePath } from "next/cache";
import type { Question, Participant, ApiResponse, SharingSettings } from "@/types/data";
// import { connectDB } from "@/services/database.service";

/**
 * 질문 생성 Server Action
 */
export async function createQuestion(
  content: string,
  userId: string
): Promise<ApiResponse<Question>> {
  try {
    // TODO: 실제 데이터베이스 구현
    const question: Question = {
      id: `q-${Date.now()}`,
      content,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    revalidatePath("/questions");
    return { success: true, data: question };
  } catch (error) {
    console.error("질문 생성 실패:", error);
    return { success: false, error: "질문 생성에 실패했습니다." };
  }
}

/**
 * 질문 삭제 Server Action
 */
export async function deleteQuestion(
  questionId: string
): Promise<ApiResponse<void>> {
  try {
    // TODO: 실제 데이터베이스 구현
    revalidatePath("/questions");
    return { success: true };
  } catch (error) {
    console.error("질문 삭제 실패:", error);
    return { success: false, error: "질문 삭제에 실패했습니다." };
  }
}

/**
 * 참여자 생성 Server Action
 */
export async function createParticipant(
  name: string,
  userId: string
): Promise<ApiResponse<Participant>> {
  try {
    // TODO: 실제 데이터베이스 구현
    const participant: Participant = {
      id: `p-${Date.now()}`,
      name,
      userId,
      createdAt: new Date(),
    };

    revalidatePath("/participants");
    return { success: true, data: participant };
  } catch (error) {
    console.error("참여자 생성 실패:", error);
    return { success: false, error: "참여자 생성에 실패했습니다." };
  }
}

/**
 * 참여자 삭제 Server Action
 */
export async function deleteParticipant(
  participantId: string
): Promise<ApiResponse<void>> {
  try {
    // TODO: 실제 데이터베이스 구현
    revalidatePath("/participants");
    return { success: true };
  } catch (error) {
    console.error("참여자 삭제 실패:", error);
    return { success: false, error: "참여자 삭제에 실패했습니다." };
  }
}

/**
 * 공유 설정 업데이트 Server Action
 */
export async function updateSharingSettings(
  rouletteId: string,
  settings: Partial<SharingSettings>
): Promise<ApiResponse<SharingSettings>> {
  try {
    // TODO: 실제 데이터베이스 구현
    const sharingSettings: SharingSettings = {
      isPublic: settings.isPublic ?? false,
      shareToken: settings.shareToken ?? `share-${Date.now()}`,
      expiresAt: settings.expiresAt,
    };

    return { success: true, data: sharingSettings };
  } catch (error) {
    console.error("공유 설정 업데이트 실패:", error);
    return { success: false, error: "공유 설정 업데이트에 실패했습니다." };
  }
}

/**
 * 공유 토큰 생성 Server Action
 */
export async function generateShareToken(
  rouletteId: string
): Promise<ApiResponse<string>> {
  try {
    const token = `${rouletteId}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    return { success: true, data: token };
  } catch (error) {
    console.error("공유 토큰 생성 실패:", error);
    return { success: false, error: "공유 토큰 생성에 실패했습니다." };
  }
}

