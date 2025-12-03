import type { RouletteResult } from "@/types/data";

/**
 * 배열에서 랜덤 인덱스를 선택합니다.
 * @param length - 배열의 길이
 * @returns 랜덤 인덱스 (0부터 length-1 사이)
 */
export function getRandomIndex(length: number): number {
  if (length <= 0) {
    throw new Error("배열 길이는 0보다 커야 합니다.");
  }
  return Math.floor(Math.random() * length);
}

/**
 * 배열에서 랜덤 항목을 선택합니다.
 * @param items - 선택할 항목 배열
 * @returns 선택된 항목
 */
export function selectRandomItem<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error("배열이 비어있습니다.");
  }
  const index = getRandomIndex(items.length);
  return items[index];
}

/**
 * 룰렛 결과를 생성합니다.
 * @param items - 룰렛 항목 배열
 * @returns 룰렛 결과 객체
 */
export function generateRouletteResult(items: string[]): RouletteResult {
  if (items.length === 0) {
    throw new Error("룰렛 항목이 비어있습니다.");
  }

  const selectedIndex = getRandomIndex(items.length);
  const selectedItem = items[selectedIndex];

  return {
    selectedItem,
    selectedIndex,
    items: [...items],
    timestamp: new Date(),
  };
}

/**
 * 룰렛 회전 시간을 계산합니다. (ms)
 * @param baseTime - 기본 회전 시간 (기본값: 3000ms)
 * @param variance - 시간 변동폭 (기본값: 1000ms)
 * @returns 총 회전 시간 (ms)
 */
export function calculateSpinDuration(
  baseTime: number = 3000,
  variance: number = 1000
): number {
  return baseTime + Math.random() * variance;
}

/**
 * 항목 배열을 섞습니다. (Fisher-Yates 알고리즘)
 * @param items - 섞을 항목 배열
 * @returns 섞인 새 배열
 */
export function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
