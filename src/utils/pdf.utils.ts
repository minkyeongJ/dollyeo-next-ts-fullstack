/**
 * PDF 내보내기 옵션
 */
export interface PDFExportOptions {
  title?: string;
  filename?: string;
}

/**
 * PDF 데이터 인터페이스
 */
export interface PDFData {
  content: string;
  options?: PDFExportOptions;
}

/**
 * PDF 유틸리티 인터페이스
 */
export interface IPDFUtils {
  /**
   * PDF 인쇄용 HTML을 생성합니다.
   * @param content - 출력할 내용
   * @param options - PDF 옵션
   * @returns HTML 문자열
   */
  generateHTML(content: string, options?: PDFExportOptions): string;

  /**
   * 새 창에서 PDF 인쇄 다이얼로그를 엽니다.
   * @param content - 출력할 내용
   * @param options - PDF 옵션
   * @throws 팝업이 차단된 경우 에러
   */
  print(content: string, options?: PDFExportOptions): void;

  /**
   * 기본 PDF 옵션을 반환합니다.
   */
  getDefaultOptions(): Required<PDFExportOptions>;
}

/**
 * PDF 유틸리티 객체
 */
export const PDF: IPDFUtils = {
  generateHTML(content: string, options?: PDFExportOptions): string {
    const { title } = { ...this.getDefaultOptions(), ...options };

    return `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            color: #4F46E5;
            border-bottom: 2px solid #4F46E5;
            padding-bottom: 10px;
          }
          .content {
            margin-top: 20px;
            line-height: 1.6;
          }
          .timestamp {
            color: #6B7280;
            font-size: 14px;
            margin-top: 30px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="content">${content}</div>
        <p class="timestamp">생성일: ${new Date().toLocaleString("ko-KR")}</p>
      </body>
      </html>
    `;
  },

  print(content: string, options?: PDFExportOptions): void {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      throw new Error("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
    }

    const htmlContent = this.generateHTML(content, options);

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
    };
  },

  getDefaultOptions(): Required<PDFExportOptions> {
    return {
      title: "룰렛 결과",
      filename: "roulette-result",
    };
  },
};

