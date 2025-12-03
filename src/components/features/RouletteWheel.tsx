"use client";

import { motion } from "framer-motion";
import { useRoulette } from "@/hooks/useRoulette";

interface RouletteWheelProps {
  onSpinComplete?: (result: string) => void;
}

export function RouletteWheel({ onSpinComplete }: RouletteWheelProps) {
  const { items, isSpinning, result, spin, canSpin } = useRoulette();

  const handleSpin = async () => {
    if (!canSpin) return;

    const spinResult = await spin();
    if (spinResult && onSpinComplete) {
      onSpinComplete(spinResult.selectedItem);
    }
  };

  // 색상 배열 (룰렛 조각별)
  const colors = [
    "#EF4444", // red
    "#F97316", // orange
    "#EAB308", // yellow
    "#22C55E", // green
    "#3B82F6", // blue
    "#8B5CF6", // violet
    "#EC4899", // pink
    "#06B6D4", // cyan
  ];

  return (
    <div className="flex flex-col items-center">
      {/* 룰렛 휠 */}
      <div className="relative">
        {/* 포인터 */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-indigo-600" />
        </div>

        {/* 휠 */}
        <motion.div
          className="w-72 h-72 rounded-full border-8 border-indigo-600 relative overflow-hidden"
          animate={
            isSpinning
              ? { rotate: 360 * 5 + Math.random() * 360 }
              : { rotate: 0 }
          }
          transition={{
            duration: isSpinning ? 3.5 : 0,
            ease: [0.2, 0.8, 0.3, 1],
          }}
          style={{
            background:
              items.length > 0
                ? `conic-gradient(${items
                    .map(
                      (_, i) =>
                        `${colors[i % colors.length]} ${(i / items.length) * 100}% ${((i + 1) / items.length) * 100}%`
                    )
                    .join(", ")})`
                : "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
          }}
        >
          {/* 항목 텍스트 */}
          {items.map((item, index) => {
            const angle = (index / items.length) * 360 + 360 / items.length / 2;
            return (
              <div
                key={index}
                className="absolute w-full h-full flex items-center justify-center"
                style={{
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <span
                  className="text-white text-xs font-semibold truncate max-w-[80px] transform -translate-y-24"
                  style={{
                    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  {item}
                </span>
              </div>
            );
          })}

          {/* 중앙 원 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-lg">GO</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 돌리기 버튼 */}
      <motion.button
        whileHover={{ scale: canSpin ? 1.05 : 1 }}
        whileTap={{ scale: canSpin ? 0.95 : 1 }}
        onClick={handleSpin}
        disabled={!canSpin}
        className={`
          mt-8 px-10 py-4 rounded-full font-bold text-lg
          transition-all duration-200
          ${
            canSpin
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }
        `}
      >
        {isSpinning ? "돌리는 중..." : items.length === 0 ? "항목을 추가하세요" : "돌리기!"}
      </motion.button>

      {/* 결과 표시 */}
      {result && !isSpinning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-indigo-50 rounded-lg text-center"
        >
          <p className="text-sm text-gray-600">🎉 당첨!</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {result.selectedItem}
          </p>
        </motion.div>
      )}
    </div>
  );
}

