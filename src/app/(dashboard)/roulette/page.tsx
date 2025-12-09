"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getQuestions } from "@/actions/questions.actions";
import { getParticipants } from "@/actions/participants.actions";
import type { RouletteRecord } from "@/types/data";

// 로컬 스토리지 키
const STORAGE_KEY = "dollyeo-roulette-data";
const GROUPS_STORAGE_KEY = "dollyeo-question-groups";
const RECORDS_STORAGE_KEY = "dollyeo-roulette-records";

// 질문 그룹 타입
interface QuestionGroup {
  id: string;
  name: string;
  questions: LocalQuestion[];
  participants: LocalParticipant[];
  createdAt: string;
}

// 아이콘 컴포넌트들
function PlayIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XMarkIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function QuestionMarkIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      className="w-12 h-12 text-indigo-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
      />
    </svg>
  );
}

function FolderOpenIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  );
}

function FolderPlusIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    </svg>
  );
}

// 아바타 색상
const avatarColors = [
  "bg-indigo-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-pink-500",
];

interface LocalQuestion {
  id: string;
  content: string;
  isUsed: boolean;
  answer?: string; // 질문에 대한 답변
}

interface LocalParticipant {
  id: string;
  name: string;
  order: number;
}

export default function RoulettePage() {
  // 세션 정보
  const { data: session } = useSession();

  // 그룹 이름 상태
  const [groupName, setGroupName] = useState("Untitled");

  // 질문 상태
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState("");

  // 참여자 상태
  const [participants, setParticipants] = useState<LocalParticipant[]>([]);
  const [newParticipant, setNewParticipant] = useState("");

  // 게임 상태
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<LocalQuestion | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showAnswerInModal, setShowAnswerInModal] = useState(false);

  // 기록 상태
  const [records, setRecords] = useState<RouletteRecord[]>([]);
  const [round, setRound] = useState(1);

  // 저장 상태
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [hasSavedData, setHasSavedData] = useState(false);

  // 질문 불러오기 모달 상태
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [dbQuestions, setDbQuestions] = useState<
    Array<{ id: string; content: string; isIncluded: boolean }>
  >([]);
  const [selectedDbQuestions, setSelectedDbQuestions] = useState<Set<string>>(
    new Set()
  );
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // 참여자 불러오기 모달 상태
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [dbParticipants, setDbParticipants] = useState<
    Array<{ id: string; name: string; isIncluded: boolean }>
  >([]);
  const [selectedDbParticipants, setSelectedDbParticipants] = useState<
    Set<string>
  >(new Set());
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);

  // 그룹 관련 상태
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showSaveGroupModal, setShowSaveGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // 저장할 항목 선택 상태
  const [selectedSaveQuestions, setSelectedSaveQuestions] = useState<
    Set<string>
  >(new Set());
  const [selectedSaveParticipants, setSelectedSaveParticipants] = useState<
    Set<string>
  >(new Set());

  // 불러온 그룹 추적 및 저장 타입
  const [loadedGroupId, setLoadedGroupId] = useState<string | null>(null);
  const [saveType, setSaveType] = useState<"new" | "update" | "updateAll">(
    "new"
  );
  // 원본 그룹 데이터 (변경 감지용)
  const [originalGroupData, setOriginalGroupData] = useState<{
    questions: LocalQuestion[];
    participants: LocalParticipant[];
  } | null>(null);

  // 페이지 로드 시 저장된 데이터 확인
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHasSavedData(true);
      }
      // 그룹 데이터 불러오기
      const savedGroups = localStorage.getItem(GROUPS_STORAGE_KEY);
      if (savedGroups) {
        setQuestionGroups(JSON.parse(savedGroups));
      }
    } catch {
      // 로컬 스토리지 접근 불가
    }
  }, []);

  // 로그인한 사용자를 기본 참여자로 추가
  useEffect(() => {
    if (session?.user?.name && participants.length === 0) {
      const defaultParticipant: LocalParticipant = {
        id: `p-${Date.now()}`,
        name: session.user.name,
        order: 0,
      };
      setParticipants([defaultParticipant]);
    }
  }, [session?.user?.name, participants.length]);

  // 데이터 저장
  const handleSaveData = useCallback(() => {
    try {
      const data = {
        questions,
        participants,
        records,
        round,
        currentParticipantIndex,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setHasSavedData(true);
      setSaveMessage({ type: "success", text: "저장되었습니다!" });
      setTimeout(() => setSaveMessage(null), 2000);
    } catch {
      setSaveMessage({ type: "error", text: "저장에 실패했습니다" });
      setTimeout(() => setSaveMessage(null), 2000);
    }
  }, [questions, participants, records, round, currentParticipantIndex]);

  // 데이터 불러오기
  const handleLoadData = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setQuestions(data.questions || []);
        setParticipants(data.participants || []);
        setRecords(data.records || []);
        setRound(data.round || 1);
        setCurrentParticipantIndex(data.currentParticipantIndex || 0);
        setSelectedQuestion(null);
        setSaveMessage({ type: "success", text: "불러왔습니다!" });
        setTimeout(() => setSaveMessage(null), 2000);
      }
    } catch {
      setSaveMessage({ type: "error", text: "불러오기에 실패했습니다" });
      setTimeout(() => setSaveMessage(null), 2000);
    }
  }, []);

  // 저장된 데이터 삭제
  const handleClearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHasSavedData(false);
      setSaveMessage({
        type: "success",
        text: "저장된 데이터가 삭제되었습니다",
      });
      setTimeout(() => setSaveMessage(null), 2000);
    } catch {
      // 무시
    }
  }, []);

  // ========== 그룹 관련 함수 ==========

  // 현재 질문을 그룹으로 저장
  const handleSaveAsGroup = useCallback(() => {
    if (questions.length === 0) {
      setSaveMessage({ type: "error", text: "저장할 질문이 없습니다" });
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }
    // 현재 그룹 이름을 기본값으로 사용
    setNewGroupName(groupName || "Untitled");
    // 모든 질문과 참여자를 기본 선택
    setSelectedSaveQuestions(new Set(questions.map((q) => q.id)));
    setSelectedSaveParticipants(new Set(participants.map((p) => p.id)));

    // 저장 타입 기본값 설정
    if (!loadedGroupId) {
      setSaveType("new");
    } else if (originalGroupData) {
      // 변경 감지
      const originalQuestionContents = new Set(
        originalGroupData.questions.map((q) => q.content)
      );
      const currentQuestionContents = new Set(questions.map((q) => q.content));
      const originalParticipantNames = new Set(
        originalGroupData.participants.map((p) => p.name)
      );
      const currentParticipantNames = new Set(participants.map((p) => p.name));

      const hasChanges =
        originalQuestionContents.size !== currentQuestionContents.size ||
        [...originalQuestionContents].some(
          (c) => !currentQuestionContents.has(c)
        ) ||
        originalParticipantNames.size !== currentParticipantNames.size ||
        [...originalParticipantNames].some(
          (n) => !currentParticipantNames.has(n)
        );

      setSaveType(hasChanges ? "updateAll" : "update");
    } else {
      setSaveType("update");
    }

    setShowSaveGroupModal(true);
  }, [questions, participants, groupName, loadedGroupId, originalGroupData]);

  // 불러온 그룹 찾기
  const loadedGroup = useMemo(
    () => questionGroups.find((g) => g.id === loadedGroupId),
    [questionGroups, loadedGroupId]
  );

  // 질문/참여자 변경 감지
  const hasDataChanges = useMemo(() => {
    if (!originalGroupData || !loadedGroupId) return false;

    // 질문 내용 비교 (content 기준)
    const originalQuestionContents = new Set(
      originalGroupData.questions.map((q) => q.content)
    );
    const currentQuestionContents = new Set(questions.map((q) => q.content));
    const questionsChanged =
      originalQuestionContents.size !== currentQuestionContents.size ||
      [...originalQuestionContents].some(
        (c) => !currentQuestionContents.has(c)
      );

    // 참여자 이름 비교
    const originalParticipantNames = new Set(
      originalGroupData.participants.map((p) => p.name)
    );
    const currentParticipantNames = new Set(participants.map((p) => p.name));
    const participantsChanged =
      originalParticipantNames.size !== currentParticipantNames.size ||
      [...originalParticipantNames].some(
        (n) => !currentParticipantNames.has(n)
      );

    return questionsChanged || participantsChanged;
  }, [originalGroupData, loadedGroupId, questions, participants]);

  // 그룹 저장 확인
  const handleConfirmSaveGroup = useCallback(() => {
    if (saveType === "new" && !newGroupName.trim()) {
      setSaveMessage({ type: "error", text: "그룹 이름을 입력해주세요" });
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }

    if (saveType === "new" && selectedSaveQuestions.size === 0) {
      setSaveMessage({ type: "error", text: "저장할 질문을 선택해주세요" });
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }

    if (saveType === "update" && !loadedGroupId) {
      setSaveMessage({ type: "error", text: "불러온 그룹이 없습니다" });
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }

    if ((saveType === "update" || saveType === "updateAll") && loadedGroupId) {
      // 기존 그룹 업데이트
      const existingGroupIndex = questionGroups.findIndex(
        (g) => g.id === loadedGroupId
      );
      if (existingGroupIndex === -1) {
        setSaveMessage({ type: "error", text: "원본 그룹을 찾을 수 없습니다" });
        setTimeout(() => setSaveMessage(null), 2000);
        return;
      }

      const existingGroup = questionGroups[existingGroupIndex];
      let updatedGroup = { ...existingGroup };
      let successMessage = "";

      if (saveType === "updateAll") {
        // 질문/참여자도 함께 업데이트
        updatedGroup = {
          ...existingGroup,
          name: groupName || existingGroup.name,
          questions: questions.map((q) => ({ ...q, isUsed: false })),
          participants: participants.map((p) => ({ ...p })),
        };

        // 그룹 목록 업데이트
        const updatedGroups = [...questionGroups];
        updatedGroups[existingGroupIndex] = updatedGroup;
        setQuestionGroups(updatedGroups);
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updatedGroups));

        // 원본 데이터도 업데이트
        setOriginalGroupData({
          questions: questions.map((q) => ({ ...q })),
          participants: participants.map((p) => ({ ...p })),
        });

        successMessage = `"${
          updatedGroup.name
        }" 그룹이 업데이트되었습니다 (질문 ${questions.length}개, 참여자 ${
          participants.length
        }명${records.length > 0 ? `, 기록 ${records.length}개` : ""})`;
      } else {
        successMessage = `"${existingGroup.name}" 그룹에 ${records.length}개의 기록이 저장되었습니다`;
      }

      // 로컬 스토리지의 기록에 groupName 업데이트
      if (records.length > 0) {
        try {
          const existingRecords = JSON.parse(
            localStorage.getItem(RECORDS_STORAGE_KEY) || "[]"
          );
          const updatedRecords = existingRecords.map(
            (r: RouletteRecord & { groupName?: string }) => {
              if (!r.groupName && records.some((rec) => rec.id === r.id)) {
                return { ...r, groupName: updatedGroup.name };
              }
              return r;
            }
          );
          localStorage.setItem(
            RECORDS_STORAGE_KEY,
            JSON.stringify(updatedRecords)
          );
        } catch {
          // 로컬 스토리지 접근 불가
        }
      }

      setShowSaveGroupModal(false);
      setSaveMessage({ type: "success", text: successMessage });
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }

    // 새 그룹으로 저장
    const selectedQuestions = questions
      .filter((q) => selectedSaveQuestions.has(q.id))
      .map((q) => ({ ...q, isUsed: false }));

    const selectedParticipantsList = participants
      .filter((p) => selectedSaveParticipants.has(p.id))
      .map((p) => ({ ...p }));

    const newGroup: QuestionGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName.trim(),
      questions: selectedQuestions,
      participants: selectedParticipantsList,
      createdAt: new Date().toISOString(),
    };

    const updatedGroups = [...questionGroups, newGroup];
    setQuestionGroups(updatedGroups);
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updatedGroups));

    // 새로 저장된 그룹을 현재 그룹으로 설정
    setLoadedGroupId(newGroup.id);

    // 현재 기록에 groupName 추가
    try {
      const existingRecords = JSON.parse(
        localStorage.getItem(RECORDS_STORAGE_KEY) || "[]"
      );
      const updatedRecords = existingRecords.map(
        (r: RouletteRecord & { groupName?: string }) => {
          if (!r.groupName && records.some((rec) => rec.id === r.id)) {
            return { ...r, groupName: newGroup.name };
          }
          return r;
        }
      );
      localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(updatedRecords));
    } catch {
      // 로컬 스토리지 접근 불가
    }

    setShowSaveGroupModal(false);
    setNewGroupName("");
    setSaveMessage({
      type: "success",
      text: `"${newGroup.name}" 그룹이 저장되었습니다`,
    });
    setTimeout(() => setSaveMessage(null), 2000);
  }, [
    saveType,
    newGroupName,
    groupName,
    questions,
    participants,
    questionGroups,
    selectedSaveQuestions,
    selectedSaveParticipants,
    loadedGroupId,
    records,
  ]);

  // 그룹 삭제
  const handleDeleteGroup = useCallback(
    (groupId: string) => {
      const updatedGroups = questionGroups.filter((g) => g.id !== groupId);
      setQuestionGroups(updatedGroups);
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updatedGroups));

      if (selectedGroupId === groupId) {
        setSelectedGroupId(null);
      }

      setSaveMessage({ type: "success", text: "그룹이 삭제되었습니다" });
      setTimeout(() => setSaveMessage(null), 2000);
    },
    [questionGroups, selectedGroupId]
  );

  // 그룹에서 질문 및 참여자 불러오기
  const handleLoadFromGroup = useCallback((group: QuestionGroup) => {
    const newQuestions = group.questions.map((q) => ({
      ...q,
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isUsed: false,
    }));
    setQuestions(newQuestions);

    // 참여자도 함께 불러오기
    let newParticipants: LocalParticipant[] = [];
    if (group.participants && group.participants.length > 0) {
      newParticipants = group.participants.map((p, idx) => ({
        ...p,
        id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order: idx,
      }));
      setParticipants(newParticipants);
      setCurrentParticipantIndex(0);
    }

    // 그룹 이름 업데이트
    setGroupName(group.name);

    // 불러온 그룹 ID 저장
    setLoadedGroupId(group.id);

    // 원본 데이터 저장 (변경 감지용)
    setOriginalGroupData({
      questions: newQuestions.map((q) => ({ ...q })),
      participants: newParticipants.map((p) => ({ ...p })),
    });

    // 기록 초기화
    setRecords([]);
    setRound(1);

    setShowGroupModal(false);

    const message =
      group.participants && group.participants.length > 0
        ? `"${group.name}"에서 질문 ${newQuestions.length}개, 참여자 ${group.participants.length}명을 불러왔습니다`
        : `"${group.name}"에서 ${newQuestions.length}개의 질문을 불러왔습니다`;
    setSaveMessage({ type: "success", text: message });
    setTimeout(() => setSaveMessage(null), 2000);
  }, []);

  // 그룹 모달 열기 (DB 질문도 함께 불러오기)
  const handleOpenGroupModal = useCallback(async () => {
    setShowGroupModal(true);
    setIsLoadingQuestions(true);
    setIsLoadingParticipants(true);
    try {
      // 질문과 참여자 동시에 불러오기
      const [questionsData, participantsData] = await Promise.all([
        getQuestions(),
        getParticipants(),
      ]);

      setDbQuestions(
        questionsData.map((q) => ({
          id: q.id,
          content: q.content,
          isIncluded: q.isIncluded,
        }))
      );
      const includedQuestionIds = questionsData
        .filter((q) => q.isIncluded)
        .map((q) => q.id);
      setSelectedDbQuestions(new Set(includedQuestionIds));

      setDbParticipants(
        participantsData.map((p) => ({
          id: p.id,
          name: p.name,
          isIncluded: p.isIncluded,
        }))
      );
      const includedParticipantIds = participantsData
        .filter((p) => p.isIncluded)
        .map((p) => p.id);
      setSelectedDbParticipants(new Set(includedParticipantIds));

      // 첫 번째 그룹 기본 선택 (DB 질문이 있으면 DB, 아니면 첫 번째 저장 그룹)
      if (questionsData.length > 0) {
        setSelectedGroupId("db");
      } else if (questionGroups.length > 0) {
        setSelectedGroupId(questionGroups[0].id);
      } else {
        setSelectedGroupId(null);
      }
    } catch {
      // DB 불러오기 실패 시 저장된 그룹 선택
      if (questionGroups.length > 0) {
        setSelectedGroupId(questionGroups[0].id);
      }
    } finally {
      setIsLoadingParticipants(false);
      setIsLoadingQuestions(false);
    }
  }, [questionGroups]);

  // DB 질문에서 선택된 질문 불러오기
  const handleLoadSelectedDbQuestions = useCallback(() => {
    if (selectedDbQuestions.size === 0) {
      setSaveMessage({ type: "error", text: "선택된 질문이 없습니다" });
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }

    const newQuestions: LocalQuestion[] = dbQuestions
      .filter((q) => selectedDbQuestions.has(q.id))
      .map((q) => ({
        id: q.id,
        content: q.content,
        isUsed: false,
      }));

    setQuestions(newQuestions);
    setShowGroupModal(false);
    setSaveMessage({
      type: "success",
      text: `${newQuestions.length}개의 질문을 불러왔습니다`,
    });
    setTimeout(() => setSaveMessage(null), 2000);
  }, [dbQuestions, selectedDbQuestions]);

  // DB에서 질문과 참여자 함께 불러오기
  const handleLoadSelectedFromDb = useCallback(() => {
    if (selectedDbQuestions.size === 0) {
      setSaveMessage({ type: "error", text: "선택된 질문이 없습니다" });
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }

    // 질문 불러오기
    const newQuestions: LocalQuestion[] = dbQuestions
      .filter((q) => selectedDbQuestions.has(q.id))
      .map((q) => ({
        id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: q.content,
        isUsed: false,
      }));
    setQuestions(newQuestions);

    // 참여자 불러오기 (선택된 경우에만)
    if (selectedDbParticipants.size > 0) {
      const newParticipants: LocalParticipant[] = dbParticipants
        .filter((p) => selectedDbParticipants.has(p.id))
        .map((p, idx) => ({
          id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: p.name,
          order: idx,
        }));
      setParticipants(newParticipants);
      setCurrentParticipantIndex(0);
    }

    setShowGroupModal(false);

    const message =
      selectedDbParticipants.size > 0
        ? `질문 ${newQuestions.length}개, 참여자 ${selectedDbParticipants.size}명을 불러왔습니다`
        : `${newQuestions.length}개의 질문을 불러왔습니다`;
    setSaveMessage({ type: "success", text: message });
    setTimeout(() => setSaveMessage(null), 2000);
  }, [
    dbQuestions,
    dbParticipants,
    selectedDbQuestions,
    selectedDbParticipants,
  ]);

  // 질문 불러오기 모달 열기
  const handleOpenQuestionModal = useCallback(async () => {
    setIsLoadingQuestions(true);
    setShowQuestionModal(true);
    try {
      const questions = await getQuestions();
      setDbQuestions(
        questions.map((q) => ({
          id: q.id,
          content: q.content,
          isIncluded: q.isIncluded,
        }))
      );
      // 포함된 질문만 기본 선택
      const includedIds = questions
        .filter((q) => q.isIncluded)
        .map((q) => q.id);
      setSelectedDbQuestions(new Set(includedIds));
    } catch {
      setSaveMessage({ type: "error", text: "질문을 불러오는데 실패했습니다" });
      setTimeout(() => setSaveMessage(null), 2000);
      setShowQuestionModal(false);
    } finally {
      setIsLoadingQuestions(false);
    }
  }, []);

  // 질문 선택 토글
  const handleToggleDbQuestion = useCallback((id: string) => {
    setSelectedDbQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // 모든 질문 선택/해제
  const handleSelectAllQuestions = useCallback(
    (selectAll: boolean) => {
      if (selectAll) {
        setSelectedDbQuestions(new Set(dbQuestions.map((q) => q.id)));
      } else {
        setSelectedDbQuestions(new Set());
      }
    },
    [dbQuestions]
  );

  // 선택된 질문 불러오기
  const handleConfirmLoadQuestions = useCallback(() => {
    if (selectedDbQuestions.size === 0) {
      setSaveMessage({ type: "error", text: "선택된 질문이 없습니다" });
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }

    const newQuestions: LocalQuestion[] = dbQuestions
      .filter((q) => selectedDbQuestions.has(q.id))
      .map((q) => ({
        id: q.id,
        content: q.content,
        isUsed: false,
      }));

    setQuestions(newQuestions);
    setShowQuestionModal(false);
    setSaveMessage({
      type: "success",
      text: `${newQuestions.length}개의 질문을 불러왔습니다`,
    });
    setTimeout(() => setSaveMessage(null), 2000);
  }, [dbQuestions, selectedDbQuestions]);

  // 참여자 불러오기 모달 열기
  const handleOpenParticipantModal = useCallback(async () => {
    setIsLoadingParticipants(true);
    setShowParticipantModal(true);
    try {
      const participants = await getParticipants();
      setDbParticipants(
        participants.map((p) => ({
          id: p.id,
          name: p.name,
          isIncluded: p.isIncluded,
        }))
      );
      // 포함된 참여자만 기본 선택
      const includedIds = participants
        .filter((p) => p.isIncluded)
        .map((p) => p.id);
      setSelectedDbParticipants(new Set(includedIds));
    } catch {
      setSaveMessage({
        type: "error",
        text: "참여자를 불러오는데 실패했습니다",
      });
      setTimeout(() => setSaveMessage(null), 2000);
      setShowParticipantModal(false);
    } finally {
      setIsLoadingParticipants(false);
    }
  }, []);

  // 참여자 선택 토글
  const handleToggleDbParticipant = useCallback((id: string) => {
    setSelectedDbParticipants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // 모든 참여자 선택/해제
  const handleSelectAllParticipants = useCallback(
    (selectAll: boolean) => {
      if (selectAll) {
        setSelectedDbParticipants(new Set(dbParticipants.map((p) => p.id)));
      } else {
        setSelectedDbParticipants(new Set());
      }
    },
    [dbParticipants]
  );

  // 선택된 참여자 불러오기
  const handleConfirmLoadParticipants = useCallback(() => {
    if (selectedDbParticipants.size === 0) {
      setSaveMessage({ type: "error", text: "선택된 참여자가 없습니다" });
      setTimeout(() => setSaveMessage(null), 2000);
      return;
    }

    const newParticipants: LocalParticipant[] = dbParticipants
      .filter((p) => selectedDbParticipants.has(p.id))
      .map((p, index) => ({
        id: p.id,
        name: p.name,
        order: index,
      }));

    setParticipants(newParticipants);
    setCurrentParticipantIndex(0);
    setShowParticipantModal(false);
    setSaveMessage({
      type: "success",
      text: `${newParticipants.length}명의 참여자를 불러왔습니다`,
    });
    setTimeout(() => setSaveMessage(null), 2000);
  }, [dbParticipants, selectedDbParticipants]);

  // 사용 가능한 질문들
  const availableQuestions = useMemo(
    () => questions.filter((q) => !q.isUsed),
    [questions]
  );

  // 현재 참여자
  const currentParticipant = useMemo(
    () =>
      participants.length > 0 ? participants[currentParticipantIndex] : null,
    [participants, currentParticipantIndex]
  );

  // 질문 추가
  const handleAddQuestion = useCallback(() => {
    if (!newQuestion.trim()) return;
    const question: LocalQuestion = {
      id: `q-${Date.now()}`,
      content: newQuestion.trim(),
      isUsed: false,
    };
    setQuestions((prev) => [...prev, question]);
    setNewQuestion("");
  }, [newQuestion]);

  // 질문 삭제
  const handleDeleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  // 질문 포함/제외 토글
  const handleToggleQuestion = useCallback((id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isUsed: !q.isUsed } : q))
    );
  }, []);

  // 모든 질문 삭제
  const handleClearAllQuestions = useCallback(() => {
    setQuestions([]);
  }, []);

  // 참여자 추가
  const handleAddParticipant = useCallback(() => {
    if (!newParticipant.trim()) return;
    const participant: LocalParticipant = {
      id: `p-${Date.now()}`,
      name: newParticipant.trim(),
      order: participants.length,
    };
    setParticipants((prev) => [...prev, participant]);
    setNewParticipant("");
  }, [newParticipant, participants.length]);

  // 참여자 삭제
  const handleDeleteParticipant = useCallback((id: string) => {
    setParticipants((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      return filtered.map((p, i) => ({ ...p, order: i }));
    });
  }, []);

  // 참여자 순서 랜덤 섞기
  const handleShuffleParticipants = useCallback(() => {
    setParticipants((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.map((p, i) => ({ ...p, order: i }));
    });
    setCurrentParticipantIndex(0);
  }, []);

  // 룰렛 시작
  const handleStartRoulette = useCallback(() => {
    if (availableQuestions.length === 0 || !currentParticipant) return;

    setIsSpinning(true);

    // 애니메이션 효과 (질문이 빠르게 바뀌는 효과)
    let spinCount = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      setSelectedQuestion(availableQuestions[randomIndex]);
      spinCount++;

      if (spinCount >= maxSpins) {
        clearInterval(interval);

        // 최종 결과 선택
        const finalIndex = Math.floor(
          Math.random() * availableQuestions.length
        );
        const finalQuestion = availableQuestions[finalIndex];
        setSelectedQuestion(finalQuestion);

        // 질문을 사용됨으로 표시
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === finalQuestion.id ? { ...q, isUsed: true } : q
          )
        );

        // 기록 추가
        const record: RouletteRecord = {
          id: `r-${Date.now()}`,
          participantId: currentParticipant.id,
          participantName: currentParticipant.name,
          questionId: finalQuestion.id,
          questionContent: finalQuestion.content,
          round,
          timestamp: new Date(),
        };
        setRecords((prev) => {
          const newRecords = [...prev, record];
          // 로컬 스토리지에 기록 저장
          try {
            const existingRecords = JSON.parse(
              localStorage.getItem(RECORDS_STORAGE_KEY) || "[]"
            );
            localStorage.setItem(
              RECORDS_STORAGE_KEY,
              JSON.stringify([...existingRecords, { ...record, groupName }])
            );
          } catch {
            // 로컬 스토리지 접근 불가
          }
          return newRecords;
        });

        setIsSpinning(false);
        setShowResultModal(true);
      }
    }, 100);
  }, [availableQuestions, currentParticipant, round, groupName]);

  // 마지막 기록의 맞춤/틀림 업데이트
  const handleUpdateLastRecordResult = useCallback((isCorrect: boolean) => {
    setRecords((prev) => {
      if (prev.length === 0) return prev;
      const updatedRecords = [...prev];
      const lastRecord = {
        ...updatedRecords[updatedRecords.length - 1],
        isCorrect,
      };
      updatedRecords[updatedRecords.length - 1] = lastRecord;

      // 로컬 스토리지 업데이트
      try {
        const existingRecords = JSON.parse(
          localStorage.getItem(RECORDS_STORAGE_KEY) || "[]"
        );
        if (existingRecords.length > 0) {
          existingRecords[existingRecords.length - 1] = {
            ...existingRecords[existingRecords.length - 1],
            isCorrect,
          };
          localStorage.setItem(
            RECORDS_STORAGE_KEY,
            JSON.stringify(existingRecords)
          );
        }
      } catch {
        // 로컬 스토리지 접근 불가
      }

      return updatedRecords;
    });
  }, []);

  // 다음 참여자로 이동
  const handleNextParticipant = useCallback(() => {
    setShowResultModal(false);
    setShowAnswerInModal(false);
    setSelectedQuestion(null);

    if (currentParticipantIndex < participants.length - 1) {
      setCurrentParticipantIndex((prev) => prev + 1);
    } else {
      // 한 바퀴 완료, 라운드 증가
      setCurrentParticipantIndex(0);
      setRound((prev) => prev + 1);
    }
  }, [currentParticipantIndex, participants.length]);

  // 게임 리셋
  const handleResetGame = useCallback(() => {
    setQuestions((prev) => prev.map((q) => ({ ...q, isUsed: false })));
    setCurrentParticipantIndex(0);
    setRound(1);
    setRecords([]);
    setSelectedQuestion(null);
  }, []);

  const canStartRoulette =
    availableQuestions.length > 0 && participants.length > 0 && !isSpinning;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Untitled"
          className="text-xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none focus:ring-0 p-0 w-auto min-w-[100px] placeholder:text-gray-400"
          style={{ width: `${Math.max(100, groupName.length * 14)}px` }}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            leftIcon={<SaveIcon />}
            onClick={handleSaveAsGroup}
            disabled={questions.length === 0}
          >
            저장하기
          </Button>
          <Button
            variant="secondary"
            leftIcon={<FolderOpenIcon />}
            onClick={handleOpenGroupModal}
          >
            불러오기
          </Button>
          <Button variant="ghost" onClick={handleResetGame}>
            초기화
          </Button>
        </div>
      </div>

      {/* 저장 메시지 */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-lg
              ${
                saveMessage.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
              }
            `}
          >
            {saveMessage.type === "success" && <CheckCircleIcon />}
            <span className="text-sm font-medium">{saveMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 참여자 */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <UserIcon />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  참여자
                </h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {participants.length}명
                </span>
              </div>
              <button
                onClick={handleOpenParticipantModal}
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                title="참여자 관리 페이지에서 불러오기"
              >
                <DatabaseIcon />
                <span>DB 불러오기</span>
              </button>
            </div>
            <div className="flex justify-end mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShuffleParticipants}
                disabled={participants.length < 2}
                leftIcon={<ShuffleIcon />}
              >
                순서 섞기
              </Button>
            </div>

            {/* 참여자 입력 */}
            <div className="flex gap-2 mb-4">
              <Input
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                placeholder="이름 입력"
                onKeyDown={(e) => e.key === "Enter" && handleAddParticipant()}
                className="flex-1"
              />
              <Button onClick={handleAddParticipant} size="sm">
                <PlusIcon />
              </Button>
            </div>

            {/* 참여자 리스트 */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {participants.map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`
                      group flex items-center gap-3 p-2.5 rounded-lg transition-all
                      ${
                        currentParticipantIndex === index
                          ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700"
                          : "bg-gray-50 dark:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                      }
                    `}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        avatarColors[index % avatarColors.length]
                      }`}
                    >
                      {participant.name.charAt(0)}
                    </div>
                    <span
                      className={`flex-1 text-sm ${
                        currentParticipantIndex === index
                          ? "font-semibold text-indigo-700 dark:text-indigo-300"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {participant.name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      #{index + 1}
                    </span>
                    <button
                      onClick={() => handleDeleteParticipant(participant.id)}
                      className="p-1 rounded text-rose-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all"
                    >
                      <TrashIcon />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {participants.length === 0 && (
              <div className="text-center py-6 text-gray-400 dark:text-gray-500">
                <UserIcon />
                <p className="mt-2 text-sm">참여자를 추가해주세요</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* 질문 목록 */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
          >
            {/* 룰렛 시작 버튼 영역 */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              {/* 현재 발표자 표시 */}
              {participants.length > 0 && (
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">
                      R{round}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      발표자:
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {currentParticipant?.name || "-"}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      ({currentParticipantIndex + 1}/{participants.length})
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    남은 질문: {availableQuestions.length}개
                  </span>
                </div>
              )}

              <Button
                onClick={handleStartRoulette}
                disabled={!canStartRoulette}
                size="lg"
                className="w-full"
                leftIcon={<PlayIcon />}
              >
                {isSpinning ? "선택 중..." : "룰렛 시작"}
              </Button>

              {availableQuestions.length === 0 && questions.length > 0 && (
                <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-2 rounded-lg text-center">
                  모든 질문이 완료되었습니다.
                </p>
              )}
            </div>

            {/* 질문 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <QuestionMarkIcon />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  질문 목록
                </h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {questions.length}개
                </span>
              </div>
            </div>

            {/* 질문 입력 */}
            <div className="flex gap-2 mb-4">
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="질문을 입력하세요"
                onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
                className="flex-1"
              />
              <Button onClick={handleAddQuestion} size="sm">
                <PlusIcon />
              </Button>
            </div>

            {/* 질문 리스트 */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              <AnimatePresence>
                {questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`
                      group flex items-center gap-2 p-3 rounded-lg border transition-all
                      ${
                        question.isUsed
                          ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50"
                          : selectedQuestion?.id === question.id && isSpinning
                          ? "bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-600"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                      }
                    `}
                  >
                    <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full shrink-0">
                      {index + 1}
                    </span>
                    <span
                      className={`flex-1 text-sm truncate ${
                        question.isUsed
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {question.content}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleQuestion(question.id)}
                        className={`p-1 rounded ${
                          question.isUsed
                            ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                            : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        title={question.isUsed ? "다시 포함" : "제외"}
                      >
                        {question.isUsed ? <CheckIcon /> : <XMarkIcon />}
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-1 rounded text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                        title="삭제"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {questions.length > 0 && (
              <button
                onClick={handleClearAllQuestions}
                className="mt-4 w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              >
                전체 삭제
              </button>
            )}

            {questions.length === 0 && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <QuestionMarkIcon />
                <p className="mt-2 text-sm">질문을 추가해주세요</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* 기록 */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 sticky top-24"
          >
            <div className="flex items-center gap-2 mb-4">
              <ClipboardIcon />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                기록
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                {records.length}개
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {records.length === 0 ? (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                  <ClipboardIcon />
                  <p className="mt-2 text-sm">아직 기록이 없습니다</p>
                  <p className="text-xs mt-1">룰렛을 시작해보세요</p>
                </div>
              ) : (
                <AnimatePresence>
                  {[...records].reverse().map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">
                          R{record.round}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          #{records.length - index}
                        </span>
                        {/* 맞춤/틀림 뱃지 */}
                        {record.isCorrect !== undefined && (
                          <span
                            className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              record.isCorrect
                                ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                                : "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300"
                            }`}
                          >
                            {record.isCorrect ? (
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                            {record.isCorrect ? "맞춤" : "틀림"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                            avatarColors[
                              (records.length - index - 1) % avatarColors.length
                            ]
                          }`}
                        >
                          {record.participantName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {record.participantName}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 pl-8">
                        &quot;{record.questionContent}&quot;
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 결과 모달 */}
      <Modal
        isOpen={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          setShowAnswerInModal(false);
        }}
        title=""
        size="md"
      >
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <SparklesIcon />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {currentParticipant?.name}
              </span>
              님의 질문
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              &quot;{selectedQuestion?.content}&quot;
            </h2>

            {/* 정답 확인하기 버튼 및 답변 영역 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              {!showAnswerInModal ? (
                <button
                  onClick={() => setShowAnswerInModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/70 transition-colors text-sm font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  정답 확인하기
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    정답
                  </div>
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-left">
                    {selectedQuestion?.answer ? (
                      <p className="text-sm text-indigo-700 dark:text-indigo-300">
                        {selectedQuestion.answer}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        등록된 답변이 없습니다
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowAnswerInModal(false)}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    답변 숨기기
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* 맞춤/틀림 선택 버튼 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                결과 선택
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleUpdateLastRecordResult(true)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    records.length > 0 &&
                    records[records.length - 1]?.isCorrect === true
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  맞춤
                </button>
                <button
                  onClick={() => handleUpdateLastRecordResult(false)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    records.length > 0 &&
                    records[records.length - 1]?.isCorrect === false
                      ? "bg-rose-500 text-white shadow-md"
                      : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/50"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  틀림
                </button>
              </div>
            </motion.div>

            {/* 마지막 질문일 때 축하 메시지 */}
            {availableQuestions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-4 py-3 px-4 bg-gradient-to-r from-indigo-100 to-teal-100 dark:from-indigo-900/50 dark:to-teal-900/50 rounded-xl"
              >
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  총 {records.length + 1}개의 질문을 완료했습니다
                </p>
              </motion.div>
            )}
          </motion.div>

          <div className="flex gap-3 justify-center">
            <Button
              variant={availableQuestions.length > 0 ? "secondary" : "primary"}
              onClick={() => {
                setShowResultModal(false);
                setShowAnswerInModal(false);

                // 마지막 질문이면 컨페티와 완료 메시지
                if (availableQuestions.length === 0) {
                  // 컨페티 효과
                  const duration = 3000;
                  const end = Date.now() + duration;

                  const frame = () => {
                    confetti({
                      particleCount: 5,
                      angle: 60,
                      spread: 55,
                      origin: { x: 0 },
                      colors: [
                        "#6366f1",
                        "#14b8a6",
                        "#f43f5e",
                        "#f59e0b",
                        "#10b981",
                      ],
                    });
                    confetti({
                      particleCount: 5,
                      angle: 120,
                      spread: 55,
                      origin: { x: 1 },
                      colors: [
                        "#6366f1",
                        "#14b8a6",
                        "#f43f5e",
                        "#f59e0b",
                        "#10b981",
                      ],
                    });

                    if (Date.now() < end) {
                      requestAnimationFrame(frame);
                    }
                  };
                  frame();

                  // 중앙 컨페티 한 번
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: [
                      "#6366f1",
                      "#14b8a6",
                      "#f43f5e",
                      "#f59e0b",
                      "#10b981",
                    ],
                  });

                  // 완료 메시지
                  setSaveMessage({
                    type: "success",
                    text: `🎉 모든 질문이 완료되었습니다! (총 ${records.length}개)`,
                  });
                  setTimeout(() => setSaveMessage(null), 4000);
                }
              }}
            >
              {availableQuestions.length === 0 ? "완료" : "닫기"}
            </Button>
            {availableQuestions.length > 0 && (
              <Button
                onClick={() => {
                  handleNextParticipant();
                  // 다음 질문이 있으면 바로 룰렛 시작
                  setTimeout(() => {
                    handleStartRoulette();
                  }, 100);
                }}
              >
                다음 질문
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* 질문 불러오기 모달 */}
      <Modal
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        title="질문 불러오기"
        size="lg"
      >
        <div className="space-y-4">
          {isLoadingQuestions ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : dbQuestions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <QuestionMarkIcon />
              <p className="mt-2">저장된 질문이 없습니다</p>
              <p className="text-sm mt-1">
                질문 관리 페이지에서 질문을 추가해주세요
              </p>
            </div>
          ) : (
            <>
              {/* 선택 도구 */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedDbQuestions.size}개 선택됨
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectAllQuestions(true)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    전체 선택
                  </button>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <button
                    onClick={() => handleSelectAllQuestions(false)}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                  >
                    선택 해제
                  </button>
                </div>
              </div>

              {/* 질문 리스트 */}
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {dbQuestions.map((question, index) => (
                  <label
                    key={question.id}
                    className={`
                      flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${
                        selectedDbQuestions.has(question.id)
                          ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDbQuestions.has(question.id)}
                      onChange={() => handleToggleDbQuestion(question.id)}
                      className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          #{index + 1}
                        </span>
                        {question.isIncluded && (
                          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                            포함됨
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
                        {question.content}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="secondary"
                  onClick={() => setShowQuestionModal(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={handleConfirmLoadQuestions}
                  disabled={selectedDbQuestions.size === 0}
                >
                  {selectedDbQuestions.size}개 불러오기
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* 참여자 불러오기 모달 */}
      <Modal
        isOpen={showParticipantModal}
        onClose={() => setShowParticipantModal(false)}
        title="참여자 불러오기"
        size="lg"
      >
        <div className="space-y-4">
          {isLoadingParticipants ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : dbParticipants.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <UserIcon />
              <p className="mt-2">저장된 참여자가 없습니다</p>
              <p className="text-sm mt-1">
                참여자 관리 페이지에서 참여자를 추가해주세요
              </p>
            </div>
          ) : (
            <>
              {/* 선택 도구 */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedDbParticipants.size}명 선택됨
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectAllParticipants(true)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    전체 선택
                  </button>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <button
                    onClick={() => handleSelectAllParticipants(false)}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                  >
                    선택 해제
                  </button>
                </div>
              </div>

              {/* 참여자 리스트 */}
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {dbParticipants.map((participant, index) => (
                  <label
                    key={participant.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${
                        selectedDbParticipants.has(participant.id)
                          ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDbParticipants.has(participant.id)}
                      onChange={() => handleToggleDbParticipant(participant.id)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        avatarColors[index % avatarColors.length]
                      }`}
                    >
                      {participant.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {participant.name}
                        </span>
                        {participant.isIncluded && (
                          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                            포함됨
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="secondary"
                  onClick={() => setShowParticipantModal(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={handleConfirmLoadParticipants}
                  disabled={selectedDbParticipants.size === 0}
                >
                  {selectedDbParticipants.size}명 불러오기
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* 그룹 선택 모달 */}
      <Modal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        title="질문 그룹 불러오기"
        size="2xl"
      >
        <div className="flex gap-4 min-h-[400px]">
          {/* 왼쪽: 그룹 리스트 */}
          <div className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-700 pr-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              그룹 선택
            </h3>

            {isLoadingQuestions ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {/* DB 그룹 */}
                {dbQuestions.length > 0 && (
                  <button
                    onClick={() => setSelectedGroupId("db")}
                    className={`
                      w-full text-left p-3 rounded-lg border transition-all
                      ${
                        selectedGroupId === "db"
                          ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <DatabaseIcon />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        질문 관리 (DB)
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {dbQuestions.length}개 질문
                    </p>
                  </button>
                )}

                {/* 구분선 */}
                {dbQuestions.length > 0 && questionGroups.length > 0 && (
                  <div className="flex items-center gap-2 py-1">
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      저장됨
                    </span>
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                )}

                {/* 저장된 그룹 */}
                {questionGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`
                      relative p-3 rounded-lg border transition-all group
                      ${
                        selectedGroupId === group.id
                          ? "bg-teal-50 dark:bg-teal-900/30 border-teal-300 dark:border-teal-600"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600"
                      }
                    `}
                  >
                    <button
                      onClick={() => setSelectedGroupId(group.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center gap-2">
                        <FolderIcon />
                        <span className="font-medium text-gray-900 dark:text-white text-sm truncate flex-1">
                          {group.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        질문 {group.questions.length}개
                        {group.participants &&
                          group.participants.length > 0 && (
                            <span> · 참여자 {group.participants.length}명</span>
                          )}
                      </p>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group.id);
                      }}
                      className="absolute top-2 right-2 p-1 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="삭제"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}

                {/* 빈 상태 */}
                {dbQuestions.length === 0 && questionGroups.length === 0 && (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                    <FolderIcon />
                    <p className="mt-2 text-xs">저장된 그룹이 없습니다</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 오른쪽: 선택된 그룹의 질문/참여자 리스트 */}
          <div className="flex-1 pl-2">
            {!selectedGroupId ? (
              <div className="flex items-center justify-center h-[350px] text-gray-400 dark:text-gray-500">
                <div className="text-center">
                  <QuestionMarkIcon />
                  <p className="mt-2 text-sm">왼쪽에서 그룹을 선택해주세요</p>
                </div>
              </div>
            ) : selectedGroupId === "db" ? (
              // DB 질문/참여자 리스트 (체크박스)
              <div className="space-y-4">
                {/* 참여자 섹션 */}
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <UserIcon />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        참여자
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedDbParticipants.size}/{dbParticipants.length}명
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSelectAllParticipants(true)}
                        className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        전체 선택
                      </button>
                      <span className="text-gray-300 dark:text-gray-600">
                        |
                      </span>
                      <button
                        onClick={() => handleSelectAllParticipants(false)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                      >
                        선택 해제
                      </button>
                    </div>
                  </div>

                  {isLoadingParticipants ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                    </div>
                  ) : dbParticipants.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                      참여자가 없습니다
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto">
                      {dbParticipants.map((participant, idx) => (
                        <label
                          key={participant.id}
                          className={`
                            flex items-center gap-1.5 px-2 py-1 rounded-full cursor-pointer transition-all text-xs
                            ${
                              selectedDbParticipants.has(participant.id)
                                ? "bg-teal-200 dark:bg-teal-800"
                                : "bg-white dark:bg-gray-700 hover:bg-teal-100 dark:hover:bg-teal-900/50"
                            }
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={selectedDbParticipants.has(participant.id)}
                            onChange={() =>
                              handleToggleDbParticipant(participant.id)
                            }
                            className="w-3 h-3 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-medium ${
                              avatarColors[idx % avatarColors.length]
                            }`}
                          >
                            {participant.name.charAt(0)}
                          </div>
                          <span className="text-gray-700 dark:text-gray-200">
                            {participant.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* 질문 섹션 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <QuestionMarkIcon />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        질문
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedDbQuestions.size}/{dbQuestions.length}개
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSelectAllQuestions(true)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        전체 선택
                      </button>
                      <span className="text-gray-300 dark:text-gray-600">
                        |
                      </span>
                      <button
                        onClick={() => handleSelectAllQuestions(false)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                      >
                        선택 해제
                      </button>
                    </div>
                  </div>

                  {/* 질문 체크박스 리스트 */}
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {dbQuestions.map((question, index) => (
                      <label
                        key={question.id}
                        className={`
                          flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-all
                          ${
                            selectedDbQuestions.has(question.id)
                              ? "bg-indigo-100 dark:bg-indigo-900/40"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDbQuestions.has(question.id)}
                          onChange={() => handleToggleDbQuestion(question.id)}
                          className="mt-0.5 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                          {index + 1}.
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-200 flex-1">
                          {question.content}
                        </span>
                        {question.isIncluded && (
                          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-1 py-0.5 rounded shrink-0">
                            포함
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 불러오기 버튼 */}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    className="w-full"
                    onClick={handleLoadSelectedFromDb}
                    disabled={selectedDbQuestions.size === 0}
                  >
                    불러오기 (질문 {selectedDbQuestions.size}개
                    {selectedDbParticipants.size > 0 &&
                      `, 참여자 ${selectedDbParticipants.size}명`}
                    )
                  </Button>
                </div>
              </div>
            ) : (
              // 저장된 그룹의 질문 및 참여자 리스트
              (() => {
                const group = questionGroups.find(
                  (g) => g.id === selectedGroupId
                );
                if (!group) return null;
                return (
                  <div className="space-y-4">
                    {/* 참여자 목록 */}
                    {group.participants && group.participants.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <UserIcon />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            참여자 ({group.participants.length}명)
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {group.participants.map((p, idx) => (
                            <div
                              key={p.id}
                              className="flex items-center gap-1.5 text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded-full"
                            >
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-medium ${
                                  avatarColors[idx % avatarColors.length]
                                }`}
                              >
                                {p.name.charAt(0)}
                              </div>
                              <span className="text-gray-700 dark:text-gray-200">
                                {p.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 질문 목록 */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          질문 ({group.questions.length}개)
                        </span>
                      </div>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {group.questions.map((q, idx) => (
                          <div
                            key={q.id}
                            className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                          >
                            <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                              {idx + 1}.
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-200">
                              {q.content}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 전체 불러오기 버튼 */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        className="w-full"
                        onClick={() => handleLoadFromGroup(group)}
                      >
                        전체 불러오기
                      </Button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={() => setShowGroupModal(false)}>
            닫기
          </Button>
        </div>
      </Modal>

      {/* 그룹 저장 모달 */}
      <Modal
        isOpen={showSaveGroupModal}
        onClose={() => setShowSaveGroupModal(false)}
        title=""
        size="2xl"
      >
        <div className="space-y-4">
          {/* 모달 헤더 - 컴팩트 */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {loadedGroupId ? "저장 옵션" : "새 그룹 저장"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {loadedGroupId
                  ? "변경사항 저장 방식 선택"
                  : "질문과 참여자를 그룹으로 저장"}
              </p>
            </div>
            {/* 변경 알림 뱃지 */}
            {loadedGroupId && loadedGroup && hasDataChanges && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                변경됨
              </span>
            )}
          </div>

          {/* 저장 타입 선택 - 가로 버튼 */}
          {loadedGroupId && loadedGroup && (
            <div className="flex gap-2">
              {/* 전체 업데이트 */}
              <button
                type="button"
                onClick={() => setSaveType("updateAll")}
                className={`relative flex-1 px-3 py-2 rounded-lg border-2 transition-all text-center ${
                  saveType === "updateAll"
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                {hasDataChanges && (
                  <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold px-1.5 py-0.5 bg-amber-500 text-white rounded-full">
                    권장
                  </span>
                )}
                <p
                  className={`font-medium text-sm ${
                    saveType === "updateAll"
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  전체 업데이트
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {hasDataChanges
                    ? `질문 ${loadedGroup.questions.length}→${questions.length}`
                    : "덮어쓰기"}
                </p>
              </button>

              {/* 새 그룹으로 저장 */}
              <button
                type="button"
                onClick={() => setSaveType("new")}
                className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all text-center ${
                  saveType === "new"
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <p
                  className={`font-medium text-sm ${
                    saveType === "new"
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  새 그룹 저장
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  원본 유지
                </p>
              </button>

              {/* 기록만 저장 (변경 없을 때만) */}
              {!hasDataChanges && (
                <button
                  type="button"
                  onClick={() => setSaveType("update")}
                  className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all text-center ${
                    saveType === "update"
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  <p
                    className={`font-medium text-sm ${
                      saveType === "update"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    기록만 저장
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {records.length}개 추가
                  </p>
                </button>
              )}
            </div>
          )}

          {/* 새 그룹 이름 입력 - 컴팩트 */}
          {(saveType === "new" || !loadedGroupId) && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                그룹 이름
              </p>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="예: 아이스브레이킹 질문"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                autoFocus
              />
            </div>
          )}

          {/* 업데이트 미리보기 - 컴팩트 */}
          {(saveType === "update" || saveType === "updateAll") &&
            loadedGroupId &&
            loadedGroup &&
            records.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    저장될 기록
                  </p>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {records.length}개
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 max-h-20 overflow-y-auto space-y-1">
                  {records.slice(0, 3).map((record, idx) => (
                    <div
                      key={record.id}
                      className="flex items-center gap-2 text-xs bg-white dark:bg-gray-800 rounded px-2 py-1.5"
                    >
                      <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[10px] font-medium text-indigo-600 dark:text-indigo-400 shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-gray-700 dark:text-gray-300 shrink-0">
                        {record.participantName}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="text-gray-500 dark:text-gray-400 truncate">
                        {record.questionContent}
                      </span>
                      {record.isCorrect !== undefined && (
                        <span
                          className={`text-[9px] px-1 py-0.5 rounded shrink-0 ${
                            record.isCorrect
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-rose-100 text-rose-600"
                          }`}
                        >
                          {record.isCorrect ? "O" : "X"}
                        </span>
                      )}
                    </div>
                  ))}
                  {records.length > 3 && (
                    <p className="text-[10px] text-gray-400 text-center">
                      +{records.length - 3}개 더
                    </p>
                  )}
                </div>
              </div>
            )}

          {/* 선택 영역 (새 그룹일 때만) */}
          {(saveType === "new" || !loadedGroupId) && (
            <div className="space-y-3 flex-1">
              <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                저장할 항목
              </p>
              <div className="grid md:grid-cols-2 gap-3 h-full">
                {/* 참여자 */}
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50/30 dark:from-teal-900/20 dark:to-emerald-900/10 rounded-xl p-4 border border-teal-200/60 dark:border-teal-700/40 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-white shadow-sm">
                        <UserIcon />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        참여자
                      </span>
                      <span className="text-xs font-medium text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/50 px-2 py-0.5 rounded-full">
                        {selectedSaveParticipants.size}/{participants.length}
                      </span>
                    </div>
                    {participants.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          selectedSaveParticipants.size === participants.length
                            ? setSelectedSaveParticipants(new Set())
                            : setSelectedSaveParticipants(
                                new Set(participants.map((p) => p.id))
                              )
                        }
                        className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
                      >
                        {selectedSaveParticipants.size === participants.length
                          ? "해제"
                          : "전체"}
                      </button>
                    )}
                  </div>
                  {participants.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8 flex-1 flex items-center justify-center">
                      참여자 없음
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1 flex-1">
                      {participants.map((p, idx) => (
                        <label
                          key={p.id}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                            selectedSaveParticipants.has(p.id)
                              ? "bg-white dark:bg-gray-800 shadow-sm ring-1 ring-teal-300 dark:ring-teal-600"
                              : "hover:bg-white/70 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSaveParticipants.has(p.id)}
                            onChange={() =>
                              setSelectedSaveParticipants((prev) => {
                                const s = new Set(prev);
                                if (s.has(p.id)) s.delete(p.id);
                                else s.add(p.id);
                                return s;
                              })
                            }
                            className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                          />
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                              avatarColors[idx % avatarColors.length]
                            }`}
                          >
                            {p.name.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-800 dark:text-gray-200 truncate font-medium">
                            {p.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* 질문 */}
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50/30 dark:from-indigo-900/20 dark:to-violet-900/10 rounded-xl p-4 border border-indigo-200/60 dark:border-indigo-700/40 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-sm">
                        <QuestionMarkIcon />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        질문
                      </span>
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">
                        {selectedSaveQuestions.size}/{questions.length}
                      </span>
                    </div>
                    {questions.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          selectedSaveQuestions.size === questions.length
                            ? setSelectedSaveQuestions(new Set())
                            : setSelectedSaveQuestions(
                                new Set(questions.map((q) => q.id))
                              )
                        }
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        {selectedSaveQuestions.size === questions.length
                          ? "해제"
                          : "전체"}
                      </button>
                    )}
                  </div>
                  {questions.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8 flex-1 flex items-center justify-center">
                      질문 없음
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1 flex-1">
                      {questions.map((q, idx) => (
                        <label
                          key={q.id}
                          className={`flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                            selectedSaveQuestions.has(q.id)
                              ? "bg-white dark:bg-gray-800 shadow-sm ring-1 ring-indigo-300 dark:ring-indigo-600"
                              : "hover:bg-white/70 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSaveQuestions.has(q.id)}
                            onChange={() =>
                              setSelectedSaveQuestions((prev) => {
                                const s = new Set(prev);
                                if (s.has(q.id)) s.delete(q.id);
                                else s.add(q.id);
                                return s;
                              })
                            }
                            className="w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500 mt-0.5"
                          />
                          <span className="text-xs text-indigo-400 dark:text-indigo-500 shrink-0 w-5 font-medium">
                            {idx + 1}.
                          </span>
                          <span
                            className={`text-sm text-gray-800 dark:text-gray-200 ${
                              q.isUsed ? "line-through opacity-50" : ""
                            }`}
                          >
                            {q.content}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 액션 버튼 - 컴팩트 */}
          <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowSaveGroupModal(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmSaveGroup}
              disabled={
                saveType === "new"
                  ? !newGroupName.trim() || selectedSaveQuestions.size === 0
                  : saveType === "update"
                  ? records.length === 0
                  : false
              }
              className="flex-1"
            >
              {saveType === "update" && loadedGroupId
                ? "기록 저장"
                : saveType === "updateAll" && loadedGroupId
                ? "업데이트"
                : "저장"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
