"use client";

import { useCallback } from "react";
import { useRouletteStore } from "@/store/uiStore";
import {
  generateRouletteResult,
  calculateSpinDuration,
} from "@/utils/roulette.utils";

/**
 * 룰렛 기능을 위한 커스텀 훅
 */
export function useRoulette() {
  const { items, isSpinning, result, startSpinning, stopSpinning, resetResult } =
    useRouletteStore();

  /**
   * 룰렛을 돌리고 결과를 반환합니다.
   */
  const spin = useCallback(async () => {
    if (items.length === 0) {
      throw new Error("룰렛에 항목이 없습니다.");
    }

    if (isSpinning) {
      return;
    }

    startSpinning();

    // 회전 애니메이션 시간
    const spinDuration = calculateSpinDuration();

    // 결과 미리 계산
    const rouletteResult = generateRouletteResult(items);

    // 애니메이션 완료 후 결과 설정
    return new Promise((resolve) => {
      setTimeout(() => {
        stopSpinning(rouletteResult);
        resolve(rouletteResult);
      }, spinDuration);
    });
  }, [items, isSpinning, startSpinning, stopSpinning]);

  return {
    items,
    isSpinning,
    result,
    spin,
    resetResult,
    canSpin: items.length > 0 && !isSpinning,
  };
}
