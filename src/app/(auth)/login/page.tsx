"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

type LoginFormData = z.infer<typeof loginSchema>;

// 아이콘 컴포넌트
function MailIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } else {
      window.location.href = "/questions";
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* 왼쪽: 브랜딩 영역 */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 items-center justify-center p-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            className="w-48 h-48 mx-auto mb-8 relative"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image 
              src="/mascot.png" 
              alt="Dollyeo 마스코트" 
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">Dollyeo</h1>
          <p className="text-indigo-200 text-lg max-w-md">
            질문과 참여자를 관리하고<br />
            룰렛으로 무작위 선택을 해보세요!
          </p>
        </motion.div>
      </div>

      {/* 오른쪽: 로그인 폼 영역 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          {/* 모바일용 로고 */}
          <div className="lg:hidden text-center mb-8">
            <motion.div
              className="w-20 h-20 mx-auto mb-4 relative"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image 
                src="/mascot.png" 
                alt="Dollyeo 마스코트" 
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900">Dollyeo</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
              <p className="mt-2 text-sm text-gray-500">
                계정에 로그인하여 서비스를 이용하세요
              </p>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg"
              >
                <p className="text-sm text-rose-600 text-center">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MailIcon />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    className={`
                      block w-full pl-10 pr-4 py-2.5 rounded-lg border
                      text-gray-900 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors
                      ${errors.email 
                        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" 
                        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }
                    `}
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <LockIcon />
                  </div>
                  <input
                    {...register("password")}
                    type="password"
                    className={`
                      block w-full pl-10 pr-4 py-2.5 rounded-lg border
                      text-gray-900 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors
                      ${errors.password 
                        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" 
                        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      }
                    `}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
                size="lg"
              >
                로그인
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                계정이 없으신가요?{" "}
                <Link href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  회원가입
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
