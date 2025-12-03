"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input } from "@/components/ui";

interface ShareSettingsModalProps {
  shareToken?: string;
  isPublic: boolean;
  onClose: () => void;
  onSave: (settings: { isPublic: boolean }) => Promise<void>;
  onGenerateToken: () => Promise<string>;
}

export function ShareSettingsModal({
  shareToken,
  isPublic: initialIsPublic,
  onClose,
  onSave,
  onGenerateToken,
}: ShareSettingsModalProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [currentToken, setCurrentToken] = useState(shareToken || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = currentToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${currentToken}`
    : "";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ isPublic });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateToken = async () => {
    setIsGenerating(true);
    try {
      const token = await onGenerateToken();
      setCurrentToken(token);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 공개 설정 토글 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">공개 설정</h3>
          <p className="text-sm text-gray-500">
            링크를 가진 누구나 룰렛을 볼 수 있습니다.
          </p>
        </div>
        <button
          onClick={() => setIsPublic(!isPublic)}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer 
            rounded-full border-2 border-transparent 
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            ${isPublic ? "bg-indigo-600" : "bg-gray-200"}
          `}
        >
          <motion.span
            layout
            className={`
              pointer-events-none inline-block h-5 w-5 
              rounded-full bg-white shadow ring-0
            `}
            animate={{ x: isPublic ? 20 : 0 }}
          />
        </button>
      </div>

      {/* 공유 링크 */}
      {isPublic && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              placeholder="공유 링크를 생성하세요"
              className="flex-1"
            />
            <Button
              variant="secondary"
              onClick={handleCopyLink}
              disabled={!shareUrl}
            >
              {copied ? "복사됨!" : "복사"}
            </Button>
          </div>

          {!currentToken && (
            <Button
              variant="ghost"
              onClick={handleGenerateToken}
              isLoading={isGenerating}
              className="w-full"
            >
              공유 링크 생성
            </Button>
          )}
        </motion.div>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-3 pt-4 border-t">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          취소
        </Button>
        <Button onClick={handleSave} isLoading={isSaving} className="flex-1">
          저장
        </Button>
      </div>
    </div>
  );
}

