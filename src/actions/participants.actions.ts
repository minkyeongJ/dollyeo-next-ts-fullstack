"use server";

import { revalidatePath } from "next/cache";
import type { Participant, ApiResponse } from "@/types/data";
import { ParticipantsService } from "@/services";

// 환경 변수로 Mock 모드 결정
const USE_MOCK = process.env.USE_MOCK_DATA === "true";

// 임시 사용자 ID (실제로는 세션에서 가져와야 함)
const TEMP_USER_ID = "user-1";

/**
 * 모든 참여자 조회
 */
export async function getParticipants(): Promise<Participant[]> {
  try {
    return await ParticipantsService.getAll(TEMP_USER_ID, USE_MOCK);
  } catch (error) {
    console.error("참여자 조회 실패:", error);
    throw new Error("참여자를 불러오는데 실패했습니다.");
  }
}

/**
 * ID로 참여자 조회
 */
export async function getParticipantById(
  id: string
): Promise<Participant | null> {
  try {
    return await ParticipantsService.getById(id, USE_MOCK);
  } catch (error) {
    console.error("참여자 조회 실패:", error);
    throw new Error("참여자를 불러오는데 실패했습니다.");
  }
}

/**
 * 참여자 생성
 */
export async function createParticipant(
  name: string
): Promise<ApiResponse<Participant>> {
  try {
    if (!name || name.trim().length === 0) {
      return { success: false, error: "참여자 이름을 입력해주세요." };
    }

    const participant = await ParticipantsService.create(
      name.trim(),
      TEMP_USER_ID,
      USE_MOCK
    );

    revalidatePath("/participants");
    return { success: true, data: participant };
  } catch (error) {
    console.error("참여자 생성 실패:", error);
    return { success: false, error: "참여자 생성에 실패했습니다." };
  }
}

/**
 * 참여자 수정
 */
export async function updateParticipant(
  id: string,
  name: string
): Promise<ApiResponse<Participant>> {
  try {
    if (!name || name.trim().length === 0) {
      return { success: false, error: "참여자 이름을 입력해주세요." };
    }

    const participant = await ParticipantsService.update(
      id,
      name.trim(),
      USE_MOCK
    );

    if (!participant) {
      return { success: false, error: "참여자를 찾을 수 없습니다." };
    }

    revalidatePath("/participants");
    return { success: true, data: participant };
  } catch (error) {
    console.error("참여자 수정 실패:", error);
    return { success: false, error: "참여자 수정에 실패했습니다." };
  }
}

/**
 * 참여자 삭제
 */
export async function deleteParticipant(
  id: string
): Promise<ApiResponse<void>> {
  try {
    const deleted = await ParticipantsService.delete(id, USE_MOCK);

    if (!deleted) {
      return { success: false, error: "참여자를 찾을 수 없습니다." };
    }

    revalidatePath("/participants");
    return { success: true };
  } catch (error) {
    console.error("참여자 삭제 실패:", error);
    return { success: false, error: "참여자 삭제에 실패했습니다." };
  }
}

/**
 * 참여자 포함/제외 토글
 */
export async function toggleParticipantIncluded(
  id: string,
  included: boolean
): Promise<ApiResponse<Participant>> {
  try {
    const participant = await ParticipantsService.toggleIncluded(id, included, USE_MOCK);

    if (!participant) {
      return { success: false, error: "참여자를 찾을 수 없습니다." };
    }

    revalidatePath("/participants");
    revalidatePath("/roulette");
    return { success: true, data: participant };
  } catch (error) {
    console.error("참여자 토글 실패:", error);
    return { success: false, error: "참여자 상태 변경에 실패했습니다." };
  }
}

