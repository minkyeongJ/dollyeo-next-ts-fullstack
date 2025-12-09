"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getQuestions,
  createQuestion,
  deleteQuestion,
} from "@/actions/questions.actions";

const questionSchema = z.object({
  content: z.string().min(1, "질문을 입력해주세요."),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export default function QuestionsPage() {
  const queryClient = useQueryClient();

  // 질문 목록 조회 (Server Action 사용)
  const {
    data: questions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: () => getQuestions(),
  });

  // 질문 생성 mutation
  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      const result = await createQuestion(content);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      reset();
    },
  });

  // 질문 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteQuestion(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit = (data: QuestionFormData) => {
    createMutation.mutate(data.content);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">질문 관리</h1>
          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
            {process.env.NODE_ENV === "development" ? "개발 모드" : "프로덕션"}
          </span>
        </div>

        {/* 질문 추가 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              {...register("content")}
              type="text"
              placeholder="새 질문을 입력하세요..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={createMutation.isPending}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? "추가 중..." : "추가"}
          </button>
        </form>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            <span className="ml-2 text-gray-500">로딩 중...</span>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">
              데이터를 불러오는데 실패했습니다: {error.message}
            </p>
          </div>
        )}

        {/* 질문 목록 */}
        {!isLoading && !error && (
          <div className="space-y-2">
            {questions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                아직 등록된 질문이 없습니다.
              </p>
            ) : (
              questions.map((question) => (
                <div
                  key={question.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-gray-800">{question.content}</span>
                    <span className="ml-2 text-xs text-gray-400">
                      {new Date(question.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(question.id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* 데이터 개수 표시 */}
        {!isLoading && questions.length > 0 && (
          <p className="mt-4 text-sm text-gray-500 text-right">
            총 {questions.length}개의 질문
          </p>
        )}
      </div>
    </div>
  );
}
