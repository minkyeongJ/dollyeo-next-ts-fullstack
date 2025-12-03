import { Roulette } from "@/utils/roulette.utils";

describe("Roulette", () => {
  describe("getRandomIndex", () => {
    it("유효한 범위 내의 인덱스를 반환해야 합니다", () => {
      const length = 10;
      for (let i = 0; i < 100; i++) {
        const index = Roulette.getRandomIndex(length);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(length);
      }
    });

    it("길이가 1인 경우 0을 반환해야 합니다", () => {
      expect(Roulette.getRandomIndex(1)).toBe(0);
    });

    it("길이가 0 이하인 경우 에러를 던져야 합니다", () => {
      expect(() => Roulette.getRandomIndex(0)).toThrow(
        "배열 길이는 0보다 커야 합니다."
      );
      expect(() => Roulette.getRandomIndex(-1)).toThrow(
        "배열 길이는 0보다 커야 합니다."
      );
    });
  });

  describe("selectRandomItem", () => {
    it("배열에서 항목을 선택해야 합니다", () => {
      const items = ["사과", "바나나", "체리"];
      for (let i = 0; i < 100; i++) {
        const selected = Roulette.selectRandomItem(items);
        expect(items).toContain(selected);
      }
    });

    it("빈 배열인 경우 에러를 던져야 합니다", () => {
      expect(() => Roulette.selectRandomItem([])).toThrow("배열이 비어있습니다.");
    });
  });

  describe("generateResult", () => {
    it("유효한 룰렛 결과를 반환해야 합니다", () => {
      const items = ["참가자1", "참가자2", "참가자3"];
      const result = Roulette.generateResult(items);

      expect(result.selectedItem).toBeDefined();
      expect(items).toContain(result.selectedItem);
      expect(result.selectedIndex).toBeGreaterThanOrEqual(0);
      expect(result.selectedIndex).toBeLessThan(items.length);
      expect(result.items).toEqual(items);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it("빈 배열인 경우 에러를 던져야 합니다", () => {
      expect(() => Roulette.generateResult([])).toThrow(
        "룰렛 항목이 비어있습니다."
      );
    });

    it("원본 배열을 복사해서 저장해야 합니다", () => {
      const items = ["참가자1", "참가자2"];
      const result = Roulette.generateResult(items);

      items.push("참가자3");
      expect(result.items).not.toContain("참가자3");
    });
  });

  describe("calculateSpinDuration", () => {
    it("기본 시간과 변동폭 내의 값을 반환해야 합니다", () => {
      for (let i = 0; i < 100; i++) {
        const duration = Roulette.calculateSpinDuration();
        expect(duration).toBeGreaterThanOrEqual(3000);
        expect(duration).toBeLessThan(4000);
      }
    });

    it("커스텀 값으로 시간을 계산해야 합니다", () => {
      for (let i = 0; i < 100; i++) {
        const duration = Roulette.calculateSpinDuration(5000, 2000);
        expect(duration).toBeGreaterThanOrEqual(5000);
        expect(duration).toBeLessThan(7000);
      }
    });
  });

  describe("shuffle", () => {
    it("원본 배열과 같은 항목을 포함해야 합니다", () => {
      const items = [1, 2, 3, 4, 5];
      const shuffled = Roulette.shuffle(items);

      expect(shuffled).toHaveLength(items.length);
      items.forEach((item) => {
        expect(shuffled).toContain(item);
      });
    });

    it("원본 배열을 변경하지 않아야 합니다", () => {
      const items = [1, 2, 3, 4, 5];
      const original = [...items];
      Roulette.shuffle(items);

      expect(items).toEqual(original);
    });

    it("빈 배열은 빈 배열을 반환해야 합니다", () => {
      expect(Roulette.shuffle([])).toEqual([]);
    });

    it("단일 항목 배열은 그대로 반환해야 합니다", () => {
      expect(Roulette.shuffle([1])).toEqual([1]);
    });
  });
});
