import { Participant } from "@/utils/participant.utils";

describe("Participant", () => {
  describe("add", () => {
    it("참여자를 추가해야 합니다", () => {
      const participants: string[] = [];
      const result = Participant.add(participants, "홍길동");

      expect(result).toEqual(["홍길동"]);
    });

    it("기존 목록에 참여자를 추가해야 합니다", () => {
      const participants = ["김철수"];
      const result = Participant.add(participants, "홍길동");

      expect(result).toEqual(["김철수", "홍길동"]);
    });

    it("원본 배열을 변경하지 않아야 합니다", () => {
      const participants = ["김철수"];
      Participant.add(participants, "홍길동");

      expect(participants).toEqual(["김철수"]);
    });

    it("이름 앞뒤 공백을 제거해야 합니다", () => {
      const result = Participant.add([], "  홍길동  ");

      expect(result).toEqual(["홍길동"]);
    });

    it("빈 이름은 에러를 던져야 합니다", () => {
      expect(() => Participant.add([], "")).toThrow(
        "유효하지 않은 이름입니다."
      );
      expect(() => Participant.add([], "   ")).toThrow(
        "유효하지 않은 이름입니다."
      );
    });
  });

  describe("remove", () => {
    it("이름으로 참여자를 삭제해야 합니다", () => {
      const participants = ["김철수", "홍길동", "이영희"];
      const result = Participant.remove(participants, "홍길동");

      expect(result).toEqual(["김철수", "이영희"]);
    });

    it("존재하지 않는 이름은 원본과 동일한 배열을 반환해야 합니다", () => {
      const participants = ["김철수", "홍길동"];
      const result = Participant.remove(participants, "이영희");

      expect(result).toEqual(["김철수", "홍길동"]);
    });

    it("원본 배열을 변경하지 않아야 합니다", () => {
      const participants = ["김철수", "홍길동"];
      Participant.remove(participants, "홍길동");

      expect(participants).toEqual(["김철수", "홍길동"]);
    });

    it("동일한 이름이 여러 개면 모두 삭제해야 합니다", () => {
      const participants = ["홍길동", "김철수", "홍길동"];
      const result = Participant.remove(participants, "홍길동");

      expect(result).toEqual(["김철수"]);
    });
  });

  describe("shuffle", () => {
    it("참여자 순서를 섞어야 합니다", () => {
      const participants = ["A", "B", "C", "D", "E"];
      const shuffled = Participant.shuffle(participants);

      expect(shuffled).toHaveLength(participants.length);
      participants.forEach((p) => {
        expect(shuffled).toContain(p);
      });
    });

    it("원본 배열을 변경하지 않아야 합니다", () => {
      const participants = ["A", "B", "C"];
      const original = [...participants];
      Participant.shuffle(participants);

      expect(participants).toEqual(original);
    });
  });

  describe("isValidName", () => {
    it("유효한 이름은 true를 반환해야 합니다", () => {
      expect(Participant.isValidName("홍길동")).toBe(true);
      expect(Participant.isValidName("A")).toBe(true);
      expect(Participant.isValidName("  홍길동  ")).toBe(true);
    });

    it("빈 이름은 false를 반환해야 합니다", () => {
      expect(Participant.isValidName("")).toBe(false);
      expect(Participant.isValidName("   ")).toBe(false);
    });
  });

  describe("isDuplicate", () => {
    it("중복된 이름은 true를 반환해야 합니다", () => {
      const participants = ["김철수", "홍길동"];

      expect(Participant.isDuplicate(participants, "홍길동")).toBe(true);
    });

    it("중복되지 않은 이름은 false를 반환해야 합니다", () => {
      const participants = ["김철수", "홍길동"];

      expect(Participant.isDuplicate(participants, "이영희")).toBe(false);
    });

    it("이름 앞뒤 공백을 제거하고 비교해야 합니다", () => {
      const participants = ["홍길동"];

      expect(Participant.isDuplicate(participants, "  홍길동  ")).toBe(true);
    });

    it("빈 배열에서는 false를 반환해야 합니다", () => {
      expect(Participant.isDuplicate([], "홍길동")).toBe(false);
    });
  });
});
