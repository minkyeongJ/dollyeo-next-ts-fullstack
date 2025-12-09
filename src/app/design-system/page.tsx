"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

// 컬러 팔레트 데이터
const colorPalettes = {
  primary: [
    { name: "50", value: "#eef2ff", textDark: true },
    { name: "100", value: "#e0e7ff", textDark: true },
    { name: "200", value: "#c7d2fe", textDark: true },
    { name: "300", value: "#a5b4fc", textDark: true },
    { name: "400", value: "#818cf8", textDark: false },
    { name: "500", value: "#6366f1", textDark: false },
    { name: "600", value: "#4f46e5", textDark: false },
    { name: "700", value: "#4338ca", textDark: false },
    { name: "800", value: "#3730a3", textDark: false },
    { name: "900", value: "#312e81", textDark: false },
  ],
  secondary: [
    { name: "50", value: "#f0fdfa", textDark: true },
    { name: "100", value: "#ccfbf1", textDark: true },
    { name: "200", value: "#99f6e4", textDark: true },
    { name: "300", value: "#5eead4", textDark: true },
    { name: "400", value: "#2dd4bf", textDark: true },
    { name: "500", value: "#14b8a6", textDark: false },
    { name: "600", value: "#0d9488", textDark: false },
    { name: "700", value: "#0f766e", textDark: false },
    { name: "800", value: "#115e59", textDark: false },
    { name: "900", value: "#134e4a", textDark: false },
  ],
  accent: [
    { name: "50", value: "#fff1f2", textDark: true },
    { name: "100", value: "#ffe4e6", textDark: true },
    { name: "200", value: "#fecdd3", textDark: true },
    { name: "300", value: "#fda4af", textDark: true },
    { name: "400", value: "#fb7185", textDark: false },
    { name: "500", value: "#f43f5e", textDark: false },
    { name: "600", value: "#e11d48", textDark: false },
    { name: "700", value: "#be123c", textDark: false },
    { name: "800", value: "#9f1239", textDark: false },
    { name: "900", value: "#881337", textDark: false },
  ],
  gray: [
    { name: "50", value: "#f9fafb", textDark: true },
    { name: "100", value: "#f3f4f6", textDark: true },
    { name: "200", value: "#e5e7eb", textDark: true },
    { name: "300", value: "#d1d5db", textDark: true },
    { name: "400", value: "#9ca3af", textDark: true },
    { name: "500", value: "#6b7280", textDark: false },
    { name: "600", value: "#4b5563", textDark: false },
    { name: "700", value: "#374151", textDark: false },
    { name: "800", value: "#1f2937", textDark: false },
    { name: "900", value: "#111827", textDark: false },
  ],
};

const semanticColors = [
  { name: "Success", light: "#d1fae5", main: "#10b981", dark: "#059669" },
  { name: "Warning", light: "#fef3c7", main: "#f59e0b", dark: "#d97706" },
  { name: "Error", light: "#fee2e2", main: "#ef4444", dark: "#dc2626" },
  { name: "Info", light: "#dbeafe", main: "#3b82f6", dark: "#2563eb" },
];

// 컬러 스와치 컴포넌트
function ColorSwatch({ 
  color, 
  name, 
  textDark = true 
}: { 
  color: string; 
  name: string; 
  textDark?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      className="group relative flex flex-col items-center"
    >
      <div
        className="w-16 h-16 rounded-xl shadow-md transition-shadow hover:shadow-lg"
        style={{ backgroundColor: color }}
      />
      <span className={`mt-2 text-xs font-medium ${textDark ? 'text-gray-700' : 'text-gray-500'}`}>
        {name}
      </span>
      <span className="text-[10px] text-gray-400 font-mono">{color}</span>
      {copied && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-6 text-xs bg-gray-800 text-white px-2 py-1 rounded"
        >
          복사됨!
        </motion.span>
      )}
    </motion.button>
  );
}

