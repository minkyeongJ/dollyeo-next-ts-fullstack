"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  getParticipants,
  createParticipant,
  deleteParticipant,
  toggleParticipantIncluded,
} from "@/actions/participants.actions";
import { Button } from "@/components/ui/Button";

const participantSchema = z.object({
  name: z.string().min(1, "참여자 이름을 입력해주세요."),
});

type ParticipantFormData = z.infer<typeof participantSchema>;

// 아이콘 컴포넌트들
function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

// 참여자 아바타 색상
const avatarColors = [
  "bg-indigo-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-pink-500",
];

function getAvatarColor(name: string) {
  const charCode = name.charCodeAt(0) || 0;
  return avatarColors[charCode % avatarColors.length];
}

export default function ParticipantsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "included" | "excluded">("all");

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

  // 포함/제외 토글 mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ id, included }: { id: string; included: boolean }) => {
      const result = await toggleParticipantIncluded(id, included);
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

  // 필터링된 참여자 목록
  const filteredParticipants = participants.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterMode === "all" ? true :
      filterMode === "included" ? p.isIncluded :
      !p.isIncluded;
    return matchesSearch && matchesFilter;
  });

  // 통계
  const includedCount = participants.filter((p) => p.isIncluded).length;
  const excludedCount = participants.length - includedCount;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">참여자 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            룰렛에 참여할 사람들을 관리하세요
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
            총 {participants.length}명
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            포함 {includedCount}명
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            제외 {excludedCount}명
          </span>
        </div>
      </div>

      {/* 참여자 추가 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
          <div className="flex-1">
            <input
              {...register("name")}
              type="text"
              placeholder="참여자 이름을 입력하세요..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition-colors"
              disabled={createMutation.isPending}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-rose-600">{errors.name.message}</p>
            )}
          </div>
          <Button
            type="submit"
            isLoading={createMutation.isPending}
            leftIcon={<PlusIcon />}
          >
            추가
          </Button>
        </form>
      </motion.div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="참여자 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition-colors bg-white"
          />
        </div>
        <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white">
          {[
            { key: "all", label: "전체" },
            { key: "included", label: "포함" },
            { key: "excluded", label: "제외" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterMode(filter.key as typeof filterMode)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                filterMode === filter.key
                  ? "bg-indigo-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* 참여자 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
            <span className="mt-4 text-gray-500">참여자를 불러오는 중...</span>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-rose-600 font-medium">데이터를 불러오는데 실패했습니다</p>
            <p className="text-gray-500 text-sm mt-1">{error.message}</p>
          </div>
        )}

        {/* 빈 상태 */}
        {!isLoading && !error && filteredParticipants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UsersIcon />
            </div>
            <p className="text-gray-500 font-medium">
              {searchQuery || filterMode !== "all"
                ? "검색 결과가 없습니다"
                : "아직 등록된 참여자가 없습니다"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery || filterMode !== "all"
                ? "다른 검색어나 필터를 시도해보세요"
                : "위에서 새 참여자를 추가해보세요"}
            </p>
          </div>
        )}

        {/* 참여자 그리드 */}
        {!isLoading && !error && filteredParticipants.length > 0 && (
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <AnimatePresence mode="popLayout">
                {filteredParticipants.map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.02 }}
                    className={`
                      relative flex items-center gap-3 p-3 rounded-xl border transition-all group
                      ${participant.isIncluded 
                        ? "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm" 
                        : "bg-gray-50 border-gray-200 opacity-60"
                      }
                    `}
                  >
                    {/* 체크박스 */}
                    <button
                      onClick={() => toggleMutation.mutate({ 
                        id: participant.id, 
                        included: !participant.isIncluded 
                      })}
                      disabled={toggleMutation.isPending}
                      className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0
                        ${participant.isIncluded 
                          ? "bg-indigo-500 border-indigo-500 text-white" 
                          : "border-gray-300 hover:border-indigo-400"
                        }
                      `}
                    >
                      {participant.isIncluded && <CheckIcon />}
                    </button>

                    {/* 아바타 */}
                    <div className={`
                      w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0
                      ${getAvatarColor(participant.name)}
                      ${!participant.isIncluded && "opacity-50"}
                    `}>
                      {participant.name.charAt(0)}
                    </div>

                    {/* 이름 */}
                    <span className={`
                      flex-1 font-medium truncate
                      ${participant.isIncluded ? "text-gray-900" : "text-gray-400 line-through"}
                    `}>
                      {participant.name}
                    </span>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => deleteMutation.mutate(participant.id)}
                      disabled={deleteMutation.isPending}
                      className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <TrashIcon />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
