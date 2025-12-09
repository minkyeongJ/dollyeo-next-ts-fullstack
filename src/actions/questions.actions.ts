"use server";

import { revalidatePath } from "next/cache";
import type { Question, ApiResponse } from "@/types/data";
import { QuestionsService } from "@/services";

// 환경 변수로 Mock 모드 결정
const USE_MOCK = process.env.USE_MOCK_DATA === "true";

// 임시 사용자 ID (실제로는 세션에서 가져와야 함)
const TEMP_USER_ID = "user-1";

/**
 * 모든 질문 조회
 */
export async function getQuestions(): Promise<Question[]> {
  try {
    return await QuestionsService.getAll(TEMP_USER_ID, USE_MOCK);
  } catch (error) {
    console.error("질문 조회 실패:", error);
    throw new Error("질문을 불러오는데 실패했습니다.");
  }
}

/**
 * ID로 질문 조회
 */
export async function getQuestionById(id: string): Promise<Question | null> {
  try {
    return await QuestionsService.getById(id, USE_MOCK);
  } catch (error) {
    console.error("질문 조회 실패:", error);
    throw new Error("질문을 불러오는데 실패했습니다.");
  }
}

/**
 * 질문 생성
 */
export async function createQuestion(
  content: string
): Promise<ApiResponse<Question>> {
  try {
    if (!content || content.trim().length === 0) {
      return { success: false, error: "질문 내용을 입력해주세요." };
    }

    const question = await QuestionsService.create(
      content.trim(),
      TEMP_USER_ID,
      USE_MOCK
    );

    revalidatePath("/questions");
    return { success: true, data: question };
  } catch (error) {
    console.error("질문 생성 실패:", error);
    return { success: false, error: "질문 생성에 실패했습니다." };
  }
}

/**
 * 질문 수정
 */
export async function updateQuestion(
  id: string,
  content: string
): Promise<ApiResponse<Question>> {
  try {
    if (!content || content.trim().length === 0) {
      return { success: false, error: "질문 내용을 입력해주세요." };
    }

    const question = await QuestionsService.update(id, content.trim(), USE_MOCK);

    if (!question) {
      return { success: false, error: "질문을 찾을 수 없습니다." };
    }

    revalidatePath("/questions");
    return { success: true, data: question };
  } catch (error) {
    console.error("질문 수정 실패:", error);
    return { success: false, error: "질문 수정에 실패했습니다." };
  }
}

/**
 * 질문 삭제
 */
export async function deleteQuestion(id: string): Promise<ApiResponse<void>> {
  try {
    const deleted = await QuestionsService.delete(id, USE_MOCK);

    if (!deleted) {
      return { success: false, error: "질문을 찾을 수 없습니다." };
    }

    revalidatePath("/questions");
    return { success: true };
  } catch (error) {
    console.error("질문 삭제 실패:", error);
    return { success: false, error: "질문 삭제에 실패했습니다." };
  }
}

/**
 * 질문 포함/제외 토글
 */
export async function toggleQuestionIncluded(
  id: string,
  included: boolean
): Promise<ApiResponse<Question>> {
  try {
    const question = await QuestionsService.toggleIncluded(id, included, USE_MOCK);

    if (!question) {
      return { success: false, error: "질문을 찾을 수 없습니다." };
    }

    revalidatePath("/questions");
    revalidatePath("/roulette");
    return { success: true, data: question };
  } catch (error) {
    console.error("질문 토글 실패:", error);
    return { success: false, error: "질문 상태 변경에 실패했습니다." };
  }
}

