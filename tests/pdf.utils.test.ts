import { PDF } from "@/utils/pdf.utils";

describe("PDF", () => {
  describe("getDefaultOptions", () => {
    it("기본 옵션을 반환해야 합니다", () => {
      const options = PDF.getDefaultOptions();

      expect(options).toEqual({
        title: "룰렛 결과",
        filename: "roulette-result",
      });
    });
  });

  describe("generateHTML", () => {
    it("HTML 문자열을 생성해야 합니다", () => {
      const content = "테스트 내용입니다";
      const html = PDF.generateHTML(content);

      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("<html lang=\"ko\">");
      expect(html).toContain(content);
    });

    it("기본 타이틀을 사용해야 합니다", () => {
      const html = PDF.generateHTML("내용");

      expect(html).toContain("<title>룰렛 결과</title>");
      expect(html).toContain("<h1>룰렛 결과</h1>");
    });

    it("커스텀 타이틀을 사용해야 합니다", () => {
      const html = PDF.generateHTML("내용", { title: "커스텀 타이틀" });

      expect(html).toContain("<title>커스텀 타이틀</title>");
      expect(html).toContain("<h1>커스텀 타이틀</h1>");
    });

    it("콘텐츠를 포함해야 합니다", () => {
      const content = "<p>테스트 콘텐츠</p>";
      const html = PDF.generateHTML(content);

      expect(html).toContain(`<div class="content">${content}</div>`);
    });

    it("타임스탬프를 포함해야 합니다", () => {
      const html = PDF.generateHTML("내용");

      expect(html).toContain("생성일:");
      expect(html).toContain("timestamp");
    });

    it("스타일을 포함해야 합니다", () => {
      const html = PDF.generateHTML("내용");

      expect(html).toContain("<style>");
      expect(html).toContain("@media print");
    });
  });

  describe("print", () => {
    let mockWindow: {
      document: {
        write: jest.Mock;
        close: jest.Mock;
      };
      onload: (() => void) | null;
      print: jest.Mock;
    };

    beforeEach(() => {
      mockWindow = {
        document: {
          write: jest.fn(),
          close: jest.fn(),
        },
        onload: null,
        print: jest.fn(),
      };

      jest.spyOn(window, "open").mockReturnValue(mockWindow as unknown as Window);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("새 창을 열어야 합니다", () => {
      PDF.print("테스트");

      expect(window.open).toHaveBeenCalledWith("", "_blank");
    });

    it("HTML을 작성하고 문서를 닫아야 합니다", () => {
      PDF.print("테스트 내용");

      expect(mockWindow.document.write).toHaveBeenCalled();
      expect(mockWindow.document.close).toHaveBeenCalled();
    });

    it("onload 이벤트를 설정해야 합니다", () => {
      PDF.print("테스트");

      expect(mockWindow.onload).toBeDefined();
    });

    it("onload 시 print를 호출해야 합니다", () => {
      PDF.print("테스트");

      // onload 콜백 실행
      if (mockWindow.onload) {
        mockWindow.onload();
      }

      expect(mockWindow.print).toHaveBeenCalled();
    });

    it("팝업이 차단되면 에러를 던져야 합니다", () => {
      jest.spyOn(window, "open").mockReturnValue(null);

      expect(() => PDF.print("테스트")).toThrow(
        "팝업이 차단되었습니다. 팝업 차단을 해제해주세요."
      );
    });

    it("커스텀 옵션을 사용해야 합니다", () => {
      PDF.print("테스트", { title: "커스텀 타이틀" });

      const writtenHtml = mockWindow.document.write.mock.calls[0][0];
      expect(writtenHtml).toContain("커스텀 타이틀");
    });
  });
});

