"use server";

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

// Note: v4에서는 signIn/signOut을 Server Action에서 직접 사용할 수 없습니다.
// 클라이언트 컴포넌트에서 next-auth/react의 signIn/signOut을 사용하세요.
//
// 예시:
// import { signIn, signOut } from "next-auth/react";
// await signIn("credentials", { email, password, callbackUrl: "/questions" });
// await signOut({ callbackUrl: "/login" });
