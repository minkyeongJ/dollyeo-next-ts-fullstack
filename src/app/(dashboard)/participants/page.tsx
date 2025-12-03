"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const participantSchema = z.object({
  name: z.string().min(1, "참여자 이름을 입력해주세요."),
});

type ParticipantFormData = z.infer<typeof participantSchema>;

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
  });

  const onSubmit = (data: ParticipantFormData) => {
    setParticipants([...participants, data.name]);
    reset();
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">참여자 관리</h1>

        {/* 참여자 추가 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              {...register("name")}
              type="text"
              placeholder="참여자 이름을 입력하세요..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            추가
          </button>
        </form>

        {/* 참여자 목록 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {participants.length === 0 ? (
            <p className="col-span-full text-gray-500 text-center py-8">
              아직 등록된 참여자가 없습니다.
            </p>
          ) : (
            participants.map((participant, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-gray-800 truncate">{participant}</span>
                <button
                  onClick={() => removeParticipant(index)}
                  className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