// 섹션 헤더 컴포넌트
function SectionHeader({ 
  title, 
  description 
}: { 
  title: string; 
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      {description && (
        <p className="text-gray-500">{description}</p>
      )}
    </div>
  );
}

// 카드 예시 컴포넌트
function FeedCard() {
  const [liked, setLiked] = useState(false);
  const [curious, setCurious] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
          김
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">김학생</span>
            <span className="text-xs text-gray-400">• 2시간 전</span>
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
              질문
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mb-2">
            React에서 useEffect와 useLayoutEffect의 차이가 뭔가요?
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            둘 다 사이드 이펙트를 처리하는데 사용하는 것 같은데, 언제 어떤 걸 사용해야 하는지 헷갈려요...
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                liked 
                  ? 'bg-rose-100 text-rose-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <HeartIcon filled={liked} />
              <span>좋아요</span>
              <span className="font-medium">12</span>
            </button>
            <button
              onClick={() => setCurious(!curious)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                curious 
                  ? 'bg-amber-100 text-amber-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <QuestionIcon />
              <span>저도 궁금해요</span>
              <span className="font-medium">8</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
              <ChatIcon />
              <span>답변</span>
              <span className="font-medium">3</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 아이콘 컴포넌트들
function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg className="w-4 h-4" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

// 스페이스 카드 컴포넌트
function SpaceCard({ 
  name, 
  memberCount, 
  color 
}: { 
  name: string; 
  memberCount: number; 
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
    >
      <div 
        className="h-24 flex items-end p-4"
        style={{ backgroundColor: color }}
      >
        <h3 className="text-white font-bold text-lg">{name}</h3>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <UsersIcon />
            {memberCount}명 참여중
          </span>
          <span className="w-2 h-2 bg-green-400 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

// 뱃지 컴포넌트
function Badge({ 
  children, 
  variant = "default" 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "primary" | "success" | "warning" | "error";
}) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-indigo-100 text-indigo-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

// 통계 카드 컴포넌트
function StatCard({ 
  label, 
  value, 
  change, 
  icon 
}: { 
  label: string; 
  value: string; 
  change?: string; 
  icon: React.ReactNode;
}) {
  const isPositive = change?.startsWith('+');
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400">{icon}</span>
        {change && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

export default function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/mascot.png" 
                alt="돌려요 마스코트" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">디자인 시스템</h1>
                <p className="text-xs text-gray-500">돌려요 스타일 가이드</p>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#colors" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">컬러</a>
              <a href="#typography" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">타이포그래피</a>
              <a href="#components" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">컴포넌트</a>
              <a href="#patterns" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">패턴</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 인트로 */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-white"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.img 
                src="/mascot.png" 
                alt="돌려요 마스코트" 
                className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  교육용 커뮤니티를 위한<br />디자인 시스템
                </h1>
                <p className="text-white/80 text-lg max-w-2xl mb-6">
                  클라썸 스타일의 가볍고 친근한 톤을 기반으로, 
                  피드형 커뮤니티와 모듈형 교육 기능을 위한 UI 가이드라인입니다.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">React</Badge>
                  <Badge variant="default">Tailwind CSS</Badge>
                  <Badge variant="default">Framer Motion</Badge>
                  <Badge variant="default">Next.js</Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 컬러 팔레트 */}
        <section id="colors" className="mb-16 scroll-mt-20">
          <SectionHeader 
            title="컬러 팔레트" 
            description="브랜드 아이덴티티를 구성하는 핵심 컬러 시스템입니다."
          />
          
          {/* Primary Colors */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-indigo-500" />
              Primary (Indigo)
            </h3>
            <div className="flex flex-wrap gap-4">
              {colorPalettes.primary.map((color) => (
                <ColorSwatch 
                  key={color.name} 
                  color={color.value} 
                  name={color.name}
                  textDark={color.textDark}
                />
              ))}
            </div>
          </div>

          {/* Secondary Colors */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-teal-500" />
              Secondary (Teal)
            </h3>
            <div className="flex flex-wrap gap-4">
              {colorPalettes.secondary.map((color) => (
                <ColorSwatch 
                  key={color.name} 
                  color={color.value} 
                  name={color.name}
                  textDark={color.textDark}
                />
              ))}
            </div>
          </div>

          {/* Accent Colors */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-rose-500" />
              Accent (Rose)
            </h3>
            <div className="flex flex-wrap gap-4">
              {colorPalettes.accent.map((color) => (
                <ColorSwatch 
                  key={color.name} 
                  color={color.value} 
                  name={color.name}
                  textDark={color.textDark}
                />
              ))}
            </div>
          </div>

          {/* Gray Colors */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gray-500" />
              Neutral (Gray)
            </h3>
            <div className="flex flex-wrap gap-4">
              {colorPalettes.gray.map((color) => (
                <ColorSwatch 
                  key={color.name} 
                  color={color.value} 
                  name={color.name}
                  textDark={color.textDark}
                />
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">시맨틱 컬러</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {semanticColors.map((color) => (
                <div key={color.name} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-3">{color.name}</h4>
                  <div className="flex gap-2">
                    <div 
                      className="flex-1 h-12 rounded-lg" 
                      style={{ backgroundColor: color.light }}
                      title="Light"
                    />
                    <div 
                      className="flex-1 h-12 rounded-lg" 
                      style={{ backgroundColor: color.main }}
                      title="Main"
                    />
                    <div 
                      className="flex-1 h-12 rounded-lg" 
                      style={{ backgroundColor: color.dark }}
                      title="Dark"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 타이포그래피 */}
        <section id="typography" className="mb-16 scroll-mt-20">
          <SectionHeader 
            title="타이포그래피" 
            description="가독성과 계층 구조를 고려한 텍스트 스타일입니다."
          />
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="space-y-6">
              <div className="flex items-baseline gap-4 pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-400 w-20 shrink-0">4XL / 36px</span>
                <span className="text-4xl font-bold text-gray-900">교육의 미래를 만듭니다</span>
              </div>
              <div className="flex items-baseline gap-4 pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-400 w-20 shrink-0">3XL / 30px</span>
                <span className="text-3xl font-bold text-gray-900">함께 배우고 성장하는 공간</span>
              </div>
              <div className="flex items-baseline gap-4 pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-400 w-20 shrink-0">2XL / 24px</span>
                <span className="text-2xl font-semibold text-gray-900">실시간 질문과 답변</span>
              </div>
              <div className="flex items-baseline gap-4 pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-400 w-20 shrink-0">XL / 20px</span>
                <span className="text-xl font-semibold text-gray-900">AI 기반 학습 분석</span>
              </div>
              <div className="flex items-baseline gap-4 pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-400 w-20 shrink-0">LG / 18px</span>
                <span className="text-lg font-medium text-gray-900">과제 제출 현황 확인하기</span>
              </div>
              <div className="flex items-baseline gap-4 pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-400 w-20 shrink-0">Base / 16px</span>
                <span className="text-base text-gray-700">본문 텍스트입니다. 가독성을 위해 적절한 줄 간격과 색상을 사용합니다.</span>
              </div>
              <div className="flex items-baseline gap-4 pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-400 w-20 shrink-0">SM / 14px</span>
                <span className="text-sm text-gray-600">보조 텍스트나 캡션에 사용되는 작은 사이즈입니다.</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-gray-400 w-20 shrink-0">XS / 12px</span>
                <span className="text-xs text-gray-500">메타 정보나 라벨에 사용됩니다.</span>
              </div>
            </div>
          </div>
        </section>

        {/* 버튼 */}
        <section id="components" className="mb-16 scroll-mt-20">
          <SectionHeader 
            title="버튼" 
            description="다양한 상황에 맞는 버튼 스타일입니다."
          />
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-8">
            {/* Variants */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-4">Variants</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-4">Sizes</h4>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-4">States</h4>
              <div className="flex flex-wrap gap-4">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button isLoading>Loading</Button>
              </div>
            </div>

            {/* With Icons */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-4">With Icons</h4>
              <div className="flex flex-wrap gap-4">
                <Button leftIcon={<PlusIcon />}>새 질문</Button>
                <Button rightIcon={<ArrowRightIcon />}>다음으로</Button>
                <Button variant="secondary" leftIcon={<ExportIcon />}>내보내기</Button>
              </div>
            </div>
          </div>
        </section>

        {/* 인풋 */}
        <section className="mb-16">
          <SectionHeader 
            title="인풋" 
            description="폼 요소를 위한 입력 컴포넌트입니다."
          />
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2 gap-6">
              <Input label="이름" placeholder="이름을 입력하세요" />
              <Input label="이메일" type="email" placeholder="email@example.com" />
              <Input label="검색" placeholder="검색어 입력..." leftIcon={<SearchIcon />} />
              <Input 
                label="비밀번호" 
                type="password" 
                placeholder="••••••••" 
                helperText="8자 이상 입력해주세요"
              />
              <Input 
                label="에러 상태" 
                placeholder="잘못된 입력" 
                error="올바른 형식으로 입력해주세요"
              />
              <Input 
                label="비활성화" 
                placeholder="수정 불가" 
                disabled 
              />
            </div>
          </div>
        </section>

        {/* 뱃지 */}
        <section className="mb-16">
          <SectionHeader 
            title="뱃지" 
            description="상태나 카테고리를 나타내는 작은 라벨입니다."
          />
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-3">
              <Badge>기본</Badge>
              <Badge variant="primary">질문</Badge>
              <Badge variant="success">해결됨</Badge>
              <Badge variant="warning">진행중</Badge>
              <Badge variant="error">마감임박</Badge>
            </div>
          </div>
        </section>

        {/* 모달 */}
        <section className="mb-16">
          <SectionHeader 
            title="모달" 
            description="팝업 다이얼로그 컴포넌트입니다."
          />
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <Button onClick={() => setIsModalOpen(true)}>모달 열기</Button>
            
            <Modal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
              title="새 질문 작성"
              size="lg"
            >
              <div className="space-y-4">
                <Input label="제목" placeholder="질문 제목을 입력하세요" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    내용
                  </label>
                  <textarea 
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                    placeholder="질문 내용을 상세히 적어주세요..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={() => setIsModalOpen(false)}>
                    질문 등록
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </section>

        {/* 패턴 - 카드 */}
        <section id="patterns" className="mb-16 scroll-mt-20">
          <SectionHeader 
            title="UI 패턴" 
            description="자주 사용되는 UI 패턴과 컴포넌트 조합입니다."
          />

          {/* 스페이스 카드 */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">공간 카드</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <SpaceCard name="웹 개발 입문" memberCount={42} color="#6366f1" />
              <SpaceCard name="React 마스터 클래스" memberCount={128} color="#14b8a6" />
              <SpaceCard name="CS 스터디" memberCount={67} color="#f43f5e" />
            </div>
          </div>

          {/* 피드 카드 */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">피드 카드</h3>
            <div className="max-w-2xl">
              <FeedCard />
            </div>
          </div>

          {/* 통계 카드 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">통계 카드</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<ChartIcon />} label="총 참여율" value="87.3%" change="+5.2%" />
              <StatCard icon={<CheckIcon />} label="과제 완료" value="156건" change="+12" />
              <StatCard icon={<ChatIcon />} label="질문 수" value="89건" change="+8" />
              <StatCard icon={<StarIcon />} label="평균 평점" value="4.8" change="-0.1" />
            </div>
          </div>
        </section>

        {/* 간격 시스템 */}
        <section className="mb-16">
          <SectionHeader 
            title="간격 시스템" 
            description="일관된 레이아웃을 위한 스페이싱 스케일입니다."
          />
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="space-y-4">
              {[
                { name: "space-1", value: "4px", width: "w-1" },
                { name: "space-2", value: "8px", width: "w-2" },
                { name: "space-3", value: "12px", width: "w-3" },
                { name: "space-4", value: "16px", width: "w-4" },
                { name: "space-5", value: "20px", width: "w-5" },
                { name: "space-6", value: "24px", width: "w-6" },
                { name: "space-8", value: "32px", width: "w-8" },
                { name: "space-10", value: "40px", width: "w-10" },
                { name: "space-12", value: "48px", width: "w-12" },
                { name: "space-16", value: "64px", width: "w-16" },
              ].map((space) => (
                <div key={space.name} className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 w-24">{space.name}</span>
                  <span className="text-xs text-gray-400 w-12">{space.value}</span>
                  <div className={`h-4 bg-indigo-500 rounded ${space.width}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 라운드니스 */}
        <section className="mb-16">
          <SectionHeader 
            title="모서리 라운드" 
            description="UI 요소의 부드러움을 결정하는 border-radius 값입니다."
          />
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-6">
              {[
                { name: "sm", value: "6px", class: "rounded-md" },
                { name: "default", value: "8px", class: "rounded-lg" },
                { name: "md", value: "10px", class: "rounded-[10px]" },
                { name: "lg", value: "12px", class: "rounded-xl" },
                { name: "xl", value: "16px", class: "rounded-2xl" },
                { name: "2xl", value: "24px", class: "rounded-3xl" },
                { name: "full", value: "9999px", class: "rounded-full" },
              ].map((radius) => (
                <div key={radius.name} className="text-center">
                  <div 
                    className={`w-16 h-16 bg-indigo-500 ${radius.class}`}
                  />
                  <p className="mt-2 text-sm font-medium text-gray-700">{radius.name}</p>
                  <p className="text-xs text-gray-400">{radius.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 그림자 */}
        <section className="mb-16">
          <SectionHeader 
            title="그림자" 
            description="깊이감과 계층 구조를 표현하는 그림자 시스템입니다."
          />
          
          <div className="bg-gray-100 rounded-2xl p-8">
            <div className="flex flex-wrap gap-8 justify-center">
              {[
                { name: "sm", class: "shadow-sm" },
                { name: "default", class: "shadow" },
                { name: "md", class: "shadow-md" },
                { name: "lg", class: "shadow-lg" },
                { name: "xl", class: "shadow-xl" },
              ].map((shadow) => (
                <div key={shadow.name} className="text-center">
                  <div 
                    className={`w-24 h-24 bg-white rounded-xl ${shadow.class}`}
                  />
                  <p className="mt-3 text-sm font-medium text-gray-700">{shadow.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 아이콘 */}
        <section className="mb-16">
          <SectionHeader 
            title="아이콘" 
            description="시스템에서 사용되는 기본 아이콘 세트입니다."
          />
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
              {[
                { name: "Heart", icon: <HeartIcon /> },
                { name: "Question", icon: <QuestionIcon /> },
                { name: "Chat", icon: <ChatIcon /> },
                { name: "Search", icon: <SearchIcon /> },
                { name: "Plus", icon: <PlusIcon /> },
                { name: "Arrow", icon: <ArrowRightIcon /> },
                { name: "Export", icon: <ExportIcon /> },
                { name: "Users", icon: <UsersIcon /> },
                { name: "Chart", icon: <ChartIcon /> },
                { name: "Check", icon: <CheckIcon /> },
                { name: "Star", icon: <StarIcon /> },
              ].map((item) => (
                <div key={item.name} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                    {item.icon}
                  </div>
                  <span className="text-xs text-gray-500">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/mascot.png" 
                alt="돌려요 마스코트" 
                className="w-8 h-8 object-contain"
              />
              <p className="text-sm text-gray-500">
                © 2024 돌려요. 디자인 시스템 가이드
              </p>
            </div>
            <p className="text-sm text-gray-400">
              Made with care
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
