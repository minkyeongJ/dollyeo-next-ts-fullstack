import { Roulette } from "./roulette.utils";

/**
 * 참여자 유틸리티 인터페이스
 */
export interface IParticipantUtils {
  /**
   * 참여자를 추가합니다.
   * @param participants - 기존 참여자 목록
   * @param name - 추가할 참여자 이름
   * @returns 새로운 참여자 목록
   */
  add(participants: string[], name: string): string[];

  /**
   * 참여자를 이름으로 삭제합니다.
   * @param participants - 기존 참여자 목록
   * @param name - 삭제할 참여자 이름
   * @returns 새로운 참여자 목록
   */
  remove(participants: string[], name: string): string[];

  /**
   * 참여자 순서를 랜덤으로 섞습니다.
   * @param participants - 기존 참여자 목록
   * @returns 섞인 새로운 참여자 목록
   */
  shuffle(participants: string[]): string[];

  /**
   * 참여자 이름이 유효한지 검증합니다.
   * @param name - 검증할 이름
   * @returns 유효 여부
   */
  isValidName(name: string): boolean;

  /**
   * 참여자 이름이 중복되는지 확인합니다.
   * @param participants - 기존 참여자 목록
   * @param name - 확인할 이름
   * @returns 중복 여부
   */
  isDuplicate(participants: string[], name: string): boolean;
}

/**
 * 참여자 유틸리티 객체
 */
export const Participant: IParticipantUtils = {
  add(participants: string[], name: string): string[] {
    const trimmedName = name.trim();
    if (!this.isValidName(trimmedName)) {
      throw new Error("유효하지 않은 이름입니다.");
    }
    return [...participants, trimmedName];
  },

  remove(participants: string[], name: string): string[] {
    return participants.filter((p) => p !== name);
  },

  shuffle(participants: string[]): string[] {
    return Roulette.shuffle(participants);
  },

  isValidName(name: string): boolean {
    return name.trim().length > 0;
  },

  isDuplicate(participants: string[], name: string): boolean {
    return participants.includes(name.trim());
  },
};
