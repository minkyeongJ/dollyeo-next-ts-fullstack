import { Question } from "@/utils/question.utils";

describe("Question", () => {
  describe("add", () => {
    it("질문을 추가해야 합니다", () => {
      const questions: string[] = [];
      const result = Question.add(questions, "좋아하는 음식은?");

      expect(result).toEqual(["좋아하는 음식은?"]);
    });

    it("기존 목록에 질문을 추가해야 합니다", () => {
      const questions = ["첫 번째 질문"];
      const result = Question.add(questions, "두 번째 질문");

      expect(result).toEqual(["첫 번째 질문", "두 번째 질문"]);
    });

    it("원본 배열을 변경하지 않아야 합니다", () => {
      const questions = ["첫 번째 질문"];
      Question.add(questions, "두 번째 질문");

      expect(questions).toEqual(["첫 번째 질문"]);
    });

    it("질문 앞뒤 공백을 제거해야 합니다", () => {
      const result = Question.add([], "  질문입니다  ");

      expect(result).toEqual(["질문입니다"]);
    });

    it("빈 질문은 에러를 던져야 합니다", () => {
      expect(() => Question.add([], "")).toThrow("유효하지 않은 질문입니다.");
      expect(() => Question.add([], "   ")).toThrow("유효하지 않은 질문입니다.");
    });
  });

  describe("remove", () => {
    it("인덱스로 질문을 삭제해야 합니다", () => {
      const questions = ["질문1", "질문2", "질문3"];
      const result = Question.remove(questions, 1);

      expect(result).toEqual(["질문1", "질문3"]);
    });

    it("첫 번째 질문을 삭제할 수 있어야 합니다", () => {
      const questions = ["질문1", "질문2"];
      const result = Question.remove(questions, 0);

      expect(result).toEqual(["질문2"]);
    });

    it("마지막 질문을 삭제할 수 있어야 합니다", () => {
      const questions = ["질문1", "질문2"];
      const result = Question.remove(questions, 1);

      expect(result).toEqual(["질문1"]);
    });

    it("원본 배열을 변경하지 않아야 합니다", () => {
      const questions = ["질문1", "질문2"];
      Question.remove(questions, 0);

      expect(questions).toEqual(["질문1", "질문2"]);
    });

    it("유효하지 않은 인덱스는 에러를 던져야 합니다", () => {
      const questions = ["질문1"];

      expect(() => Question.remove(questions, -1)).toThrow(
        "유효하지 않은 인덱스입니다."
      );
      expect(() => Question.remove(questions, 1)).toThrow(
        "유효하지 않은 인덱스입니다."
      );
      expect(() => Question.remove([], 0)).toThrow(
        "유효하지 않은 인덱스입니다."
      );
    });
  });

  describe("clear", () => {
    it("빈 배열을 반환해야 합니다", () => {
      expect(Question.clear()).toEqual([]);
    });
  });

  describe("isValidContent", () => {
    it("유효한 질문은 true를 반환해야 합니다", () => {
      expect(Question.isValidContent("질문입니다")).toBe(true);
      expect(Question.isValidContent("?")).toBe(true);
      expect(Question.isValidContent("  질문  ")).toBe(true);
    });

    it("빈 질문은 false를 반환해야 합니다", () => {
      expect(Question.isValidContent("")).toBe(false);
      expect(Question.isValidContent("   ")).toBe(false);
    });
  });

  describe("update", () => {
    it("질문을 수정해야 합니다", () => {
      const questions = ["원래 질문", "다른 질문"];
      const result = Question.update(questions, 0, "수정된 질문");

      expect(result).toEqual(["수정된 질문", "다른 질문"]);
    });

    it("원본 배열을 변경하지 않아야 합니다", () => {
      const questions = ["원래 질문"];
      Question.update(questions, 0, "수정된 질문");

      expect(questions).toEqual(["원래 질문"]);
    });

    it("질문 앞뒤 공백을 제거해야 합니다", () => {
      const questions = ["원래 질문"];
      const result = Question.update(questions, 0, "  수정된 질문  ");

      expect(result).toEqual(["수정된 질문"]);
    });

    it("유효하지 않은 인덱스는 에러를 던져야 합니다", () => {
      const questions = ["질문1"];

      expect(() => Question.update(questions, -1, "수정")).toThrow(
        "유효하지 않은 인덱스입니다."
      );
      expect(() => Question.update(questions, 1, "수정")).toThrow(
        "유효하지 않은 인덱스입니다."
      );
    });

    it("빈 질문으로 수정하면 에러를 던져야 합니다", () => {
      const questions = ["질문1"];

      expect(() => Question.update(questions, 0, "")).toThrow(
        "유효하지 않은 질문입니다."
      );
      expect(() => Question.update(questions, 0, "   ")).toThrow(
        "유효하지 않은 질문입니다."
      );
    });
  });
});

