"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 로컬 스토리지 키 (룰렛 페이지와 동일)
const GROUPS_STORAGE_KEY = "dollyeo-question-groups";
const RECORDS_STORAGE_KEY = "dollyeo-roulette-records";

// 타입 정의
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

interface QuestionGroup {
  id: string;
  name: string;
  questions: LocalQuestion[];
  participants: LocalParticipant[];
  createdAt: string;
}

interface RouletteRecord {
  id: string;
  participantId: string;
  participantName: string;
  questionId: string;
  questionContent: string;
  round: number;
  timestamp: string;
  groupName?: string;
  isCorrect?: boolean;
}

// 아이콘 컴포넌트들
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

function QuestionIcon() {
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
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );
}

function CheckCircleIcon() {
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
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ArrowRightIcon() {
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
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}

function PencilIcon() {
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
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );
}

function ChatBubbleIcon() {
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
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
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

// 아바타 색상
const avatarColors = [
  "bg-indigo-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-pink-500",
];

// 목데이터
const MOCK_GROUPS: QuestionGroup[] = [
  {
    id: "group-1",
    name: "아이스브레이킹 질문",
    questions: [
      {
        id: "q1",
        content: "가장 좋아하는 음식은 무엇인가요?",
        isUsed: false,
        answer: "저는 파스타를 가장 좋아합니다.",
      },
      {
        id: "q2",
        content: "최근에 본 영화 중 추천하고 싶은 작품이 있나요?",
        isUsed: true,
        answer:
          "인터스텔라를 추천합니다. 우주와 인간의 사랑에 대한 이야기입니다.",
      },
      {
        id: "q3",
        content: "주말에 주로 무엇을 하며 시간을 보내나요?",
        isUsed: false,
      },
      {
        id: "q4",
        content: "올해 꼭 이루고 싶은 목표가 있다면?",
        isUsed: false,
        answer: "매일 운동하는 습관을 들이고 싶습니다.",
      },
      {
        id: "q5",
        content: "가장 기억에 남는 여행지는 어디인가요?",
        isUsed: true,
      },
    ],
    participants: [
      { id: "p1", name: "김철수", order: 0 },
      { id: "p2", name: "이영희", order: 1 },
      { id: "p3", name: "박민수", order: 2 },
      { id: "p4", name: "최지연", order: 3 },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2일 전
  },
  {
    id: "group-2",
    name: "팀 회의 질문",
    questions: [
      {
        id: "q6",
        content: "이번 스프린트에서 가장 어려웠던 점은?",
        isUsed: false,
        answer: "API 연동 부분에서 예상치 못한 이슈가 많았습니다.",
      },
      {
        id: "q7",
        content: "다음 스프린트에서 개선하고 싶은 부분이 있나요?",
        isUsed: false,
      },
      {
        id: "q8",
        content: "팀원들에게 감사 인사를 전하고 싶다면?",
        isUsed: true,
        answer: "코드 리뷰해주신 모든 분들께 감사합니다!",
      },
    ],
    participants: [
      { id: "p5", name: "홍길동", order: 0 },
      { id: "p6", name: "김개발", order: 1 },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
  },
  {
    id: "group-3",
    name: "점심 메뉴 정하기",
    questions: [
      { id: "q9", content: "오늘 점심 뭐 먹을까요?", isUsed: false },
      {
        id: "q10",
        content: "매운 음식 vs 안 매운 음식?",
        isUsed: false,
        answer: "매운 음식!",
      },
      { id: "q11", content: "배달 vs 외출?", isUsed: false },
    ],
    participants: [
      { id: "p7", name: "박지성", order: 0 },
      { id: "p8", name: "손흥민", order: 1 },
      { id: "p9", name: "이강인", order: 2 },
    ],
    createdAt: new Date().toISOString(), // 오늘
  },
];

const MOCK_RECORDS: RouletteRecord[] = [
  {
    id: "r1",
    participantId: "p1",
    participantName: "김철수",
    questionId: "q2",
    questionContent: "최근에 본 영화 중 추천하고 싶은 작품이 있나요?",
    round: 1,
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    groupName: "아이스브레이킹 질문",
    isCorrect: true,
  },
  {
    id: "r2",
    participantId: "p2",
    participantName: "이영희",
    questionId: "q5",
    questionContent: "가장 기억에 남는 여행지는 어디인가요?",
    round: 1,
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    groupName: "아이스브레이킹 질문",
    isCorrect: false,
  },
  {
    id: "r3",
    participantId: "p5",
    participantName: "홍길동",
    questionId: "q8",
    questionContent: "팀원들에게 감사 인사를 전하고 싶다면?",
    round: 1,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    groupName: "팀 회의 질문",
    isCorrect: true,
  },
];

// 초기 데이터 로딩 함수
function loadInitialData(): {
  groups: QuestionGroup[];
  selectedId: string | null;
  records: RouletteRecord[];
} {
  if (typeof window === "undefined") {
    return {
      groups: [],
      selectedId: null,
      records: [],
    };
  }

  try {
    const savedGroups = localStorage.getItem(GROUPS_STORAGE_KEY);
    let groups: QuestionGroup[] = MOCK_GROUPS;
    let selectedId: string | null = MOCK_GROUPS[0]?.id || null;

    if (savedGroups) {
      const parsedGroups = JSON.parse(savedGroups);
      if (parsedGroups.length > 0) {
        groups = parsedGroups;
        selectedId = parsedGroups[0].id;
      }
    }

    const savedRecords = localStorage.getItem(RECORDS_STORAGE_KEY);
    let records: RouletteRecord[] = MOCK_RECORDS;

    if (savedRecords) {
      const parsedRecords = JSON.parse(savedRecords);
      if (parsedRecords.length > 0) {
        records = parsedRecords;
      }
    }

    return { groups, selectedId, records };
  } catch {
    return {
      groups: MOCK_GROUPS,
      selectedId: MOCK_GROUPS[0]?.id || null,
      records: MOCK_RECORDS,
    };
  }
}

// 초기 데이터 상태 타입
interface DataState {
  questionGroups: QuestionGroup[];
  allRecords: RouletteRecord[];
  selectedGroupId: string | null;
}

export default function QuestionsPage() {
  // 초기화 여부 추적
  const isInitialized = useRef(false);

  // 로컬 스토리지 데이터 (단일 상태로 관리)
  const [data, setData] = useState<DataState>({
    questionGroups: [],
    allRecords: [],
    selectedGroupId: null,
  });

  const [activeTab, setActiveTab] = useState<
    "questions" | "participants" | "records"
  >("questions");

  // 답변 편집 상태
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [editingAnswer, setEditingAnswer] = useState("");

  // 클라이언트에서만 데이터 로딩 (초기 마운트 시 한 번만 실행)
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const { groups, selectedId, records } = loadInitialData();
    setData({
      questionGroups: groups,
      allRecords: records,
      selectedGroupId: selectedId,
    });
  }, []);

  // 편의를 위한 구조 분해
  const { questionGroups, allRecords, selectedGroupId } = data;

  // 그룹 업데이트 헬퍼
  const setQuestionGroups = (groups: QuestionGroup[]) => {
    setData((prev) => ({ ...prev, questionGroups: groups }));
  };

  const setSelectedGroupId = (id: string | null) => {
    setData((prev) => ({ ...prev, selectedGroupId: id }));
  };

  // 그룹 삭제
  const handleDeleteGroup = (groupId: string) => {
    const updatedGroups = questionGroups.filter((g) => g.id !== groupId);
    setQuestionGroups(updatedGroups);
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updatedGroups));

    if (selectedGroupId === groupId) {
      setSelectedGroupId(updatedGroups.length > 0 ? updatedGroups[0].id : null);
    }
  };

  // 답변 저장
  const handleSaveAnswer = (questionId: string) => {
    const updatedGroups = questionGroups.map((group) => {
      if (group.id === selectedGroupId) {
        return {
          ...group,
          questions: group.questions.map((q) =>
            q.id === questionId ? { ...q, answer: editingAnswer } : q
          ),
        };
      }
      return group;
    });
    setQuestionGroups(updatedGroups);
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updatedGroups));
    setEditingQuestionId(null);
    setEditingAnswer("");
  };

  // 답변 편집 시작
  const handleStartEditAnswer = (question: LocalQuestion) => {
    setEditingQuestionId(question.id);
    setEditingAnswer(question.answer || "");
  };

  // 선택된 그룹
  const selectedGroup = useMemo(
    () => questionGroups.find((g) => g.id === selectedGroupId),
    [questionGroups, selectedGroupId]
  );

  // 선택된 그룹의 기록만 필터링
  const groupRecords = useMemo(() => {
    if (!selectedGroup) return [];
    return allRecords.filter((r) => r.groupName === selectedGroup.name);
  }, [allRecords, selectedGroup]);

  // 참여자별 답변 질문 매핑
  const participantQuestionMap = useMemo(() => {
    if (!selectedGroup) return new Map<string, RouletteRecord[]>();

    const map = new Map<string, RouletteRecord[]>();
    selectedGroup.participants?.forEach((p) => {
      const participantRecords = groupRecords.filter(
        (r) => r.participantName === p.name
      );
      map.set(p.name, participantRecords);
    });
    return map;
  }, [selectedGroup, groupRecords]);

  // 질문별 답변자 매핑
  const questionAnswerMap = useMemo(() => {
    const map = new Map<string, string>();
    groupRecords.forEach((r) => {
      map.set(r.questionContent, r.participantName);
    });
    return map;
  }, [groupRecords]);

  return (
    <div className="space-y-6">
      {/* 헤더 */}

      <div className="grid lg:grid-cols-12 gap-6">
        {/* 왼쪽: 그룹 목록 */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sticky top-24"
          >
            <div className="flex items-center gap-2 mb-4">
              <FolderIcon />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                질문 그룹
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                {questionGroups.length}개
              </span>
            </div>

            {questionGroups.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <FolderIcon />
                <p className="mt-2 text-sm">저장된 그룹이 없습니다</p>
                <p className="text-xs mt-1">
                  룰렛 페이지에서 그룹을 저장해보세요
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {questionGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`
                      relative p-3 rounded-lg border cursor-pointer transition-all group/item
                      ${
                        selectedGroupId === group.id
                          ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                      }
                    `}
                  >
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate pr-6">
                      {group.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      질문 {group.questions.length}개
                      {group.participants && group.participants.length > 0 && (
                        <span> · 참여자 {group.participants.length}명</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {new Date(group.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group.id);
                      }}
                      className="absolute top-2 right-2 p-1 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded opacity-0 group-hover/item:opacity-100 transition-opacity"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* 오른쪽: 그룹 상세 */}
        <div className="lg:col-span-9">
          {!selectedGroup ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <FolderIcon />
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                그룹을 선택해주세요
              </p>
            </div>
          ) : (
            <motion.div
              key={selectedGroup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* 그룹 헤더 */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedGroup.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(selectedGroup.createdAt).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                      질문 {selectedGroup.questions.length}개
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300">
                      참여자 {selectedGroup.participants?.length || 0}명
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                      기록 {groupRecords.length}개
                    </span>
                  </div>
                </div>
              </div>

              {/* 탭 */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex gap-6">
                  {[
                    {
                      key: "questions",
                      label: "질문 목록",
                      icon: <QuestionIcon />,
                    },
                    {
                      key: "participants",
                      label: "참여자",
                      icon: <UserIcon />,
                    },
                    {
                      key: "records",
                      label: "답변 기록",
                      icon: <ClipboardIcon />,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={`
                        flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors
                        ${
                          activeTab === tab.key
                            ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }
                      `}
                    >
                      {tab.icon}
                      <span className="font-medium text-sm">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* 질문 목록 탭 */}
              {activeTab === "questions" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {selectedGroup.questions.map((question, idx) => {
                      const answeredBy = questionAnswerMap.get(
                        question.content
                      );
                      const isEditing = editingQuestionId === question.id;

                      return (
                        <div
                          key={question.id}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full shrink-0">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 dark:text-white font-medium">
                                {question.content}
                              </p>

                              {/* 답변 영역 */}
                              {isEditing ? (
                                <div className="mt-3">
                                  <textarea
                                    value={editingAnswer}
                                    onChange={(e) =>
                                      setEditingAnswer(e.target.value)
                                    }
                                    placeholder="답변을 입력하세요..."
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                                    rows={3}
                                    autoFocus
                                  />
                                  <div className="flex gap-2 mt-2">
                                    <button
                                      onClick={() =>
                                        handleSaveAnswer(question.id)
                                      }
                                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
                                    >
                                      <CheckIcon />
                                      저장
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingQuestionId(null);
                                        setEditingAnswer("");
                                      }}
                                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                      <XMarkIcon />
                                      취소
                                    </button>
                                  </div>
                                </div>
                              ) : question.answer ? (
                                <div className="mt-2 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <ChatBubbleIcon />
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300 flex-1">
                                      {question.answer}
                                    </p>
                                    <button
                                      onClick={() =>
                                        handleStartEditAnswer(question)
                                      }
                                      className="p-1 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded transition-colors"
                                      title="답변 수정"
                                    >
                                      <PencilIcon />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleStartEditAnswer(question)
                                  }
                                  className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                                >
                                  <PencilIcon />
                                  답변 추가
                                </button>
                              )}
                            </div>

                            {answeredBy && (
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-full shrink-0">
                                <CheckCircleIcon />
                                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                  {answeredBy}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* 참여자 탭 */}
              {activeTab === "participants" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
                >
                  {!selectedGroup.participants ||
                  selectedGroup.participants.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                      <UserIcon />
                      <p className="mt-2 text-sm">참여자가 없습니다</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedGroup.participants.map((participant, idx) => {
                        const participantRecords =
                          participantQuestionMap.get(participant.name) || [];
                        return (
                          <div
                            key={participant.id}
                            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                                  avatarColors[idx % avatarColors.length]
                                }`}
                              >
                                {participant.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {participant.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  #{idx + 1} · 답변 {participantRecords.length}
                                  개
                                </p>
                              </div>
                            </div>

                            {participantRecords.length > 0 && (
                              <div className="ml-13 space-y-2">
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                  답변한 질문:
                                </p>
                                {participantRecords.map((record) => (
                                  <div
                                    key={record.id}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <ArrowRightIcon />
                                    <p className="text-gray-700 dark:text-gray-300">
                                      &quot;{record.questionContent}&quot;
                                    </p>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                                      R{record.round}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* 답변 기록 탭 */}
              {activeTab === "records" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
                >
                  {groupRecords.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                      <ClipboardIcon />
                      <p className="mt-2 text-sm">기록이 없습니다</p>
                      <p className="text-xs mt-1">
                        이 그룹으로 룰렛 게임을 진행해보세요
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <AnimatePresence>
                        {[...groupRecords].reverse().map((record, index) => (
                          <motion.div
                            key={record.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">
                                라운드 {record.round}
                              </span>
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                #{groupRecords.length - index}
                              </span>
                              {/* 맞춤/틀림 뱃지 */}
                              {record.isCorrect !== undefined && (
                                <span
                                  className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${
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
                              <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                                {new Date(record.timestamp).toLocaleString(
                                  "ko-KR"
                                )}
                              </span>
                            </div>

                            <div className="flex items-center gap-4">
                              {/* 참여자 */}
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                    avatarColors[
                                      (groupRecords.length - index - 1) %
                                        avatarColors.length
                                    ]
                                  }`}
                                >
                                  {record.participantName.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {record.participantName}
                                </span>
                              </div>

                              <ArrowRightIcon />

                              {/* 질문 */}
                              <p className="flex-1 text-gray-600 dark:text-gray-300 text-sm">
                                &quot;{record.questionContent}&quot;
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
