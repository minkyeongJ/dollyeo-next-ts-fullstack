"use server";

import { signIn, signOut } from "@/auth/auth";
import type { ApiResponse } from "@/types/data";

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

/**
 * 사용자 회원가입 Server Action
 */
export async function registerUser(
  data: RegisterUserData
): Promise<ApiResponse<{ userId: string }>> {
  try {
    // TODO: 실제 데이터베이스에 사용자 생성 구현
    // const user = await createUser(data);

    // 임시 응답
    return {
      success: true,
      data: { userId: "temp-user-id" },
    };
  } catch (error) {
    console.error("회원가입 실패:", error);
    return {
      success: false,
      error: "회원가입에 실패했습니다. 다시 시도해주세요.",
    };
  }
}

/**
 * 로그인 Server Action
 */
export async function loginWithCredentials(
  email: string,
  password: string
): Promise<ApiResponse<void>> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("로그인 실패:", error);
    return {
      success: false,
      error: "이메일 또는 비밀번호가 올바르지 않습니다.",
    };
  }
}

/**
 * 로그아웃 Server Action
 */
export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}

