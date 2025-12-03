"use client";

import { motion } from "framer-motion";
import { useRoulette } from "@/hooks/useRoulette";
import { useUIStore } from "@/store/uiStore";

export default function RoulettePage() {
  const { items, isSpinning, result, spin, canSpin } = useRoulette();
  const { setItems, addItem, removeItem, clearItems } = useUIStore();

  const handleSpin = async () => {
    if (!canSpin) return;
    await spin();
  };

  const handleAddItem = () => {
    const item = prompt("추가할 항목을 입력하세요:");
    if (item?.trim()) {
      addItem(item.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">룰렛 돌리기</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 룰렛 영역 */}
          <div className="flex flex-col items-center justify-center">
            <motion.div
              className="w-64 h-64 rounded-full border-8 border-indigo-500 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100"
              animate={isSpinning ? { rotate: 360 * 5 } : { rotate: 0 }}
              transition={{
                duration: isSpinning ? 3 : 0,
                ease: "easeOut",
              }}
            >
              <span className="text-lg font-semibold text-indigo-700 text-center px-4">
                {result?.selectedItem || "룰렛을 돌려보세요!"}
              </span>
            </motion.div>

            <button
              onClick={handleSpin}
              disabled={!canSpin}
              className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSpinning ? "돌리는 중..." : "돌리기!"}
            </button>
          </div>

          {/* 항목 관리 영역 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">룰렛 항목</h2>
              <div className="space-x-2">
                <button
                  onClick={handleAddItem}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                >
                  항목 추가
                </button>
                <button
                  onClick={clearItems}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  전체 삭제
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  항목을 추가해주세요.
                </p>
              ) : (
                items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-800">{item}</span>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 결과 표시 */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-indigo-50 rounded-lg text-center"
          >
            <p className="text-lg text-gray-600">선택된 항목</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {result.selectedItem}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

