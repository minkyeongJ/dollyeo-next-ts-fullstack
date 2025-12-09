"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getParticipants,
  createParticipant,
  deleteParticipant,
} from "@/actions/participants.actions";

const participantSchema = z.object({
  name: z.string().min(1, "참여자 이름을 입력해주세요."),
});

type ParticipantFormData = z.infer<typeof participantSchema>;

export default function ParticipantsPage() {
  const queryClient = useQueryClient();

  // 참여자 목록 조회 (Server Action 사용)
  const {
    data: participants = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["participants"],
    queryFn: () => getParticipants(),
  });

  // 참여자 생성 mutation
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const result = await createParticipant(name);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      reset();
    },
  });

  // 참여자 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteParticipant(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
  });

  const onSubmit = (data: ParticipantFormData) => {
    createMutation.mutate(data.name);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">참여자 관리</h1>
          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
            {process.env.NODE_ENV === "development" ? "개발 모드" : "프로덕션"}
          </span>
        </div>

        {/* 참여자 추가 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              {...register("name")}
              type="text"
              placeholder="참여자 이름을 입력하세요..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={createMutation.isPending}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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

        {/* 참여자 목록 */}
        {!isLoading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {participants.length === 0 ? (
              <p className="col-span-full text-gray-500 text-center py-8">
                아직 등록된 참여자가 없습니다.
              </p>
            ) : (
              participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-800 truncate block">
                      {participant.name}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(participant.id)}
                    disabled={deleteMutation.isPending}
                    className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* 데이터 개수 표시 */}
        {!isLoading && participants.length > 0 && (
          <p className="mt-4 text-sm text-gray-500 text-right">
            총 {participants.length}명의 참여자
          </p>
        )}
      </div>
    </div>
  );
}
