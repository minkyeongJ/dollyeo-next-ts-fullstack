/**
 * 질문 유틸리티 인터페이스
 */
export interface IQuestionUtils {
  /**
   * 질문을 추가합니다.
   * @param questions - 기존 질문 목록
   * @param content - 추가할 질문 내용
   * @returns 새로운 질문 목록
   */
  add(questions: string[], content: string): string[];

  /**
   * 질문을 인덱스로 삭제합니다.
   * @param questions - 기존 질문 목록
   * @param index - 삭제할 질문 인덱스
   * @returns 새로운 질문 목록
   */
  remove(questions: string[], index: number): string[];

  /**
   * 모든 질문을 삭제합니다.
   * @returns 빈 질문 목록
   */
  clear(): string[];

  /**
   * 질문 내용이 유효한지 검증합니다.
   * @param content - 검증할 질문 내용
   * @returns 유효 여부
   */
  isValidContent(content: string): boolean;

  /**
   * 질문 내용을 수정합니다.
   * @param questions - 기존 질문 목록
   * @param index - 수정할 질문 인덱스
   * @param content - 새로운 질문 내용
   * @returns 새로운 질문 목록
   */
  update(questions: string[], index: number, content: string): string[];
}

/**
 * 질문 유틸리티 객체
 */
export const Question: IQuestionUtils = {
  add(questions: string[], content: string): string[] {
    const trimmedContent = content.trim();
    if (!this.isValidContent(trimmedContent)) {
      throw new Error("유효하지 않은 질문입니다.");
    }
    return [...questions, trimmedContent];
  },

  remove(questions: string[], index: number): string[] {
    if (index < 0 || index >= questions.length) {
      throw new Error("유효하지 않은 인덱스입니다.");
    }
    return questions.filter((_, i) => i !== index);
  },

  clear(): string[] {
    return [];
  },

  isValidContent(content: string): boolean {
    return content.trim().length > 0;
  },

  update(questions: string[], index: number, content: string): string[] {
    if (index < 0 || index >= questions.length) {
      throw new Error("유효하지 않은 인덱스입니다.");
    }
    const trimmedContent = content.trim();
    if (!this.isValidContent(trimmedContent)) {
      throw new Error("유효하지 않은 질문입니다.");
    }
    return questions.map((q, i) => (i === index ? trimmedContent : q));
  },
};

