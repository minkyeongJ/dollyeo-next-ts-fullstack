"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const questionSchema = z.object({
  content: z.string().min(1, "질문을 입력해주세요."),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit = (data: QuestionFormData) => {
    setQuestions([...questions, data.content]);
    reset();
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">질문 관리</h1>

        {/* 질문 추가 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              {...register("content")}
              type="text"
              placeholder="새 질문을 입력하세요..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            추가
          </button>
        </form>

        {/* 질문 목록 */}
        <div className="space-y-2">
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              아직 등록된 질문이 없습니다.
            </p>
          ) : (
            questions.map((question, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <span className="text-gray-800">{question}</span>
                <button
                  onClick={() => removeQuestion(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

